"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import BasicInfoStep from "./steps/basic-info-step"
import SpiritualPathStep from "./steps/spiritual-path-step"
import LifestyleStep from "./steps/lifestyle-step"
import ProfessionalStep from "./steps/professional-step"
import PersonalDetailsStep from "./steps/personal-details-step"
import JourneyStep from "./steps/journey-step"
import PhotosStep from "./steps/photos-step"
import FinalStep from "./steps/final-step"
import WelcomeScreen from "./welcome-screen"
import ProgressIndicator from "./progress-indicator"

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const totalSteps = 8

  const handleNext = (stepData = {}) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setFormData({})
    setIsComplete(false)
  }

  if (isComplete) {
    return <WelcomeScreen onStartOver={handleStartOver} />
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-light text-maroon-800 dark:text-maroon-300 mb-2">DharmaSaathi</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Find your spiritual partner</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {currentStep === 1 && <BasicInfoStep onNext={handleNext} onSkip={handleSkip} />}
              {currentStep === 2 && <SpiritualPathStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 3 && <LifestyleStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 4 && <ProfessionalStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 5 && <PersonalDetailsStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 6 && <JourneyStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 7 && <PhotosStep onNext={handleNext} onSkip={handleSkip} onBack={handleBack} />}
              {currentStep === 8 && <FinalStep onNext={handleNext} onBack={handleBack} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
