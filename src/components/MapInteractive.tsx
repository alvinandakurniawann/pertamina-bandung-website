"use client"
import React, { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

/* ---------- KOMPONEN MAP ---------- */
type Props = {
  onSelect?: (key: string, displayName: string) => void
  stats?: any
  currentName?: string
  currentKey?: string
}

type AnimatedCounterProps = {
  value: number
  duration?: number
}

function AnimatedCounter({ value, duration = 1000 }: AnimatedCounterProps) {
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

type MarkerData = {
  id: string
  name: string
  latitude: number
  longitude: number
  color?: string
}

function MapInteractiveComponent({ onSelect, stats, currentName = 'Semua Wilayah', currentKey = 'ALL' }: Props) {
  // Default stats jika tidak ada
  const defaultStats = {
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
  }
  const safeStats = stats || defaultStats
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  
  // Debug: cek apakah token ter-load (hanya log prefix untuk security)
  useEffect(() => {
    if (!mapboxToken) {
      console.warn('⚠️ NEXT_PUBLIC_MAPBOX_TOKEN tidak ditemukan! Pastikan token ada di .env.local dan restart dev server.')
    } else {
      console.log('✅ Mapbox token ter-load:', mapboxToken.substring(0, 20) + '...')
    }
  }, [mapboxToken])
  
  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded">
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold mb-2">⚠️ Mapbox Token Tidak Ditemukan</p>
          <p className="text-sm text-gray-600 mb-4">
            Pastikan <code className="bg-gray-200 px-2 py-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> ada di <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
          </p>
          <p className="text-xs text-gray-500">Restart dev server setelah menambah token di .env.local</p>
        </div>
      </div>
    )
  }
  
  const [viewState, setViewState] = useState({
    longitude: 107.60981,
    latitude: -6.914744,
    zoom: 9
  })

  const [markers, setMarkers] = useState<MarkerData[]>([])
  const [loadingMarkers, setLoadingMarkers] = useState(true)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [markerStats, setMarkerStats] = useState<Record<string, any>>({})

  // Load markers dari database
  useEffect(() => {
    async function loadMarkers() {
      try {
        console.log('🔄 Memuat markers dari database...')
        const res = await fetch('/api/regions', { cache: 'no-store' })
        const json = await res.json()
        console.log('📦 Response dari /api/regions:', json)
        
        if (json?.data) {
          const validMarkers = json.data
            .filter((r: any) => r.latitude && r.longitude)
            .map((r: any) => ({
              id: r.id,
              name: r.name,
              latitude: Number(r.latitude),
              longitude: Number(r.longitude),
              color: r.color,
            }))
          console.log(`✅ Berhasil memuat ${validMarkers.length} marker:`, validMarkers.map(m => m.name))
          setMarkers(validMarkers)
          
          if (validMarkers.length === 0) {
            console.warn('⚠️ Tidak ada marker yang ditemukan. Pastikan:')
            console.warn('   1. Migration SQL sudah dijalankan di Supabase')
            console.warn('   2. Kolom latitude dan longitude sudah ada di tabel regions')
            console.warn('   3. Data regions sudah memiliki koordinat')
          }
        } else {
          console.warn('⚠️ Response tidak memiliki data:', json)
        }
      } catch (e) {
        console.error('❌ Error loading markers:', e)
      } finally {
        setLoadingMarkers(false)
      }
    }
    loadMarkers()
  }, [])

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const openModal = (id: string) => setActiveModal(id)
  const closeModal = () => setActiveModal(null)
  const [locations, setLocations] = useState<any[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  // Fetch locations berdasarkan type dan region
  useEffect(() => {
    if (activeModal && currentKey !== 'ALL') {
      const locationType = activeModal === 'spbu' ? 'SPBU' :
                          activeModal === 'pertashop' ? 'PERTASHOP' :
                          activeModal === 'spbe' ? 'SPBE' :
                          activeModal === 'agen' ? 'AGEN_LPG' :
                          activeModal === 'pangkalan' ? 'PANGKALAN' : null

      if (locationType) {
        setLoadingLocations(true)
        fetch(`/api/locations?region_id=${currentKey}&type=${locationType}`)
          .then(res => res.json())
          .then(data => {
            setLocations(data.data || [])
            setLoadingLocations(false)
          })
          .catch(err => {
            console.error('Error fetching locations:', err)
            setLocations([])
            setLoadingLocations(false)
          })
      }
    } else {
      setLocations([])
    }
  }, [activeModal, currentKey])

  return (
    <>
      <div style={{ height: '500px', width: '100%', position: 'relative' }}>
        {loadingMarkers ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
            <p className="text-gray-600">Memuat peta...</p>
          </div>
        ) : (
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={mapboxToken}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
          >
            {markers.map((marker, i) => (
          <Marker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor="bottom"
                onClick={async (e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedMarker(marker.id)
                  // Jangan panggil onSelect untuk mencegah popup ganda
                  // if (onSelect) onSelect(marker.id, marker.name)
                  
                  // Fetch stats untuk marker ini jika belum ada
                  if (!markerStats[marker.id]) {
                    try {
                      const res = await fetch(`/api/region-stats?key=${encodeURIComponent(marker.id)}`, { cache: 'no-store' })
                      const json = await res.json()
                      if (json?.data) {
                        setMarkerStats(prev => ({
                          ...prev,
                          [marker.id]: json.data
                        }))
                      }
                    } catch (e) {
                      console.error('Error fetching marker stats:', e)
                    }
                  }
                }}
              >
                <div
                  className="cursor-pointer"
                  style={{
                    backgroundColor: marker.color || '#3B82F6',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {i + 1}
              </div>
          </Marker>
        ))}

            {selectedMarker && markers.find(m => m.id === selectedMarker) && (() => {
              const marker = markers.find(m => m.id === selectedMarker)!
              const stats = markerStats[marker.id] || safeStats
              return (
                <Popup
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  anchor="bottom"
                  onClose={() => {
                    setSelectedMarker(null)
                    // Jangan reset ke ALL untuk mencegah popup ganda
                    // if (onSelect) onSelect('ALL', 'Semua Wilayah')
                  }}
                  closeButton={true}
                  closeOnClick={false}
                  style={{ padding: 0 }}
                >
                  <div className="bg-white rounded-3xl shadow-2xl p-4 min-w-[220px] max-w-[260px] relative">
                    <h3 className="text-base font-bold mb-3 text-center text-gray-800 pr-7 leading-tight">{marker.name}</h3>
                    {markerStats[marker.id] ? (
                      <div className="text-xs text-gray-700 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-semibold">SPBU: <span className="font-normal">{stats.spbu_total ?? 0}</span></div>
                          <div className="text-red-600 font-semibold">COCO: <span className="font-normal">{stats.spbu_coco ?? 0}</span></div>
                          <div className="text-blue-600 font-semibold">CODO: <span className="font-normal">{stats.spbu_codo ?? 0}</span></div>
                          <div className="text-green-600 font-semibold">DODO: <span className="font-normal">{stats.spbu_dodo ?? 0}</span></div>
                        </div>
                        <div className="border-t pt-2 mt-2 space-y-1.5">
                          <div><span className="font-semibold">Pertashop:</span> <span className="ml-2">{stats.pertashop_total ?? 0}</span></div>
                          <div><span className="font-semibold">SPBE:</span> <span className="ml-2">{(stats.spbe_pso_total ?? 0) + (stats.spbe_npso_total ?? 0)}</span> <span className="text-[10px] text-gray-500">(PSO: {stats.spbe_pso_total ?? 0}, NPSO: {stats.spbe_npso_total ?? 0})</span></div>
                          <div><span className="font-semibold">Agen LPG:</span> <span className="ml-2">{stats.agen_lpg_3kg_total ?? 0}</span></div>
                          <div><span className="font-semibold">Pangkalan LPG:</span> <span className="ml-2">{stats.pangkalan_lpg_3kg_total ?? 0}</span></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">Statistik belum tersedia.<br />Tambahkan di halaman Region Stats.</p>
                    )}
                  </div>
                </Popup>
              )
            })()}
          </Map>
        )}
      </div>

      {/* Cards */}
      <section className="py-8 mt-[50px]">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" >
          {/* Card 1: SPBU */}
          <div className="relative h-[320px] rounded-lg overflow-hidden bg-[#000000] shadow-xl group cursor-pointer" onClick={() => setActiveModal('spbu')} >
            <img
              src="/spbu.jpg"
              alt="SPBU"
              className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBU</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={safeStats.spbu_total} duration={1000} /> SPBU
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
                <li>{safeStats.spbu_coco} Unit SPBU COCO</li>
                <li>{safeStats.spbu_dodo} Unit SPBU DODO</li>
                <li>{safeStats.spbu_codo} Unit SPBU CODO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 2: Pertashop */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("pertashop")}>
            <img
              src="/pertashop.jpg"
              alt="Pertashop"
              className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pertashop</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={safeStats.pertashop_total} duration={1000} /> Pertashop
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
              <p className="text-sm text-center mt-[10px]">Total {safeStats.pertashop_total} Unit</p>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 3: SPBE */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("spbe")}>
            <img
              src="/spbe.jpg"
              alt="SPBE"
              className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBE</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={safeStats.spbe_pso_total + safeStats.spbe_npso_total} duration={1000} /> SPBE
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
                <li>{safeStats.spbe_pso_total} SPBE PSO</li>
                <li>{safeStats.spbe_npso_total} SPBE NPSO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 4: Agen LPG */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("agen")}>
            <img
              src="/agenlpg.jpg"
              alt="Agen LPG"
              className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Agen LPG</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={safeStats.agen_lpg_3kg_total} duration={1000} /> Agen LPG
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
                <li>{safeStats.agen_lpg_3kg_total} Agen LPG 3 Kg</li>
                <li>{safeStats.lpg_npso_total} LPG NPSO</li>
              </ul>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>

          {/* Card 5: Pangkalan LPG */}
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer group" onClick={() => setActiveModal("pangkalan")}>
            <img
              src="/pangkalanlpg.jpg"
              alt="Pangkalan LPG"
              className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pangkalan LPG</h4>
              <p className="text-lg opacity-90">
                <AnimatedCounter value={safeStats.pangkalan_lpg_3kg_total} duration={1000} /> Pangkalan
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
              <p className="text-sm text-center mt-[10px]">{safeStats.pangkalan_lpg_3kg_total} Pangkalan LPG 3 Kg</p>
              <div className='flex flex-col justify-end items-end mt-auto'>
                <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {activeModal && (
        <div className="fixed inset-0 bg-black/95 bg-opacity-90 pt-[75px] flex justify-center items-center z-1001">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[1024px] max-w-[90%] relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>

            {/* SPBU */}
            {activeModal === 'spbu' && (
              <div className="bg-white p-8 rounded-xl max-h-[450px] shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Statistik */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-red-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-red-700">SPBU COCO</span>
                        <span className="font-bold text-xl">{safeStats.spbu_coco ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-green-700">SPBU DODO</span>
                        <span className="font-bold text-xl">{safeStats.spbu_dodo ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-blue-700">SPBU CODO</span>
                        <span className="font-bold text-xl">{safeStats.spbu_codo ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-yellow-700">TOTAL LOKASI</span>
                        <span className="font-bold text-xl">{safeStats.spbu_total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Daftar Lokasi */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div
                      className="flex flex-col gap-4 overflow-y-auto"
                      style={{ maxHeight: "300px" }}
                    >
                      {loadingLocations ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <span className="text-gray-500 font-semibold">Memuat data...</span>
                        </div>
                      ) : locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                          <span className="mt-1 text-xs text-gray-400">Coba scrape data di halaman /crud/scrape</span>
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <div key={loc.id} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                {loc.spbu_type && (
                                  <div className={`mt-1 font-semibold ${loc.spbu_type === "DODO" ? "text-green-700" : loc.spbu_type === "COCO" ? "text-red-700" : "text-blue-700"}`}>{loc.spbu_type}</div>
                                )}
                                <div className="text-sm text-gray-600">{loc.address || 'Alamat tidak tersedia'}</div>
                                {loc.phone && (
                                  <div className="text-xs text-gray-500 mt-1">📞 {loc.phone}</div>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
                                  <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
                                </span>
                                {loc.google_rating && (
                                  <span className="text-xs text-gray-500 mt-1">⭐ {loc.google_rating} ({loc.google_user_ratings_total || 0})</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                >
                  Kembali
                </button>
              </div>
            )}

            {/* Pertashop */}
            {activeModal === 'pertashop' && (
              <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-blue-700">TOTAL PERTASHOP</span>
                        <span className="font-bold text-xl">{stats.pertashop_total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div className="flex flex-col gap-4">
                      {loadingLocations ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <span className="text-gray-500 font-semibold">Memuat data...</span>
                        </div>
                      ) : locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <div key={loc.id} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                <div className="text-sm text-gray-600">{loc.address || 'Alamat tidak tersedia'}</div>
                                {loc.phone && <div className="text-xs text-gray-500 mt-1">📞 {loc.phone}</div>}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
                                  <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition">Kembali</button>
              </div>
            )}

            {/* SPBE */}
            {activeModal === 'spbe' && (
              <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-green-700">SPBE PSO</span>
                        <span className="font-bold text-xl">{stats.spbe_pso_total ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-yellow-700">SPBE NPSO</span>
                        <span className="font-bold text-xl">{stats.spbe_npso_total ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-blue-700">TOTAL SPBE</span>
                        <span className="font-bold text-xl">{(stats.spbe_pso_total ?? 0) + (stats.spbe_npso_total ?? 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div className="flex flex-col gap-4">
                      {loadingLocations ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <span className="text-gray-500 font-semibold">Memuat data...</span>
                        </div>
                      ) : locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <div key={loc.id} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                <div className="text-sm text-gray-600">{loc.address || 'Alamat tidak tersedia'}</div>
                                {loc.phone && <div className="text-xs text-gray-500 mt-1">📞 {loc.phone}</div>}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
                                  <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition">Kembali</button>
              </div>
            )}

            {/* Agen LPG */}
            {activeModal === 'agen' && (
              <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-green-700">AGEN LPG 3 KG</span>
                        <span className="font-bold text-xl">{stats.agen_lpg_3kg_total ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-blue-700">LPG NPSO</span>
                        <span className="font-bold text-xl">{stats.lpg_npso_total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div className="flex flex-col gap-4">
                      {loadingLocations ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <span className="text-gray-500 font-semibold">Memuat data...</span>
                        </div>
                      ) : locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <div key={loc.id} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                <div className="text-sm text-gray-600">{loc.address || 'Alamat tidak tersedia'}</div>
                                {loc.phone && <div className="text-xs text-gray-500 mt-1">📞 {loc.phone}</div>}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
                                  <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition">Kembali</button>
              </div>
            )}

            {/* Pangkalan LPG */}
            {activeModal === 'pangkalan' && (
              <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-yellow-700">TOTAL PANGKALAN</span>
                        <span className="font-bold text-xl">{stats.pangkalan_lpg_3kg_total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div className="flex flex-col gap-4">
                      {loadingLocations ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <span className="text-gray-500 font-semibold">Memuat data...</span>
                        </div>
                      ) : locations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                        </div>
                      ) : (
                        locations.map((loc) => (
                          <div key={loc.id} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                <div className="text-sm text-gray-600">{loc.address || 'Alamat tidak tersedia'}</div>
                                {loc.phone && <div className="text-xs text-gray-500 mt-1">📞 {loc.phone}</div>}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
                                  <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition">Kembali</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MapInteractiveComponent
