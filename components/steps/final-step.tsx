"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FinalStepProps {
  onNext: (data: any) => void
  onBack: () => void
}

export default function FinalStep({ onNext, onBack }: FinalStepProps) {
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!agreed) {
      setError("Please agree to the community guidelines to continue")
      return
    }
    setError("")
    onNext({ communityGuidelines: true })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-3">Almost there!</h2>
        <p className="text-slate-600 dark:text-slate-400">
          You're now part of a conscious community. Let's co-create a safe, inspiring space together.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
              id="community-guidelines"
              className="mt-1 border-slate-400 dark:border-slate-500 data-[state=checked]:border-maroon-700 data-[state=checked]:bg-maroon-700 dark:data-[state=checked]:border-maroon-500 dark:data-[state=checked]:bg-maroon-500"
            />
            <div className="space-y-2">
              <Label
                htmlFor="community-guidelines"
                className="text-base font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Community Guidelines Agreement
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I affirm that I am seeking a genuine, spiritually aligned connection and will interact respectfully with
                all members of the DharmaSaathi community. I understand the importance of creating a safe, supportive
                environment for everyone.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-maroon-50 dark:bg-maroon-900/20 p-6 rounded-xl border border-maroon-200 dark:border-maroon-800/50">
          <h3 className="font-medium text-maroon-800 dark:text-maroon-300 mb-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-maroon-700 dark:text-maroon-400" />
            What happens next?
          </h3>
          <ul className="text-sm text-maroon-700 dark:text-maroon-300/90 space-y-2">
            <li>
              • Your profile will be reviewed. This may take up to 4 business days due to the high volume of
              applications we receive.
            </li>
            <li>• You'll receive personalized matches based on your spiritual journey.</li>
            <li>• Connect with like-minded souls in a respectful environment.</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 pt-6">
          <Button
            onClick={handleSubmit}
            className="bg-maroon-800 hover:bg-maroon-700 dark:bg-maroon-700 dark:hover:bg-maroon-600 text-white py-3 rounded-xl font-medium text-base"
          >
            Complete Profile & Start Journey
          </Button>
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    </div>
  )
}
