import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Authenticate the user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse request body
    const { productId } = await request.json()
    
    // 3. Find product and validate Price ID
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product || !product.stripePriceId) {
      return NextResponse.json({ error: "Invalid product or missing Price ID" }, { status: 404 })
    }

    // 4. Fetch or create Stripe Customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")

    // 5. CREATE EMBEDDED CHECKOUT SESSION
    // Note: Embedded mode requires 'ui_mode: embedded' and 'return_url'
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', 
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      // For Embedded Checkout, return_url handles the redirection after payment
      return_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        user_id: user.id,
        product_tier: product.tier, // Matches your Webhook's 'const tier' check
      },
    })

    // 6. Return the client_secret to the @stripe/react-stripe-js component
    return NextResponse.json({ 
      clientSecret: session.client_secret 
    })

  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 },
    )
  }
}