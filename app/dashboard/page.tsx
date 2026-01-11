import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"

// NEW
import { getUserStats } from "@/lib/stats/get-user-stats"
import { getGlobalStats } from "@/lib/stats/get-global-stats"

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

  // Fetch profile + stats in parallel (faster)
  const [{ data: profile }, userTotalMessages, globalStats] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),

      getUserStats(user.id),
      getGlobalStats(),
    ])

  return (
    <DashboardContent
      user={user}
      profile={profile}
      stats={{
        personalTotal: userTotalMessages,
        globalTotal: globalStats.total_messages,
      }}
    />
  )
}
