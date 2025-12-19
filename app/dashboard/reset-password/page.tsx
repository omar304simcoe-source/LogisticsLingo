"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Lock, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // This updates the password for the currently logged-in user
    // (The recovery link logs them in automatically)
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      alert(error.message)
    } else {
      alert("Password updated! Redirecting to login...")
      window.location.assign("/auth/login")
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <form onSubmit={updatePassword} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Set new password</h1>
        <p className="text-sm text-slate-500">Please enter a secure password for your account.</p>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-lg border border-slate-300 p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button 
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Update Password"}
        </button>
      </form>
    </div>
  )
}