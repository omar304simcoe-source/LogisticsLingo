"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { KeyRound, Mail, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard/reset-password`,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: "Check your email for the reset link!" })
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <KeyRound size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Forgot password?</h2>
          <p className="mt-2 text-sm text-slate-600">No worries, we'll send you reset instructions.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`rounded-lg p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset password"}
          </button>
        </form>

        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            <ArrowLeft size={16} className="mr-2" /> Back to log in
          </Link>
        </div>
      </div>
    </div>
  )
}