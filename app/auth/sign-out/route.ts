import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache" // Add this

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const url = new URL(request.url)
  
  // This clears the cache for the dashboard so the next user gets fresh data
  revalidatePath('/dashboard', 'layout') 
  
  return NextResponse.redirect(new URL("/auth/login", url.origin))
}