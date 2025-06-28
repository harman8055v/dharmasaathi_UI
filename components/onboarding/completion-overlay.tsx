import { CheckCircle } from "lucide-react"

export default function CompletionOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Profile Complete!</h2>
        <p className="text-gray-600 mt-2">Redirecting you to your dashboard...</p>
      </div>
    </div>
  )
}
