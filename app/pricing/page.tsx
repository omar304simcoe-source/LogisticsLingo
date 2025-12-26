import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PricingContent } from "@/components/pricing-content"

export default async function PricingPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // Auto-create profile if missing (first login)
  if (!profile && profileError?.code === "PGRST116") {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        subscription_tier: "free",
        subscription_status: "inactive",
      })
      .select()
      .single()

    if (insertError || !newProfile) {
      throw new Error("Failed to create user profile")
    }

    return <PricingContent profile={newProfile} />
  }

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile) {
    throw new Error("Profile not found")
  }

  return <PricingContent profile={profile} />
}
