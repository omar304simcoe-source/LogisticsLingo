import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Truck, UserCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Fetch the user session
  const { data: { user } } = await supabase.auth.getUser()

  // If no user is found, send them back to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get the name we saved in Step 1
  const fullName = user.user_metadata?.full_name || "User"
  const firstName = fullName.split(" ")[0]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-bold text-slate-900 hidden sm:inline-block">
              LogisticsLingo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                Welcome, {firstName}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            
            <Link href="/dashboard/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors">
                <UserCircle className="h-6 w-6 text-slate-600" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}