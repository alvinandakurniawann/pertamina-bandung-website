import Link from 'next/link'

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tentang Kami
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Mengenal lebih dekat Pertamina Cabang Bandung dan komitmen kami dalam melayani masyarakat
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Pertamina Cabang Bandung
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Pertamina Cabang Bandung merupakan bagian dari PT Pertamina (Persero), perusahaan energi nasional yang berkomitmen melayani kebutuhan energi masyarakat Bandung dan sekitarnya dengan standar kualitas dan pelayanan terbaik.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Dengan pengalaman puluhan tahun dalam industri energi, kami terus berinovasi untuk memberikan layanan yang lebih baik dan mendukung pertumbuhan ekonomi daerah Jawa Barat.
              </p>
              <p className="text-lg text-gray-600">
                Jaringan SPBU dan SPBE kami tersebar di seluruh wilayah Bandung, Cimahi, dan sekitarnya untuk memastikan akses energi yang mudah dan terjangkau bagi seluruh masyarakat.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Fakta & Angka</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">SPBU Aktif</span>
                  <span className="text-2xl font-bold">21+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">SPBE Aktif</span>
                  <span className="text-2xl font-bold">9+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Wilayah Cakupan</span>
                  <span className="text-2xl font-bold">6 SA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Tahun Berdiri</span>
                  <span className="text-2xl font-bold">1957</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Visi & Misi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Komitmen kami dalam melayani bangsa dan negara
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Visi</h3>
              </div>
              <p className="text-lg text-gray-600 text-center">
                Menjadi perusahaan energi nasional kelas dunia yang terpercaya, kompetitif, dan terdepan dalam menjalankan misi pelayanan publik.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Misi</h3>
              </div>
              <p className="text-lg text-gray-600 text-center">
                Mengelola dan mengusahakan kegiatan di bidang energi dan petrokimia, melaksanakan tugas-tugas negara untuk menyediakan BBM dan LPG dalam negeri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nilai-Nilai Perusahaan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Prinsip-prinsip yang menjadi dasar dalam menjalankan bisnis kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Integritas</h3>
              <p className="text-gray-600">Menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Inovasi</h3>
              <p className="text-gray-600">Terus berinovasi untuk memberikan layanan yang lebih baik</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kolaborasi</h3>
              <p className="text-gray-600">Berkolaborasi dengan berbagai pihak untuk mencapai tujuan bersama</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kepedulian</h3>
              <p className="text-gray-600">Peduli terhadap lingkungan, keselamatan, dan kesejahteraan masyarakat</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Sejarah Pertamina
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Perjalanan panjang Pertamina dalam melayani bangsa Indonesia
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1957
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pendirian Pertamina</h3>
                  <p className="text-gray-600">PT Pertamina (Persero) didirikan sebagai perusahaan minyak dan gas bumi milik negara</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1971
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ekspansi Nasional</h3>
                  <p className="text-gray-600">Pertamina mulai memperluas jaringan SPBU ke seluruh Indonesia termasuk Bandung</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2003
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Transformasi Digital</h3>
                  <p className="text-gray-600">Memulai transformasi digital dengan sistem manajemen terintegrasi</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2020
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Inovasi Layanan</h3>
                  <p className="text-gray-600">Meluncurkan layanan digital dan pembayaran elektronik untuk kemudahan pelanggan</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2024
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Masa Depan</h3>
                  <p className="text-gray-600">Terus berkomitmen menjadi perusahaan energi terdepan dengan fokus pada keberlanjutan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tim Manajemen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kepemimpinan yang berpengalaman dan berdedikasi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">General Manager</h3>
              <p className="text-gray-600 mb-2">Ir. Ahmad Supriyadi</p>
              <p className="text-sm text-gray-500">Memimpin operasional cabang Bandung</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Manager Operasional</h3>
              <p className="text-gray-600 mb-2">Drs. Budi Santoso</p>
              <p className="text-sm text-gray-500">Mengawasi operasional SPBU dan SPBE</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Manager Layanan</h3>
              <p className="text-gray-600 mb-2">Siti Nurhaliza, S.E.</p>
              <p className="text-sm text-gray-500">Mengelola layanan pelanggan dan kualitas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Tahu Lebih Lanjut?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih detail tentang layanan dan produk Pertamina
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Hubungi Kami
            </Link>
            <Link
              href="/layanan"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Layanan
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
