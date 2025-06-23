"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Phone, Mail, MessageCircle, Shield, Heart, Users, HelpCircle, Clock } from "lucide-react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/support/submit-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Ticket Submitted!",
          description: result.message,
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "How do I create an account on DharmaSaathi?",
      answer:
        "You can create an account by clicking on the 'Join Now' button on our homepage. You'll be guided through a simple onboarding process to set up your profile with your spiritual preferences, personal details, and photos.",
    },
    {
      question: "How can I update my profile details or photos?",
      answer:
        "After logging in, navigate to your 'Profile' section in the dashboard. You can edit your personal details, spiritual preferences, and upload new photos there. Remember to save your changes! Your profile will be reviewed for verification.",
    },
    {
      question: "How does the matching algorithm work?",
      answer:
        "Our algorithm considers your spiritual practices, religious beliefs, lifestyle choices, location preferences, and partner criteria to suggest compatible matches. The more detailed and honest your profile, the better our suggestions will be.",
    },
    {
      question: "Is my personal information kept private and secure?",
      answer:
        "Your privacy is our top priority. We use advanced encryption, secure servers, and strict privacy controls. You can manage your privacy settings in the 'Privacy' section to control what information is visible to others. We never share your data with third parties.",
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer:
        "If you experience technical difficulties, try refreshing the page or clearing your browser's cache first. For mobile app issues, try restarting the app. If problems persist, contact our support team with details about your device and the issue.",
    },
    {
      question: "How do I report inappropriate behavior or block someone?",
      answer:
        "Your safety is important to us. You can report or block any user by clicking the three dots menu on their profile or in messages. Our team reviews all reports within 24 hours and takes appropriate action to maintain a safe community.",
    },
    {
      question: "What are the different membership plans and their benefits?",
      answer:
        "We offer Free, Premium, and Elite memberships. Premium includes unlimited messaging, advanced filters, and profile boosts. Elite adds priority support, exclusive events, and enhanced matching. Check our 'Store' section for detailed comparisons.",
    },
    {
      question: "How does the verification process work?",
      answer:
        "Profile verification involves reviewing your photos, personal information, and spiritual preferences for authenticity. This typically takes 24-48 hours. Verified profiles get a blue checkmark and are prioritized in matching algorithms.",
    },
    {
      question: "Can I pause or delete my account?",
      answer:
        "Yes! You can pause your account in Settings to temporarily hide your profile, or permanently delete your account. Paused accounts can be reactivated anytime. Deleted accounts cannot be recovered, so choose carefully.",
    },
    {
      question: "How do I change my location or expand my search area?",
      answer:
        "Go to 'Preferences' in your dashboard to update your location and adjust your search radius. Premium members can search in multiple cities and set broader geographical preferences.",
    },
    {
      question: "What if I'm not getting enough matches?",
      answer:
        "Try expanding your search criteria, updating your photos, completing your profile fully, and being active on the platform. Our algorithm favors complete, active profiles. Consider upgrading to Premium for profile boosts and advanced filters.",
    },
    {
      question: "How do I cancel my premium subscription?",
      answer:
        "You can cancel your subscription anytime in the 'Settings' > 'Subscription' section. Your premium features will remain active until the current billing period ends. No cancellation fees apply.",
    },
    {
      question: "Is DharmaSaathi available as a mobile app?",
      answer:
        "Yes! DharmaSaathi is available on both iOS and Android. Download from the App Store or Google Play Store. Your account syncs across all devices, so you can switch between web and mobile seamlessly.",
    },
    {
      question: "How do I know if someone is interested in me?",
      answer:
        "You'll receive notifications when someone likes your profile, sends you a message, or expresses interest. Check your 'Matches' section to see mutual interests and start conversations.",
    },
    {
      question: "What makes DharmaSaathi different from other matrimonial sites?",
      answer:
        "DharmaSaathi focuses specifically on spiritual compatibility, dharmic values, and meaningful connections. We emphasize quality over quantity, with thorough verification, spiritual preference matching, and a community built on shared values and traditions.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-brand-600 to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <HelpCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">We're Here to Help</h1>
            <p className="text-xl text-white/90 mb-6">
              Your spiritual journey to finding the perfect life partner should be smooth and supported. Our dedicated
              team is committed to helping you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="h-3 w-3 mr-1" />
                24/7 Support
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Secure & Private
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Heart className="h-3 w-3 mr-1" />
                Trusted by Thousands
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Get in Touch
                </CardTitle>
                <CardDescription>Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone Support */}
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600 mb-2">Call us directly for immediate assistance</p>
                    <a
                      href="tel:+919537376569"
                      className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      +91 95373 76569
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Available 9 AM - 9 PM IST</p>
                  </div>
                </div>

                <Separator />

                {/* Email Support */}
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-2">Send us detailed queries</p>
                    <a
                      href="mailto:support@dharmasaathi.com"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      support@dharmasaathi.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <Separator />

                {/* Community */}
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community Support</h3>
                    <p className="text-sm text-gray-600 mb-2">Connect with other users</p>
                    <p className="text-sm text-primary">Join our community forums</p>
                    <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Submit a Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a detailed message and we'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Please provide detailed information about your issue or question..."
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-600 to-primary hover:from-brand-700 hover:to-primary/90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions about DharmaSaathi</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
