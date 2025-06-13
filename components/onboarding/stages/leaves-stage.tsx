"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface LeavesStageProps {
  profile: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function LeavesStage({ profile, onSubmit, isSubmitting }: LeavesStageProps) {
  const [formData, setFormData] = useState({
    education: profile.education || "",
    profession: profile.profession || "",
    annual_income: profile.annual_income || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const incomeRanges = [
    "Less than ₹5,00,000",
    "₹5,00,000 - ₹10,00,000",
    "₹10,00,000 - ₹15,00,000",
    "₹15,00,000 - ₹25,00,000",
    "₹25,00,000 - ₹50,00,000",
    "₹50,00,000 - ₹75,00,000",
    "₹75,00,000 - ₹1,00,00,000",
    "More than ₹1,00,00,000",
    "Prefer not to say",
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Name your strengths</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Education */}
          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium text-foreground">
              Highest Education
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <label htmlFor="profession" className="block text-sm font-medium text-foreground">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Doctor, Teacher"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <label htmlFor="annual_income" className="block text-sm font-medium text-foreground">
              Annual Income
            </label>
            <select
              id="annual_income"
              name="annual_income"
              value={formData.annual_income}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select income range</option>
              {incomeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Next"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
