import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  
  // Use a reliable base URL
  const baseUrl = "https://logistics-lingo.vercel.app"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
    
    // Log the error so you can see it in Vercel Logs
    console.error('Auth error:', error.message)
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}