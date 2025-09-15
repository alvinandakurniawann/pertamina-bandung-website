import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center bg-cover" style={{ backgroundImage: "url('/bannerhome.svg')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        
         <div className="flex flex-col gap-6 z-10 text-left max-w-4xl mx-auto w-full text-center items-center">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl lg:text-6xl">
              Sales Area Bandung 
            </h1>
            <div className="max-w-2xl ml-[80px]">
            <p className="text-white/90 text-base font-normal leading-relaxed sm:text-lg">
              Sales Area Retail Bandung merupakan salah satu wilayah kerja Marketing Operation Regional III Jawa Bagian Barat yang berlokasi di Jl. Wirayudah No. 1 Bandung Jawa Barat. 
            </p>
            <p className="text-white/90 text-base font-normal leading-relaxed sm:text-lg mt-4">
               SA Retail Bandung melayani 4 Kota dan 7 Kabupaten yang meliputi Bandung Raya, Sumedang dan Priangan Timur.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          <div className='flex flex-col md:flex-row items-center gap-30 mb-18'>
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sejarah Sales Area Retail Bandung</h2>
              <p className="text-lg w-[700px] text-gray-600 max-w-4xl mx-auto">
                Sales Area (SA) Retail Bandung merupakan bagian dari Pertamina Patra Niaga yang bertugas melayani kebutuhan energi untuk wilayah Bandung dan sekitarnya. 
                 Perjalanan SA Bandung ditandai modernisasi jaringan ritel, peningkatan layanan pelanggan, serta penguatan ketahanan pasokan.
              </p>
            </div>
            <img src="/sejarah.svg" alt="Sejarah SA Retail Bandung" className="w-[428px] h-[380px] object-cover rounded-lg shadow-md" /> 
          </div>

          {/* Timeline ringkas */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
              <div className="text-sm text-blue-700 font-semibold">1970–1990-an</div>
              <div className="mt-1 font-bold text-gray-900">Awal Jaringan SPBU</div>
              <p className="mt-2 text-sm text-gray-600">Penguatan layanan BBM ritel dan perluasan titik SPBU di Bandung.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
              <div className="text-sm text-blue-700 font-semibold">2000–2010</div>
              <div className="mt-1 font-bold text-gray-900">Standarisasi Layanan</div>
              <p className="mt-2 text-sm text-gray-600">Peningkatan standar mutu dan keselamatan (HSSE) di ritel BBM/LPG.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
              <div className="text-sm text-blue-700 font-semibold">2010–2019</div>
              <div className="mt-1 font-bold text-gray-900">Modernisasi & Ekspansi</div>
              <p className="mt-2 text-sm text-gray-600">Revitalisasi SPBU, perluasan jaringan LPG, penguatan supply chain.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
              <div className="text-sm text-blue-700 font-semibold">2020–2022</div>
              <div className="mt-1 font-bold text-gray-900">Digitalisasi Layanan</div>
              <p className="mt-2 text-sm text-gray-600">Adopsi MyPertamina dan inisiatif Subsidi Tepat untuk LPG/BBM.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-300">
              <div className="text-sm text-blue-700 font-semibold">2023–Kini</div>
              <div className="mt-1 font-bold text-gray-900">Fokus Ketahanan Energi</div>
              <p className="mt-2 text-sm text-gray-600">Optimalisasi distribusi, layanan pelanggan, dan keberlanjutan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Operasional SA Bandung */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Apa yang Dilakukan SA Retail Bandung</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">Bidang operasi utama dan tanggung jawab layanan di wilayah Bandung dan sekitarnya.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Distribusi BBM Ritel</h3>
              <p className="text-gray-600 text-sm">Pengelolaan dan pengawasan penyaluran BBM ke SPBU, pemantauan stok dan layanan pelanggan.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Penyaluran LPG</h3>
              <p className="text-gray-600 text-sm">Koordinasi SPBE/agen dan monitoring program Subsidi Tepat untuk LPG rumah tangga.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Jaringan Ritel & Pertashop</h3>
              <p className="text-gray-600 text-sm">Pengembangan channel ritel termasuk Pertashop untuk menjangkau wilayah kota/kabupaten.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Digital & Subsidi Tepat</h3>
              <p className="text-gray-600 text-sm">Implementasi MyPertamina, validasi data konsumen, serta tata kelola penyaluran subsidi.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">HSSE & Quality</h3>
              <p className="text-gray-600 text-sm">Pengawasan kualitas produk dan keselamatan operasi di SPBU/SPBE.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border hover:shadow-sm transition">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20h10M12 14v6m8-10a8 8 0 11-16 0 8 8 0 0116 0z"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Layanan Masyarakat & CSR</h3>
              <p className="text-gray-600 text-sm">Edukasi keselamatan energi, pelayanan keluhan, dan program tanggung jawab sosial.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
      <Footer />
    </>
  )
}
