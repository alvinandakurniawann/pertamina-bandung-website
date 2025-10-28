"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

interface Props {
  onSelect: (city: string, name: string) => void;
  stats?: any;
  currentName?: string;
}

function MapInteractive({ onSelect, stats, currentName }: Props) {
  const position: [number, number] = [-7.08313, 108.184514];
  const [geojsonData, setGeojsonData] = useState<any>(null);

  useEffect(() => {
    fetch("/map.geojson")
      .then((res) => res.json())
      .then((json) => {
        console.log("✅ GeoJSON Loaded:", json);
        setGeojsonData(json);
      })
      .catch((err) => console.error("❌ Error loading GeoJSON:", err));
  }, []);

  // Fungsi untuk menentukan ikon berdasarkan tipe lokasi
  const getIcon = (props: any) => {
    const kategori =
      props["Customer group"]?.toLowerCase() ||
      props["Category"]?.toLowerCase() ||
      "";

    let iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
    let color = "";

    if (kategori.includes("spbu")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/3097/3097144.png"; // pom bensin
      color = "#FFD700";
    } else if (kategori.includes("pertashop")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/4149/4149677.png"; // toko kecil
      color = "#FF3B30";
    } else if (kategori.includes("spbe")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/992/992651.png"; // gas
      color = "#007BFF";
    } else if (kategori.includes("agen")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/1170/1170678.png"; // orang toko
      color = "#28A745";
    } else if (kategori.includes("bpt")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/2331/2331942.png"; // kantor
      color = "#8A2BE2";
    } else if (kategori.includes("pso")) {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/1998/1998613.png"; // distribusi
      color = "#FF8C00";
    } else {
      iconUrl = "https://cdn-icons-png.flaticon.com/512/252/252025.png"; // titik default
      color = "#666";
    }

    return new L.Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -30],
      className: "marker-" + color,
    });
  };

  return (
    <div>
      <MapContainer center={position} zoom={9} style={{ height: "500px" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geojsonData?.features?.map((f: any, idx: number) => {
          const coords = f.geometry?.coordinates;
          if (!coords || coords.length < 2) return null;

          const lon = coords[0];
          const lat = coords[1];
          const props = f.properties || {};
          const name = props.name || "Tanpa Nama";
          const kota = props["Kab / Kota"] || "-";
          const rayon = props["Rayon"] || "-";

          return (
            <Marker
              key={idx}
              position={[lat, lon]}
              icon={getIcon(props)}
              eventHandlers={{
                click: () => onSelect(kota, kota),
              }}
            >
              <Tooltip direction="top">{name}</Tooltip>
              <Popup>
                <div className="text-xs">
                  <p>
                    <b>{name}</b>
                  </p>
                  <p>Kota: {kota}</p>
                  <p>Rayon: {rayon}</p>
                  <hr />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props?.description?.value || "",
                    }}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapInteractive;








      // {/* Cards */}
      // <section className="py-8 mt-[50px]">
      //   <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" >
      //     {/* Card 1: SPBU */}
      //     <div className="relative h-[320px] rounded-lg overflow-hidden bg-[#000000] shadow-xl group cursor-pointer" onClick={() => setActiveModal('spbu')} >
      //       <img
      //         src="/spbu.jpg"
      //         alt="SPBU"
      //         className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
      //       />
      //       <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
      //         <h4 className="text-xl font-semibold">SPBU</h4>
      //         <p className="text-lg opacity-90">
      //           <AnimatedCounter value={stats.spbu_total} duration={1000} /> SPBU
      //         </p>
      //       </div>
      //       <div className="absolute inset-0 text-white flex flex-col justify-start gap-[10px] p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
      //         style={{
      //           backgroundImage: "url('/hovercard.svg')",
      //           backgroundColor: "#172027e3",
      //           backgroundSize: "cover",
      //           backgroundRepeat: "no-repeat",
      //         }}
      //       >
      //         <h4 className="text-xl font-semibold border-b gap-[5px] text-center mb-4">SPBU</h4>
      //         <ul className="space-y-3 text-sm flex flex-col gap-[10px] text-center">
      //           <li>{stats.spbu_coco} Unit SPBU COCO</li>
      //           <li>{stats.spbu_dodo} Unit SPBU DODO</li>
      //           <li>{stats.spbu_codo} Unit SPBU CODO</li>
      //         </ul>
      //         <div className='flex flex-col justify-end items-end mt-auto'>
      //           <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
      //         </div>
      //       </div>
      //     </div>

      //     {/* Card 2: Pertashop */}
      //     <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("pertashop")}>
      //       <img
      //         src="/pertashop.jpg"
      //         alt="Pertashop"
      //         className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
      //       />
      //       <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
      //         <h4 className="text-xl font-semibold">Pertashop</h4>
      //         <p className="text-lg opacity-90">
      //           <AnimatedCounter value={stats.pertashop_total} duration={1000} /> Pertashop
      //         </p>
      //       </div>
      //       <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
      //         style={{
      //           backgroundImage: "url('/hovercard.svg')",
      //           backgroundColor: "#522222a9",
      //           backgroundSize: "cover",
      //           backgroundRepeat: "no-repeat",
      //         }} >
      //         <h4 className="text-xl font-semibold border-b text-center mb-4">Pertashop</h4>
      //         <p className="text-sm text-center mt-[10px]">Total {stats.pertashop_total} Unit</p>
      //         <div className='flex flex-col justify-end items-end mt-auto'>
      //           <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
      //         </div>
      //       </div>
      //     </div>

      //     {/* Card 3: SPBE */}
      //     <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("spbe")}>
      //       <img
      //         src="/spbe.jpg"
      //         alt="SPBE"
      //         className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
      //       />
      //       <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
      //         <h4 className="text-xl font-semibold">SPBE</h4>
      //         <p className="text-lg opacity-90">
      //           <AnimatedCounter value={stats.spbe_pso_total + stats.spbe_npso_total} duration={1000} /> SPBE
      //         </p>
      //       </div>
      //       <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      //         style={{
      //           backgroundImage: "url('/hovercard.svg')",
      //           backgroundColor: "#3242189d",
      //           backgroundSize: "cover",
      //           backgroundRepeat: "no-repeat",
      //         }}
      //       >
      //         <h4 className="text-xl border-b font-semibold text-center mb-4">SPBE</h4>
      //         <ul className="space-y-3 text-sm text-center gap-[10px] mt-[10px] flex flex-col">
      //           <li>{stats.spbe_pso_total} SPBE PSO</li>
      //           <li>{stats.spbe_npso_total} SPBE NPSO</li>
      //         </ul>
      //         <div className='flex flex-col justify-end items-end mt-auto'>
      //           <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
      //         </div>
      //       </div>
      //     </div>

      //     {/* Card 4: Agen LPG */}
      //     <div className="relative w-full h-[320px] rounded-lg overflow-hidden shadow-lg bg-black group cursor-pointer" onClick={() => setActiveModal("agen")}>
      //       <img
      //         src="/agenlpg.jpg"
      //         alt="Agen LPG"
      //         className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
      //       />
      //       <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
      //         <h4 className="text-xl font-semibold">Agen LPG</h4>
      //         <p className="text-lg opacity-90">
      //           <AnimatedCounter value={stats.agen_lpg_3kg_total} duration={1000} /> Agen LPG
      //         </p>
      //       </div>
      //       <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      //         style={{
      //           backgroundImage: "url('/hovercard.svg')",
      //           backgroundColor: "#3d3d3d94",
      //           backgroundSize: "cover",
      //           backgroundRepeat: "no-repeat",
      //         }}
      //       >
      //         <h4 className="text-xl font-semibold border-b text-center mb-4">Agen LPG</h4>
      //         <ul className="space-y-3 text-sm text-center gap-[10px] mt-[10px] flex flex-col">
      //           <li>{stats.agen_lpg_3kg_total} Agen LPG 3 Kg</li>
      //           <li>{stats.lpg_npso_total} LPG NPSO</li>
      //         </ul>
      //         <div className='flex flex-col justify-end items-end mt-auto'>
      //           <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
      //         </div>
      //       </div>
      //     </div>

      //     {/* Card 5: Pangkalan LPG */}
      //     <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer group" onClick={() => setActiveModal("pangkalan")}>
      //       <img
      //         src="/pangkalanlpg.jpg"
      //         alt="Pangkalan LPG"
      //         className="w-full h-full object-cover filter brightness-50 transition-opacity duration-500 group-hover:brightness-0"
      //       />
      //       <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 text-white transition-opacity duration-500 group-hover:opacity-0">
      //         <h4 className="text-xl font-semibold">Pangkalan LPG</h4>
      //         <p className="text-lg opacity-90">
      //           <AnimatedCounter value={stats.pangkalan_lpg_3kg_total} duration={1000} /> Pangkalan
      //         </p>
      //       </div>
      //       <div className="absolute inset-0 text-white flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      //         style={{
      //           backgroundImage: "url('/hovercard.svg')",
      //           backgroundColor: "#3d290396",
      //           backgroundSize: "cover",
      //           backgroundRepeat: "no-repeat",
      //         }}
      //       >
      //         <h4 className="text-xl font-semibold text-center border-b mb-4">Pangkalan LPG</h4>
      //         <p className="text-sm text-center mt-[10px]">{stats.pangkalan_lpg_3kg_total} Pangkalan LPG 3 Kg</p>
      //         <div className='flex flex-col justify-end items-end mt-auto'>
      //           <a href="#"><svg className='w-[40px] h-[40px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg></a>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </section>
      // {activeModal && (
      //   <div className="fixed inset-0 bg-black/95 bg-opacity-90 pt-[75px] flex justify-center items-center z-1001">
      //     <div className="bg-white p-6 rounded-lg shadow-lg w-[1024px] max-w-[90%] relative">
      //       <button
      //         onClick={closeModal}
      //         className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
      //       >
      //         &times;
      //       </button>

      //       {/* SPBU */}
      //       {activeModal === 'spbu' && (
      //         <div className="bg-white p-8 rounded-xl max-h-[450px] shadow-lg mx-auto relative">
      //           <div className="flex flex-col md:flex-row gap-8">
      //             {/* Statistik */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Statistik</h2>
      //               <div className="flex flex-col gap-3">
      //                 <div className="rounded-lg bg-red-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-red-700">SPBU COCO</span>
      //                   <span className="font-bold text-xl">{stats.spbu_coco ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-green-700">SPBU DODO</span>
      //                   <span className="font-bold text-xl">{stats.spbu_dodo ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-blue-700">SPBU CODO</span>
      //                   <span className="font-bold text-xl">{stats.spbu_codo ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-yellow-700">TOTAL LOKASI</span>
      //                   <span className="font-bold text-xl">{stats.spbu_total ?? '-'}</span>
      //                 </div>
      //               </div>
      //             </div>
      //             {/* Daftar Lokasi */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
      //               <div
      //                 className="flex flex-col gap-4 overflow-y-auto"
      //                 style={{ maxHeight: "300px" }} // atur tinggi sesuai kebutuhan
      //               >
      //                 {spbuLocations.length === 0 ? (
      //                   <div className="flex flex-col items-center justify-center py-8">
      //                     {/* SVG Segitiga tanda seru */}
      //                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      //                       <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
      //                       <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
      //                     </svg>
      //                     <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
      //                   </div>
      //                 ) : (
      //                   spbuLocations.map((loc, idx) => (
      //                     <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
      //                       <div className="flex justify-between items-center">
      //                         <div>
      //                           <span className="font-bold text-lg">{loc.name}</span>
      //                           <div className={`mt-1 font-semibold ${loc.type === "DODO" ? "text-green-700" : loc.type === "COCO" ? "text-red-700" : "text-blue-700"}`}>{loc.type}</div>
      //                           <div className="text-sm text-gray-600">{loc.address}</div>
      //                         </div>
      //                         <div className="flex flex-col items-end">
      //                           <span className="flex items-center gap-2">
      //                             <span className={`w-4 h-4 rounded-full ${loc.status === "on" ? "bg-green-400" : "bg-red-500"}`}></span>
      //                             <span className="text-xs">{loc.status === "on" ? "On Duty" : "Off Duty"}</span>
      //                           </span>
      //                         </div>
      //                       </div>
      //                     </div>
      //                   ))
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           {/* Tombol Kembali */}
      //           <button
      //             onClick={closeModal}
      //             className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
      //           >
      //             Kembali
      //           </button>
      //         </div>
      //       )}

      //       {/* Pertashop */}
      //       {activeModal === 'pertashop' && (
      //         <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
      //           <div className="flex flex-col md:flex-row gap-8">
      //             {/* Statistik */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Statistik</h2>
      //               <div className="flex flex-col gap-3">
      //                 <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-blue-700">TOTAL PERTASHOP</span>
      //                   <span className="font-bold text-xl">{stats.pertashop_total ?? '-'}</span>
      //                 </div>
      //               </div>
      //             </div>
      //             {/* Daftar Lokasi */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
      //               <div className="flex flex-col gap-4">
      //                 {/* Ganti dengan data asli jika ada */}
      //                 {[].length === 0 ? (
      //                   <div className="flex flex-col items-center justify-center py-8">
      //                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      //                       <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
      //                       <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
      //                     </svg>
      //                     <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
      //                   </div>
      //                 ) : (
      //                   [].map((loc, idx) => (
      //                     <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
      //                       {/* Isi data lokasi pertashop */}
      //                     </div>
      //                   ))
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           <button
      //             onClick={closeModal}
      //             className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
      //           >
      //             Kembali
      //           </button>
      //         </div>
      //       )}

      //       {/* SPBE */}
      //       {activeModal === 'spbe' && (
      //         <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
      //           <div className="flex flex-col md:flex-row gap-8">
      //             {/* Statistik */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Statistik</h2>
      //               <div className="flex flex-col gap-3">
      //                 <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-green-700">SPBE PSO</span>
      //                   <span className="font-bold text-xl">{stats.spbe_pso_total ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-yellow-700">SPBE NPSO</span>
      //                   <span className="font-bold text-xl">{stats.spbe_npso_total ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-blue-700">TOTAL SPBE</span>
      //                   <span className="font-bold text-xl">{(stats.spbe_pso_total ?? 0) + (stats.spbe_npso_total ?? 0)}</span>
      //                 </div>
      //               </div>
      //             </div>
      //             {/* Daftar Lokasi */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
      //               <div className="flex flex-col gap-4">
      //                 {/* Ganti dengan data asli jika ada */}
      //                 {[].length === 0 ? (
      //                   <div className="flex flex-col items-center justify-center py-8">
      //                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      //                       <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
      //                       <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
      //                     </svg>
      //                     <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
      //                   </div>
      //                 ) : (
      //                   [].map((loc, idx) => (
      //                     <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
      //                       {/* Isi data lokasi SPBE */}
      //                     </div>
      //                   ))
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           <button
      //             onClick={closeModal}
      //             className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
      //           >
      //             Kembali
      //           </button>
      //         </div>
      //       )}

      //       {/* Agen LPG */}
      //       {activeModal === 'agen' && (
      //         <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
      //           <div className="flex flex-col md:flex-row gap-8">
      //             {/* Statistik */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Statistik</h2>
      //               <div className="flex flex-col gap-3">
      //                 <div className="rounded-lg bg-green-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-green-700">AGEN LPG 3 KG</span>
      //                   <span className="font-bold text-xl">{stats.agen_lpg_3kg_total ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-blue-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-blue-700">LPG NPSO</span>
      //                   <span className="font-bold text-xl">{stats.lpg_npso_total ?? '-'}</span>
      //                 </div>
      //                 <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-yellow-700">TOTAL AGEN</span>
      //                   <span className="font-bold text-xl">{stats.agen_lpg_3kg_total ?? '-'}</span>
      //                 </div>
      //               </div>
      //             </div>
      //             {/* Daftar Lokasi */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
      //               <div className="flex flex-col gap-4">
      //                 {/* Ganti dengan data asli jika ada */}
      //                 {[].length === 0 ? (
      //                   <div className="flex flex-col items-center justify-center py-8">
      //                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      //                       <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
      //                       <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
      //                     </svg>
      //                     <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
      //                   </div>
      //                 ) : (
      //                   [].map((loc, idx) => (
      //                     <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
      //                       {/* Isi data lokasi Agen LPG */}
      //                     </div>
      //                   ))
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           <button
      //             onClick={closeModal}
      //             className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
      //           >
      //             Kembali
      //           </button>
      //         </div>
      //       )}

      //       {/* Pangkalan LPG */}
      //       {activeModal === 'pangkalan' && (
      //         <div className="bg-white p-8 rounded-xl shadow-lg mx-auto relative">
      //           <div className="flex flex-col md:flex-row gap-8">
      //             {/* Statistik */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Statistik</h2>
      //               <div className="flex flex-col gap-3">
      //                 <div className="rounded-lg bg-yellow-200 px-6 py-3 flex justify-between items-center">
      //                   <span className="font-semibold text-yellow-700">TOTAL PANGKALAN</span>
      //                   <span className="font-bold text-xl">{stats.pangkalan_lpg_3kg_total ?? '-'}</span>
      //                 </div>
      //               </div>
      //             </div>
      //             {/* Daftar Lokasi */}
      //             <div className="flex-1">
      //               <h2 className="text-xl font-bold mb-4">Daftar Lokasi</h2>
      //               <div className="flex flex-col gap-4">
      //                 {/* Ganti dengan data asli jika ada */}
      //                 {[].length === 0 ? (
      //                   <div className="flex flex-col items-center justify-center py-8">
      //                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      //                       <polygon points="12,2 22,20 2,20" fill="#fbbf24"/>
      //                       <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">!</text>
      //                     </svg>
      //                     <span className="mt-2 text-gray-500 font-semibold">Data tidak tersedia</span>
      //                   </div>
      //                 ) : (
      //                   [].map((loc, idx) => (
      //                     <div key={idx} className="rounded-lg border p-4 flex flex-col mb-2">
      //                       {/* Isi data lokasi Pangkalan LPG */}
      //                     </div>
      //                   ))
      //                 )}
      //               </div>
      //             </div>
      //           </div>
      //           <button
      //             onClick={closeModal}
      //             className="mt-8 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
      //           >
      //             Kembali
      //           </button>
      //         </div>
      //       )}
      //     </div>
      //   </div>
  //     )}
  //   </>
  // )
// }


