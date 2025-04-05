"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20">
              <img
                src="/images/lpu-logo.png"
                alt="Lovely Professional University Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">
              SpeakPal <span className="text-cyan-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-white hover:text-cyan-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-white hover:text-cyan-400 transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-white hover:text-cyan-400 transition-colors">
            Pricing
          </Link>
          <Link href="#blog" className="text-white hover:text-cyan-400 transition-colors">
            Blog
          </Link>
        </div>

        <Button className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
          Get Started
        </Button>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-blue-900/80 backdrop-blur-sm rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <Link href="#features" className="text-white hover:text-cyan-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white hover:text-cyan-400 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-white hover:text-cyan-400 transition-colors">
              Pricing
            </Link>
            <Link href="#blog" className="text-white hover:text-cyan-400 transition-colors">
              Blog
            </Link>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

