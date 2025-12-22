import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  // Move these INSIDE the function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // On the server during build, we don't want to throw an error and crash the build
    // We only want to throw if we're actually trying to use the client in the browser
    console.warn("Supabase variables are missing")
    return createBrowserClient(
      supabaseUrl || "", 
      supabaseAnonKey || ""
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}