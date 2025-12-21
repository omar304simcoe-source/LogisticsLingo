import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Get the user session
  const { data: { user }, error } = await supabase.auth.getUser()

  // 2. If no user, redirect to login
  if (error || !user) {
    redirect("/login")
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Profile</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Email Address</label>
          <p className="text-lg text-gray-900 font-semibold">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">User ID</label>
          <p className="text-xs text-gray-400 font-mono">{user.id}</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <form action="/auth/sign-out" method="post">
            <button 
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}