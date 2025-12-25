'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import CrudPanel from '@/components/CrudPanel'
import dynamic from 'next/dynamic'

// Dynamic import Mapbox untuk menghindari SSR error
const MapboxMap = dynamic(() => import('./RegionsMap'), { ssr: false })

type Region = {
  id: string
  name: string
  color: string
  spbu_count: number
  spbe_count: number
  latitude?: number
  longitude?: number
}

type RegionStat = {
  key: string
  display_name: string
  spbu_total: number
  spbu_coco: number
  spbu_codo: number
  spbu_dodo: number
  pertashop_total: number
  spbe_pso_total: number
  spbe_npso_total: number
  agen_lpg_3kg_total: number
  lpg_npso_total: number
  pangkalan_lpg_3kg_total: number
}

export default function RegionsCrudPage() {
  const [items, setItems] = useState<Region[]>([])
  const [regionStats, setRegionStats] = useState<Record<string, RegionStat>>({})
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Region | null>(null)
  const [filter, setFilter] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const { isAuthorized } = useAuth()

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return items
    return items.filter(r => r.id.toLowerCase().includes(f) || r.name.toLowerCase().includes(f))
  }, [items, filter])

  const resetForm = () => setEditing({ id: '', name: '', color: '#2A82BF', spbu_count: 0, spbe_count: 0, latitude: undefined, longitude: undefined })

  useEffect(() => { 
    resetForm()
    load()
    loadRegionStats()
    setMounted(true)
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('regions').select('*').order('name')
      if (error) throw error
      setItems(data || [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  async function loadRegionStats() {
    try {
      const { data, error } = await supabase.from('region_stats').select('*')
      if (error) throw error
      const statsMap: Record<string, RegionStat> = {}
      if (data) {
        data.forEach((stat: any) => {
          statsMap[stat.key] = stat
        })
      }
      setRegionStats(statsMap)
    } catch (e) {
      console.error('Error loading region stats:', e)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    try {
      if (!editing.id || !editing.name) { alert('ID dan Name wajib diisi'); return }
      const payload = { 
        id: editing.id, 
        name: editing.name, 
        color: editing.color, 
        spbu_count: editing.spbu_count || 0, 
        spbe_count: editing.spbe_count || 0,
        latitude: editing.latitude ? Number(editing.latitude) : null,
        longitude: editing.longitude ? Number(editing.longitude) : null,
      }
      const { error } = await supabase.from('regions').upsert(payload, { onConflict: 'id' })
      if (error) throw error
      await load()
      await loadRegionStats()
      resetForm()
      alert('Tersimpan')
    } catch (e: any) { alert(e?.message || 'Gagal simpan') }
  }

  async function remove(id: string) {
    if (!confirm('Hapus region ini?')) return
    try {
      const { error } = await supabase.from('regions').delete().eq('id', id)
      if (error) throw error
      await load()
      await loadRegionStats()
    } catch (e: any) { alert(e?.message || 'Gagal hapus') }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (!isAuthorized) {
      alert('Silakan verifikasi shared key terlebih dahulu')
      return
    }
    resetForm()
    setEditing({
      id: '',
      name: '',
      color: '#2A82BF',
      spbu_count: 0,
      spbe_count: 0,
      latitude: lat,
      longitude: lng,
    })
    setShowMap(false) // Tutup map, fokus ke form
  }

  const handleMarkerClick = (regionId: string) => {
    const region = items.find(r => r.id === regionId)
    if (region) {
      setEditing(region)
      setShowMap(false)
    }
  }

  if (!mounted) return <div className="min-h-screen bg-gray-50" />

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <CrudPanel />

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Regions</h1>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showMap ? 'Sembunyikan Map' : 'Tampilkan Map untuk Tambah Marker'}
            </button>
          </div>

          {showMap && (
            <div className="mb-6 bg-white rounded-lg p-4 border">
              <h2 className="font-semibold mb-3 text-gray-800">Klik di Map untuk Menambah Marker Baru</h2>
              <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                <MapboxMap
                  regions={items}
                  regionStats={regionStats}
                  onMapClick={handleMapClick}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border">
              <h2 className="font-semibold mb-3 text-gray-800">Daftar Region</h2>
              <div className="flex items-center gap-2 mb-3">
                <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Cari..." className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" />
                <button onClick={load} className="px-3 py-2 bg-gray-100 rounded">Reload</button>
              </div>
              <div className="overflow-auto max-h-[480px] border rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 text-gray-700">ID</th>
                      <th className="text-left p-2 text-gray-700">Name</th>
                      <th className="text-left p-2 text-gray-700">Color</th>
                      <th className="text-right p-2 text-gray-700">SPBU</th>
                      <th className="text-right p-2 text-gray-700">SPBE</th>
                      <th className="text-left p-2 text-gray-700">Koordinat</th>
                      <th className="p-2 text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const stats = regionStats[r.id]
                      return (
                        <tr key={r.id} className="border-t">
                          <td className="p-2 font-mono text-xs text-gray-900">{r.id}</td>
                          <td className="p-2 text-gray-900">{r.name}</td>
                          <td className="p-2"><span className="inline-block w-4 h-4 rounded" style={{ background: r.color }} /></td>
                          <td className="p-2 text-right text-gray-900">{stats?.spbu_total ?? r.spbu_count}</td>
                          <td className="p-2 text-right text-gray-900">{stats ? (stats.spbe_pso_total + stats.spbe_npso_total) : r.spbe_count}</td>
                          <td className="p-2 text-xs text-gray-600">
                            {r.latitude && r.longitude ? `${r.latitude.toFixed(6)}, ${r.longitude.toFixed(6)}` : '-'}
                          </td>
                          <td className="p-2 space-x-2 text-right text-gray-900">
                            <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded" onClick={()=>{setEditing(r); setShowMap(false)}}>Edit</button>
                            <button className="px-2 py-1 text-xs bg-red-600 text-white rounded" onClick={()=>remove(r.id)}>Hapus</button>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr><td className="p-3 text-center text-gray-500" colSpan={7}>{loading ? 'Memuat...' : 'Kosong'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h2 className="font-semibold mb-3">{editing && items.find(i=>i.id===editing.id) ? 'Edit' : 'Tambah'} Region</h2>
              <form onSubmit={save} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">ID (slug, mis. kab-bandung)</label>
                  <input className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.id || ''} onChange={e=>setEditing(prev=>({ ...(prev as Region), id: e.target.value }))} placeholder="kab-bandung" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Name</label>
                  <input className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.name || ''} onChange={e=>setEditing(prev=>({ ...(prev as Region), name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Color</label>
                  <input type="color" className="w-24 h-10 border rounded" value={editing?.color || '#2A82BF'} onChange={e=>setEditing(prev=>({ ...(prev as Region), color: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">SPBU Count</label>
                    <input type="number" className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.spbu_count || 0} onChange={e=>setEditing(prev=>({ ...(prev as Region), spbu_count: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">SPBE Count</label>
                    <input type="number" className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.spbe_count || 0} onChange={e=>setEditing(prev=>({ ...(prev as Region), spbe_count: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">Latitude (contoh: -6.914744)</label>
                    <input type="number" step="any" className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.latitude || ''} onChange={e=>setEditing(prev=>({ ...(prev as Region), latitude: e.target.value ? Number(e.target.value) : undefined }))} placeholder="-6.914744" />
                    <p className="text-xs text-gray-500 mt-1">Klik di map untuk set otomatis</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Longitude (contoh: 107.60981)</label>
                    <input type="number" step="any" className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.longitude || ''} onChange={e=>setEditing(prev=>({ ...(prev as Region), longitude: e.target.value ? Number(e.target.value) : undefined }))} placeholder="107.60981" />
                    <p className="text-xs text-gray-500 mt-1">Klik di map untuk set otomatis</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" type="submit" disabled={!isAuthorized}>Simpan</button>
                  <button className="px-4 py-2 bg-gray-100 rounded" type="button" onClick={resetForm}>Bersihkan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
