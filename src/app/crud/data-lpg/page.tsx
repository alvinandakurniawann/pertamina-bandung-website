'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Region {
  id: string
  name: string
}

interface Location {
  id: string
  name: string
  type: 'SPBU' | 'SPBE'
  address: string
  hours: string
  phone: string
  region_id: string
  region?: Region
}

export default function DataLPGPage() {
  const [mounted, setMounted] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('*')
          .order('name')
        
        if (regionsError) throw regionsError

        const { data: locationsData, error: locationsError } = await supabase
          .from('locations')
          .select(`
            *,
            region:regions(name)
          `)
          .order('name')
        
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

  const filteredLocations = locations.filter(location => {
    if (selectedRegion !== 'all' && location.region_id !== selectedRegion) return false
    if (selectedType !== 'all' && location.type !== selectedType) return false
    return true
  })

  const openAddModal = () => {
    setEditingLocation({
      id: '',
      name: '',
      type: 'SPBE',
      address: '',
      hours: '',
      phone: '',
      region_id: regions[0]?.id || ''
    })
    setShowModal(true)
  }

  const openEditModal = (location: Location) => {
    setEditingLocation({ ...location })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingLocation(null)
  }

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
          <div className="mb-8">
            <div className="bg-red-600 text-white text-center py-4 px-6 rounded-lg">
              <h1 className="text-lg font-bold">PERTAMINA PETRA NIAGA BANDUNG</h1>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">AS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Ahmad Sumbul</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/crud" 
              className="block w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50"
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
              className="block w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
            >
              Data LPG
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Data LPG</h1>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Tambah Data
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Semua Wilayah
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">Semua Wilayah</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bulan
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">Semua Bulan</option>
                  <option value="Januari">Januari</option>
                  <option value="Februari">Februari</option>
                  <option value="Maret">Maret</option>
                  <option value="April">April</option>
                  <option value="Mei">Mei</option>
                  <option value="Juni">Juni</option>
                  <option value="Juli">Juli</option>
                  <option value="Agustus">Agustus</option>
                  <option value="September">September</option>
                  <option value="Oktober">Oktober</option>
                  <option value="November">November</option>
                  <option value="Desember">Desember</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tipe
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="SPBU">SPBU</option>
                  <option value="SPBE">SPBE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Jam Operasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Volume Penjualan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.map((location, index) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                         {location.name}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         {location.address}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         {location.hours}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         34.43242
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                         {(Math.random() * 3000 + 2000).toFixed(0)} kg
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button
                          onClick={() => openEditModal(location)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                                 <h2 className="text-2xl font-bold text-gray-900">
                   {editingLocation?.id ? 'Edit Data' : 'Tambah Data Baru'}
                 </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data SPBE Section */}
                <div>
                                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Data SPBE</h3>
                  <div className="space-y-4">
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Nama SPBE
                       </label>
                                               <input
                           type="text"
                           value={editingLocation?.name || ''}
                           onChange={(e) => setEditingLocation(prev => prev ? { ...prev, name: e.target.value } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="SPBE Antapani"
                         />
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         No Telepon
                       </label>
                                             <input
                         type="text"
                         value={editingLocation?.phone || ''}
                         onChange={(e) => setEditingLocation(prev => prev ? { ...prev, phone: e.target.value } : null)}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                         placeholder="(022) 6112345"
                       />
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Kode SPBE
                       </label>
                                             <input
                         type="text"
                         value="34.402.23"
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                         placeholder="34.402.23"
                         readOnly
                       />
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Waktu Operasi
                       </label>
                                             <input
                         type="text"
                         value={editingLocation?.hours || ''}
                         onChange={(e) => setEditingLocation(prev => prev ? { ...prev, hours: e.target.value } : null)}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                         placeholder="05:00 - 23:00"
                       />
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Wilayah SPBE
                       </label>
                                             <select
                         value={editingLocation?.region_id || ''}
                         onChange={(e) => setEditingLocation(prev => prev ? { ...prev, region_id: e.target.value } : null)}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                       >
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Layanan
                       </label>
                      <div className="flex flex-wrap gap-2">
                        {['LPG 3kg', 'LPG 12kg', 'LPG 50kg'].map((service) => (
                          <span
                            key={service}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                                             <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                         + Add
                       </button>
                    </div>
                  </div>
                </div>

                {/* Data Penjualan LPG Section */}
                <div>
                                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Penjualan LPG</h3>
                  <div className="space-y-4">
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Volume LPG 3kg
                       </label>
                                             <div className="relative">
                         <input
                           type="number"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="1,500"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kg</span>
                       </div>
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Volume LPG 12kg
                       </label>
                                             <div className="relative">
                         <input
                           type="number"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="2,000"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kg</span>
                       </div>
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Volume LPG 50kg
                       </label>
                                             <div className="relative">
                         <input
                           type="number"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="500"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kg</span>
                       </div>
                    </div>
                    
                    <div>
                                             <label className="block text-sm font-semibold text-gray-900 mb-2">
                         Volume LPG Industri
                       </label>
                                             <div className="relative">
                         <input
                           type="number"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="1,000"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kg</span>
                       </div>
                    </div>
                    
                                         <button className="w-full text-sm text-green-600 hover:text-green-800 border border-green-200 rounded-lg py-2 font-medium">
                       + Tambah Produk
                     </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                 <button
                   onClick={closeModal}
                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                 >
                   Cancel
                 </button>
                 <button
                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                 >
                   Save
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

