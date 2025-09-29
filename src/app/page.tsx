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
          style={{ backgroundImage: "url('/bannerhome.svg')" }}>
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="flex flex-col gap-6 z-10 max-w-4xl mx-auto w-full px-4 text-center md:text-left justify-center items-center h-screen">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl lg:text-6xl">
                Sales Area Bandung
            </h1>
            <div className="max-w-2xl mx-auto md:mx-0">
                <p className="text-white/90 text-center font-normal leading-relaxed sm:text-lg">
                    Sales Area Retail Bandung merupakan salah satu wilayah kerja
                    Marketing Operation Regional III Jawa Bagian Barat yang berlokasi
                    di Jl. Wirayudah No. 1 Bandung Jawa Barat.
                </p>
                <p className="text-white/90 text-center font-normal leading-relaxed sm:text-lg mt-4">
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
              {/* Text Section */}
              <div className="text-left w-full md:max-w-xl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Sejarah Sales Area Retail Bandung
                </h2>
                <p className="text-[16px] md:text-[18px] text-gray-600">
                  Sales Area (SA) Retail Bandung merupakan bagian dari Pertamina
                  Patra Niaga yang bertugas melayani kebutuhan energi untuk
                  wilayah Bandung dan sekitarnya. Perjalanan SA Bandung ditandai
                  modernisasi jaringan ritel, peningkatan layanan pelanggan, serta
                  penguatan ketahanan pasokan.
                </p>
              </div>

              {/* Image Section */}
              <div className="w-full md:w-[50%] flex justify-center md:justify-end">
                <img
                  src="/sejarah.svg"
                  alt="Sejarah SA Retail Bandung"
                  className="w-full md:w-[420px] h-auto object-cover rounded-lg shadow-md"
                />
              </div>
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
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                  <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11"/><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"/><path d="M6 13h12"/><path d="M6 17h12"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Distribusi BBM Ritel</h3>
                <p className="text-gray-600 text-sm">
                  Pengelolaan dan pengawasan penyaluran BBM ke SPBU, pemantauan
                  stok dan layanan pelanggan.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Penyaluran LPG</h3>
                <p className="text-gray-600 text-sm">
                  Koordinasi SPBE/agen dan monitoring program Subsidi Tepat untuk LPG rumah tangga.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                  <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"/><path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"/><path d="M2 21h13"/><path d="M3 9h11"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Jaringan Ritel & Pertashop</h3>
                <p className="text-gray-600 text-sm">
                  Pengembangan channel ritel termasuk Pertashop untuk menjangkau wilayah kota/kabupaten.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                  <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Digital & Subsidi Tepat</h3>
                <p className="text-gray-600 text-sm">
                  Implementasi MyPertamina, validasi data konsumen, serta tata kelola penyaluran subsidi.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">HSSE & Quality</h3>
                <p className="text-gray-600 text-sm">
                  Pengawasan kualitas produk dan keselamatan operasi di SPBU/SPBE.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                  <path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Layanan Masyarakat & CSR</h3>
                <p className="text-gray-600 text-sm">
                  Edukasi keselamatan energi, pelayanan keluhan, dan program tanggung jawab sosial.
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
