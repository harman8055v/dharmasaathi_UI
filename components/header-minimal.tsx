"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSignup = () => {
    const signupForm = document.getElementById("signup-form")
    if (signupForm) {
      signupForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">DharmaSaathi</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Stories
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={scrollToSignup} className="btn btn-ghost">
              Login
            </button>
            <button onClick={scrollToSignup} className="btn btn-primary">
              Join Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Stories
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <button onClick={scrollToSignup} className="btn btn-ghost w-full">
                  Login
                </button>
                <button onClick={scrollToSignup} className="btn btn-primary w-full">
                  Join Now
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
