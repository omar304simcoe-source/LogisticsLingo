import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has Pro or Agency plan
    const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single()

    if (!profile || (profile.subscription_tier !== "pro" && profile.subscription_tier !== "agency")) {
      return NextResponse.json({ error: "Upgrade to Pro or Agency to save templates" }, { status: 403 })
    }

    const { templateName, messageType, templateContent } = await request.json()

    const { error } = await supabase.from("saved_templates").insert({
      user_id: user.id,
      template_name: templateName,
      message_type: messageType,
      template_content: templateContent,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving template:", error)
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
  }
}
