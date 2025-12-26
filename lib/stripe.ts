import "server-only"
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Use the exact version string from your Stripe Dashboard
  apiVersion: "2025-12-15.clover" as any, 
  typescript: true,
})