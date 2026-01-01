import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. THE BYPASS: Standard static/public routes
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Initialize response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. INITIALIZE SUPABASE
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          // Update request headers for the current server run
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // CRITICAL: Re-create the response object with new cookies
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          
          // Set cookies on the response to send back to the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. PROTECT DASHBOARD
  // Use getUser() instead of getSession() as it's more secure for server checks
  if (pathname.startsWith('/dashboard')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Create a redirect response
      const redirectResponse = NextResponse.redirect(new URL('/auth/login', request.url))
      
      // IMPORTANT: Copy existing cookies to the redirect response 
      // so the logout/session-clear is preserved
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      
      return redirectResponse
    }
  }

  // Return the final response (which now correctly carries updated cookies)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}