import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BillingPortalButton } from "@/components/ui/BillingPortalButton"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single()

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Subscription</label>
          <p className="text-lg font-semibold capitalize">
            {profile?.subscription_tier ?? "free"}
          </p>
        </div>

        {/* 🔥 Billing Portal Button */}
        <BillingPortalButton />

        <form action="/auth/sign-out" method="post" className="pt-4">
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
