import { type NextRequest, NextResponse } from "next/server"
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
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 404 })
    }

    // Fetch profile
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

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL!

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      return_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        user_id: user.id,
        tier: product.tier,
      },
    })

    return NextResponse.json({
      clientSecret: session.client_secret,
    })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 },
    )
  }
}
