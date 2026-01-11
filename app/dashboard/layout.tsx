import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { Truck } from "lucide-react"
import Link from "next/link"
import MessageCounter from "@/components/ui/MessageCounter"

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

  // Get initial count from the server side
  const { count: initialCount } = await supabase
    .from('message_history')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* Global Count Banner */}
      <MessageCounter initialCount={initialCount || 0} />

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