'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logopertamina.svg" alt="Pertamina Logo" className="w-32 h-8 sm:w-40 sm:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Beranda
            </Link>
            
            <Link
              href="/Peta-Overview-Wilayah"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Peta Overview Wilayah dan Outlet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-300"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-64 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            
            <Link
              href="/Peta-Overview-Wilayah"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Peta Overview Wilayah dan Outlet
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
