"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface StemStageProps {
  profile: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function StemStage({ profile, onSubmit, isSubmitting }: StemStageProps) {
  const [formData, setFormData] = useState({
    gender: profile.gender || "",
    birthdate: profile.birthdate || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    mother_tongue: profile.mother_tongue || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Let's sprout your profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Female</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          {/* Birthdate */}
          <div className="space-y-2">
            <label htmlFor="birthdate" className="block text-sm font-medium text-foreground">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-foreground">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-foreground">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-foreground">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Mother Tongue */}
          <div className="space-y-2">
            <label htmlFor="mother_tongue" className="block text-sm font-medium text-foreground">
              Mother Tongue
            </label>
            <input
              type="text"
              id="mother_tongue"
              name="mother_tongue"
              value={formData.mother_tongue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
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
