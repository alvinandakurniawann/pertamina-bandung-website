'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Region, Location } from '@/types/sa'
import { db } from '@/lib/firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'

// Mengambil data hanya dari Firestore; tidak ada default seed besar

export default function PetaSAPage() {
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'regions'), async (snap) => {
      const next: Region[] = []
      for (const d of snap.docs) {
        const base = d.data() as Region
        const locSnap = await getDocs(collection(db, 'regions', d.id, 'locations'))
        const locations: Location[] = locSnap.docs.map(l => l.data() as Location)
        const spbuCount = locations.filter(l => l.type === 'SPBU').length
        const spbeCount = locations.filter(l => l.type === 'SPBE').length
        next.push({ ...base, id: d.id, locations, spbuCount, spbeCount })
      }
      if (next.length) setRegions(next)
    })
    return () => unsub()
  }, [])

  const slugify = (s: string | undefined | null): string => {
    if (!s) return ''
    return s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const getRegionBySlug = (slug: string): Region | null => {
    const target = slugify(slug)
    return (
      regions.find(r => r.id === slug) ||
      regions.find(r => slugify(r.id) === target) ||
      regions.find(r => slugify(r.name) === target) ||
      null
    )
  }

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region)
    setShowRegionModal(true)
  }

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location)
    setShowLocationModal(true)
  }

  const closeRegionModal = () => {
    setShowRegionModal(false)
    setSelectedRegion(null)
  }

  const closeLocationModal = () => {
    setShowLocationModal(false)
    setSelectedLocation(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Peta Sales Area Bandung
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Temukan lokasi SPBU dan SPBE terdekat di wilayah Sales Area Bandung
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>SPBU</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>SPBE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Peta SA Bandung
              </h2>
              <p className="text-gray-600">
                Klik pada area wilayah untuk melihat detail SPBU dan SPBE
              </p>
            </div>

            {/* Interactive SVG Map */}
            <div className="relative bg-white rounded-lg overflow-hidden border-2 border-gray-200">
              <svg
                viewBox="0 0 600 500"
                className="w-full h-auto cursor-pointer"
                style={{ minHeight: '500px' }}
              >
                {/* Background */}
                <rect width="600" height="500" fill="#f8fafc" />
                
                {/* Region: Bojonagara (top-left) */}
                <path
                  d="M50 50 L150 30 L200 80 L180 120 L120 150 L80 120 Z"
                  fill="#90EE90"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('bojonagara'); if (r) handleRegionClick(r) }}
                />
                <text x="100" y="90" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Bojonagara
                </text>

                {/* Region: Cibeunying (top-middle) */}
                <path
                  d="M150 30 L350 20 L400 60 L380 100 L320 130 L200 80 L150 30"
                  fill="#32CD32"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('cibeunying'); if (r) handleRegionClick(r) }}
                />
                <text x="275" y="70" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Cibeunying
                </text>

                {/* Region: Tegallega (middle-left) */}
                <path
                  d="M50 50 L80 120 L120 150 L150 200 L100 250 L60 220 L50 50"
                  fill="#FFB6C1"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('tegallega'); if (r) handleRegionClick(r) }}
                />
                <text x="85" y="180" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Tegallega
                </text>

                {/* Region: Karees (center) */}
                <path
                  d="M180 120 L320 130 L350 180 L330 220 L280 250 L150 200 L180 120"
                  fill="#87CEEB"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('karees'); if (r) handleRegionClick(r) }}
                />
                <text x="250" y="200" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Karees
                </text>

                {/* Region: Ujung Berung (top-right) */}
                <path
                  d="M350 20 L500 10 L550 50 L530 90 L470 120 L400 60 L350 20"
                  fill="#DDA0DD"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('ujung-berung'); if (r) handleRegionClick(r) }}
                />
                <text x="450" y="60" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Ujung Berung
                </text>

                {/* Region: Gede Bage (bottom-right) */}
                <path
                  d="M400 60 L470 120 L530 90 L550 150 L520 200 L480 250 L350 180 L320 130 L400 60"
                  fill="#FFA500"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  onClick={() => { const r = getRegionBySlug('gede-bage'); if (r) handleRegionClick(r) }}
                />
                <text x="450" y="200" textAnchor="middle" className="text-sm font-semibold fill-gray-800 pointer-events-none">
                  Gede Bage
                </text>

                {/* City Label */}
                <text x="300" y="480" textAnchor="middle" className="text-2xl font-bold fill-gray-400 opacity-50 pointer-events-none">
                  BANDUNG
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {regions.map((region) => (
                <div key={region.id} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: region.color }}
                  ></div>
                  <span className="font-medium">{region.name}</span>
                  <span className="text-gray-500">({region.spbuCount} SPBU, {region.spbeCount} SPBE)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Region List Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Daftar Wilayah SA</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <div
                key={region.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => handleRegionClick(region)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{region.name}</h3>
                    <p className="text-sm text-gray-600">Sales Area</p>
                  </div>
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: region.color }}
                  ></div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">SPBU:</span> {region.spbuCount} lokasi
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">SPBE:</span> {region.spbeCount} lokasi
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total:</span> {region.locations.length} lokasi
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region Modal */}
      {showRegionModal && selectedRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: selectedRegion.color }}
                  ></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedRegion.name}</h3>
                    <p className="text-gray-600">Sales Area</p>
                  </div>
                </div>
                <button
                  onClick={closeRegionModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Statistik</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-red-800">SPBU</span>
                      <span className="text-2xl font-bold text-red-600">{selectedRegion.spbuCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">SPBE</span>
                      <span className="text-2xl font-bold text-green-600">{selectedRegion.spbeCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-800">Total Lokasi</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedRegion.locations.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Daftar Lokasi</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedRegion.locations.map((location: Location) => (
                      <div
                        key={location.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-800">{location.name}</h5>
                            <p className={`text-sm font-medium ${
                              location.type === 'SPBU' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {location.type}
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            location.type === 'SPBU' ? 'bg-red-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={closeRegionModal}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedLocation.name}</h3>
                  <p className={`text-sm font-medium ${
                    selectedLocation.type === 'SPBU' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {selectedLocation.type}
                  </p>
                </div>
                <button
                  onClick={closeLocationModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Alamat</h4>
                  <p className="text-gray-600">{selectedLocation.address}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Jam Operasional</h4>
                  <p className="text-gray-600">{selectedLocation.hours}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Telepon</h4>
                  <p className="text-gray-600">{selectedLocation.phone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Layanan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={closeLocationModal}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut tentang layanan dan lokasi SPBU/SPBE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/peta-sa"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Peta SA
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
