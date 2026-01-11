import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"

export const revalidate = 60 // ⏱️ Next.js cache (1 min)

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data in parallel using direct Supabase queries
  const [
    { data: profile },
    { count: userTotalMessages },
    { count: globalTotalMessages }
  ] = await Promise.all([
    // 1. Get user profile
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single(),

    // 2. Get personal message count
    supabase
      .from("message_history")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id),

    // 3. Get global message count
    supabase
      .from("message_history")
      .select("*", { count: 'exact', head: true })
  ])

  return (
    <DashboardContent
      user={user}
      profile={profile}
      stats={{
        personalTotal: userTotalMessages || 0,
        globalTotal: globalTotalMessages || 0,
      }}
    />
  )
}