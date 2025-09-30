"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-[9999]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logopertamina.svg"
              alt="Pertamina Logo"
              className="w-40 h-10"
            />
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
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Satgas RAFI
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Satgas NATARU
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Popup */}
      {isOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] md:hidden flex justify-end">
    <div className="mt-16 mr-4 w-64 bg-white rounded-xl shadow-xl p-6 space-y-6 relative">
      {/* Tombol Tutup */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Menu Items */}
      <Link
        href="/"
        className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
        onClick={() => setIsOpen(false)}
      >
        Beranda
      </Link>
      <Link
        href="/Peta-Overview-Wilayah"
        className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
        onClick={() => setIsOpen(false)}
      >
        Peta Overview Wilayah dan Outlet
      </Link>
    </div>
  </div>
)}
    </header>
  );
}
