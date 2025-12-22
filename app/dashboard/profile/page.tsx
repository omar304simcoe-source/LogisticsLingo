import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileForm from "./profile-form" // We will create this next

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Account Settings</h1>
      
      {/* Pass the existing user data to the Client Component form */}
      <ProfileForm user={user} />

      <div className="pt-6 mt-6 border-t border-slate-100">
        <form action="/auth/sign-out" method="post">
          <button 
            type="submit"
            className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium py-2 px-4 rounded-md transition-all"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}