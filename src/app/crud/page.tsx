'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import CrudPanel from '@/components/CrudPanel'

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
  const [regions, setRegions] = useState<Region[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  type Stat = {
    key: string
    display_name: string
    spbu_total: number
    spbu_coco?: number
    spbu_codo?: number
    spbu_dodo?: number
    pertashop_total: number
    spbe_pso_total: number
    spbe_npso_total: number
    agen_lpg_3kg_total: number
    lpg_npso_total: number
    pangkalan_lpg_3kg_total: number
  }
  const [regionStats, setRegionStats] = useState<Stat[]>([])
  const [metric, setMetric] = useState<keyof Stat>('spbu_total')
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
          
        // Fetch region_stats
        const { data: statsData, error: statsError } = await supabase
          .from('region_stats')
          .select('*')
          .order('key')
        if (statsError) throw statsError
          
        setRegions(regionsData || [])
        setLocations(locationsData || [])
        setRegionStats(statsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {

      }
    }

    fetchData()
  }, [])

  const handleSharedKeySubmit = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: sharedKey.trim() }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsAuthorized(true)
          localStorage.setItem('pertamina-auth', JSON.stringify({ isAuthorized: true, sharedKey: sharedKey }))
        } else {
          alert('Shared key tidak valid!')
        }
      } else {
        alert('Shared key tidak valid!')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat verifikasi!')
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
        <CrudPanel />

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
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Overview</h1>

          {/* Rekap Region Stats (ALL) – light cards with icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            {/* SPBU */}
            <div className="flex items-center p-5 rounded-lg border bg-red-50 border-red-200">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-red-700">Total SPBU</div>
                <div className="text-xl font-bold text-red-900">{(() => { const all = regionStats.find(s=>s.key==='ALL'); const sum = (all?.spbu_coco||0)+(all?.spbu_codo||0)+(all?.spbu_dodo||0); return all?.spbu_total || sum; })()}</div>
              </div>
            </div>

            {/* Pertashop */}
            <div className="flex items-center p-5 rounded-lg border bg-blue-50 border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-700">Total Pertashop</div>
                <div className="text-xl font-bold text-blue-900">{(regionStats.find(s=>s.key==='ALL')?.pertashop_total ?? 0)}</div>
              </div>
            </div>

            {/* SPBE */}
            <div className="flex items-center p-5 rounded-lg border bg-green-50 border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-green-700">SPBE PSO / NPSO</div>
                <div className="text-sm text-green-900 font-medium">{(regionStats.find(s=>s.key==='ALL')?.spbe_pso_total ?? 0)} PSO</div>
                <div className="text-sm text-green-900 font-medium">{(regionStats.find(s=>s.key==='ALL')?.spbe_npso_total ?? 0)} NPSO</div>
              </div>
            </div>

            {/* Agen LPG */}
            <div className="flex items-center p-5 rounded-lg border bg-neutral-50 border-neutral-200">
              <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-700">Agen LPG / LPG NPSO</div>
                <div className="text-sm text-slate-900 font-medium">{(regionStats.find(s=>s.key==='ALL')?.agen_lpg_3kg_total ?? 0)} Agen 3kg</div>
                <div className="text-sm text-slate-900 font-medium">{(regionStats.find(s=>s.key==='ALL')?.lpg_npso_total ?? 0)} LPG NPSO</div>
              </div>
            </div>

            {/* Pangkalan */}
            <div className="flex items-center p-5 rounded-lg border bg-amber-50 border-amber-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">Pangkalan LPG 3kg</div>
                <div className="text-xl font-bold text-gray-900">{(regionStats.find(s=>s.key==='ALL')?.pangkalan_lpg_3kg_total ?? 0)}</div>
              </div>
            </div>
          </div>

          {/* Grafik Dinamis per Wilayah */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Grafik per Wilayah</h3>
              <select value={metric as string} onChange={e=>setMetric(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                <option value="spbu_total">SPBU</option>
                <option value="pertashop_total">Pertashop</option>
                <option value="spbe_pso_total">SPBE PSO</option>
                <option value="spbe_npso_total">SPBE NPSO</option>
                <option value="agen_lpg_3kg_total">Agen LPG 3kg</option>
                <option value="lpg_npso_total">LPG NPSO</option>
                <option value="pangkalan_lpg_3kg_total">Pangkalan LPG 3kg</option>
              </select>
            </div>
            {(() => {
              const rows = regionStats.filter(s=>s.key !== 'ALL') as any[]
              const getVal = (r: any) => metric === 'spbu_total' ? ((r.spbu_total ?? ((r.spbu_coco||0)+(r.spbu_codo||0)+(r.spbu_dodo||0))) || 0) : (Number(r[metric]) || 0)
              const max = Math.max(1, ...rows.map(r => getVal(r)))
              return (
                <>
                  <div className="h-64 flex items-end gap-2 overflow-x-auto pr-2">
                    {rows.map(r => {
                      const val = getVal(r)
                      const h = `${Math.round((val / max) * 100)}%`
                      return (
                        <div key={r.key} className="flex flex-col justify-end items-center min-w-[56px] h-full">
                          <div className="w-8 bg-blue-600 rounded-t" style={{ height: h }} title={`${r.display_name}: ${val}`} />
                          <div className="mt-2 text-[10px] text-gray-600 text-center w-14 truncate" title={r.display_name}>{r.display_name}</div>
                          <div className="text-[10px] text-gray-900">{val}</div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </div>

          {/* Rincian per Wilayah */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rincian per Wilayah</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-2 text-left">Wilayah</th>
                    <th className="p-2 text-right">SPBU</th>
                    <th className="p-2 text-right">Pertashop</th>
                    <th className="p-2 text-right">SPBE PSO</th>
                    <th className="p-2 text-right">SPBE NPSO</th>
                    <th className="p-2 text-right">Agen LPG 3kg</th>
                    <th className="p-2 text-right">LPG NPSO</th>
                    <th className="p-2 text-right">Pangkalan 3kg</th>
                  </tr>
                </thead>
                <tbody>
                  {regionStats.filter(s=>s.key!=='ALL').map((s)=> (
                    <tr key={s.key} className="border-t">
                      <td className="p-2 text-gray-900">{s.display_name}</td>
                      <td className="p-2 text-right text-gray-900">{s.spbu_total || ((s.spbu_coco||0)+(s.spbu_codo||0)+(s.spbu_dodo||0))}</td>
                      <td className="p-2 text-right text-gray-900">{s.pertashop_total}</td>
                      <td className="p-2 text-right text-gray-900">{s.spbe_pso_total}</td>
                      <td className="p-2 text-right text-gray-900">{s.spbe_npso_total}</td>
                      <td className="p-2 text-right text-gray-900">{s.agen_lpg_3kg_total}</td>
                      <td className="p-2 text-right text-gray-900">{s.lpg_npso_total}</td>
                      <td className="p-2 text-right text-gray-900">{s.pangkalan_lpg_3kg_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
      </div>
          
      </div>
    </div>
    </>
  )
}


