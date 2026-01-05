import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PricingContent } from "@/components/pricing-content"

export default async function PricingPage() {
  // 1. Initialize Supabase (Must be awaited in Next.js 15)
  const supabase = await createClient()

  // 2. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // If no session, send them to login
  if (authError || !user) {
    redirect("/auth/login")
  }

  // 3. Fetch user profile
  // We use maybeSingle() because it handles "0 rows found" gracefully (returning null)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // 4. Handle Case: Profile does not exist yet
  // This happens the first time a user visits the pricing page after signing up.
  if (!profile && !profileError) {
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

    if (insertError) {
      console.error("Critical: Failed to auto-create profile", insertError)
      throw new Error("Failed to initialize user profile")
    }

    return <PricingContent profile={newProfile} />
  }

  // 5. Handle Case: Database Error
  if (profileError) {
    console.error("Database error fetching profile:", profileError)
    throw new Error("Profile fetching failed")
  }

  // 6. Success: Pass existing profile to the client-side component
  return <PricingContent profile={profile} />
}