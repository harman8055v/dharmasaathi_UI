import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import twilio from "twilio"

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(request: NextRequest) {
  try {
    const { userId, message, type } = await request.json()

    // Create admin client with service role key
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create auth client to verify user session
    const supabaseAuth = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
      error: sessionError,
    } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    // Verify admin permissions
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (adminError || !adminUser || !["admin", "super_admin"].includes(adminUser.role?.toLowerCase())) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, mobile_number, first_name, last_name")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const notificationTitle = getNotificationTitle(type)
    const fullMessage = `${notificationTitle}\n\n${message}\n\nBest regards,\nDharmaSaathi Team`

    let smsSuccess = false
    let emailSuccess = false
    const errors: string[] = []

    // Send SMS if mobile number exists
    if (user.mobile_number) {
      try {
        // Format mobile number for international format
        let phoneNumber = user.mobile_number
        if (!phoneNumber.startsWith("+")) {
          // Assume Indian number if no country code
          phoneNumber = phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`
        }

        const smsMessage = await twilioClient.messages.create({
          body: fullMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        })

        console.log(`SMS sent successfully to ${phoneNumber}:`, smsMessage.sid)
        smsSuccess = true
      } catch (smsError) {
        console.error("SMS sending failed:", smsError)
        errors.push(`SMS failed: ${smsError instanceof Error ? smsError.message : "Unknown error"}`)
      }
    }

    // Send Email if email exists
    if (user.email) {
      try {
        // Use Twilio SendGrid for email
        const sgMail = require("@sendgrid/mail")
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const emailData = {
          to: user.email,
          from: {
            email: process.env.FROM_EMAIL || "noreply@dharmasaathi.com",
            name: "DharmaSaathi Team",
          },
          subject: notificationTitle,
          html: generateEmailHTML(user.first_name, notificationTitle, message),
          text: fullMessage,
        }

        await sgMail.send(emailData)
        console.log(`Email sent successfully to ${user.email}`)
        emailSuccess = true
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        errors.push(`Email failed: ${emailError instanceof Error ? emailError.message : "Unknown error"}`)
      }
    }

    // Create notification record in database for tracking
    const { error: notificationError } = await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title: notificationTitle,
      message: message,
      type: type,
      created_at: new Date().toISOString(),
      read: false,
      sms_sent: smsSuccess,
      email_sent: emailSuccess,
    })

    if (notificationError) {
      console.error("Failed to create notification record:", notificationError)
    }

    // Determine response based on success/failure
    if (!smsSuccess && !emailSuccess) {
      return NextResponse.json(
        {
          error: "Failed to send notifications",
          details: errors,
          user_contact: {
            mobile: user.mobile_number || "Not provided",
            email: user.email || "Not provided",
          },
        },
        { status: 500 },
      )
    }

    const successMessage = []
    if (smsSuccess) successMessage.push("SMS")
    if (emailSuccess) successMessage.push("Email")

    return NextResponse.json({
      success: true,
      message: `Notification sent successfully via ${successMessage.join(" and ")}`,
      details: {
        sms_sent: smsSuccess,
        email_sent: emailSuccess,
        errors: errors.length > 0 ? errors : null,
        recipient: {
          name: `${user.first_name} ${user.last_name}`,
          mobile: user.mobile_number || "Not provided",
          email: user.email || "Not provided",
        },
      },
    })
  } catch (error) {
    console.error("Notification API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case "profile_update":
      return "DharmaSaathi: Profile Update Required"
    case "verification_pending":
      return "DharmaSaathi: Verification Under Review"
    case "verification_approved":
      return "DharmaSaathi: Profile Verified Successfully!"
    case "verification_rejected":
      return "DharmaSaathi: Verification Update Needed"
    default:
      return "DharmaSaathi: Important Notification"
  }
}

function generateEmailHTML(firstName: string, title: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #ff6b35;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #ff6b35;
                margin-bottom: 10px;
            }
            .title {
                color: #2c3e50;
                font-size: 22px;
                margin-bottom: 20px;
            }
            .message {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #ff6b35;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                margin: 20px 0;
                font-weight: bold;
            }
            .contact-info {
                background: #e8f4fd;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🕉️ DharmaSaathi</div>
                <div style="color: #666; font-size: 16px;">Your Spiritual Journey Partner</div>
            </div>
            
            <h2 class="title">Namaste ${firstName || "Dear User"},</h2>
            
            <div class="message">
                ${message.replace(/\n/g, "<br>")}
            </div>
            
            <div style="text-align: center;">
                <a href="https://dharmasaathi.com/dashboard" class="cta-button">
                    Visit Your Dashboard
                </a>
            </div>
            
            <div class="contact-info">
                <strong>Need Help?</strong><br>
                📧 Email: support@dharmasaathi.com<br>
                📱 WhatsApp: +91-XXXXXXXXXX<br>
                🌐 Website: www.dharmasaathi.com
            </div>
            
            <div class="footer">
                <p>This message was sent from DharmaSaathi Admin Team.</p>
                <p>© ${new Date().getFullYear()} DharmaSaathi. All rights reserved.</p>
                <p style="font-size: 12px; color: #999;">
                    If you believe this message was sent in error, please contact our support team.
                </p>
            </div>
        </div>
    </body>
    </html>
  `
}
