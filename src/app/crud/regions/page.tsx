'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import CrudPanel from '@/components/CrudPanel'

type Region = {
  id: string
  name: string
  color: string
  spbu_count: number
  spbe_count: number
}

export default function RegionsCrudPage() {
  const [items, setItems] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Region | null>(null)
  const [filter, setFilter] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [sharedKey, setSharedKey] = useState('')

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return items
    return items.filter(r => r.id.toLowerCase().includes(f) || r.name.toLowerCase().includes(f))
  }, [items, filter])

  const resetForm = () => setEditing({ id: '', name: '', color: '#2A82BF', spbu_count: 0, spbe_count: 0 })

  useEffect(() => { resetForm(); load(); setMounted(true) }, [])

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

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    try {
      if (!editing.id || !editing.name) { alert('ID dan Name wajib diisi'); return }
      const payload = { id: editing.id, name: editing.name, color: editing.color, spbu_count: editing.spbu_count || 0, spbe_count: editing.spbe_count || 0 }
      const { error } = await supabase.from('regions').upsert(payload, { onConflict: 'id' })
      if (error) throw error
      await load(); resetForm(); alert('Tersimpan')
    } catch (e: any) { alert(e?.message || 'Gagal simpan') }
  }

  async function remove(id: string) {
    if (!confirm('Hapus region ini?')) return
    try {
      const { error } = await supabase.from('regions').delete().eq('id', id)
      if (error) throw error
      await load()
    } catch (e: any) { alert(e?.message || 'Gagal hapus') }
  }

  if (!mounted) return <div className="min-h-screen bg-gray-50" />

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <CrudPanel />

      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Regions</h1>
          </div>

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
                    <th className="p-2 text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 font-mono text-xs text-gray-900">{r.id}</td>
                      <td className="p-2 text-gray-900">{r.name}</td>
                      <td className="p-2"><span className="inline-block w-4 h-4 rounded" style={{ background: r.color }} /></td>
                      <td className="p-2 text-right text-gray-900">{r.spbu_count}</td>
                      <td className="p-2 text-right text-gray-900">{r.spbe_count}</td>
                      <td className="p-2 space-x-2 text-right text-gray-900">
                        <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded" onClick={()=>setEditing(r)}>Edit</button>
                        <button className="px-2 py-1 text-xs bg-red-600 text-white rounded" onClick={()=>remove(r.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td className="p-3 text-center text-gray-500" colSpan={6}>{loading ? 'Memuat...' : 'Kosong'}</td></tr>
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


