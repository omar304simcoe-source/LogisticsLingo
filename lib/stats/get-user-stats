// lib/stats/get-user-stats.ts
import { createServerClient } from "@/lib/supabase/server"

export async function getUserStats(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("user_stats")
    .select("total_messages")
    .eq("user_id", userId)
    .single()

  if (error) {
    // user might be new → return 0
    return 0
  }

  return data?.total_messages ?? 0
}
