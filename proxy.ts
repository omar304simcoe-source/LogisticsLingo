import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. BYPASS
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Create an initial response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. INITIALIZE SUPABASE
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          // This is the correct logic for syncing cookies back to the browser
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. THE KEY CHANGE: Always call getUser() for protected routes
  if (pathname.startsWith('/dashboard')) {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If no user exists, redirect to login
    if (error || !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      // Pass the current URL as a 'next' param so user returns here after login
      url.searchParams.set('next', pathname) 
      
      const redirectResponse = NextResponse.redirect(url)
      
      // Copy the cookies to the redirect so the session clear persists
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - IMPORTANT for Stripe)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}