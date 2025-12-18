import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai" // 1. Added the provider import

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check rate limits for free tier
    if (profile.subscription_tier === "free") {
      const now = new Date()
      const resetTime = new Date(profile.messages_reset_at)

      if (now.getTime() - resetTime.getTime() > 24 * 60 * 60 * 1000) {
        await supabase
          .from("profiles")
          .update({ messages_today: 0, messages_reset_at: now.toISOString() })
          .eq("id", user.id)
        profile.messages_today = 0
      }

      if (profile.messages_today >= 3) {
        return NextResponse.json(
          { error: "Daily message limit reached. Upgrade to Pro for unlimited messages." },
          { status: 429 },
        )
      }
    }

    const loadDetails = await request.json()
    const prompt = buildPrompt(loadDetails)

    // 2. Updated generateText to use the provider and added a system prompt
    const { text } = await generateText({
      model: openai("gpt-4o-mini"), // Fixes the GatewayAuthenticationError
      system: "You are a professional logistics communication assistant. You specialize in generating clear, concise freight updates and professional correspondence between drivers, brokers, and shippers.",
      prompt,
    })

    // Increment message counter for free tier
    if (profile.subscription_tier === "free") {
      await supabase
        .from("profiles")
        .update({ messages_today: profile.messages_today + 1 })
        .eq("id", user.id)
    }

    // Save to message history
    await supabase.from("message_history").insert({
      user_id: user.id,
      message_type: loadDetails.messageType,
      generated_message: text,
      load_details: loadDetails,
    })

    return NextResponse.json({ message: text })
  } catch (error: any) {
    console.error("Error generating message:", error)
    return NextResponse.json({ error: error.message || "Failed to generate message" }, { status: 500 })
  }
}

function buildPrompt(details: any): string {
  const messageTypeMap: Record<string, string> = {
    "check-in": "Check-in message",
    dispatch: "Dispatch message",
    delay: "Delay notification",
    "delivery-completed": "Delivery completed message",
    "tonu-request": "TONU (Truck Ordered Not Used) request",
    "pod-request": "Proof of Delivery (POD) request",
    "rate-con-request": "Rate confirmation request",
    "eta-update": "ETA update",
    "empty-available": "Empty/available message",
    "weight-commodity-update": "Weight/commodity update",
    "guard-check-in": "Guard check-in message",
    "detention-notice": "Detention notice",
    "layover-request": "Layover request",
    "temperature-controlled": "Temperature controlled update",
    "lumper-code": "Lumper code request",
    "arrival-delivery": "Arrival at delivery notification",
    "pickup-confirmation": "Pickup confirmation",
    "delivery-confirmation": "Delivery confirmation",
  }

  const messageType = messageTypeMap[details.messageType] || details.messageType

  // Helper to safely display fields
  const field = (label: string, value: any) => value ? `${label}: ${value}\n` : "";

  return `Generate a ${messageType} based on the following load details:

${field("Driver", details.assignedDriver)}${field("Pickup Address", details.pickupAddress)}${field("Pickup Time", `${details.pickupDate} at ${details.pickupTime}`)}${field("Delivery Address", details.deliveryAddress)}${field("Delivery Time", `${details.deliveryDate} at ${details.deliveryTime}`)}${field("Commodity", details.commodity)}${field("Weight", details.weight)}${field("Broker Contact", details.brokerContact)}${field("Reference #", details.referenceNumber)}${field("Load #", details.loadNumber)}${field("PO #", details.poNumber)}${field("BOL #", details.bolNumber)}${field("Notes", details.additionalNotes)}
Instructions:
- Clear and professional freight industry tone.
- Include all provided identifiers (Load #, BOL, etc.).
- No subject lines, no signatures.
- Output ONLY the message body.`
}