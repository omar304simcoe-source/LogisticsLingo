import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PricingContent } from "@/components/pricing-content"

export default async function PricingPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle() // 👈 important

  // Optional: auto-create profile if missing
  if (!profile && profileError?.code === "PGRST116") {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        subscription_tier: "free",
      })
      .select()
      .single()

    if (insertError) {
      throw new Error("Failed to create user profile")
    }

    return <PricingContent profile={newProfile} />
  }

  if (profileError) {
    throw new Error(profileError.message)
  }

  return <PricingContent profile={profile} />
}
