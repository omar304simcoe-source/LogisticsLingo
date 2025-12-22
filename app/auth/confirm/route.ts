import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const origin = requestUrl.origin
  
  // FIX: Default changed from /dashboard/... to /auth/reset-password
  const next = searchParams.get('next') ?? '/auth/reset-password'
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (errorParam) {
    const errorUrl = new URL("/auth/auth-code-error", origin)
    errorUrl.searchParams.set("error", errorDescription || errorParam)
    return NextResponse.redirect(errorUrl)
  }

  // Logic for Email Link (token_hash)
  if (token_hash && type) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
      
      if (!error && data.session) {
        // SUCCESS: Redirect to the actual page location
        return NextResponse.redirect(new URL(next, origin), { status: 303 })
      }
      
      const errorUrl = new URL("/auth/auth-code-error", origin)
      errorUrl.searchParams.set("error", error?.message || "Invalid or expired link")
      return NextResponse.redirect(errorUrl)
    } catch (err) {
      return NextResponse.redirect(new URL("/auth/auth-code-error", origin))
    }
  }

  // Logic for Code Exchange (if needed)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin), { status: 303 })
  }

  return NextResponse.redirect(new URL("/auth/auth-code-error", origin))
}