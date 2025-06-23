"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
      const response = await fetch('/api/support/submit-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Ticket Submitted!',
          description: result.message,
          variant: 'default',
        })
        setFormData({ name: '', email: '', subject: '', message: '' }) // Clear form
      } else {
        toast({
          title: 'Submission Failed',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "How do I create an account on DharmaSaathi?",
      answer: "You can create an account by clicking on the 'Join Now' button on our homepage. You'll be guided through a simple onboarding process to set up your profile."
    },
    {
      question: "How can I update my profile details or photos?",
      answer: "After logging in, navigate to your 'Profile' section in the dashboard. You can edit your personal details, preferences, and upload new photos there. Remember to save your changes!"
    },
    {
      question: "How does the matching algorithm work?",
      answer: "Our algorithm considers your spiritual preferences, lifestyle choices, and partner preferences to suggest compatible matches. The more detailed your profile, the better our suggestions will be."
    },
    {
      question: "Is my personal information kept private?",
      answer: "Yes, your privacy is our top priority. We use advanced encryption and strict privacy controls. You can manage your privacy settings in the 'Privacy' section of your dashboard to control what information is visible to others."
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer: "If you experience any technical difficulties, please try refreshing the page or clearing your browser's cache. If the issue persists, use our contact form to reach out to our support team."\
    }
