"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, CreditCard, Smartphone, Building, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    type: "plan" | "superlike" | "highlight"
    name: string
    price: number
    description: string
    features?: string[]
    count?: number
  } | null
  onSuccess: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentModal({ isOpen, onClose, item, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "success">("details")

  if (!item) return null

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway")
      }

      // Create order
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: item.price * 100, // Convert to paise
          currency: "INR",
          receipt: `${item.type}_${Date.now()}`,
          notes: {
            type: item.type,
            name: item.name,
            count: item.count || 1,
          },
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderResponse.json()

      // Configure Razorpay options
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "DharmaSaathi",
        description: item.description,
        order_id: order.id,
        image: "/logo.png",
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#f97316", // Orange theme
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                item_type: item.type,
                item_name: item.name,
                amount: item.price,
                count: item.count || 1,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const result = await verifyResponse.json()
            if (result.verified) {
              setPaymentStep("success")
              setTimeout(() => {
                onSuccess()
                onClose()
                toast.success("Payment successful! Your purchase has been activated.")
              }, 2000)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast.error("Payment verification failed. Please contact support.")
            setPaymentStep("details")
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            setPaymentStep("details")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed. Please try again.")
      setPaymentStep("details")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentStep = () => {
    switch (paymentStep) {
      case "processing":
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Please complete the payment in the popup window</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-green-700">Payment Successful!</h3>
            <p className="text-gray-600">Your purchase has been activated</p>
          </div>
        )

      default:
        return (
          <>
            {/* Item Details */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">₹{item.price}</div>
                    {item.count && <div className="text-sm text-gray-500">{item.count} items</div>}
                  </div>
                </div>

                {item.features && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Includes:</h4>
                    <ul className="space-y-1">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Accepted Payment Methods</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 border rounded-lg">
                  <Smartphone className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs text-center">UPI</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-xs text-center">Cards</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-lg">
                  <Building className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-xs text-center">Net Banking</span>
                </div>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Secure Payment</h4>
                  <p className="text-sm text-green-700">Your payment is protected by 256-bit SSL encryption</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
              <Lock className="w-4 h-4" />
              <span>Powered by Razorpay • PCI DSS Compliant</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isProcessing ? "Processing..." : `Pay ₹${item.price}`}
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Complete Payment</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        {renderPaymentStep()}
      </DialogContent>
    </Dialog>
  )
}
