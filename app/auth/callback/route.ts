import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Force redirect to dashboard to break any login loops
    const next = '/dashboard'

    if (code) {
      const cookieStore = await cookies() // CRITICAL: Must await in Next 15/16
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
                // Ignore errors if called from Server Component
              }
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('Exchange error:', error)
    }
  } catch (err) {
    console.error('Callback crash:', err)
  }

  // If we reach here, redirect to a safe error page
  return NextResponse.redirect(`${new URL(request.url).origin}/login?error=auth-code-error`)
}