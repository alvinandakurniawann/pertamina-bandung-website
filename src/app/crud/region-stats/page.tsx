'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import CrudPanel from '@/components/CrudPanel'

type Stat = {
  key: string
  display_name: string
  spbu_total: number
  pertashop_total: number
  spbe_pso_total: number
  spbe_npso_total: number
  agen_lpg_3kg_total: number
  lpg_npso_total: number
  pangkalan_lpg_3kg_total: number
}

export default function RegionStatsCrudPage() {
  const [items, setItems] = useState<Stat[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [filter, setFilter] = useState('')
  const [mounted, setMounted] = useState(false)

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return items
    return items.filter(r => r.key.toLowerCase().includes(f) || r.display_name.toLowerCase().includes(f))
  }, [items, filter])

  const blank: Stat = {
    key: '', display_name: '', spbu_total: 0, pertashop_total: 0, spbe_pso_total: 0, spbe_npso_total: 0, agen_lpg_3kg_total: 0, lpg_npso_total: 0, pangkalan_lpg_3kg_total: 0
  }

  useEffect(() => { setEditing(blank); load(); setMounted(true) }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('region_stats').select('*').order('key')
      if (error) throw error
      setItems(data || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    try {
      if (!editing.key || !editing.display_name) { alert('Key dan Display Name wajib'); return }
      const { error } = await supabase.from('region_stats').upsert(editing, { onConflict: 'key' })
      if (error) throw error
      await recomputeAllTotals();
      await load(); setEditing(blank); alert('Tersimpan')
    } catch (e: any) { alert(e?.message || 'Gagal simpan') }
  }

  async function remove(key: string) {
    if (!confirm('Hapus data ini?')) return
    try {
      const { error } = await supabase.from('region_stats').delete().eq('key', key)
      if (error) throw error
      await recomputeAllTotals();
      await load()
    } catch (e: any) { alert(e?.message || 'Gagal hapus') }
  }

  async function recomputeAllTotals() {
    try {
      const { data, error } = await supabase
        .from('region_stats')
        .select('spbu_total, pertashop_total, spbe_pso_total, spbe_npso_total, agen_lpg_3kg_total, lpg_npso_total, pangkalan_lpg_3kg_total, key')
      if (error) throw error
      const rows = (data || []).filter(r => r.key !== 'ALL') as any[]
      const sum = (field: string) => rows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0)
      const payload = {
        key: 'ALL',
        display_name: 'Semua Wilayah',
        spbu_total: sum('spbu_total'),
        pertashop_total: sum('pertashop_total'),
        spbe_pso_total: sum('spbe_pso_total'),
        spbe_npso_total: sum('spbe_npso_total'),
        agen_lpg_3kg_total: sum('agen_lpg_3kg_total'),
        lpg_npso_total: sum('lpg_npso_total'),
        pangkalan_lpg_3kg_total: sum('pangkalan_lpg_3kg_total'),
      }
      const { error: upErr } = await supabase.from('region_stats').upsert(payload, { onConflict: 'key' })
      if (upErr) throw upErr
    } catch (e) {
      console.error('Recompute ALL failed', e)
    }
  }

  if (!mounted) return <div className="min-h-screen bg-gray-50" />

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <CrudPanel />

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Region Stats</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border">
              <h2 className="font-semibold mb-3 text-gray-800">Daftar</h2>
              <div className="flex items-center gap-2 mb-3">
                <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Cari..." className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" />
                <button onClick={load} className="px-3 py-2 bg-gray-100 rounded">Reload</button>
              </div>
              <div className="overflow-auto max-h-[480px] border rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 text-gray-700">Key</th>
                      <th className="text-left p-2 text-gray-700">Display</th>
                      <th className="p-2 text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.key} className="border-t">
                        <td className="p-2 font-mono text-xs text-gray-900">{s.key}</td>
                        <td className="p-2 text-gray-900">{s.display_name}</td>
                        <td className="p-2 text-right space-x-2 text-gray-900">
                          <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded" onClick={()=>setEditing(s)}>Edit</button>
                          <button className="px-2 py-1 text-xs bg-red-600 text-white rounded" onClick={()=>remove(s.key)}>Hapus</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td className="p-3 text-center text-gray-500" colSpan={3}>{loading ? 'Memuat...' : 'Kosong'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h2 className="font-semibold mb-3 text-gray-800">{editing && items.find(i=>i.key===editing.key) ? 'Edit' : 'Tambah'} Stat</h2>
              <form onSubmit={save} className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Key (mis. kab-bandung, kota-bandung, ALL)</label>
                  <input className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.key || ''} onChange={e=>setEditing(prev=>({ ...(prev as Stat), key: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Display Name</label>
                  <input className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={editing?.display_name || ''} onChange={e=>setEditing(prev=>({ ...(prev as Stat), display_name: e.target.value }))} />
                </div>
                {[
                  ['spbu_total','SPBU'],
                  ['pertashop_total','Pertashop'],
                  ['spbe_pso_total','SPBE PSO'],
                  ['spbe_npso_total','SPBE NPSO'],
                  ['agen_lpg_3kg_total','Agen LPG 3kg'],
                  ['lpg_npso_total','LPG NPSO'],
                  ['pangkalan_lpg_3kg_total','Pangkalan LPG 3kg'],
                ].map(([field,label]) => (
                  <div key={field as string}>
                    <label className="text-xs text-gray-600">{label}</label>
                    <input type="number" className="w-full border rounded px-3 py-2 text-gray-900 placeholder:text-gray-400" value={(editing as any)?.[field] ?? 0} onChange={e=>setEditing(prev=>({ ...(prev as any), [field]: Number(e.target.value) }))} />
                  </div>
                ))}
                <div className="col-span-2 flex gap-2 mt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Simpan</button>
                  <button className="px-4 py-2 bg-gray-100 rounded" type="button" onClick={()=>setEditing(blank)}>Bersihkan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


