"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Truck, CheckCircle2 } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    // This updates the user's password in the current session
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      // Wait 3 seconds so they see the success message, then go to dashboard
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh() // Ensures the middleware recognizes the new session
      }, 3000)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="h-8 w-8 text-[#0070f3]" />
            <span className="text-2xl font-bold text-slate-900">LogisticsLingo</span>
          </div>
          
          <Card className="border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isSuccess ? "Password Updated" : "Set New Password"}
              </CardTitle>
              <CardDescription className="text-center">
                {isSuccess 
                  ? "Your account is now secure. Redirecting you to the dashboard..." 
                  : "Please enter your new password below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-4 gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReset} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Update Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}