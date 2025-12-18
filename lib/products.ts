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
    stripeProductId: "prod_TbHEZ8fF64ThdN",
    name: "Pro",
    description: "Perfect for individual brokers and carriers",
    priceInCents: 300,
    tier: "pro",
    features: ["Unlimited messages", "Save templates", "Multi-driver profiles", "Priority support"],
  },
  {
    id: "agency-plan",
    stripeProductId: "prod_TbHGtAFeWUWQxp",
    name: "Agency",
    description: "For small dispatch companies",
    priceInCents: 699,
    tier: "agency",
    features: ["Everything in Pro", "Multiple users", "Export templates", "Custom branding", "Team management"],
  },
]
