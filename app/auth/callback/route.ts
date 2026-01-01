import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Use a relative path for next to avoid origin issues
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies() // Correctly awaited for Next.js 15/16
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Middleware will handle session refresh if this fails
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        // In Vercel, 'origin' can sometimes be http instead of https 
        // behind the proxy. Forcing the primary domain is safer.
        return NextResponse.redirect(`https://logistics-lingo.vercel.app${next}`)
      }
    }
    
    console.error('Handshake Error:', error.message)
  }

  // Return to login with a clear error param
  return NextResponse.redirect(`${origin}/auth/login?error=auth-code-error`)
}