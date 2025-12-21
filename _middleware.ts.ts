export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Robust Bypass Logic
  // Ensure the callback and the reset page are totally ignored by the auth protector
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/dashboard/reset-password') ||
    pathname === '/login' // Allow access to login page
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. IMPORTANT: Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protection Logic
  // If no user and trying to access dashboard, redirect to login
  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}