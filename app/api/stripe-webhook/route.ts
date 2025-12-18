import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
// Use the standard JS client for admin tasks
import { createClient } from "@supabase/supabase-js" 
import type Stripe from "stripe"

// Initialize the Admin client (Bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const productTier = session.metadata?.product_tier

        if (userId && productTier) {
          // Use supabaseAdmin here
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              subscription_tier: productTier,
              subscription_status: "active",
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string, // Store this for future updates
            })
            .eq("id", userId)
          
          if (error) throw error
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const status = subscription.status === "active" ? "active" : "inactive"
        
        // Use supabaseAdmin to find and update via customer ID
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: status })
          .eq("stripe_customer_id", customerId)
        
        if (error) throw error
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "inactive",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId)
        
        if (error) throw error
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error.message)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}