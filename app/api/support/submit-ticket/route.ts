import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // In a real application, you would:
    // 1. Save this ticket to a database
    // 2. Send an email notification to the support team
    // 3. Integrate with a ticketing system (e.g., Zendesk, Freshdesk)

    console.log("New Support Ticket Received:")
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Subject: ${subject}`)
    console.log(`Message: ${message}`)

    return NextResponse.json({
      success: true,
      message: "Your ticket has been submitted successfully. We will get back to you shortly.",
    })
  } catch (error) {
    console.error("Error submitting support ticket:", error)
    return NextResponse.json({ success: false, message: "Failed to submit ticket. Please try again." }, { status: 500 })
  }
}
