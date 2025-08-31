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
  const [loading, setLoading] = useState(false)
  const [activeSVG, setActiveSVG] = useState<string | null>(null);

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
        })
      }
    } catch (e) {
      // ignore - keep defaults
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats('ALL') }, [fetchStats])

  const handleSelect = useCallback((key: string, displayName: string) => {
    setCurrentKey(key);
    setCurrentName(displayName);
    fetchStats(key);
    if (key !== 'ALL') {
      setActiveSVG(`/wilayah-${key.toLowerCase()}.svg`);
    }
  }, [fetchStats]);

  const handleResetSVG = () => {
    setActiveSVG(null);
    setCurrentKey('ALL');
    setCurrentName('Semua Wilayah');
    fetchStats('ALL');
  };

  // ✅ Tambahan untuk popup
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const openModal = (id: string) => setActiveModal(id)
  const closeModal = () => setActiveModal(null)

  // Contoh data lokasi SPBU, ganti dengan data asli jika ada
  const [spbuLocations] = useState([
    { name: "SPBU Dipatiukur 1", type: "CODO", address: "Jl. Soekarno-Hatta No. 112", status: "on" },
    { name: "SPBU Dipatiukur 1", type: "DODO", address: "Jl. Dipatiukur No. 5", status: "on" },
    { name: "SPBU Dipatiukur 2", type: "COCO", address: "Jl. Cipamokolan no. 84", status: "off" },
  ]);

  return (
    <>
    <Header />
    <main className="min-h-screen bg-white text-black overflow-x-hidden">
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
          <div className="p-0 bg-transparent border-0 shadow-none relative">
            {!activeSVG ? (
              <MapInteractive onSelect={handleSelect} />
            ) : (
              <div className="relative flex justify-center items-center min-h-[400px]">
                {/* Blur background SVG */}
                <div className="absolute inset-0 z-0 flex justify-center items-center">
                  <img
                    src={activeSVG}
                    alt="Wilayah"
                    className="w-full max-w-[600px] h-auto"
                  />
                </div>
                {/* Label nama wilayah tanpa border/card */}
                {/* Tombol reset */}
                <button
                  onClick={handleResetSVG}
                  className="absolute top-4 right-4 bg-white rounded-full shadow p-2 text-black hover:bg-gray-200 text-xl z-20"
                  aria-label="Reset"
                >
                  &times;
                </button>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-8 mt-[50px]">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: SPBU */}
          <div className="relative h-[320px] rounded-lg overflow-hidden bg-[#000000] shadow-lg group cursor-pointer"
            onClick={() => openModal('spbu')}>
            {/* Tampilan Awal */}
            <img
              src="/card.jpg"
              alt="SPBU"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBU</h4>
              <p className="text-lg opacity-90">{stats.spbu_total} SPBU</p>
            </div>

            {/* Tampilan Hover dengan SVG */}
            <div className="absolute inset-0 text-white flex flex-col justify-start gap-[10px] p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#172027e3", // warna dasar
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
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer"
            onClick={() => openModal('pertashop')}>
            <img
              src="/card.jpg"
              alt="Pertashop"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pertashop</h4>
              <p className="text-lg opacity-90">{stats.pertashop_total} Pertashop</p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#522222a9", // warna dasar
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
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer"
            onClick={() => openModal('spbe')}>
            <img
              src="/card.jpg"
              alt="SPBE"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">SPBE</h4>
              <p className="text-lg opacity-90">{stats.spbe_pso_total + stats.spbe_npso_total} SPBE</p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3242189d", // warna dasar
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
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer"
            onClick={() => openModal('agen')}>
            <img
              src="/card.jpg"
              alt="Agen LPG"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Agen LPG</h4>
              <p className="text-lg opacity-90">{stats.agen_lpg_3kg_total} Agen LPG</p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3d3d3d94", // warna dasar
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
          <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer group"
            onClick={() => openModal('pangkalan')}>
            <img
              src="/card.jpg"
              alt="Pangkalan LPG"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
              <h4 className="text-xl font-semibold">Pangkalan LPG</h4>
              <p className="text-lg opacity-90">{stats.pangkalan_lpg_3kg_total} Pangkalan</p>
            </div>
            <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
                backgroundImage: "url('/hovercard.svg')",
                backgroundColor: "#3d290396", // warna dasar
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

      {/* ✅ POPUP */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/95 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[1024px] max-w-[90%] relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>

            {activeModal === 'spbu' && (
              <div className="bg-white p-8  rounded-xl shadow-lg mx-auto relative">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Statistik */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Statistik</h2>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-lg bg-red-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-red-700">SPBU COCO</span>
                        <span className="font-bold text-xl">{stats.spbu_coco ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-green-700">SPBU DODO</span>
                        <span className="font-bold text-xl">{stats.spbu_dodo ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-blue-700">SPBU CODO</span>
                        <span className="font-bold text-xl">{stats.spbu_codo ?? '-'}</span>
                      </div>
                      <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
                        <span className="font-semibold text-yellow-700">TOTAL LOKASI</span>
                        <span className="font-bold text-xl">{stats.spbu_total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Daftar Lokasi */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
                    <div className="flex flex-col gap-4">
                      {spbuLocations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          {/* SVG Segitiga tanda seru */}
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
                          </svg>
                          <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
                        </div>
                      ) : (
                        spbuLocations.map((loc, idx) => (
                          <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">{loc.name}</span>
                                <div className={`mt-1 font-semibold ${loc.type === "DODO" ? "text-green-700" : loc.type === "COCO" ? "text-red-700" : "text-blue-700"}`}>{loc.type}</div>
                                <div className="text-sm text-gray-600">{loc.address}</div>
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
                {/* Tombol Kembali */}
                <button
                  onClick={closeModal}
                  className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
                >
                  Kembali
                </button>
              </div>
            )}

            {activeModal === 'pertashop' && (
              <>
                <h2 className="text-xl font-bold mb-4">Detail Pertashop</h2>
                <p>Total Pertashop: {stats.pertashop_total}</p>
              </>
            )}

            {activeModal === 'spbe' && (
              <>
                <h2 className="text-xl font-bold mb-4">Detail SPBE</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>SPBE PSO: {stats.spbe_pso_total}</li>
                  <li>SPBE NPSO: {stats.spbe_npso_total}</li>
                </ul>
              </>
            )}

            {activeModal === 'agen' && (
              <>
                <h2 className="text-xl font-bold mb-4">Detail Agen LPG</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Agen LPG 3 Kg: {stats.agen_lpg_3kg_total}</li>
                  <li>LPG NPSO: {stats.lpg_npso_total}</li>
                </ul>
              </>
            )}

            {activeModal === 'pangkalan' && (
              <>
                <h2 className="text-xl font-bold mb-4">Detail Pangkalan LPG</h2>
                <p>Pangkalan LPG 3 Kg: {stats.pangkalan_lpg_3kg_total}</p>
              </>
            )}
          </div>
        </div>
      )}

      <section className='hidden'>
          {/* Banner Section */}
        <div className="flex justify-center items-center" style={{ marginTop: '150px', marginBottom: '200px', backgroundImage: "url('/banner.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: '450px', position: 'relative', width: '100%' }}>
          <div className="top-[50px] left-0 p-8 w-full text-white">
            <h1 className='mb-[21px] font-bold text-3xl'>LOREM IPSUM</h1>
            <p className='text-base'>asfjlasfaksflasf</p>
           <div className='flex justify-center items-center mt-[127px]'> 
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-40 justify-center ">
                <div className='border-b'>
                  <h1 className='text-4xl font-bold '>512</h1>
                  <p className='w-[300px] mt-[5px]'>Number of One-Price Fuel Distribution Points across Indonesia</p>
                </div>
                <div className='border-b'>
                  <h1 className='text-4xl font-bold'>512</h1>
                  <p className='mt-[5px] w-[300px]'>Number of One-Price Fuel Distribution Points across Indonesia</p>
                </div><div className='border-b'>
                  <h1 className='text-4xl font-bold '>512</h1>
                  <p className='w-[300px] mt-[5px]'>Number of One-Price Fuel Distribution Points across Indonesia</p>
                </div>
                </div>  
              </div>
            </div>
          </div>
      </section>
    </main>
    <Footer />
    </>
  )
}

