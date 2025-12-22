"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProfileForm({ user }: { user: any }) {
  const supabase = createClient()
  const router = useRouter()
  
  // Initialize state with the existing name from metadata
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })

    if (error) {
      setMessage("❌ Error updating profile")
    } else {
      setMessage("✅ Profile updated!")
      router.refresh() // This updates the name in your Header/Sidebar
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
        <p className="text-sm text-slate-400 bg-slate-50 p-2 rounded border border-slate-100 cursor-not-allowed">
          {user.email}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          placeholder="Enter your full name"
        />
      </div>

      {message && (
        <p className={`text-xs font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  )
}