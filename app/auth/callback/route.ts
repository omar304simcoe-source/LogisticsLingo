import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
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
            } catch (error) {
              // Can be ignored if handled by middleware
            }
          },
        },
      }
    )

    // Attempt the exchange
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      // SUCCESS: The session is active, go to dashboard
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }

    // If there's an error, log it to the Vercel Function Logs
    console.error('Auth Exchange Failed:', error?.message)
  }

  // FAIL: No code or exchange failed
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-code-error`)
}