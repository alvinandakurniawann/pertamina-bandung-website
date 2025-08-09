import Link from 'next/link'

export default function LayananPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Layanan Kami
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Berbagai produk dan layanan energi yang kami sediakan untuk memenuhi kebutuhan masyarakat
          </p>
        </div>
      </section>

      {/* BBM Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bahan Bakar Minyak (BBM)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilihan BBM berkualitas tinggi untuk berbagai jenis kendaraan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pertalite</h3>
                <p className="text-sm text-gray-600 mb-4">RON 90</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• BBM untuk kendaraan bermotor</p>
                <p>• Harga terjangkau</p>
                <p>• Kualitas terjamin</p>
                <p>• Ramah lingkungan</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pertamax</h3>
                <p className="text-sm text-gray-600 mb-4">RON 92</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• BBM premium untuk kendaraan modern</p>
                <p>• Performa tinggi</p>
                <p>• Mesin lebih bersih</p>
                <p>• Konsumsi lebih efisien</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pertamax Turbo</h3>
                <p className="text-sm text-gray-600 mb-4">RON 98</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• BBM premium untuk kendaraan performa tinggi</p>
                <p>• Akselerasi maksimal</p>
                <p>• Mesin lebih responsif</p>
                <p>• Teknologi terdepan</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Dexlite</h3>
                <p className="text-sm text-gray-600 mb-4">CN 51</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• BBM untuk kendaraan diesel</p>
                <p>• Performa optimal</p>
                <p>• Mesin lebih awet</p>
                <p>• Emisi rendah</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LPG Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Liquefied Petroleum Gas (LPG)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LPG berkualitas untuk kebutuhan rumah tangga dan industri
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">LPG 3kg</h3>
                <p className="text-gray-600">Untuk kebutuhan rumah tangga</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Harga terjangkau</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kualitas terjamin</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Distribusi merata</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Layanan 24 jam</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">LPG 12kg</h3>
                <p className="text-gray-600">Untuk kebutuhan industri dan komersial</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Kapasitas besar</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Efisien untuk industri</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pengiriman langsung</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Layanan khusus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pertashop Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Pertashop
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Toko retail yang menyediakan berbagai produk kebutuhan sehari-hari dengan kualitas terjamin dan harga terjangkau.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Produk kebutuhan sehari-hari</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Layanan pembayaran digital</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Lokasi strategis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Jam operasional fleksibel</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Produk Tersedia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Makanan & Minuman</h4>
                  <p className="text-sm opacity-90">Snack, minuman, makanan ringan</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Kebutuhan Rumah</h4>
                  <p className="text-sm opacity-90">Peralatan rumah tangga</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Kesehatan</h4>
                  <p className="text-sm opacity-90">Obat-obatan, vitamin</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Otomotif</h4>
                  <p className="text-sm opacity-90">Peralatan kendaraan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pertamina Pay Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Fitur Pertamina Pay</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Pembayaran BBM & LPG</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Top up saldo</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Riwayat transaksi</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Keamanan terjamin</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Pertamina Pay
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Layanan pembayaran digital yang praktis dan aman untuk transaksi BBM, LPG, dan produk Pertamina lainnya.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">Kemudahan Transaksi</h4>
                  <p className="text-gray-600 text-sm">Bayar BBM dan LPG dengan mudah melalui aplikasi mobile</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">Promo & Cashback</h4>
                  <p className="text-gray-600 text-sm">Dapatkan berbagai promo menarik dan cashback untuk setiap transaksi</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">Loyalty Program</h4>
                  <p className="text-gray-600 text-sm">Program loyalitas dengan poin reward yang dapat ditukar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Lokasi Layanan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan SPBU, SPBE, dan Pertashop terdekat di wilayah Anda
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">SPBU</h3>
              <p className="text-gray-600 mb-4">21+ lokasi tersebar di 6 wilayah SA</p>
              <Link
                href="/peta-sa"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Lihat Peta →
              </Link>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">SPBE</h3>
              <p className="text-gray-600 mb-4">9+ lokasi untuk kebutuhan LPG</p>
              <Link
                href="/peta-sa"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Lihat Peta →
              </Link>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pertashop</h3>
              <p className="text-gray-600 mb-4">Toko retail di berbagai lokasi</p>
              <Link
                href="/kontak"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Hubungi Kami →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut tentang layanan dan produk yang kami sediakan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Hubungi Kami
            </Link>
            <Link
              href="/peta-sa"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Peta SA
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
