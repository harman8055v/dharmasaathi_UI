import twilio from "twilio"

// Twilio configuration
export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || "noreply@dharmasaathi.com",
}

// Initialize Twilio client
export const twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken)

// SMS sending utility
export async function sendSMS(to: string, message: string) {
  try {
    // Format phone number for international format
    let phoneNumber = to
    if (!phoneNumber.startsWith("+")) {
      // Assume Indian number if no country code
      phoneNumber = phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioConfig.phoneNumber,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error("SMS sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS error",
    }
  }
}

// Email sending utility using SendGrid
export async function sendEmail(to: string, subject: string, htmlContent: string, textContent?: string) {
  try {
    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(twilioConfig.sendGridApiKey)

    const emailData = {
      to,
      from: {
        email: twilioConfig.fromEmail,
        name: "DharmaSaathi Team",
      },
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    }

    const result = await sgMail.send(emailData)

    return {
      success: true,
      messageId: result[0]?.headers?.["x-message-id"] || "unknown",
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

// Notification templates
export const notificationTemplates = {
  profile_update: {
    title: "DharmaSaathi: Profile Update Required",
    defaultMessage:
      "Hi! To complete your profile verification, please update your profile with complete information including photos, about section, and partner preferences.",
  },
  verification_pending: {
    title: "DharmaSaathi: Verification Under Review",
    defaultMessage: "Your profile is currently under review. We'll notify you once the verification is complete.",
  },
  verification_approved: {
    title: "DharmaSaathi: Profile Verified Successfully!",
    defaultMessage:
      "Congratulations! Your profile has been verified successfully. You can now access all premium features.",
  },
  verification_rejected: {
    title: "DharmaSaathi: Verification Update Needed",
    defaultMessage: "Your profile verification needs some updates. Please review and update your profile information.",
  },
}
