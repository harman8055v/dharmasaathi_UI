import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import DevAuthBanner from "@/components/dev-auth-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DharmaSaathi - Find Your Spiritual Life Partner",
  description: "Connect with like-minded souls on a journey of spiritual growth and conscious relationships.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DevAuthBanner />
          <div className="pt-0 md:pt-0">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
