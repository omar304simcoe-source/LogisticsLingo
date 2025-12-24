// app/auth/signout/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  // IMPORTANT: use NextResponse.redirect with absolute URL
  return NextResponse.redirect(
    new URL("/auth/login", request.url),
    { status: 302 }
  )
}
