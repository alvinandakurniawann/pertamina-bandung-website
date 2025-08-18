import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            PERTAMINA
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8">
            Sales Area Bandung
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Melayani kebutuhan energi masyarakat Bandung dan sekitarnya dengan komitmen kualitas dan pelayanan terbaik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/peta-spbu-spbe"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Peta SPBU & SPBE
            </Link>
            
          </div>
        </div>
      </section>

      {/* Sejarah SA Retail Bandung */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sejarah Sales Area Retail Bandung</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Sales Area (SA) Retail Bandung merupakan bagian dari Pertamina Patra Niaga yang bertugas melayani kebutuhan energi untuk wilayah Bandung dan sekitarnya. 
              Perjalanan SA Bandung ditandai modernisasi jaringan ritel, peningkatan layanan pelanggan, serta penguatan ketahanan pasokan.
            </p>
          </div>

          {/* Timeline ringkas */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-gray-50 rounded-lg p-5 border">
              <div className="text-sm text-blue-700 font-semibold">1970–1990-an</div>
              <div className="mt-1 font-bold text-gray-900">Awal Jaringan SPBU</div>
              <p className="mt-2 text-sm text-gray-600">Penguatan layanan BBM ritel dan perluasan titik SPBU di Bandung.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border">
              <div className="text-sm text-blue-700 font-semibold">2000–2010</div>
              <div className="mt-1 font-bold text-gray-900">Standarisasi Layanan</div>
              <p className="mt-2 text-sm text-gray-600">Peningkatan standar mutu dan keselamatan (HSSE) di ritel BBM/LPG.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border">
              <div className="text-sm text-blue-700 font-semibold">2010–2019</div>
              <div className="mt-1 font-bold text-gray-900">Modernisasi & Ekspansi</div>
              <p className="mt-2 text-sm text-gray-600">Revitalisasi SPBU, perluasan jaringan LPG, penguatan supply chain.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border">
              <div className="text-sm text-blue-700 font-semibold">2020–2022</div>
              <div className="mt-1 font-bold text-gray-900">Digitalisasi Layanan</div>
              <p className="mt-2 text-sm text-gray-600">Adopsi MyPertamina dan inisiatif Subsidi Tepat untuk LPG/BBM.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border">
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

                     <div className="text-center mt-10">
             <Link href="/peta-spbu-spbe" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition">Lihat Peta SPBU & SPBE</Link>
           </div>
        </div>
      </section>
      

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut tentang layanan dan produk Pertamina
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              href="/peta-spbu-spbe"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Peta SPBU & SPBE
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
