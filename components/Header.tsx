'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-blog">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍜</span>
            <span className="font-serif text-xl font-bold text-primary-900 hidden sm:inline">
              World Travels Food
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-accent transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/categories/street-food" 
              className="text-gray-700 hover:text-accent transition-colors font-medium"
            >
              Street Food
            </Link>
            <Link 
              href="/categories/regional-cuisine" 
              className="text-gray-700 hover:text-accent transition-colors font-medium"
            >
              Regional Cuisine
            </Link>
            <Link 
              href="/categories/local-markets" 
              className="text-gray-700 hover:text-accent transition-colors font-medium"
            >
              Local Markets
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-accent transition-colors font-medium"
            >
              Contact
            </Link>
            {/* Changed: Added Search Link (from main branch) */}
            <Link 
              href="/search" 
              className="flex items-center gap-1 text-gray-700 hover:text-accent transition-colors font-medium"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="sr-only md:not-sr-only">Search</span>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/categories/street-food" 
                className="text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Street Food
              </Link>
              <Link 
                href="/categories/regional-cuisine" 
                className="text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Regional Cuisine
              </Link>
              <Link 
                href="/categories/local-markets" 
                className="text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Local Markets
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {/* Changed: Added Search Link for mobile (from main branch) */}
              <Link 
                href="/search" 
                className="flex items-center gap-2 text-gray-700 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}