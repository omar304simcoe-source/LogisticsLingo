import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
// Use the Admin client to bypass RLS
import { createClient } from "@supabase/supabase-js" 

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure this is in your Vercel Env Vars
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Configuration Error" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("Signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const tier = session.metadata?.product_tier // Matches your Pricing Page
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        if (!userId || !tier) {
          console.error("Missing metadata:", { userId, tier })
          break
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId, // Crucial for later updates
          })
          .eq("id", userId)

        if (error) throw error
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "canceled",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", subscription.customer as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("Webhook Error:", err.message)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }
}