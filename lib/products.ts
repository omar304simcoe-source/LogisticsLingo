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
    // ⚠️ Get this from the "Pricing" section of the product, NOT the top header
    stripePriceId: "price_1ShKkoGjRgaLSEnZPHydeESf", 
    name: "Pro",
    description: "Perfect for individual brokers and carriers",
    priceInCents: 499, // Matching your image's $4.99
    tier: "pro",
    features: ["Unlimited messages", "Save templates", "Multi-driver profiles", "Priority support"],
  },
  {
    id: "agency-plan",
    // ⚠️ Get this from the "Pricing" section of the product, NOT the top header
    stripePriceId: "price_1ShKlWGjRgaLSEnZJQjHFjF3", 
    name: "Agency",
    description: "For small dispatch companies",
    priceInCents: 799,
    tier: "agency",
    features: ["Everything in Pro", "Multiple users", "Export templates", "Custom branding", "Team management"],
  },
]