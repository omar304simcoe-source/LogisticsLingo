import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Truck, MessageSquare, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">LogisticsLingo</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 text-balance">
            Professional Logistics Messages
            <br />
            Generated Instantly
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Save hours every day with AI-powered message generation for brokers, dispatchers, and carriers
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Why LogisticsLingo?</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Save Time</h4>
                  <p className="text-muted-foreground">Generate professional messages in seconds, not minutes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Stay Professional</h4>
                  <p className="text-muted-foreground">Every message is clear, concise, and industry-appropriate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Always Ready</h4>
                  <p className="text-muted-foreground">20+ message types for every logistics scenario</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Message Types</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Check-in messages",
                "Dispatch messages",
                "Delay notifications",
                "Delivery confirmations",
                "POD requests",
                "Rate confirmations",
                "ETA updates",
                "TONU requests",
                "Detention notices",
                "Pickup confirmations",
                "Guard check-ins",
                "Temperature updates",
              ].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to streamline your logistics communication?</h3>
            <p className="text-xl mb-8 opacity-90">Start with 3 free messages. Upgrade anytime.</p>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        <footer className="border-t py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-semibold">LogisticsLingo</span>
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/refund" className="hover:underline">
                  Refund Policy
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">© 2025 Goyley Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
