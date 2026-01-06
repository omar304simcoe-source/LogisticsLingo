import Link from "next/link"
import { Check } from "lucide-react"

export interface Product {
  id: string
  stripePriceId: string
  name: string
  description: string
  priceInCents: number
  tier: "pro" | "agency"
  features: string[]
}

const PRODUCTS: Product[] = [
  {
    id: "pro-plan",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    name: "Pro",
    description: "Perfect for individual brokers and carriers",
    priceInCents: 499, // ✅ $4.99
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

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Built for dispatchers, brokers, and logistics teams
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border bg-background p-8 shadow-sm flex flex-col"
          >
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="mt-2 text-muted-foreground">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold">
                ${(product.priceInCents / 100).toFixed(2)}
              </span>
              <span className="ml-2 text-muted-foreground">/ month</span>
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-3 flex-1">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={`/api/stripe/checkout?priceId=${product.stripePriceId}`}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Get started
            </Link>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-center text-sm text-muted-foreground">
        Cancel anytime. No hidden fees.
      </p>
    </div>
  )
}
