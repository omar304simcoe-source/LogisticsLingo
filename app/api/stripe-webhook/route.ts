import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js" 

// Initialize Admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      // 1. Handled when a user first subscribes via Checkout
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const tier = session.metadata?.product_tier
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        if (!userId || !tier) {
          console.error("Missing metadata in checkout.session.completed:", { userId, tier })
          break
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
          })
          .eq("id", userId)

        if (error) throw error
        console.log(`✅ Profile updated for user ${userId}: Tier ${tier}`)
        break
      }

      // 2. Handled when a subscription changes (upgrades/downgrades or payment failures)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Map Stripe status to your internal status
        const status = subscription.status === "active" ? "active" : "past_due"
        
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ 
            subscription_status: status 
          })
          .eq("stripe_customer_id", customerId)
        
        if (error) throw error
        console.log(`🔄 Subscription updated for customer ${customerId}: Status ${status}`)
        break
      }

      // 3. Handled when a subscription is canceled or ends
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "canceled",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId)
        
        if (error) throw error
        console.log(`❌ Subscription deleted for customer ${customerId}. Reverted to Free tier.`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("Webhook Handler Error:", err.message)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }
}