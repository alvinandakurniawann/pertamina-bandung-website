"use client"
import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MapInteractive from '@/components/MapInteractive'

export default function IndexPage() {
  const [currentKey, setCurrentKey] = useState<string>('ALL')
  const [currentName, setCurrentName] = useState<string>('Semua Wilayah')
  const [stats, setStats] = useState({
    spbu_total: 328,
    pertashop_total: 116,
    spbe_pso_total: 42,
    spbe_npso_total: 10,
    agen_lpg_3kg_total: 422,
    lpg_npso_total: 42,
    pangkalan_lpg_3kg_total: 10904,
  })

  const fetchStats = useCallback(async (key: string) => {
    try {
      const res = await fetch(`/api/region-stats?key=${encodeURIComponent(key)}`, { cache: 'no-store' })
      const json = await res.json()
      if (json?.data) {
        setStats({
          spbu_total: json.data.spbu_total,
          pertashop_total: json.data.pertashop_total,
          spbe_pso_total: json.data.spbe_pso_total,
          spbe_npso_total: json.data.spbe_npso_total,
          agen_lpg_3kg_total: json.data.agen_lpg_3kg_total,
          lpg_npso_total: json.data.lpg_npso_total,
          pangkalan_lpg_3kg_total: json.data.pangkalan_lpg_3kg_total,
        })
      }
    } catch (e) {
      // ignore - keep defaults
    }
  }, [])

  useEffect(() => { fetchStats('ALL') }, [fetchStats])

  const handleSelect = useCallback((key: string, displayName: string) => {
    setCurrentKey(key)
    setCurrentName(displayName)
    fetchStats(key)
  }, [fetchStats])
  return (
    <>
    <Header />
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#2a82bf]">Overview Wilayah dan Outlet SA Bandung - Priangan Timur</h1>
          <p className="mt-2 text-sm text-black/70">{currentName}</p>
          <p className="mt-4 text-base leading-4 tracking-wide md:text-base text-black/80"></p>
        </div>
      </section>

      {/* Map section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="p-0 bg-transparent border-0 shadow-none">
            <MapInteractive onSelect={handleSelect} />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="rounded-lg p-4 text-white h-[320px] flex flex-col justify-end text-center bg-red-500">
            <h4 className="font-semibold">SPBU</h4>
            <p className="text-sm opacity-90">{stats.spbu_total} SPBU</p>
          </div>
          <div className="rounded-lg p-4 text-white bg-[#2a82bf] h-[320px] flex flex-col justify-end text-center">
            <h4 className="font-semibold">Pertashop</h4>
            <p className="text-sm opacity-90">{stats.pertashop_total} Pertashop</p>
          </div>  
          <div className="rounded-lg p-4 text-white bg-green-500 h-[320px] flex flex-col justify-end text-center">
            <h4 className="font-semibold">SPBE</h4>
            <p className="text-sm opacity-90">{stats.spbe_pso_total} SPBE PSO</p>
            <p className="text-sm opacity-90">{stats.spbe_npso_total} SPBE NPSO</p>
          </div>
          <div className="rounded-lg p-4 text-white bg-gray-900 h-[320px] flex flex-col justify-end text-center">
            <h4 className="font-semibold">Agen LPG</h4>
            <p className="text-sm opacity-90">{stats.agen_lpg_3kg_total} Agen LPG 3 Kg</p>
            <p className="text-sm opacity-90">{stats.lpg_npso_total} LPG NPSO</p>
          </div>
          <div className="rounded-lg p-4 text-white bg-gray-400 h-[320px] flex flex-col justify-end text-center">
            <h4 className="font-semibold">Pangkalan LPG</h4>
            <p className="text-sm opacity-90">{stats.pangkalan_lpg_3kg_total} Pangkalan LPG 3 Kg</p>

          </div>
        </div>
      </section>

      {/* Stats strip */}

      {/* Footer */}
      
    </main>
    <Footer />
    </>
  )
}


