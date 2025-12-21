import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient() // MUST be awaited
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to login with success
      return NextResponse.redirect(`${origin}/login?message=Account confirmed! Please sign in.`)
    }
    
    // REDIRECT TO LOGIN WITH THE ACTUAL ERROR MESSAGE
    console.error("Auth Error:", error.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}/login?error=No code provided`)
}