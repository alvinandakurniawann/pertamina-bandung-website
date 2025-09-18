"use client"
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import React, { useCallback, useEffect, useState } from 'react'

/* ---------- ICON CUSTOM ---------- */
const smallIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [18, 30],
  iconAnchor: [9, 30],
})

/* ---------- KOMPONEN UTAMA ---------- */
export default function PetaOverviewClient() {
  const [currentKey, setCurrentKey] = useState<string>('ALL')
  const [currentName, setCurrentName] = useState<string>('Semua Wilayah')
  const [stats, setStats] = useState({
    spbu_total: 0,
    pertashop_total: 0,
    spbe_pso_total: 0,
    spbe_npso_total: 0,
    agen_lpg_3kg_total: 0,
    lpg_npso_total: 0,
    pangkalan_lpg_3kg_total: 0,
    spbu_coco: 0,
    spbu_codo: 0,
    spbu_dodo: 0,
  })
  const [loading, setLoading] = useState(false)

  const fetchStats = useCallback(async (key: string) => {
    setLoading(true)
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
          spbu_coco: json.data.spbu_coco ?? 0,
          spbu_codo: json.data.spbu_codo ?? 0,
          spbu_dodo: json.data.spbu_dodo ?? 0,
        })
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats('ALL') }, [fetchStats])

  const handleSelect = useCallback((key: string, displayName: string) => {
    setCurrentKey(key)
    setCurrentName(displayName)
    fetchStats(key)
  }, [fetchStats])

  return (
    <div>
      <h2 className="font-bold text-center mb-2">{currentName}</h2>
      <MapInteractive 
        onSelect={handleSelect}
        stats={stats}
        currentName={currentName}
      />
      {loading && <p className="text-sm text-gray-500">Loading data...</p>}
    </div>
  )
}

/* ---------- KOMPONEN MAP ---------- */
type Props = {
  onSelect: (key: string, displayName: string) => void
  stats: any
  currentName: string
}

function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    let end = value;
    let startTime: number | null = null;
    function animateCounter(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setCount(end);
      }
    }
    requestAnimationFrame(animateCounter);
    return () => setCount(end);
  }, [value, duration]);
  return <span className="counter">{count.toLocaleString('de')}</span>;
}

function MapInteractive({ onSelect, stats, currentName }: Props) {
  const position: [number, number] = [-7.083130, 108.184514] // Jawa Barat

  const markers = [
    { id: "kota-bandung", name: "Kota Bandung", pos: [-6.914744, 107.60981] },
    { id: "kab-bandung", name: "Kabupaten Bandung", pos: [-7.1124, 107.6486] },
    { id: "kab-bandung-barat", name: "Kabupaten Bandung Barat", pos: [-6.797435, 107.624433] },
    { id: "kab-garut", name: "Kabupaten Garut", pos: [-7.2279, 107.9087] },
    { id: "kab-pangandaran", name: "Kabupaten Pangandaran", pos: [-7.6906, 108.6530] },
    { id: "kab-tasikmalaya", name: "Kabupaten Tasikmalaya", pos: [-7.566427, 108.152771] },
    { id: "kab-ciamis", name: "Kabupaten Ciamis", pos: [-7.221291, 108.375916] },
    { id: "kota-tasikmalaya", name: "Kota Tasikmalaya", pos: [-7.3276, 108.2145] },
    { id: "kota-banjar", name: "Kota Banjar", pos: [-7.3700, 108.5333] },
    { id: "kota-cimahi", name: "Kota Cimahi", pos: [-6.8722, 107.5420] },
    { id: "kab-sumedang", name: "Kabupaten Sumedang", pos: [-6.9085, 108.0648] },
  ]

  return (
    <>
      <MapContainer center={position} zoom={9} style={{ height: "500px" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker
            key={m.id}
            position={m.pos as [number, number]}
            icon={smallIcon}
            eventHandlers={{
              click: () => {
                if (onSelect) onSelect(m.id, m.name);
              }
            }}
          >
            <Tooltip permanent direction={i % 2 === 0 ? "right" : "left"} offset={[10, 0]}>
              {m.name}
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <h3 className="font-bold text-center text-sm mb-2">{currentName}</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>SPBU: {stats.spbu_total}</li>
                  <li>Pertashop: {stats.pertashop_total}</li>
                  <li>SPBE: {stats.spbe_pso_total + stats.spbe_npso_total}</li>
                  <li>Agen LPG: {stats.agen_lpg_3kg_total}</li>
                  <li>Pangkalan LPG: {stats.pangkalan_lpg_3kg_total}</li>
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Cards */}
      <section className="py-8 mt-[50px]">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: SPBU */}
          <div className="relative h-[320px] rounded-lg overflow-hidden bg-[#000000] shadow-lg group cursor-pointer">
            <img
              src="/card.jpg"
              alt="SPBU"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBU</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={stats.spbu_total} duration={1000} /> SPBU
              </p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-start gap-[10px] p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#172027e3",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h4 className="text-xl font-semibold border-b gap-[5px] text-center mb-4">SPBU</h4>
              <ul className="space-y-3 text-sm flex flex-col gap-[10px] text-center">
                <li>{stats.spbu_coco} Unit SPBU COCO</li>
                <li>{stats.spbu_dodo} Unit SPBU DODO</li>
                <li>{stats.spbu_codo} Unit SPBU CODO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 2: Pertashop */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer">
            <img
              src="/card.jpg"
              alt="Pertashop"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pertashop</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={stats.pertashop_total} duration={1000} /> Pertashop
              </p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#522222a9",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }} >
              <h4 className="text-xl font-semibold border-b text-center mb-4">Pertashop</h4>
              <p className="text-sm text-center mt-[10px]">Total {stats.pertashop_total} Unit</p>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 3: SPBE */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer">
            <img
              src="/card.jpg"
              alt="SPBE"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBE</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={stats.spbe_pso_total + stats.spbe_npso_total} duration={1000} /> SPBE
              </p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3242189d",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h4 className="text-xl border-b font-semibold text-center mb-4">SPBE</h4>
              <ul className="space-y-3 text-sm text-center gap-[10px] mt-[10px] flex flex-col">
                <li>{stats.spbe_pso_total} SPBE PSO</li>
                <li>{stats.spbe_npso_total} SPBE NPSO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 4: Agen LPG */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer">
            <img
              src="/card.jpg"
              alt="Agen LPG"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Agen LPG</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={stats.agen_lpg_3kg_total} duration={1000} /> Agen LPG
              </p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3d3d3d94",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h4 className="text-xl font-semibold border-b text-center mb-4">Agen LPG</h4>
              <ul className="space-y-3 text-sm text-center gap-[10px] mt-[10px] flex flex-col">
                <li>{stats.agen_lpg_3kg_total} Agen LPG 3 Kg</li>
                <li>{stats.lpg_npso_total} LPG NPSO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 5: Pangkalan LPG */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer group">
            <img
              src="/card.jpg"
              alt="Pangkalan LPG"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pangkalan LPG</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={stats.pangkalan_lpg_3kg_total} duration={1000} /> Pangkalan
              </p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3d290396",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h4 className="text-xl font-semibold text-center border-b mb-4">Pangkalan LPG</h4>
              <p className="text-sm text-center mt-[10px]">{stats.pangkalan_lpg_3kg_total} Pangkalan LPG 3 Kg</p>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


