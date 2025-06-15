import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import crypto from "crypto"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
})

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
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
    const { order_id, payment_id, signature } = await request.json()
    const body = `${order_id}|${payment_id}`
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex")

    if (expected === signature) {
      return NextResponse.json({ verified: true })
    }
    return NextResponse.json({ verified: false }, { status: 400 })
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 })
}
