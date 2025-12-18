import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "not found" which is okay, we'll create the customer
      console.error("Error fetching profile:", profileError)
    }

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })
        customerId = customer.id

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id)

        if (updateError) {
          console.error("Error updating profile with customer ID:", updateError)
          // Continue anyway, we have the customer ID
        }
      } catch (stripeError) {
        console.error("Error creating Stripe customer:", stripeError)
        throw new Error(`Failed to create Stripe customer: ${stripeError instanceof Error ? stripeError.message : "Unknown error"}`)
      }
    }

    // Create checkout session
    const origin = request.headers.get("origin") || request.headers.get("referer")?.split("/").slice(0, 3).join("/") || "http://localhost:3000"
    
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceInCents,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        return_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          user_id: user.id,
          product_tier: product.tier,
        },
      })

      if (!session.client_secret) {
        console.error("Stripe session created but client_secret is missing")
        return NextResponse.json({ error: "Checkout session created but client secret is missing" }, { status: 500 })
      }

      return NextResponse.json({ clientSecret: session.client_secret })
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError)
      throw new Error(`Stripe checkout session creation failed: ${stripeError instanceof Error ? stripeError.message : "Unknown error"}`)
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      // If it's a Stripe error, include more details
      if (error.message.includes("Stripe")) {
        return NextResponse.json({ error: `Stripe error: ${error.message}` }, { status: 500 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
