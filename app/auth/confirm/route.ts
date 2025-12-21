import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const origin = requestUrl.origin
  
  // Log all query parameters for debugging
  const allParams = Object.fromEntries(searchParams.entries())
  console.log('Auth confirm received:', {
    url: requestUrl.toString(),
    params: allParams,
    origin,
  })
  
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code') // Some flows use code instead
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard/reset-password'

  // Check if Supabase returned an error
  if (errorParam) {
    console.error('Supabase auth error in confirm:', errorParam, errorDescription)
    const errorUrl = new URL("/auth/auth-code-error", origin)
    errorUrl.searchParams.set("error", errorDescription || errorParam || "Authentication error from Supabase")
    return NextResponse.redirect(errorUrl)
  }

  // Handle code parameter (for password reset via code exchange)
  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        console.log('Auth confirm success with code, redirecting to:', next)
        return NextResponse.redirect(new URL(next, origin), {
          status: 303,
        })
      }
      
      console.error('Auth confirm error with code:', {
        message: error?.message,
        status: error?.status,
        error: error,
      })
      
      const errorUrl = new URL("/auth/auth-code-error", origin)
      errorUrl.searchParams.set("error", error?.message || "Password reset failed")
      return NextResponse.redirect(errorUrl)
    } catch (err) {
      console.error('Unexpected error in auth confirm with code:', err)
      const errorUrl = new URL("/auth/auth-code-error", origin)
      errorUrl.searchParams.set("error", err instanceof Error ? err.message : "An unexpected error occurred")
      return NextResponse.redirect(errorUrl)
    }
  }

  // Handle token_hash parameter (for OTP verification)
  if (token_hash && type) {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      
      if (!error && data.session) {
        console.log('Auth confirm success with token_hash, redirecting to:', next)
        return NextResponse.redirect(new URL(next, origin), {
          status: 303,
        })
      }
      
      console.error('Auth confirm error with token_hash:', {
        message: error?.message,
        status: error?.status,
        error: error,
      })
      
      const errorUrl = new URL("/auth/auth-code-error", origin)
      errorUrl.searchParams.set("error", error?.message || "Invalid or expired reset link")
      return NextResponse.redirect(errorUrl)
    } catch (err) {
      console.error('Unexpected error in auth confirm with token_hash:', err)
      const errorUrl = new URL("/auth/auth-code-error", origin)
      errorUrl.searchParams.set("error", err instanceof Error ? err.message : "An unexpected error occurred")
      return NextResponse.redirect(errorUrl)
    }
  }

  // No valid parameters provided
  console.warn('Auth confirm called without valid parameters. Params:', allParams)
  const errorUrl = new URL("/auth/auth-code-error", origin)
  errorUrl.searchParams.set("error", "Invalid reset link. Please request a new password reset.")
  return NextResponse.redirect(errorUrl)
}