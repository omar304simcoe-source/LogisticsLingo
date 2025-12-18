import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PricingContent } from "@/components/pricing-content"

export default async function PricingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <PricingContent profile={profile} />
}
