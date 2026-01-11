import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import PublicGlobalCounter from "@/components/ui/PublicGlobalCounter"
import { Button } from "@/components/ui/button"

export const revalidate = 60 // Refresh the count every minute

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch only the global count (Public access)
  const { count: globalTotalMessages } = await supabase
    .from('message_history')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="flex min-h-screen flex-col">
      {/* The Global Counter at the very top */}
      <PublicGlobalCounter initialCount={globalTotalMessages || 0} />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Logistics Messaging <span className="text-blue-600">Simplified.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Generate professional dispatch, carrier, and broker messages in seconds.
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/login">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}