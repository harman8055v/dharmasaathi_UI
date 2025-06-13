import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Your existing landing page content */}

      {/* Add a button to navigate to the onboarding page */}
      <div className="flex justify-center mt-8">
        <Link href="/onboarding">
          <Button className="bg-maroon-800 hover:bg-maroon-700 text-white">Start Onboarding</Button>
        </Link>
      </div>
    </div>
  )
}
