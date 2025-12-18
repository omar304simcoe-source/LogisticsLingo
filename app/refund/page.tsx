import { Truck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            <h1 className="text-xl font-bold">LogisticsLingo</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-black">
          <CardHeader>
            <CardTitle className="text-3xl">Refund & Cancellation Policy</CardTitle>
            <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Subscription Cancellation</h2>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your LogisticsLingo subscription at any time through your account dashboard.
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Cancellations take effect at the end of the current billing cycle</li>
                <li>Access remains active until the period expires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Refund Policy</h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>
                  All subscription fees are non-refundable, except where required by Canadian consumer protection laws
                </li>
                <li>No prorated refunds are provided for unused time</li>
                <li>Trial plans, if offered, expire automatically unless upgraded</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Legal Summary (Plain English)</h2>
              <p className="text-gray-700 leading-relaxed">
                LogisticsLingo helps dispatchers, brokers, and carriers write professional logistics messages faster.
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>We generate draft messages, not legal or contractual advice</li>
                <li>You are responsible for reviewing and approving all messages before sending</li>
                <li>We do not guarantee bookings, rates, or business outcomes</li>
                <li>Your data is protected under Canadian privacy laws</li>
                <li>Payments are handled securely by Stripe</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Using LogisticsLingo means you agree to our Terms of Service, Privacy Policy, and Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Company Information</h2>
              <p className="text-gray-700 leading-relaxed">
                Goyley Inc
                <br />
                123 Bay Street, Suite 1400
                <br />
                Toronto, Ontario M5J 2N1
                <br />
                Canada
                <br />
                info.goyley@gmail.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
