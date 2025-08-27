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
  code: string
  region_id: string
  region?: Region
}

interface FuelSale {
  id?: string
  location_id: string
  pertalite: number
  pertamax: number
  pertamax_turbo: number
  biosolar: number
  dexlite: number
  month: string
  year: number
}

export default function DataFuelPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [editingFuelSale, setEditingFuelSale] = useState<FuelSale | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [sharedKey, setSharedKey] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is already authorized from localStorage
    const savedAuth = localStorage.getItem('pertamina-auth')
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      if (authData.isAuthorized && authData.sharedKey) {
        setSharedKey(authData.sharedKey)
        setIsAuthorized(true)
      }
    }
  }, [])

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
          .order('created_at', { ascending: false })
        
        if (locationsError) throw locationsError

        setRegions(regionsData || [])
        setLocations(locationsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {

      }
    }

    fetchData()
  }, [])

  const filteredLocations = locations.filter(location => {
    // Fuel page hanya menampilkan SPBU
    if (location.type !== 'SPBU') return false
    if (selectedRegion !== 'all' && location.region_id !== selectedRegion) return false
    if (selectedType !== 'all' && location.type !== selectedType) return false
    return true
  })

  const openAddModal = () => {
    setEditingLocation({
      id: '',
      name: '',
      type: 'SPBU',
      address: '',
      hours: '',
      phone: '',
      code: '',
      region_id: regions[0]?.id || ''
    })
    setEditingFuelSale({
      id: '',
      location_id: '',
      pertalite: 0,
      pertamax: 0,
      pertamax_turbo: 0,
      biosolar: 0,
      dexlite: 0,
      month: 'Januari',
      year: 2025
    })
    setShowModal(true)
  }

  const openEditModal = async (location: Location) => {
    setEditingLocation({ ...location })
    
    // Fetch existing fuel sales data for this location
    try {
      const { data: fuelSalesData, error: fuelError } = await supabase
        .from('fuel_sales')
        .select('*')
        .eq('location_id', location.id)
        .single()
      
      if (fuelError && fuelError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching fuel sales:', fuelError)
      }
      
      if (fuelSalesData) {
        setEditingFuelSale(fuelSalesData)
      } else {
        // Set default values if no fuel sales data exists
        setEditingFuelSale({
          id: '',
          location_id: location.id,
          pertalite: 0,
          pertamax: 0,
          pertamax_turbo: 0,
          biosolar: 0,
          dexlite: 0,
          month: 'Januari',
          year: 2025
        })
      }
    } catch (error) {
      console.error('Error in openEditModal:', error)
      // Set default values on error
      setEditingFuelSale({
        id: '',
        location_id: location.id,
        pertalite: 0,
        pertamax: 0,
        pertamax_turbo: 0,
        biosolar: 0,
        dexlite: 0,
        month: 'Januari',
        year: 2025
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingLocation(null)
    setEditingFuelSale(null)
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

    const saveData = async () => {
    if (!editingLocation || !editingFuelSale) return
    
    // Validate required fields
    if (!editingLocation.name || !editingLocation.address || !editingLocation.region_id) {
      showNotification('error', 'Mohon isi semua field yang wajib diisi (Nama, Alamat, Wilayah)')
      return
    }
    
    setSaving(true)
    try {
      console.log('Saving location data:', editingLocation)
      
      // Save location first
      let locationId = editingLocation.id
      if (!locationId) {
        // Create new location
        const { data: newLocation, error: locationError } = await supabase
          .from('locations')
          .insert([{
            name: editingLocation.name,
            type: editingLocation.type,
            address: editingLocation.address,
            hours: editingLocation.hours,
            phone: editingLocation.phone,
            code: editingLocation.code,
            region_id: editingLocation.region_id
          }])
          .select()
          .single()
        
        if (locationError) {
          console.error('Location insert error:', locationError)
          throw locationError
        }
        locationId = newLocation.id
        console.log('New location created with ID:', locationId)
      } else {
        // Update existing location
        const { error: locationError } = await supabase
          .from('locations')
          .update({
            name: editingLocation.name,
            type: editingLocation.type,
            address: editingLocation.address,
            hours: editingLocation.hours,
            phone: editingLocation.phone,
            code: editingLocation.code,
            region_id: editingLocation.region_id
          })
          .eq('id', locationId)
        
        if (locationError) {
          console.error('Location update error:', locationError)
          throw locationError
        }
        console.log('Location updated successfully')
      }

             // Save fuel sale data
       console.log('Saving fuel sale data:', editingFuelSale)
       
       if (editingFuelSale.id) {
         // Update existing fuel sale
         const { error: fuelError } = await supabase
           .from('fuel_sales')
           .update({
             location_id: locationId, // Ensure location_id is updated
             pertalite: editingFuelSale.pertalite,
             pertamax: editingFuelSale.pertamax,
             pertamax_turbo: editingFuelSale.pertamax_turbo,
             biosolar: editingFuelSale.biosolar,
             dexlite: editingFuelSale.dexlite,
             month: editingFuelSale.month,
             year: editingFuelSale.year
           })
           .eq('id', editingFuelSale.id)
         
         if (fuelError) {
           console.error('Fuel sale update error:', fuelError)
           throw fuelError
         }
         console.log('Fuel sale updated successfully')
       } else {
         // Create new fuel sale
         const { error: fuelError } = await supabase
           .from('fuel_sales')
           .insert([{
             location_id: locationId,
             pertalite: editingFuelSale.pertalite,
             pertamax: editingFuelSale.pertamax,
             pertamax_turbo: editingFuelSale.pertamax_turbo,
             biosolar: editingFuelSale.biosolar,
             dexlite: editingFuelSale.dexlite,
             month: editingFuelSale.month,
             year: editingFuelSale.year
           }])
         
         if (fuelError) {
           console.error('Fuel sale insert error:', fuelError)
           throw fuelError
         }
         console.log('Fuel sale created successfully')
       }

             // Skip logging to changes table for now to avoid 400 errors
       // TODO: Fix changes table schema or remove this logging

      showNotification('success', 'Data berhasil disimpan!')
      closeModal()
      
      // Refresh data
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select(`
          *,
          region:regions(name)
        `)
        .order('created_at', { ascending: false })
      
      if (!locationsError) {
        setLocations(locationsData || [])
      }
    } catch (error) {
      console.error('Error saving data:', error)
      showNotification('error', 'Gagal menyimpan data. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleSharedKeySubmit = () => {
    // Simple validation - you can enhance this with actual authentication
    if (sharedKey.trim() === 'gasmelon3kg') {
      setIsAuthorized(true)
      localStorage.setItem('pertamina-auth', JSON.stringify({ isAuthorized: true, sharedKey: sharedKey }))
    } else {
      alert('Shared key tidak valid!')
    }
  }

  const handleLogout = () => {
    setIsAuthorized(false)
    setSharedKey('')
    localStorage.removeItem('pertamina-auth')
  }



  return (
    <>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-8">
            <div className="bg-red-600 text-white text-center py-4 px-6 rounded-lg">
              <h1 className="text-lg font-bold">PERTAMINA PETRA NIAGA BANDUNG</h1>
            </div>
          </div>

          {/* Shared Key Input */}
          <div suppressHydrationWarning>
            {!isAuthorized ? (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-800 mb-3">Akses Write</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={sharedKey}
                    onChange={(e) => setSharedKey(e.target.value)}
                    placeholder="Masukkan Shared Key"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSharedKeySubmit}
                    className="w-full bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Verifikasi
                  </button>
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Masukkan shared key untuk akses write
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Akses Write Aktif</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-xs text-green-600 hover:text-green-800 underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

                     <nav className="space-y-2">
             <Link 
               href="/" 
               className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 mb-4"
             >
               ← Kembali ke Homepage
             </Link>
             <Link 
               href="/crud" 
               className="block w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50"
             >
               Overview
             </Link>
            <Link 
              href="/crud/data-fuel" 
              className="block w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
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
           {/* Access Status */}
           <div suppressHydrationWarning>
             {!isAuthorized && (
               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                 <div className="flex items-center">
                   <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                   <span className="text-sm font-medium text-red-800">
                     Akses Write Belum Aktif - Masukkan shared key di sidebar untuk mengedit data
                   </span>
                 </div>
               </div>
             )}
           </div>
           
           {/* Notification */}
           {notification && (
             <div className={`mb-6 p-4 rounded-lg ${
               notification.type === 'success' 
                 ? 'bg-green-100 border border-green-400 text-green-700' 
                 : 'bg-red-100 border border-red-400 text-red-700'
             }`}>
               <div className="flex items-center">
                 <span className="font-medium">
                   {notification.type === 'success' ? '✅' : '❌'} {notification.message}
                 </span>
                 <button 
                   onClick={() => setNotification(null)}
                   className="ml-auto text-gray-500 hover:text-gray-700"
                 >
                   ✕
                 </button>
               </div>
             </div>
           )}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Data Fuel</h1>
            {isAuthorized && (
              <button
                onClick={openAddModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Tambah Data
              </button>
            )}
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
                         {location.code || '34.43242'}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {(Math.random() * 3000 + 2000).toFixed(0)} kl
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {isAuthorized ? (
                          <button
                            onClick={() => openEditModal(location)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Login required</span>
                        )}
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
                {/* Data SPBU Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data SPBU</h3>
                  <div className="space-y-4">
                                         <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Nama SPBU
                        </label>
                                               <input
                           type="text"
                           value={editingLocation?.name || ''}
                           onChange={(e) => setEditingLocation(prev => prev ? { ...prev, name: e.target.value } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="SPBU Antapani"
                         />
                       </div>
                       
                       <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Alamat SPBU
                        </label>
                                               <input
                           type="text"
                           value={editingLocation?.address || ''}
                           onChange={(e) => setEditingLocation(prev => prev ? { ...prev, address: e.target.value } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="Jl. Antapani No. 123"
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
                          Kode SPBU
                        </label>
                                               <input
                           type="text"
                           value={editingLocation?.code || ''}
                           onChange={(e) => setEditingLocation(prev => prev ? { ...prev, code: e.target.value } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="34.402.23"
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
                          Wilayah SPBU
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
                         {['LPG', 'Car wash', 'Diesel fuel', 'Pertamina Dex fuel'].map((service) => (
                           <span
                             key={service}
                             className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                           >
                             {service}
                           </span>
                         ))}
                       </div>
                     </div>
                  </div>
                </div>

                {/* Data Penjualan Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Penjualan</h3>
                  <div className="space-y-4">
                    <div>
                                                                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Volume Pertalite
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={editingFuelSale?.pertalite || 0}
                            onChange={(e) => setEditingFuelSale(prev => prev ? { ...prev, pertalite: parseFloat(e.target.value) || 0 } : null)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="2,445"
                          />
                          <span className="absolute right-3 top-2 text-gray-700 font-medium">kl</span>
                        </div>
                    </div>
                    
                                         <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Volume Pertamax
                        </label>
                       <div className="relative">
                         <input
                           type="number"
                           value={editingFuelSale?.pertamax || 0}
                           onChange={(e) => setEditingFuelSale(prev => prev ? { ...prev, pertamax: parseFloat(e.target.value) || 0 } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="2,445"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kl</span>
                       </div>
                     </div>
                    
                                         <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Volume Pertamax Turbo
                        </label>
                       <div className="relative">
                         <input
                           type="number"
                           value={editingFuelSale?.pertamax_turbo || 0}
                           onChange={(e) => setEditingFuelSale(prev => prev ? { ...prev, pertamax_turbo: parseFloat(e.target.value) || 0 } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="2,445"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kl</span>
                       </div>
                     </div>
                    
                                         <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Volume Biosolar
                        </label>
                       <div className="relative">
                         <input
                           type="number"
                           value={editingFuelSale?.biosolar || 0}
                           onChange={(e) => setEditingFuelSale(prev => prev ? { ...prev, biosolar: parseFloat(e.target.value) || 0 } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="2,445"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kl</span>
                       </div>
                     </div>
                    
                                         <div>
                                               <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Volume Dexlite
                        </label>
                       <div className="relative">
                         <input
                           type="number"
                           value={editingFuelSale?.dexlite || 0}
                           onChange={(e) => setEditingFuelSale(prev => prev ? { ...prev, dexlite: parseFloat(e.target.value) || 0 } : null)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                           placeholder="2,445"
                         />
                         <span className="absolute right-3 top-2 text-gray-700 font-medium">kl</span>
                       </div>
                     </div>
                    
                    
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
                   onClick={saveData}
                   disabled={saving}
                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                 >
                   {saving ? 'Menyimpan...' : 'Save'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
    