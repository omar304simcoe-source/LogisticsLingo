import { createBrowserClient } from "@supabase/ssr"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createClient = () => {
  // Validate environment variables when the function is called (not at module load)
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.\n` +
      `Current values: URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}\n` +
      `Get your values from: https://supabase.com/dashboard/project/_/settings/api\n` +
      `Make sure to restart your Next.js dev server after adding environment variables.`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
