import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DharmaSaathi - Where Spiritual Seekers Find Love",
  description:
    "A global spiritual matrimony platform connecting like-minded souls on their journey from drama to dharma.",
  keywords: "spiritual matrimony, dharma, soulmates, spiritual dating, conscious relationships",
  openGraph: {
    title: "DharmaSaathi - Where Spiritual Seekers Find Love",
    description: "A global spiritual matrimony platform connecting like-minded souls.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  )
}
