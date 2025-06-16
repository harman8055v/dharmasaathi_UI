import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
})

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params

  if (action === "order") {
    try {
      const { amount, currency = "INR", receipt, notes } = await request.json()
      const order = await razorpay.orders.create({ amount, currency, receipt, notes })
      return NextResponse.json(order)
    } catch (err) {
      console.error("Razorpay order creation failed", err)
      return NextResponse.json({ error: "order_failed" }, { status: 500 })
    }
  }

  if (action === "verify") {
    try {
      const { order_id, payment_id, signature, item_type, item_name, amount, count } = await request.json()

      // Verify signature
      const body = `${order_id}|${payment_id}`
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(body)
        .digest("hex")

      if (expected !== signature) {
        return NextResponse.json({ verified: false }, { status: 400 })
      }

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Process the payment
      const processResponse = await fetch(`${request.nextUrl.origin}/api/payments/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          item_type,
          item_name,
          amount,
          count,
          payment_id,
          order_id,
        }),
      })

      if (!processResponse.ok) {
        throw new Error("Failed to process payment")
      }

      return NextResponse.json({ verified: true })
    } catch (error) {
      console.error("Payment verification error:", error)
      return NextResponse.json({ verified: false }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 })
}
