import { Truck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                LogisticsLingo is operated by Goyley Inc, a Canadian corporation. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information in compliance with the Personal Information
                Protection and Electronic Documents Act (PIPEDA).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed">We may collect the following information:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Account information (name, email address, company name)</li>
                <li>Usage data (feature usage, timestamps, interactions)</li>
                <li>Payment-related metadata (billing status, plan type — no card data)</li>
                <li>Support communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. How We Use Information</h2>
              <p className="text-gray-700 leading-relaxed">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Provide and operate the LogisticsLingo service</li>
                <li>Improve performance and features</li>
                <li>Process subscriptions and billing</li>
                <li>Communicate service updates and support responses</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Data Storage & Security</h2>
              <p className="text-gray-700 leading-relaxed">
                Data is stored using industry-standard security measures. While no system is 100% secure, we take
                reasonable steps to protect your information from unauthorized access, loss, or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">We use trusted third-party providers including:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Stripe (payment processing)</li>
                <li>Cloud infrastructure providers</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These providers process data in accordance with their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain personal information only as long as necessary to fulfill the purposes outlined in this policy
                or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Your Rights (Canada)</h2>
              <p className="text-gray-700 leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Access your personal data</li>
                <li>Request correction or deletion</li>
                <li>Withdraw consent (subject to service limitations)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">Requests may be sent to info.goyley@gmail.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. Continued use of the service constitutes acceptance of
                the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions regarding this Privacy Policy: info.goyley@gmail.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
