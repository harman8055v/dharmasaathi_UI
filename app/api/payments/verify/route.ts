import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, payment_id, signature, item_type, item_name, amount, count } = body

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(order_id + "|" + payment_id)
      .digest("hex")

    const is_signature_valid = generated_signature === signature

    if (is_signature_valid) {
      // Here you would typically update the user's subscription/credits in your database
      // For now, we'll just return success

      return NextResponse.json({
        verified: true,
        message: "Payment verified successfully",
        item_type,
        item_name,
        amount,
        count,
      })
    } else {
      return NextResponse.json({ verified: false, error: "Invalid signature" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 500 })
  }
}
