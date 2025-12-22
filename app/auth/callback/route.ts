// Replace your current GET function with this logic
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // FORCE the redirect to dashboard instead of reading from searchParams
  // if searchParams.get('next') is accidentally returning '/login'
  const next = '/dashboard' 

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
              // This can be ignored if middleware is handling session refresh
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use origin to ensure we stay on the same domain
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('Auth error:', error)
  }

  // Return to login ONLY if the exchange actually failed
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}