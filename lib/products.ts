export interface Product {
  id: string
  stripeProductId: string
  name: string
  description: string
  priceInCents: number
  tier: "pro" | "agency"
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: "pro-plan",
    stripeProductId: "prod_Tee2pVbFHLPnHP",
    name: "Pro",
    description: "Perfect for individual brokers and carriers",
    priceInCents: 499,
    tier: "pro",
    features: ["Unlimited messages", "Save templates", "Multi-driver profiles", "Priority support"],
  },
  {
    id: "agency-plan",
    stripeProductId: "prod_Tee376KoG1S8nP",
    name: "Agency",
    description: "For small dispatch companies",
    priceInCents: 799,
    tier: "agency",
    features: ["Everything in Pro", "Multiple users", "Export templates", "Custom branding", "Team management"],
  },
]
