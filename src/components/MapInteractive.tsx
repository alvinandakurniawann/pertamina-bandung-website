"use client"
import React from "react"
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

type Props = {
  onSelect: (key: string, displayName: string) => void
  debug?: boolean
}

const smallIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [18, 30],     // lebih kecil dari default (25, 41)
  iconAnchor: [9, 30],    // disesuaikan dengan ukuran baru
})

export default function MapInteractive({ onSelect }: Props) {
  const position: [number, number] = [-7.083130, 108.184514] // Bandung

  const markers = [
    { 
      id: "kota-bandung", 
      name: "Kota Bandung", 
      pos: [-6.914744, 107.60981],
      stats: { spbu: 12, pertashop: 5, spbe: 3, agen: 20, pangkalan: 150 }
    },
    { 
      id: "kab-bandung", 
      name: "Kabupaten Bandung", 
      pos: [-7.1124, 107.6486],
      stats: { spbu: 8, pertashop: 2, spbe: 2, agen: 15, pangkalan: 100 }
    },
    { 
      id: "kab-bandung-barat", 
      name: "Kabupaten Bandung Barat", 
      pos: [-6.797435, 107.624433],
      stats: { spbu: 5, pertashop: 1, spbe: 1, agen: 10, pangkalan: 70 }
    },
    { 
      id: "kab-garut", 
      name: "Kabupaten Garut", 
      pos: [-7.2279, 107.9087],
      stats: { spbu: 7, pertashop: 3, spbe: 2, agen: 12, pangkalan: 90 }
    },
    { 
      id: "kab-pangandaran", 
      name: "Kabupaten Pangandaran", 
      pos: [-7.6906, 108.6530],
      stats: { spbu: 3, pertashop: 1, spbe: 1, agen: 5, pangkalan: 40 }
    },
    { 
      id: "kab-tasikmalaya", 
      name: "Kabupaten Tasikmalaya", 
      pos: [-7.566427, 108.152771],
      stats: { spbu: 6, pertashop: 2, spbe: 1, agen: 9, pangkalan: 80 }
    },
    { 
      id: "kab-ciamis", 
      name: "Kabupaten Ciamis", 
      pos: [-7.221291, 108.375916],
      stats: { spbu: 4, pertashop: 2, spbe: 1, agen: 7, pangkalan: 60 }
    },
    { 
      id: "kota-tasikmalaya", 
      name: "Kota Tasikmalaya", 
      pos: [-7.3276, 108.2145],
      stats: { spbu: 5, pertashop: 2, spbe: 1, agen: 6, pangkalan: 55 }
    },
    { 
      id: "kota-banjar", 
      name: "Kota Banjar", 
      pos: [-7.3700, 108.5333],
      stats: { spbu: 2, pertashop: 1, spbe: 0, agen: 4, pangkalan: 30 }
    },
    { 
      id: "kota-cimahi", 
      name: "Kota Cimahi", 
      pos: [-6.8722, 107.5420],
      stats: { spbu: 4, pertashop: 1, spbe: 1, agen: 5, pangkalan: 45 }
    },
    { 
      id: "kab-sumedang", 
      name: "Kabupaten Sumedang", 
      pos: [-6.9085034938328675, 108.0648129341835],
      stats: { spbu: 5, pertashop: 1, spbe: 1, agen: 8, pangkalan: 65 }
    },
  ]

  return (
    <MapContainer
      center={position}
      zoom={9}
      style={{ height: "500px" }}
    >
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
            click: () => onSelect(m.id, m.name),
          }}
        >
          <Tooltip permanent direction={i % 2 === 0 ? "right" : "left"} offset={[10, 0]}>
            {m.name}
          </Tooltip>
          <Popup >
            <div className="space-y-1">
              {/* Nama wilayah */}
              <h3 className="font-bold text-sm mb-2">{m.name}</h3>

              {/* Daftar fasilitas */}
              <ul className="text-xs text-gray-700 space-y-1">
                <li>SPBU: {m.stats.spbu}</li>
                <li>Pertashop: {m.stats.pertashop}</li>
                <li>SPBE: {m.stats.spbe}</li>
                <li>Agen LPG: {m.stats.agen}</li>
                <li>Pangkalan LPG: {m.stats.pangkalan}</li>
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
