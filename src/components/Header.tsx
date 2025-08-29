import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logopertamina.svg" alt="Pertamina Logo" className="w-40 h-10" />
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
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-300">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
