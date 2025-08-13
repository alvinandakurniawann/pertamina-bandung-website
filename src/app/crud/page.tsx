'use client'

import { useEffect, useMemo, useState } from 'react'
import { Region, Location, LocationType } from '@/types/sa'
import { db } from '@/lib/firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'

interface ChangeItem {
  id: string
  at?: Timestamp
  by?: string
  action: 'create' | 'update' | 'delete'
  entity: 'region' | 'location'
  regionId: string
  locationId?: string
  before?: unknown
  after?: unknown
}

const emptyLocation = (): Location => ({
  id: '',
  name: '',
  type: 'SPBU',
  address: '',
  services: [],
  hours: '',
  phone: ''
})

const emptyRegion = (): Region => ({
  id: '',
  name: '',
  color: '#90EE90',
  spbuCount: 0,
  spbeCount: 0,
  locations: []
})

export default function CrudPage() {
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('')
  const [accessKey, setAccessKey] = useState<string>('')
  const MAP_REGIONS: Array<{ id: string; name: string; defaultColor: string }> = [
    { id: 'bojonagara', name: 'Bojonagara', defaultColor: '#90EE90' },
    { id: 'cibeunying', name: 'Cibeunying', defaultColor: '#32CD32' },
    { id: 'tegallega', name: 'Tegallega', defaultColor: '#FFB6C1' },
    { id: 'karees', name: 'Karees', defaultColor: '#87CEEB' },
    { id: 'ujung-berung', name: 'Ujung Berung', defaultColor: '#DDA0DD' },
    { id: 'gede-bage', name: 'Gede Bage', defaultColor: '#FFA500' },
  ]

  const hasAccess = useMemo(() => {
    const expected = (process.env.NEXT_PUBLIC_CRUD_SECRET || 'CRUD-SECRET-LOCAL').trim()
    const provided = accessKey.trim()
    return expected.length > 0 && provided.length > 0 && provided === expected
  }, [accessKey])

  // Subscribe regions + locations realtime
  useEffect(() => {
    const unsubRegions = onSnapshot(collection(db, 'regions'), async (snap) => {
      const next: Region[] = []
      for (const d of snap.docs) {
        const base = d.data() as Region
        // Load locations subcollection
        const locSnap = await getDocs(collection(db, 'regions', d.id, 'locations'))
        const locations: Location[] = locSnap.docs.map(l => l.data() as Location)
        const spbuCount = locations.filter(l => l.type === 'SPBU').length
        const spbeCount = locations.filter(l => l.type === 'SPBE').length
        next.push({ ...base, id: d.id, locations, spbuCount, spbeCount })
      }
      setRegions(next)
    })

    return () => {
      unsubRegions()
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('crudKey') || ''
    if (stored) {
      setAccessKey(stored)
    } else {
      const expected = (process.env.NEXT_PUBLIC_CRUD_SECRET || 'CRUD-SECRET-LOCAL').trim()
      if (expected) {
        setAccessKey(expected)
        localStorage.setItem('crudKey', expected)
      }
    }
  }, [])

  const filteredRegions = useMemo(() => {
    if (!filter.trim()) return regions
    const q = filter.toLowerCase()
    return regions.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
  }, [regions, filter])

  const startAddRegion = () => {
    setSelectedRegionIndex(null)
    setEditingRegion(emptyRegion())
    setEditingLocation(null)
    setEditingLocationIndex(null)
  }

  const startEditRegion = (index: number) => {
    setSelectedRegionIndex(index)
    setEditingRegion(JSON.parse(JSON.stringify(regions[index])) as Region)
    setEditingLocation(null)
    setEditingLocationIndex(null)
  }

  const deleteRegion = async (index: number) => {
    if (!hasAccess) return
    const region = regions[index]
    await deleteDoc(doc(db, 'regions', region.id))
    await addDoc(collection(db, 'changes'), {
      at: serverTimestamp(),
      action: 'delete',
      entity: 'region',
      regionId: region.id,
      before: region,
      by: 'shared-secret'
    })
  }

  const addLocation = () => {
    if (!editingRegion) return
    const next = { ...editingRegion }
    next.locations = [...next.locations, emptyLocation()]
    setEditingRegion(next)
    setEditingLocationIndex(next.locations.length - 1)
    setEditingLocation(next.locations[next.locations.length - 1])
  }

  const editLocation = (index: number) => {
    if (!editingRegion) return
    setEditingLocationIndex(index)
    setEditingLocation(JSON.parse(JSON.stringify(editingRegion.locations[index])) as Location)
  }

  const removeLocation = (index: number) => {
    if (!editingRegion) return
    const next = { ...editingRegion }
    next.locations = next.locations.filter((_, i) => i !== index)
    next.spbuCount = next.locations.filter(l => l.type === 'SPBU').length
    next.spbeCount = next.locations.filter(l => l.type === 'SPBE').length
    setEditingRegion(next)
  }

  const commitRegion = async () => {
    if (!hasAccess) return
    if (!editingRegion) return
    const payload: Region = {
      ...editingRegion,
      spbuCount: editingRegion.locations.filter(l => l.type === 'SPBU').length,
      spbeCount: editingRegion.locations.filter(l => l.type === 'SPBE').length,
    }

    // Cegah duplikasi wilayah saat create
    if (selectedRegionIndex == null && regions.some(r => r.id === payload.id)) {
      alert('Wilayah sudah ada. Silakan pilih wilayah lain atau edit yang ada.')
      return
    }

    if (selectedRegionIndex == null) {
      // create region doc and its locations
      await setDoc(doc(db, 'regions', payload.id), {
        id: payload.id,
        name: payload.name,
        color: payload.color,
        spbuCount: payload.spbuCount,
        spbeCount: payload.spbeCount
      })
      for (const loc of payload.locations) {
        await setDoc(doc(db, 'regions', payload.id, 'locations', loc.id), loc)
      }
      await addDoc(collection(db, 'changes'), {
        at: serverTimestamp(), action: 'create', entity: 'region', regionId: payload.id, after: payload, by: 'shared-secret'
      })
    } else {
      const old = regions[selectedRegionIndex]
      await updateDoc(doc(db, 'regions', payload.id), {
        name: payload.name,
        color: payload.color,
        spbuCount: payload.spbuCount,
        spbeCount: payload.spbeCount
      })
      // Replace all locations of the region to keep it simple
      const oldLocSnap = await getDocs(collection(db, 'regions', payload.id, 'locations'))
      await Promise.all(oldLocSnap.docs.map(d => deleteDoc(d.ref)))
      for (const loc of payload.locations) {
        await setDoc(doc(db, 'regions', payload.id, 'locations', loc.id), loc)
      }
      await addDoc(collection(db, 'changes'), {
        at: serverTimestamp(), action: 'update', entity: 'region', regionId: payload.id, before: old, after: payload, by: 'shared-secret'
      })
    }
    setEditingRegion(null)
    setEditingLocation(null)
    setEditingLocationIndex(null)
  }

  const commitLocation = () => {
    if (editingRegion == null || editingLocationIndex == null || editingLocation == null) return
    const next = { ...editingRegion }
    const locs = next.locations.slice()
    locs[editingLocationIndex] = editingLocation
    next.locations = locs
    setEditingRegion(next)
    setEditingLocation(null)
    setEditingLocationIndex(null)
  }

  const saveAll = async () => {
    if (!hasAccess) return
    setSaving(true)
    try {
      await fetch('/api/sa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regions })
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-gray-900">Manajemen Data Peta (CRUD)</h1>
        <p className="text-sm text-gray-600 mb-3">Halaman ini tersembunyi dari header. Akses via /crud</p>

        <div className="mb-4 p-3 border rounded bg-white">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <label className="text-sm md:w-72">Kunci Akses (shared secret)
              <input
                value={accessKey}
                onChange={(e) => { setAccessKey(e.target.value); localStorage.setItem('crudKey', e.target.value) }}
                className="mt-1 border rounded px-3 py-2 w-full"
                placeholder="Masukkan kunci akses"
                type="password"
              />
            </label>
            <div className={`text-sm ${hasAccess ? 'text-green-700' : 'text-red-700'}`}>
              {hasAccess ? 'Akses tulis diizinkan' : 'Tidak ada akses tulis. Masukkan kunci yang benar.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-64"
            placeholder="Cari wilayah..."
          />
          <button onClick={startAddRegion} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah Wilayah</button>
          <button onClick={saveAll} disabled={saving || !hasAccess} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3 text-gray-900">Daftar Wilayah</h2>
            <ul className="space-y-2">
              {filteredRegions.map((r, idx) => (
                <li key={r.id} className="flex items-center justify-between border rounded p-2">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: r.color }} />
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.id} • SPBU {r.spbuCount} • SPBE {r.spbeCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditRegion(idx)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => deleteRegion(idx)} disabled={!hasAccess} className="text-red-600 hover:underline disabled:opacity-50">Hapus</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Riwayat Perubahan */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-900">Riwayat Perubahan</h3>
              <ChangeHistory />
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3 text-gray-900">Form Wilayah</h2>
            {editingRegion ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="text-sm text-gray-700">Wilayah Peta
                    <select
                      value={editingRegion.id}
                      onChange={(e) => {
                        const sel = MAP_REGIONS.find(m => m.id === e.target.value)
                        if (!sel) return
                        const next = { ...editingRegion, id: sel.id, name: sel.name }
                        if (!editingRegion.color) next.color = sel.defaultColor
                        setEditingRegion(next)
                      }}
                      className="mt-1 border rounded px-3 py-2 w-full"
                    >
                      <option value="" disabled>Pilih wilayah…</option>
                      {MAP_REGIONS
                        .filter(m => selectedRegionIndex != null ? true : !regions.some(r => r.id === m.id))
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                  </label>
                  <label className="text-sm text-gray-700">Nama
                    <input value={editingRegion.name} onChange={(e) => setEditingRegion({ ...editingRegion, name: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="text-sm text-gray-700">Warna
                    <input type="color" value={editingRegion.color} onChange={(e) => setEditingRegion({ ...editingRegion, color: e.target.value })} className="mt-1 h-10 w-16" />
                  </label>
                  <div className="text-sm flex items-end gap-2">
                    <span>SPBU:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{editingRegion.locations.filter(l => l.type === 'SPBU').length}</span>
                    <span>SPBE:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{editingRegion.locations.filter(l => l.type === 'SPBE').length}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <h3 className="font-medium">Lokasi</h3>
                  <button onClick={addLocation} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded">Tambah Lokasi</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {editingRegion.locations.map((loc, i) => (
                    <div key={i} className="border rounded p-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{loc.name || '(nama belum diisi)'}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => editLocation(i)} className="text-blue-600 text-sm">Edit</button>
                          <button onClick={() => removeLocation(i)} className="text-red-600 text-sm">Hapus</button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{loc.type} • {loc.address}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={commitRegion} disabled={!hasAccess} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">Simpan Wilayah</button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Pilih wilayah untuk diedit atau klik Tambah Wilayah.</div>
            )}
          </div>
        </div>

        {editingLocation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Edit Lokasi</h3>
                <button onClick={() => { setEditingLocation(null); setEditingLocationIndex(null) }} className="text-gray-500">✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm">ID
                  <input value={editingLocation.id} onChange={(e) => setEditingLocation({ ...editingLocation, id: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
                <label className="text-sm">Nama
                  <input value={editingLocation.name} onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
                <label className="text-sm">Tipe
                  <select value={editingLocation.type} onChange={(e) => setEditingLocation({ ...editingLocation, type: e.target.value as LocationType })} className="mt-1 border rounded px-3 py-2 w-full">
                    <option value="SPBU">SPBU</option>
                    <option value="SPBE">SPBE</option>
                  </select>
                </label>
                <label className="text-sm">Telepon
                  <input value={editingLocation.phone} onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
                <label className="text-sm md:col-span-2">Alamat
                  <input value={editingLocation.address} onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
                <label className="text-sm">Jam Operasional
                  <input value={editingLocation.hours} onChange={(e) => setEditingLocation({ ...editingLocation, hours: e.target.value })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
                <label className="text-sm md:col-span-2">Layanan (pisahkan dengan koma)
                  <input value={editingLocation.services.join(', ')} onChange={(e) => setEditingLocation({ ...editingLocation, services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-1 border rounded px-3 py-2 w-full" />
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setEditingLocation(null); setEditingLocationIndex(null) }} className="px-4 py-2 rounded border">Batal</button>
                <button onClick={commitLocation} className="px-4 py-2 rounded bg-blue-600 text-white">Simpan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ChangeHistory() {
  const [items, setItems] = useState<ChangeItem[]>([])

  useEffect(() => {
    const q = query(collection(db, 'changes'), orderBy('at', 'desc'), limit(50))
    const unsub = onSnapshot(q, (snap) => {
      const rows: ChangeItem[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChangeItem, 'id'>) }))
      setItems(rows)
    })
    return () => unsub()
  }, [])

  return (
    <div className="border rounded">
      <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs font-semibold bg-gray-50">
        <div>Waktu</div>
        <div>User</div>
        <div>Aksi</div>
        <div>Target</div>
        <div>Ringkasan</div>
      </div>
      <div className="max-h-64 overflow-auto text-sm">
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-5 gap-2 px-3 py-2 border-t">
            <div>{it.at?.toDate ? it.at.toDate().toLocaleString() : '-'}</div>
            <div>{it.by || 'admin'}</div>
            <div>{it.action}</div>
            <div>{it.entity}{it.locationId ? `/${it.locationId}` : ''}</div>
            <div className="truncate" title={it.regionId}>region: {it.regionId}</div>
          </div>
        ))}
        {!items.length && (
          <div className="px-3 py-4 text-gray-500">Belum ada perubahan.</div>
        )}
      </div>
    </div>
  )
}


