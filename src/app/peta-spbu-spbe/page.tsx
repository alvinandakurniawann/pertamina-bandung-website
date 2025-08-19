'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Region, Location } from '@/types/sa'
import { supabase } from '@/lib/supabase'

export default function PetaSPBUSPBEPage() {
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [mapSvg, setMapSvg] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('*')
        
        if (regionsError) throw regionsError

        // Fetch locations for each region
        const regionsWithLocations: Region[] = []
        for (const region of regionsData || []) {
          const { data: locationsData, error: locationsError } = await supabase
            .from('locations')
            .select('*')
            .eq('region_id', region.id)
          
          if (locationsError) throw locationsError
          
          const locations = locationsData || []
          const spbuCount = locations.filter(l => l.type === 'SPBU').length
          const spbeCount = locations.filter(l => l.type === 'SPBE').length
          
          regionsWithLocations.push({
            ...region,
            locations,
            spbuCount,
            spbeCount
          })
        }
        
        if (regionsWithLocations.length) setRegions(regionsWithLocations)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    // Set up realtime subscription
    const subscription = supabase
      .channel('regions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'regions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, fetchData)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Load SVG map
  useEffect(() => {
    const loadMap = async () => {
      try {
        const res = await fetch('/map.svg', { cache: 'no-store' })
        if (res.ok) {
          let text = await res.text()
          if (text.trim().startsWith('<svg')) {
            // Add data-region to filled shapes and fix text labels
            text = text.replace(
              /(<(?:path|polygon|polyline|rect|circle)[^>]*\bfill="[^"]+"[^>]*\bid="([^"]+)"[^>]*)(>)/gi,
              (match, start, id, end) => {
                if (/\bdata-region=/.test(start)) return match
                const slug = id.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                return `${start} data-region="${slug}" style="cursor:pointer"${end}`
              }
            ).replace(
              /(<path[^>]*id="[^"]+"[^>]*)(>)/gi,
              (match, start, end) => {
                if (!/\bfill=/.test(start)) {
                  return `${start} fill="#111827"${end}`
                }
                return match
              }
            )
            setMapSvg(text)
          }
        }
      } catch {
        // ignore
      }
    }
    loadMap()
  }, [])

  const getRegionBySlug = (slug: string): Region | null => {
    const target = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return (
      regions.find(r => r.id === slug) ||
      regions.find(r => r.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === target) ||
      regions.find(r => r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === target) ||
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
            Peta SPBU dan SPBE Bandung
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Temukan lokasi SPBU dan SPBE terdekat di wilayah Bandung dan sekitarnya
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
                Peta SPBU dan SPBE Bandung
              </h2>
              <p className="text-gray-600">
                Klik pada area wilayah untuk melihat detail SPBU dan SPBE
              </p>
            </div>

            {/* Interactive SVG Map */}
            <div
              className="relative bg-white rounded-lg overflow-hidden border-2 border-gray-200 mx-auto max-w-[1200px]"
              onClick={(e) => {
                const el = e.target as HTMLElement
                const slug = el.getAttribute('data-region') || el.closest('[data-region]')?.getAttribute('data-region')
                if (slug) {
                  const r = getRegionBySlug(slug)
                  if (r) handleRegionClick(r)
                }
              }}
            >
              {mapSvg ? (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: mapSvg.replace('<svg ', '<svg style=\"width:100%;height:auto;min-height:650px\" ') }}
                />
              ) : (
                <div className="w-full h-[650px] flex items-center justify-center text-gray-500">
                  Peta sedang dimuat...
                </div>
              )}
            </div>

            {/* Legend */}
            {regions.length > 0 && (
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
            )}
          </div>
        </div>
      </section>

      {/* Region List Section */}
      {regions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Daftar Wilayah</h2>
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
                      <p className="text-sm text-gray-600">Wilayah Bandung</p>
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
      )}

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
                    <p className="text-gray-600">Wilayah Bandung</p>
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
              href="/peta-spbu-spbe"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Lihat Peta SPBU & SPBE
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
