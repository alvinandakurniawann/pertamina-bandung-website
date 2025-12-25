"use client"
import React, { useCallback, useEffect, useState, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MapInteractive from '@/components/MapInteractive';

type AnimatedCounterProps = {
  value: number
  duration?: number
}

function AnimatedCounter({ value, duration = 1000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
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

    // Cleanup
    return () => {
      setCount(end);
    };
  }, [value, duration]);

  return (
    <span className="counter">{count.toLocaleString('de')}</span>
  );
}

export default function PetaOverviewClient() {
  const [currentKey, setCurrentKey] = useState<string>('ALL')
  const [currentName, setCurrentName] = useState<string>('Semua Wilayah')
  const [stats, setStats] = useState({
    spbu_total:0,
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
  const [activeSVG, setActiveSVG] = useState<string | null>(null);
  const [debugOn, setDebugOn] = useState<boolean>(false)
  const [canShowDebugToggle, setCanShowDebugToggle] = useState<boolean>(false)

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
      // ignore - keep defaults
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats('ALL') }, [fetchStats])

  // Detect debug/edit mode from URL params
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const v = sp.get('debug') === '1' || sp.get('edit') === '1'
    setDebugOn(v)
    setCanShowDebugToggle(v)
  }, [])

  const handleSelect = useCallback((key: string, displayName: string) => {
    setCurrentKey(key);
    setCurrentName(displayName);
    fetchStats(key); // ini akan update stats sesuai wilayah
    // Nonaktifkan SVG overlay karena sekarang menggunakan popup di dalam map
    // setActiveSVG(key !== 'ALL' ? `/wilayah-${key.toLowerCase()}.svg` : null);
    setActiveSVG(null);
  }, [fetchStats]);

  const handleResetSVG = () => {
    setActiveSVG(null);
    setCurrentKey('ALL');
    setCurrentName('Semua Wilayah');
    fetchStats('ALL');
  };


  return (
    <>
    <Header />
    <main className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Hero */}
      <section className="pt-[30px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#2a82bf]">Overview Wilayah dan Outlet SA Bandung - Priangan Timur</h1>
          <p className="mt-4 text-base leading-4 tracking-wide md:text-base text-black/80"></p>
        </div>
      </section>

      {/* Map section */}
      {/* Map section */}
      <section className="pb-8 pt-0">
        <div className="container mx-auto px-4">
          <div className="p-0 bg-transparent border-0 shadow-none relative">
            {/* Map */}
            <MapInteractive 
              onSelect={handleSelect}
              stats={stats}
              currentName={currentName}
              currentKey={currentKey}
            />

            {/* Pop-up frame (buka kalau ada wilayah terpilih) */}
            {activeSVG && (
              <div className="absolute inset-0 flex justify-center items-center z-[1000]">
                <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative">
                  {/* Tombol close */}
                  <button
                    onClick={handleResetSVG}
                    className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    &times;
                  </button>

                  {/* Mapping nama wilayah */}
                  <h2 className="text-xl font-bold mb-4 text-center">
                    {{
                      bandung: "Kota Bandung",
                      "kab-bandung": "Kabupaten Bandung",
                      "kab-bandung-barat": "Kabupaten Bandung Barat",
                      garut: "Kabupaten Garut",
                      pangandaran: "Kabupaten Pangandaran",
                      tasikmalaya: "Kabupaten Tasikmalaya",
                      ciamis: "Kabupaten Ciamis",
                      "kota-tasik": "Kota Tasikmalaya",
                      banjar: "Kota Banjar",
                      cimahi: "Kota Cimahi",
                    }[activeSVG.replace("/wilayah-", "").replace(".svg", "")] ||
                      "Wilayah Tidak Dikenal"}
                  </h2>

                  {/* Daftar fasilitas */}
                  <ul className="space-y-2 text-gray-700">
                    <li>SPBU</li>
                    <li>SPBE</li>
                    <li>Pertashop</li>
                    <li>Agen LPG</li>
                    <li>Pangkalan LPG</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Debug toggle (hanya muncul saat ?debug=1 atau ?edit=1) */}

      <section className='hidden'>
          {/* Banner Section */}
        <div className="flex justify-center items-center" style={{ marginTop: '150px', marginBottom: '200px', backgroundImage: "url('/banner.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: '450px', position: 'relative', width: '100%' }}>
          <div className="top-[50px] left-0 p-8 w-full text-white">
            <h1 className='mb-[21px] font-bold text-3xl'>LOREM IPSUM</h1>
            <p className='text-base'>asfjlasfaksflasf</p>
           <div className='flex justify-center items-center mt-[127px]'> 
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#ffffffb5] text-black rounded-lg p-4 shadow-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">Judul 1</h3>
                  <p className="text-sm">Deskripsi singkat konten pertama.</p>
                </div>
                <div className="bg-[#ffffffb5] text-black rounded-lg p-4 shadow-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">Judul 2</h3>
                  <p className="text-sm">Deskripsi singkat konten kedua.</p>
                </div>
                <div className="bg-[#ffffffb5] text-black rounded-lg p-4 shadow-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">Judul 3</h3>
                  <p className="text-sm">Deskripsi singkat konten ketiga.</p>
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

