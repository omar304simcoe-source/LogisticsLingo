"use client"

import { PRODUCTS } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Truck } from "lucide-react"
import { useState } from "react"
import { CheckoutDialog } from "./checkout-dialog"
import Link from "next/link"

interface PricingContentProps {
  profile: any
}

export function PricingContent({ profile }: PricingContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-primary">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">LogisticsLingo</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-base sm:text-lg text-gray-600">Choose the plan that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Free</CardTitle>
              <CardDescription className="text-gray-600">Get started with basics</CardDescription>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>3 messages per day</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button disabled className="w-full bg-gray-300 text-gray-600">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className={`border-2 ${product.tier === "pro" ? "border-primary relative" : "border-primary"}`}
            >
              {product.tier === "pro" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 text-xs sm:text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">{product.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl sm:text-4xl font-bold">${(product.priceInCents / 100).toFixed(2)}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                      <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setSelectedProduct(product.id)}
                  className="w-full bg-primary text-white hover:bg-primary/80"
                  disabled={profile?.subscription_tier === product.tier}
                >
                  {profile?.subscription_tier === product.tier ? "Current Plan" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {selectedProduct && <CheckoutDialog productId={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
