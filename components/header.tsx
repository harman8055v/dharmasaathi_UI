"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import AuthDialog from "./auth-dialog"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signup" | "login">("login")

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const openAuth = (mode: "signup" | "login") => {
    setAuthMode(mode)
    setIsAuthOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-effect border-b">
        <div className="container px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => scrollToSection("hero")}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="DharmaSaathi Logo"
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:to-pink-700 transition-all duration-300">
                DharmaSaathi
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 transform duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 transform duration-200"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 transform duration-200"
              >
                Stories
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium hover:text-primary transition-colors hover:scale-105 transform duration-200"
              >
                FAQ
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => openAuth("login")}
                className="hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-105"
              >
                Login
              </Button>
              <Button
                onClick={() => openAuth("signup")}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Join Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t bg-white/95 backdrop-blur-sm rounded-b-lg">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1 rounded hover:bg-orange-50"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1 rounded hover:bg-orange-50"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1 rounded hover:bg-orange-50"
                >
                  Stories
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1 rounded hover:bg-orange-50"
                >
                  FAQ
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => openAuth("login")}
                    className="justify-start hover:bg-orange-50 hover:text-orange-600"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => openAuth("signup")}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    Join Now
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </>
  )
}
