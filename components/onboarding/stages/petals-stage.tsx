"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, X } from "lucide-react"

interface PetalsStageProps {
  profile: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function PetalsStage({ profile, onSubmit, isSubmitting }: PetalsStageProps) {
  const [formData, setFormData] = useState({
    spiritual_org: profile.spiritual_org || [],
    daily_practices: profile.daily_practices || [],
    diet: profile.diet || "",
    temple_visit_freq: profile.temple_visit_freq || "",
    vanaprastha_interest: profile.vanaprastha_interest || "",
    artha_vs_moksha: profile.artha_vs_moksha || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelect = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev[name as keyof typeof prev])
        ? (prev[name as keyof typeof prev] as string[])
        : []

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((v) => v !== value),
        }
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const spiritualOrgs = [
    "ISKCON",
    "Ramakrishna Mission",
    "Art of Living",
    "Brahma Kumaris",
    "Chinmaya Mission",
    "Swaminarayan",
    "Sathya Sai Organization",
    "Divine Life Society",
    "Other",
  ]

  const dailyPractices = [
    "Meditation",
    "Yoga",
    "Chanting",
    "Prayer",
    "Scriptural Study",
    "Seva/Service",
    "Fasting",
    "Other",
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Choose your spiritual petals</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Spiritual Organizations */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Spiritual Organizations (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {spiritualOrgs.map((org) => (
                <button
                  key={org}
                  type="button"
                  onClick={() => handleMultiSelect("spiritual_org", org)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    (formData.spiritual_org as string[]).includes(org)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {org}
                </button>
              ))}
            </div>
            {(formData.spiritual_org as string[]).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.spiritual_org as string[]).map((org) => (
                  <span
                    key={org}
                    className="inline-flex items-center bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs"
                  >
                    {org}
                    <button
                      type="button"
                      onClick={() => handleMultiSelect("spiritual_org", org)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Daily Practices */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Daily Spiritual Practices (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {dailyPractices.map((practice) => (
                <button
                  key={practice}
                  type="button"
                  onClick={() => handleMultiSelect("daily_practices", practice)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    (formData.daily_practices as string[]).includes(practice)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {practice}
                </button>
              ))}
            </div>
            {(formData.daily_practices as string[]).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {(formData.daily_practices as string[]).map((practice) => (
                  <span
                    key={practice}
                    className="inline-flex items-center bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs"
                  >
                    {practice}
                    <button
                      type="button"
                      onClick={() => handleMultiSelect("daily_practices", practice)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Diet */}
          <div className="space-y-2">
            <label htmlFor="diet" className="block text-sm font-medium text-foreground">
              Diet Preference
            </label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select diet preference</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Sattvic">Sattvic</option>
              <option value="Non-vegetarian">Non-vegetarian</option>
              <option value="Occasionally Non-vegetarian">Occasionally Non-vegetarian</option>
              <option value="Jain">Jain</option>
            </select>
          </div>

          {/* Temple Visit Frequency */}
          <div className="space-y-2">
            <label htmlFor="temple_visit_freq" className="block text-sm font-medium text-foreground">
              Temple Visit Frequency
            </label>
            <select
              id="temple_visit_freq"
              name="temple_visit_freq"
              value={formData.temple_visit_freq}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="On festivals only">On festivals only</option>
              <option value="Rarely">Rarely</option>
              <option value="Never">Never</option>
            </select>
          </div>

          {/* Vanaprastha Interest */}
          <div className="space-y-2">
            <label htmlFor="vanaprastha_interest" className="block text-sm font-medium text-foreground">
              Interest in Vanaprastha (Spiritual Retirement)
            </label>
            <select
              id="vanaprastha_interest"
              name="vanaprastha_interest"
              value={formData.vanaprastha_interest}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select interest level</option>
              <option value="Very interested">Very interested</option>
              <option value="Somewhat interested">Somewhat interested</option>
              <option value="Neutral">Neutral</option>
              <option value="Not interested">Not interested</option>
              <option value="Need more information">Need more information</option>
            </select>
          </div>

          {/* Artha vs Moksha */}
          <div className="space-y-2">
            <label htmlFor="artha_vs_moksha" className="block text-sm font-medium text-foreground">
              Balance between Material Prosperity (Artha) and Spiritual Liberation (Moksha)
            </label>
            <select
              id="artha_vs_moksha"
              name="artha_vs_moksha"
              value={formData.artha_vs_moksha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select your preference</option>
              <option value="Strongly favor Artha">Strongly favor material prosperity (Artha)</option>
              <option value="Moderately favor Artha">Moderately favor material prosperity (Artha)</option>
              <option value="Equal importance">Equal importance to both</option>
              <option value="Moderately favor Moksha">Moderately favor spiritual liberation (Moksha)</option>
              <option value="Strongly favor Moksha">Strongly favor spiritual liberation (Moksha)</option>
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
