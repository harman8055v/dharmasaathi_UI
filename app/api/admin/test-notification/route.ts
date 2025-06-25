import { type NextRequest, NextResponse } from "next/server"
import { sendSMS, sendEmail, notificationTemplates } from "@/lib/twilio-config"

export async function POST(request: NextRequest) {
  try {
    const { mobile, email, type = "profile_update" } = await request.json()

    if (!mobile && !email) {
      return NextResponse.json({ error: "Mobile number or email required" }, { status: 400 })
    }

    const template = notificationTemplates[type as keyof typeof notificationTemplates]
    const testMessage = `[TEST] ${template.defaultMessage}\n\nThis is a test notification from DharmaSaathi Admin.`

    const results = {
      sms: null as any,
      email: null as any,
    }

    // Test SMS
    if (mobile) {
      results.sms = await sendSMS(mobile, testMessage)
    }

    // Test Email
    if (email) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff6b35;">🕉️ DharmaSaathi - Test Notification</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35;">
            <p>${testMessage.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This is a test notification sent from DharmaSaathi Admin Dashboard.
          </p>
        </div>
      `
      results.email = await sendEmail(email, `[TEST] ${template.title}`, htmlContent, testMessage)
    }

    return NextResponse.json({
      success: true,
      message: "Test notifications sent",
      results,
    })
  } catch (error) {
    console.error("Test notification error:", error)
    return NextResponse.json(
      {
        error: "Failed to send test notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
