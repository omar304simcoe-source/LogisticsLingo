import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  
  // "next" allows you to redirect users back to a specific page they were trying to visit
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use the origin from the request to ensure we stay on the same domain
      // We use a URL object to safely construct the redirect
      const forwardTo = new URL(next, origin)
      return NextResponse.redirect(forwardTo)
    }
  }

  // If there's an error or no code, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}