import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1️⃣ Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2️⃣ Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // 3️⃣ Handle rate limits for free tier
    if (profile.subscription_tier === "free") {
      const now = new Date()

      const resetTime = profile.messages_reset_at
        ? new Date(profile.messages_reset_at)
        : new Date(0)

      // Reset daily counter if more than 24h passed
      if (now.getTime() - resetTime.getTime() > 24 * 60 * 60 * 1000) {
        await supabase
          .from("profiles")
          .update({
            messages_today: 0,
            messages_reset_at: now.toISOString(),
          })
          .eq("id", user.id)

        profile.messages_today = 0
      }

      if (profile.messages_today >= 3) {
        return NextResponse.json(
          {
            error:
              "Daily message limit reached. Upgrade to Pro for unlimited messages.",
          },
          { status: 429 },
        )
      }
    }

    // 4️⃣ Read request body safely
    const loadDetails = await request.json()

    if (!loadDetails?.messageType) {
      return NextResponse.json(
        { error: "Message type is required" },
        { status: 400 },
      )
    }

    const prompt = buildPrompt(loadDetails)

    // 5️⃣ Generate AI message
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a professional logistics communication assistant. You generate clear, concise, professional freight and dispatcher messages.",
      prompt,
    })

    const generatedMessage = text.trim()

    // 6️⃣ Increment usage for free tier
    if (profile.subscription_tier === "free") {
      await supabase
        .from("profiles")
        .update({ messages_today: profile.messages_today + 1 })
        .eq("id", user.id)
    }

    // 7️⃣ Save message history
    await supabase.from("message_history").insert({
      user_id: user.id,
      message_type: loadDetails.messageType,
      generated_message: generatedMessage,
      load_details: loadDetails,
    })

    // 8️⃣ Return response
    return NextResponse.json({ message: generatedMessage })
  } catch (error: any) {
    console.error("Error generating message:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate message" },
      { status: 500 },
    )
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

  const messageType =
    messageTypeMap[details.messageType] || details.messageType

  const field = (label: string, value: any) =>
    value ? `${label}: ${value}\n` : ""

  return `Generate a ${messageType} based on the following load details:

${field("Driver", details.assignedDriver)}${field(
    "Pickup Address",
    details.pickupAddress,
  )}${field(
    "Pickup Time",
    details.pickupDate && details.pickupTime
      ? `${details.pickupDate} at ${details.pickupTime}`
      : null,
  )}${field("Delivery Address", details.deliveryAddress)}${field(
    "Delivery Time",
    details.deliveryDate && details.deliveryTime
      ? `${details.deliveryDate} at ${details.deliveryTime}`
      : null,
  )}${field("Commodity", details.commodity)}${field(
    "Weight",
    details.weight,
  )}${field("Broker Contact", details.brokerContact)}${field(
    "Reference #",
    details.referenceNumber,
  )}${field("Load #", details.loadNumber)}${field(
    "PO #",
    details.poNumber,
  )}${field("BOL #", details.bolNumber)}${field(
    "Notes",
    details.additionalNotes,
  )}

Instructions:
- Clear and professional freight industry tone.
- Include all provided identifiers (Load #, BOL, etc.).
- No subject lines, no signatures.
- Output ONLY the message body.`
}
