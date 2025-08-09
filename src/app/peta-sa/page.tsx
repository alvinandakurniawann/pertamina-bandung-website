'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Data wilayah SA Bandung berdasarkan peta
const saRegions = [
  {
    id: 'bojonagara',
    name: 'Bojonagara',
    color: '#90EE90', // light green
    spbuCount: 3,
    spbeCount: 1,
    locations: [
      {
        id: 'spbu-bojonagara-1',
        name: 'SPBU Bojonagara 1',
        type: 'SPBU',
        address: 'Jl. Bojonagara No. 45, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '24 Jam',
        phone: '022-1234567'
      },
      {
        id: 'spbu-bojonagara-2',
        name: 'SPBU Bojonagara 2',
        type: 'SPBU',
        address: 'Jl. Raya Bojonagara No. 78, Bandung',
        services: ['Pertalite', 'Pertamax', 'Dexlite'],
        hours: '06:00 - 22:00',
        phone: '022-1234568'
      },
      {
        id: 'spbu-bojonagara-3',
        name: 'SPBU Bojonagara 3',
        type: 'SPBU',
        address: 'Jl. Bojonagara Utara No. 123, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234569'
      },
      {
        id: 'spbe-bojonagara-1',
        name: 'SPBE Bojonagara',
        type: 'SPBE',
        address: 'Jl. Bojonagara Selatan No. 56, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234570'
      }
    ]
  },
  {
    id: 'cibeunying',
    name: 'Cibeunying',
    color: '#32CD32', // lime green
    spbuCount: 4,
    spbeCount: 2,
    locations: [
      {
        id: 'spbu-cibeunying-1',
        name: 'SPBU Cibeunying 1',
        type: 'SPBU',
        address: 'Jl. Cibeunying No. 89, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo', 'Dexlite'],
        hours: '24 Jam',
        phone: '022-1234571'
      },
      {
        id: 'spbu-cibeunying-2',
        name: 'SPBU Cibeunying 2',
        type: 'SPBU',
        address: 'Jl. Raya Cibeunying No. 234, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234572'
      },
      {
        id: 'spbu-cibeunying-3',
        name: 'SPBU Cibeunying 3',
        type: 'SPBU',
        address: 'Jl. Cibeunying Kaler No. 67, Bandung',
        services: ['Pertalite', 'Pertamax', 'Dexlite'],
        hours: '06:00 - 22:00',
        phone: '022-1234573'
      },
      {
        id: 'spbu-cibeunying-4',
        name: 'SPBU Cibeunying 4',
        type: 'SPBU',
        address: 'Jl. Cibeunying Kidul No. 145, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '06:00 - 22:00',
        phone: '022-1234574'
      },
      {
        id: 'spbe-cibeunying-1',
        name: 'SPBE Cibeunying 1',
        type: 'SPBE',
        address: 'Jl. Cibeunying Tengah No. 78, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234575'
      },
      {
        id: 'spbe-cibeunying-2',
        name: 'SPBE Cibeunying 2',
        type: 'SPBE',
        address: 'Jl. Cibeunying Barat No. 156, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234576'
      }
    ]
  },
  {
    id: 'tegallega',
    name: 'Tegallega',
    color: '#FFB6C1', // light orange/peach
    spbuCount: 2,
    spbeCount: 1,
    locations: [
      {
        id: 'spbu-tegallega-1',
        name: 'SPBU Tegallega 1',
        type: 'SPBU',
        address: 'Jl. Tegallega No. 23, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '24 Jam',
        phone: '022-1234577'
      },
      {
        id: 'spbu-tegallega-2',
        name: 'SPBU Tegallega 2',
        type: 'SPBU',
        address: 'Jl. Raya Tegallega No. 89, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234578'
      },
      {
        id: 'spbe-tegallega-1',
        name: 'SPBE Tegallega',
        type: 'SPBE',
        address: 'Jl. Tegallega Selatan No. 45, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234579'
      }
    ]
  },
  {
    id: 'karees',
    name: 'Karees',
    color: '#87CEEB', // light blue
    spbuCount: 3,
    spbeCount: 1,
    locations: [
      {
        id: 'spbu-karees-1',
        name: 'SPBU Karees 1',
        type: 'SPBU',
        address: 'Jl. Karees No. 67, Bandung',
        services: ['Pertalite', 'Pertamax', 'Dexlite'],
        hours: '24 Jam',
        phone: '022-1234580'
      },
      {
        id: 'spbu-karees-2',
        name: 'SPBU Karees 2',
        type: 'SPBU',
        address: 'Jl. Raya Karees No. 134, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '06:00 - 22:00',
        phone: '022-1234581'
      },
      {
        id: 'spbu-karees-3',
        name: 'SPBU Karees 3',
        type: 'SPBU',
        address: 'Jl. Karees Utara No. 89, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234582'
      },
      {
        id: 'spbe-karees-1',
        name: 'SPBE Karees',
        type: 'SPBE',
        address: 'Jl. Karees Selatan No. 56, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234583'
      }
    ]
  },
  {
    id: 'ujung-berung',
    name: 'Ujung Berung',
    color: '#DDA0DD', // light purple
    spbuCount: 5,
    spbeCount: 2,
    locations: [
      {
        id: 'spbu-ujung-berung-1',
        name: 'SPBU Ujung Berung 1',
        type: 'SPBU',
        address: 'Jl. Ujung Berung No. 123, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo', 'Dexlite'],
        hours: '24 Jam',
        phone: '022-1234584'
      },
      {
        id: 'spbu-ujung-berung-2',
        name: 'SPBU Ujung Berung 2',
        type: 'SPBU',
        address: 'Jl. Raya Ujung Berung No. 234, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234585'
      },
      {
        id: 'spbu-ujung-berung-3',
        name: 'SPBU Ujung Berung 3',
        type: 'SPBU',
        address: 'Jl. Ujung Berung Timur No. 67, Bandung',
        services: ['Pertalite', 'Pertamax', 'Dexlite'],
        hours: '06:00 - 22:00',
        phone: '022-1234586'
      },
      {
        id: 'spbu-ujung-berung-4',
        name: 'SPBU Ujung Berung 4',
        type: 'SPBU',
        address: 'Jl. Ujung Berung Barat No. 145, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '06:00 - 22:00',
        phone: '022-1234587'
      },
      {
        id: 'spbu-ujung-berung-5',
        name: 'SPBU Ujung Berung 5',
        type: 'SPBU',
        address: 'Jl. Ujung Berung Utara No. 89, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234588'
      },
      {
        id: 'spbe-ujung-berung-1',
        name: 'SPBE Ujung Berung 1',
        type: 'SPBE',
        address: 'Jl. Ujung Berung Tengah No. 78, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234589'
      },
      {
        id: 'spbe-ujung-berung-2',
        name: 'SPBE Ujung Berung 2',
        type: 'SPBE',
        address: 'Jl. Ujung Berung Selatan No. 156, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234590'
      }
    ]
  },
  {
    id: 'gede-bage',
    name: 'Gede Bage',
    color: '#FFA500', // orange
    spbuCount: 4,
    spbeCount: 2,
    locations: [
      {
        id: 'spbu-gede-bage-1',
        name: 'SPBU Gede Bage 1',
        type: 'SPBU',
        address: 'Jl. Gede Bage No. 234, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo', 'Dexlite'],
        hours: '24 Jam',
        phone: '022-1234591'
      },
      {
        id: 'spbu-gede-bage-2',
        name: 'SPBU Gede Bage 2',
        type: 'SPBU',
        address: 'Jl. Raya Gede Bage No. 456, Bandung',
        services: ['Pertalite', 'Pertamax'],
        hours: '06:00 - 22:00',
        phone: '022-1234592'
      },
      {
        id: 'spbu-gede-bage-3',
        name: 'SPBU Gede Bage 3',
        type: 'SPBU',
        address: 'Jl. Gede Bage Timur No. 123, Bandung',
        services: ['Pertalite', 'Pertamax', 'Dexlite'],
        hours: '06:00 - 22:00',
        phone: '022-1234593'
      },
      {
        id: 'spbu-gede-bage-4',
        name: 'SPBU Gede Bage 4',
        type: 'SPBU',
        address: 'Jl. Gede Bage Barat No. 345, Bandung',
        services: ['Pertalite', 'Pertamax', 'Pertamax Turbo'],
        hours: '06:00 - 22:00',
        phone: '022-1234594'
      },
      {
        id: 'spbe-gede-bage-1',
        name: 'SPBE Gede Bage 1',
        type: 'SPBE',
        address: 'Jl. Gede Bage Tengah No. 178, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234595'
      },
      {
        id: 'spbe-gede-bage-2',
        name: 'SPBE Gede Bage 2',
        type: 'SPBE',
        address: 'Jl. Gede Bage Selatan No. 267, Bandung',
        services: ['LPG 3kg', 'LPG 12kg'],
        hours: '08:00 - 20:00',
        phone: '022-1234596'
      }
    ]
  }
]

export default function PetaSAPage() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  const handleRegionClick = (region: any) => {
    setSelectedRegion(region)
    setShowRegionModal(true)
  }

  const handleLocationClick = (location: any) => {
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
                  onClick={() => handleRegionClick(saRegions[0])}
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
                  onClick={() => handleRegionClick(saRegions[1])}
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
                  onClick={() => handleRegionClick(saRegions[2])}
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
                  onClick={() => handleRegionClick(saRegions[3])}
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
                  onClick={() => handleRegionClick(saRegions[4])}
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
                  onClick={() => handleRegionClick(saRegions[5])}
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
              {saRegions.map((region) => (
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
            {saRegions.map((region) => (
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
                    {selectedRegion.locations.map((location: any) => (
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
