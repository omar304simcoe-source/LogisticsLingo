"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutDialogProps {
  productId: string
  onClose: () => void
}

export function CheckoutDialog({ productId, onClose }: CheckoutDialogProps) {
  const startCheckoutSession = useCallback(async () => {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to create checkout session" }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.clientSecret || typeof data.clientSecret !== "string") {
      throw new Error("Invalid response: client secret is missing or invalid")
    }
    
    return data.clientSecret
  }, [productId])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete your purchase</DialogTitle>
        </DialogHeader>
        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSession }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
