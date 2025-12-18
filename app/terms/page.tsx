import { Truck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Company Information</h2>
              <p className="text-gray-700 leading-relaxed">
                Goyley Inc
                <br />
                123 Bay Street, Suite 1400
                <br />
                Toronto, Ontario M5J 2N1
                <br />
                Canada
                <br />
                Email: info.goyley@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                LogisticsLingo is a Software-as-a-Service (SaaS) platform that uses artificial intelligence to assist
                freight brokers, dispatchers, and motor carriers in generating professional logistics-related messages,
                including but not limited to load offers, dispatch instructions, follow-ups, confirmations, and
                operational communications.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The service is operated from Canada and is subject to Canadian federal laws and the laws of the Province
                of Ontario.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Contract Formation</h2>
              <p className="text-gray-700 leading-relaxed">
                By registering for an account or using LogisticsLingo, you enter into a legally binding agreement with
                Goyley Inc.
              </p>
              <p className="text-gray-700 leading-relaxed">The agreement becomes effective when:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>You complete registration, and</li>
                <li>We confirm your account access electronically.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. User Accounts & Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">To use LogisticsLingo, you must:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the confidentiality of your login credentials</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You are solely responsible for all activity under your account. Unauthorized account sharing, resale, or
                misuse is strictly prohibited.
              </p>
              <p className="text-gray-700 leading-relaxed">We process personal data in accordance with:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>PIPEDA (Personal Information Protection and Electronic Documents Act)</li>
                <li>Our Privacy Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Pricing & Payment Terms</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Subscription fees are displayed in USD (US Dollars) unless otherwise stated.</li>
                <li>Payments are billed on a monthly or annual basis, depending on your plan.</li>
                <li>Subscriptions automatically renew unless cancelled before the next billing cycle.</li>
                <li>Taxes (including GST/HST) may apply based on your location.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3 font-semibold">Payments:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>All payments are processed securely via Stripe</li>
                <li>Goyley Inc does not store your payment details</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Cancellation & Refund Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your subscription at any time through your account dashboard.
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Cancellations take effect at the end of the current billing period</li>
                <li>No prorated refunds are issued for unused time</li>
                <li>Trial subscriptions, if offered, expire automatically unless upgraded</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">Canadian consumer protection laws apply where applicable.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Governing Law & Jurisdiction</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the Province of Ontario and the
                federal laws of Canada applicable therein.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to submit to the exclusive jurisdiction of the courts located in Ontario, Canada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Service Usage & Limitations</h2>
              <p className="text-gray-700 leading-relaxed">
                LogisticsLingo provides AI-generated logistics message drafts.
              </p>
              <p className="text-gray-700 leading-relaxed">You acknowledge and agree that:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Generated messages are assistance tools, not legal, contractual, or regulatory advice</li>
                <li>Users are responsible for reviewing, editing, and approving all content before sending</li>
                <li>
                  The service does not guarantee rate acceptance, load booking, carrier compliance, or business outcomes
                </li>
                <li>You must comply with all applicable transportation laws and regulations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate accounts for abuse, misuse, or violations of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Disclaimer of Liability</h2>
              <p className="text-gray-700 leading-relaxed">To the maximum extent permitted by Canadian law:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>LogisticsLingo is provided "AS IS" and "AS AVAILABLE"</li>
                <li>We make no warranties regarding accuracy, reliability, or fitness for a particular purpose</li>
                <li>AI-generated content may contain errors, omissions, or inaccuracies</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">Goyley Inc is not liable for:</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Lost loads or revenue</li>
                <li>Rate disputes</li>
                <li>Carrier or broker misunderstandings</li>
                <li>Regulatory or compliance issues</li>
                <li>Business interruptions or operational delays</li>
                <li>Miscommunication resulting from generated messages</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our total liability, if any, is limited to the amount paid by you in the previous billing month.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Intellectual Property</h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>
                  LogisticsLingo, including its software, design, algorithms, and branding, is the exclusive property of
                  Goyley Inc
                </li>
                <li>Users retain ownership of their manually entered content</li>
                <li>AI-generated outputs are licensed to users for business use only</li>
                <li>You may not resell, sublicense, or redistribute the service or outputs without written consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Security</h2>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed through Stripe, a PCI-DSS Level 1 certified provider.
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Payment information is never stored on our servers</li>
                <li>Transactions are encrypted and securely handled by Stripe</li>
                <li>For more information, refer to Stripe's official security documentation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">12. Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms from time to time. Material changes will be communicated via email or within
                the application.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Continued use of LogisticsLingo constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">13. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions regarding these Terms: info.goyley@gmail.com
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
