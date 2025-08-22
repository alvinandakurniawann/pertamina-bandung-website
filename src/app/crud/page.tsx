'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Region {
  id: string
  name: string
  color: string
  spbu_count: number
  spbe_count: number
}

interface Location {
  id: string
  name: string
  type: 'SPBU' | 'SPBE'
  region_id: string
}

export default function CrudHomePage() {
  const [mounted, setMounted] = useState(false)
  const [regions, setRegions] = useState<Region[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('*')
          .order('name')
        
        if (regionsError) throw regionsError

        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('locations')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (locationsError) throw locationsError

        setRegions(regionsData || [])
        setLocations(locationsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="bg-red-600 text-white text-center py-4 px-6 rounded-lg">
              <h1 className="text-lg font-bold">PERTAMINA PETRA NIAGA BANDUNG</h1>
            </div>
          </div>



          {/* Navigation */}
          <nav className="space-y-2">
            <Link 
              href="/crud" 
              className="block w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
            >
              Beranda
            </Link>
            <Link 
              href="/crud/data-fuel" 
              className="block w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Data Fuel
            </Link>
            <Link 
              href="/crud/data-lpg" 
              className="block w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Data LPG
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">2025 Progres</h1>

          {/* Data Penjualan Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Progress Indicators */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Penjualan</h2>
              
              <div className="space-y-6">
                {/* Target Fuel */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Target Fuel:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Penjualan PSO</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Penjualan NPSO</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target LPG */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Target LPG:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Penjualan PSO</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Penjualan NPSO</span>
                        <span className="font-medium">36%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {/* Sample chart bars - in real app this would be a proper chart library */}
                <div className="flex-1 bg-purple-400 rounded-t" style={{ height: '40%' }}></div>
                <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-yellow-400 rounded-t" style={{ height: '30%' }}></div>
                <div className="flex-1 bg-red-400 rounded-t" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-gray-800 rounded-t" style={{ height: '50%' }}></div>
                <div className="flex-1 bg-green-400 rounded-t" style={{ height: '70%' }}></div>
                <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '45%' }}></div>
                <div className="flex-1 bg-purple-600 rounded-t" style={{ height: '55%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN</span>
                <span>JUL</span>
                <span>AUG</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                <div className="flex justify-between">
                  <span>10.000kl</span>
                  <span>7.500kl</span>
                  <span>5.000kl</span>
                  <span>2.500kl</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Lokasi Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Statistik Lokasi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total SPBU */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-red-600">Total SPBU</p>
                    <p className="text-2xl font-bold text-red-900">
                      {locations.filter(loc => loc.type === 'SPBU').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total SPBE */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Total SPBE</p>
                    <p className="text-2xl font-bold text-green-900">
                      {locations.filter(loc => loc.type === 'SPBE').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Lokasi */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Lokasi</p>
                    <p className="text-2xl font-bold text-blue-900">{locations.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Penjualan Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Rincian Penjualan</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Penjualan Fuel - Hanya SPBU */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Penjualan Fuel (SPBU)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Lokasi</th>
                        <th className="text-right py-2 font-medium">Volume PSO</th>
                        <th className="text-right py-2 font-medium">Volume Non PSO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations
                        .filter(loc => loc.type === 'SPBU')
                        .slice(0, 10)
                        .map((location) => (
                          <tr key={location.id} className="border-b">
                            <td className="py-2">{location.name}</td>
                            <td className="text-right py-2">{(Math.random() * 5000 + 2000).toFixed(0)} kl</td>
                            <td className="text-right py-2">{(Math.random() * 5000 + 2000).toFixed(0)} kl</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Penjualan LPG - Hanya SPBE */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Penjualan LPG (SPBE)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Lokasi</th>
                        <th className="text-right py-2 font-medium">Volume PSO</th>
                        <th className="text-right py-2 font-medium">Volume Non PSO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations
                        .filter(loc => loc.type === 'SPBE')
                        .slice(0, 10)
                        .map((location) => (
                          <tr key={location.id} className="border-b">
                            <td className="py-2">{location.name}</td>
                            <td className="text-right py-2">{(Math.random() * 5000 + 2000).toFixed(0)} kg</td>
                            <td className="text-right py-2">{(Math.random() * 5000 + 2000).toFixed(0)} kg</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


