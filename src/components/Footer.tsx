import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 h-[365px]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3">
          {/* Company Info */}
          <div className="md:col-span-1 w-[330px]">
            <div className="flex items-center space-x-2 mb-4">
                <img src="/Logo.svg" alt="Pertamina Logo" className="w-46 h-auto" />
            </div>
            <div className="flex space-x-4 flex-col w-[330px] pt-12">
              <p className="mb-4 tracking-wider leading-relaxed w-[330px] text-gray-400">
              Melayani kebutuhan energi masyarakat Bandung dan sekitarnya dengan komitmen kualitas dan pelayanan terbaik.
              </p>
              <div className="flex space-x-4 pt-10">
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                  {/* TikTok */}
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z"/>
                  </svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                  {/* X (Twitter) */}
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                  {/* Facebook */}
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
                  {/* YouTube */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.027 0 12 0 12s0 3.973.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.455 20.5 12 20.5 12 20.5s7.545 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.973 24 12 24 12s0-3.973-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='ml-[110px]'>
            <h4 className="text-lg font-semibold w-[119px] border-b border-gray-600 mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition duration-300">
                  Beranda
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact Information */}
          <div className='ml-[50px]'>
            <h4 className="text-lg font-semibold border-b border-gray-600 w-[151px] mb-4">Informasi Kontak</h4>
            <div className="space-y-2 text-gray-400">
              <p>Jl. Wirayuda Timur No.1, Lebakgede, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132</p>
              <p className="mt-2">
                <span className="font-medium">Telepon:</span><br />
                (022) 2516301
              </p>
              <p>
                <span className="font-medium">Email:</span><br />
                info@pertamina-bandung.com
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t text-gray-400 border-gray-600 mt-2 pt-2">
          <p>© 2025 Pertamina Sales Area Retail Bandung. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
