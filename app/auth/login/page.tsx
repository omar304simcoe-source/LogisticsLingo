"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react" // Added Suspense
import { Truck, AlertCircle, CheckCircle2 } from "lucide-react"

// 1. Move the logic into a internal component
function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams() 

  const successMessage = searchParams.get("message")
  const errorMessage = searchParams.get("error")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          {successMessage && (
            <div className="flex items-center gap-2 p-3 text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle2 className="h-4 w-4" />
              {successMessage}
            </div>
          )}
          {(error || errorMessage) && (
            <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-800 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error || errorMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="broker@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="underline underline-offset-4 font-semibold text-primary">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// 2. Wrap the main page in Suspense
export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-900">LogisticsLingo</h1>
          </div>
          
          <Suspense fallback={<div className="text-center p-6">Loading login...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}