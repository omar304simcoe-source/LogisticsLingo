import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { Truck } from "lucide-react"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Fetch user to show email in the "Account" section
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* This is your new Dashboard Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900">LogisticsLingo</span>
          </Link>
        </div>

        {/* This displays the Account/User dropdown */}
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