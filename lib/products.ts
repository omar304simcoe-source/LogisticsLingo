export interface Product {
  id: string
  stripePriceId: string // Changed from stripeProductId
  name: string
  description: string
  priceInCents: number
  tier: "pro" | "agency"
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: "pro-plan",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    name: "Pro",
    description: "Perfect for individual brokers and carriers",
    priceInCents: 499,
    tier: "pro",
    features: [
      "High message limits",
      "Save templates",
      "Multi-driver profiles",
      "Priority support",
    ],
  },
  {
    id: "agency-plan",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!,
    name: "Agency",
    description: "For small dispatch companies",
    priceInCents: 799,
    tier: "agency",
    features: [
      "Everything in Pro",
      "Multiple users",
      "Export templates",
      "Custom branding",
      "Team management",
    ],
  },
]
