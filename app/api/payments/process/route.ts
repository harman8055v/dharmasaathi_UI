import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { user_id, item_type, item_name, amount, count, payment_id, order_id } = await request.json()

    // Record the transaction
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id,
      razorpay_payment_id: payment_id,
      razorpay_order_id: order_id,
      amount: amount * 100, // Convert to paise
      status: "completed",
      metadata: {
        item_type,
        item_name,
        count,
      },
    })

    if (transactionError) {
      console.error("Transaction recording error:", transactionError)
      return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 })
    }

    // Process based on item type
    if (item_type === "plan") {
      // Update user's premium status
      const expiryDate = new Date()
      if (item_name.includes("Annual")) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      }

      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          account_status: "premium",
          premium_expires_at: expiryDate.toISOString(),
        })
        .eq("id", user_id)

      if (userUpdateError) {
        console.error("User update error:", userUpdateError)
        return NextResponse.json({ error: "Failed to activate premium" }, { status: 500 })
      }
    } else if (item_type === "superlike") {
      // Add super likes to user's account
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("super_likes_count")
        .eq("id", user_id)
        .single()

      if (fetchError) {
        console.error("User fetch error:", fetchError)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
      }

      const currentCount = userData.super_likes_count || 0
      const { error: updateError } = await supabase
        .from("users")
        .update({
          super_likes_count: currentCount + count,
        })
        .eq("id", user_id)

      if (updateError) {
        console.error("Super likes update error:", updateError)
        return NextResponse.json({ error: "Failed to add super likes" }, { status: 500 })
      }
    } else if (item_type === "highlight") {
      // Add message highlights to user's account
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("message_highlights_count")
        .eq("id", user_id)
        .single()

      if (fetchError) {
        console.error("User fetch error:", fetchError)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
      }

      const currentCount = userData.message_highlights_count || 0
      const { error: updateError } = await supabase
        .from("users")
        .update({
          message_highlights_count: currentCount + count,
        })
        .eq("id", user_id)

      if (updateError) {
        console.error("Message highlights update error:", updateError)
        return NextResponse.json({ error: "Failed to add message highlights" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
