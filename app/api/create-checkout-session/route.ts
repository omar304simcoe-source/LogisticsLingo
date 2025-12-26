import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()
    
    // Find product in your local lib/products.ts
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product || !product.stripePriceId) {
      return NextResponse.json({ error: "Invalid product or missing Price ID" }, { status: 404 })
    }

    // Fetch profile to get existing customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    // If no customer ID exists, create one in Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })

      customerId = customer.id

      // Save the new Customer ID to Supabase immediately
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")

    // CREATE HOSTED CHECKOUT SESSION
    // Using Hosted mode (redirect) instead of Embedded for better reliability
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: product.stripePriceId, // ✅ Must be the 'price_...' ID
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        user_id: user.id,
        product_tier: product.tier, // ✅ Changed from 'tier' to 'product_tier' to match your Webhook
      },
    })

    // Return the URL for the client to redirect to
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 },
    )
  }
}