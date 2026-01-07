import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Invalid webhook signature", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {

      // ✅ FIRST PAYMENT
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.user_id
        const tier = session.metadata?.product_tier
        const customerId = session.customer as string

        if (!userId || !tier || !customerId) break

        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_customer_id: customerId,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId)

        break
      }

      // ✅ PLAN CHANGES / PAYMENT FAILURES / RESUMES
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const status =
          subscription.status === "active" ? "active" : "inactive"

        await supabase
          .from("profiles")
          .update({
            subscription_status: status,
          })
          .eq("stripe_customer_id", customerId)

        break
      }

      // ✅ CANCELLATION
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "inactive",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", subscription.customer as string)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
