import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { Truck } from "lucide-react"
import Link from "next/link"
import PublicGlobalCounter from "@/components/ui/PublicGlobalCounter" // We can reuse this component

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch the global count for logged-in users
  const { count } = await supabase
    .from('message_history')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* The Global Counter now only shows here */}
      <PublicGlobalCounter initialCount={count || 0} />

      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">LogisticsLingo</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NavUser user={user} />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}