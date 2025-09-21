import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center bg-cover bg-center"
          style={{ backgroundImage: "url('/bannerhome.svg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="flex flex-col gap-6 z-10 max-w-4xl mx-auto w-full px-4 text-center md:text-left">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl lg:text-6xl">
              Sales Area Bandung
            </h1>
            <div className="max-w-2xl mx-auto md:mx-0">
              <p className="text-white/90 text-base font-normal leading-relaxed sm:text-lg">
                Sales Area Retail Bandung merupakan salah satu wilayah kerja
                Marketing Operation Regional III Jawa Bagian Barat yang berlokasi
                di Jl. Wirayudah No. 1 Bandung Jawa Barat.
              </p>
              <p className="text-white/90 text-base font-normal leading-relaxed sm:text-lg mt-4">
                SA Retail Bandung melayani 4 Kota dan 7 Kabupaten yang meliputi
                Bandung Raya, Sumedang dan Priangan Timur.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/Peta-Overview-Wilayah"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Lihat Peta Overview Wilayah dan Outlet
              </Link>
            </div>
          </div>
        </section>

        {/* Sejarah SA Retail Bandung */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
              <div className="text-left max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Sejarah Sales Area Retail Bandung
                </h2>
                <p className="text-lg text-gray-600">
                  Sales Area (SA) Retail Bandung merupakan bagian dari Pertamina
                  Patra Niaga yang bertugas melayani kebutuhan energi untuk
                  wilayah Bandung dan sekitarnya. Perjalanan SA Bandung ditandai
                  modernisasi jaringan ritel, peningkatan layanan pelanggan, serta
                  penguatan ketahanan pasokan.
                </p>
              </div>
              <img
                src="/sejarah.svg"
                alt="Sejarah SA Retail Bandung"
                className="w-full md:w-[428px] h-auto object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Timeline ringkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                <div className="text-sm text-blue-700 font-semibold">1970–1990-an</div>
                <div className="mt-1 font-bold text-gray-900">Awal Jaringan SPBU</div>
                <p className="mt-2 text-sm text-gray-600">
                  Penguatan layanan BBM ritel dan perluasan titik SPBU di Bandung.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                <div className="text-sm text-blue-700 font-semibold">2000–2010</div>
                <div className="mt-1 font-bold text-gray-900">Standarisasi Layanan</div>
                <p className="mt-2 text-sm text-gray-600">
                  Peningkatan standar mutu dan keselamatan (HSSE) di ritel BBM/LPG.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                <div className="text-sm text-blue-700 font-semibold">2010–2019</div>
                <div className="mt-1 font-bold text-gray-900">Modernisasi & Ekspansi</div>
                <p className="mt-2 text-sm text-gray-600">
                  Revitalisasi SPBU, perluasan jaringan LPG, penguatan supply chain.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                <div className="text-sm text-blue-700 font-semibold">2020–2022</div>
                <div className="mt-1 font-bold text-gray-900">Digitalisasi Layanan</div>
                <p className="mt-2 text-sm text-gray-600">
                  Adopsi MyPertamina dan inisiatif Subsidi Tepat untuk LPG/BBM.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
                <div className="text-sm text-blue-700 font-semibold">2023–Kini</div>
                <div className="mt-1 font-bold text-gray-900">Fokus Ketahanan Energi</div>
                <p className="mt-2 text-sm text-gray-600">
                  Optimalisasi distribusi, layanan pelanggan, dan keberlanjutan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Operasional SA Bandung */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Apa yang Dilakukan SA Retail Bandung
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Bidang operasi utama dan tanggung jawab layanan di wilayah Bandung
                dan sekitarnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card contoh */}
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Distribusi BBM Ritel</h3>
                <p className="text-gray-600 text-sm">
                  Pengelolaan dan pengawasan penyaluran BBM ke SPBU, pemantauan
                  stok dan layanan pelanggan.
                </p>
              </div>
              {/* Tambahkan card lain sama seperti contoh */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
