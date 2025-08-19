'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type FuelStatus = 'Berhasil' | 'Gagal'

interface FuelRow {
  no: number
  wilayah: string
  totalKuantitasKl: number
  tanggal: string // dd-mm-yyyy
  status: FuelStatus
}

const SAMPLE_ROWS: FuelRow[] = [
  { no: 1, wilayah: 'Andir', totalKuantitasKl: 2939, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 2, wilayah: 'Antapani', totalKuantitasKl: 4350, tanggal: '23-02-2098', status: 'Gagal' },
  { no: 3, wilayah: 'Arcamanik', totalKuantitasKl: 3800, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 4, wilayah: 'Babakan', totalKuantitasKl: 4100, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 5, wilayah: 'Buahbatu', totalKuantitasKl: 4600, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 6, wilayah: 'Cibiru', totalKuantitasKl: 3500, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 7, wilayah: 'Ciparay', totalKuantitasKl: 2700, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 8, wilayah: 'Coblong', totalKuantitasKl: 4800, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 9, wilayah: 'Kiaracondong', totalKuantitasKl: 4650, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 10, wilayah: 'Lengkong', totalKuantitasKl: 3900, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 11, wilayah: 'Mandala Jati', totalKuantitasKl: 3300, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 12, wilayah: 'Sukajadi', totalKuantitasKl: 3600, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 13, wilayah: 'Ujung Berung', totalKuantitasKl: 3400, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 14, wilayah: 'Regol', totalKuantitasKl: 3200, tanggal: '23-02-2098', status: 'Berhasil' },
  { no: 15, wilayah: 'Rancasari', totalKuantitasKl: 3900, tanggal: '23-02-2098', status: 'Berhasil' },
]

export default function DataFuelPage() {
  const [tanggal, setTanggal] = useState<string>('')
  const [wilayah, setWilayah] = useState<string>('')
  const [query, setQuery] = useState<string>('')

  const rows = useMemo(() => {
    let filtered = SAMPLE_ROWS
    if (wilayah) filtered = filtered.filter(r => r.wilayah === wilayah)
    if (tanggal) filtered = filtered.filter(r => r.tanggal === tanggal)
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(r => r.wilayah.toLowerCase().includes(q))
    }
    return filtered
  }, [tanggal, wilayah, query])

  const wilayahOptions = useMemo(() => {
    return Array.from(new Set(SAMPLE_ROWS.map(r => r.wilayah)))
  }, [])

  const formatKl = (num: number) => new Intl.NumberFormat('id-ID').format(num) + ' kl'

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-[272px] shrink-0">
            <div className="rounded-r-[60px] bg-gray-100/60 border border-gray-200 h-full min-h-[820px] p-6">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-blue-700 rounded-md grid place-items-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-black leading-tight">PERTAMINA</div>
                  <div className="text-[10px] font-semibold text-red-600 -mt-1">PETRA NIAGA BANDUNG</div>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/" className="block px-4 py-2 rounded text-black font-medium">Beranda</Link>
                <Link href="/data-fuel" className="block bg-[#001482] text-white px-4 py-3 rounded-lg font-medium">Data Fuel</Link>
                <Link href="/peta-sa" className="block px-4 py-2 rounded text-black font-medium">Data LPG</Link>
              </nav>

              <div className="mt-16 h-px bg-gray-300/60 mx-2" />
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[28px] font-bold text-gray-900">Data Fuel</h1>
              <button className="bg-[#001482] text-white px-5 py-2 rounded-lg text-sm font-medium">Tambah Data</button>
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white">
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="outline-none min-w-[120px]"
                />
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                </svg>
              </div>

              <select
                value={wilayah}
                onChange={(e) => setWilayah(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white min-w-[180px]"
              >
                <option value="">Semua Wilayah</option>
                {wilayahOptions.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari wilayah..."
                className="border rounded-md px-3 py-2 text-sm bg-white min-w-[200px]"
              />
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[60px_1fr_200px_180px_140px_100px] gap-2 px-4 py-2 bg-gray-100 border-b text-[15px] font-medium">
                <div className="self-center">No</div>
                <div className="self-center">Wilayah</div>
                <div className="self-center">Total Kuantitas</div>
                <div className="self-center">Tanggal</div>
                <div className="self-center">Status</div>
                <div className="self-center">Action</div>
              </div>

              {rows.map((r, idx) => (
                <div key={r.no} className="grid grid-cols-[60px_1fr_200px_180px_140px_100px] gap-2 px-4 py-3 border-b text-[15px]">
                  <div className="self-center text-gray-800">{r.no}</div>
                  <div className="self-center text-gray-800">{r.wilayah}</div>
                  <div className="self-center text-right tabular-nums">{formatKl(r.totalKuantitasKl)}</div>
                  <div className="self-center">{r.tanggal}</div>
                  <div className="self-center">
                    <span className={`inline-flex items-center gap-2 text-sm ${r.status === 'Berhasil' ? 'text-gray-700' : 'text-red-600'}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${r.status === 'Berhasil' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {r.status}
                    </span>
                  </div>
                  <div className="self-center">
                    <button className="p-1.5 rounded hover:bg-gray-100" title="Edit">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h2m-8 8l-1 4 4-1 10-10a2.828 2.828 0 10-4-4L6 12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {!rows.length && (
                <div className="px-4 py-10 text-center text-gray-500">Tidak ada data</div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <div>Showing {Math.min(rows.length, 8)} of 1000</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border">Prev</button>
                <button className="px-3 py-1 rounded border">Next</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}








