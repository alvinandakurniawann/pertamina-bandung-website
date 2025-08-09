'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Kami siap melayani pertanyaan dan kebutuhan Anda
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Telepon</h3>
              <p className="text-gray-600 mb-2">022-1234567</p>
              <p className="text-gray-600">022-1234568</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">info@pertamina-bandung.com</p>
              <p className="text-gray-600">cs@pertamina-bandung.com</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Alamat</h3>
              <p className="text-gray-600">Jl. Asia Afrika No. 100</p>
              <p className="text-gray-600">Bandung, Jawa Barat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Jam Operasional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Waktu layanan kantor cabang dan SPBU/SPBE
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Kantor Cabang</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Senin - Jumat</span>
                  <span className="text-gray-600">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Sabtu</span>
                  <span className="text-gray-600">08:00 - 15:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700">Minggu</span>
                  <span className="text-gray-600">Tutup</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">SPBU & SPBE</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">SPBU 24 Jam</span>
                  <span className="text-green-600 font-medium">24 Jam</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">SPBU Reguler</span>
                  <span className="text-gray-600">06:00 - 22:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700">SPBE</span>
                  <span className="text-gray-600">08:00 - 20:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Kirim Pesan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sampaikan pertanyaan, saran, atau keluhan Anda kepada kami
              </p>
            </div>
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih subjek</option>
                    <option value="informasi">Informasi Produk</option>
                    <option value="keluhan">Keluhan</option>
                    <option value="saran">Saran</option>
                    <option value="kerjasama">Kerjasama</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Lokasi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kantor cabang Pertamina Bandung
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">Peta Lokasi</p>
                <p className="text-sm text-gray-500">Jl. Asia Afrika No. 100, Bandung</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Apakah SPBU Pertamina buka 24 jam?
              </h3>
              <p className="text-gray-600">
                Tidak semua SPBU buka 24 jam. Beberapa SPBU buka 24 jam, sedangkan yang lain buka dari jam 06:00 - 22:00. Anda dapat mengecek jam operasional SPBU terdekat melalui peta SA kami.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Bagaimana cara mendapatkan LPG 3kg?
              </h3>
              <p className="text-gray-600">
                LPG 3kg dapat diperoleh di SPBE terdekat. Pastikan membawa KTP dan kartu keluarga untuk pendaftaran. Anda juga dapat menghubungi kami untuk informasi lebih lanjut.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Apakah ada promo untuk pembelian BBM?
              </h3>
              <p className="text-gray-600">
                Ya, kami sering mengadakan promo dan cashback untuk pembelian BBM melalui Pertamina Pay. Ikuti media sosial kami untuk informasi promo terbaru.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Bagaimana cara melaporkan keluhan?
              </h3>
              <p className="text-gray-600">
                Anda dapat melaporkan keluhan melalui form kontak di halaman ini, menghubungi call center kami, atau mengirim email ke cs@pertamina-bandung.com.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Apakah ada layanan pengiriman LPG ke rumah?
              </h3>
              <p className="text-gray-600">
                Untuk LPG 12kg, kami menyediakan layanan pengiriman langsung ke rumah. Hubungi kami untuk informasi lebih detail dan pemesanan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan Cepat?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi call center kami untuk bantuan langsung
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:022-1234567"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Call Center: 022-1234567
            </a>
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
