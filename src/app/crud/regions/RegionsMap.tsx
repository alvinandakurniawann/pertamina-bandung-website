"use client"

import { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

type Region = {
  id: string
  name: string
  color: string
  latitude?: number
  longitude?: number
}

type RegionStat = {
  key: string
  display_name: string
  spbu_total: number
  spbu_coco: number
  spbu_codo: number
  spbu_dodo: number
  pertashop_total: number
  spbe_pso_total: number
  spbe_npso_total: number
  agen_lpg_3kg_total: number
  lpg_npso_total: number
  pangkalan_lpg_3kg_total: number
}

type Props = {
  regions: Region[]
  regionStats: Record<string, RegionStat>
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (regionId: string) => void
}

export default function RegionsMap({ regions, regionStats, onMapClick, onMarkerClick }: Props) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  
  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded">
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold text-sm">⚠️ Mapbox Token Tidak Ditemukan</p>
          <p className="text-xs text-gray-600 mt-2">
            Pastikan NEXT_PUBLIC_MAPBOX_TOKEN ada di .env.local dan restart dev server
          </p>
        </div>
      </div>
    )
  }
  
  const [viewState, setViewState] = useState({
    longitude: 107.60981,
    latitude: -6.914744,
    zoom: 9
  })

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)

  const markers = regions.filter(r => r.latitude && r.longitude)

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={(e) => {
        // Klik di map untuk menambah marker baru
        // Hanya trigger jika bukan klik di marker atau popup
        const target = e.originalEvent.target as HTMLElement
        if (target && !target.closest('.mapboxgl-marker') && !target.closest('.mapboxgl-popup')) {
          const { lng, lat } = e.lngLat
          onMapClick(lat, lng)
        }
      }}
      mapboxAccessToken={mapboxToken}
      style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {markers.map((marker, i) => {
        const stats = regionStats[marker.id]
        return (
          <Marker
            key={marker.id}
            longitude={marker.longitude!}
            latitude={marker.latitude!}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelectedMarker(marker.id)
              onMarkerClick(marker.id)
            }}
          >
            <div
              className="cursor-pointer"
              style={{
                backgroundColor: marker.color || '#3B82F6',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {i + 1}
            </div>
          </Marker>
        )
      })}

      {selectedMarker && markers.find(m => m.id === selectedMarker) && (() => {
        const marker = markers.find(m => m.id === selectedMarker)!
        const stats = regionStats[marker.id]
        return (
          <Popup
            longitude={marker.longitude!}
            latitude={marker.latitude!}
            anchor="bottom"
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="space-y-2 min-w-[250px]">
              <h3 className="font-bold text-center text-sm mb-2 border-b pb-2">{marker.name}</h3>
              {stats ? (
                <div className="text-xs text-gray-700 space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="font-semibold">SPBU:</span> {stats.spbu_total}</div>
                    <div className="text-red-600"><span className="font-semibold">COCO:</span> {stats.spbu_coco}</div>
                    <div className="text-blue-600"><span className="font-semibold">CODO:</span> {stats.spbu_codo}</div>
                    <div className="text-green-600"><span className="font-semibold">DODO:</span> {stats.spbu_dodo}</div>
                  </div>
                  <div className="border-t pt-1 mt-1">
                    <div><span className="font-semibold">Pertashop:</span> {stats.pertashop_total}</div>
                    <div><span className="font-semibold">SPBE:</span> {stats.spbe_pso_total + stats.spbe_npso_total} (PSO: {stats.spbe_pso_total}, NPSO: {stats.spbe_npso_total})</div>
                    <div><span className="font-semibold">Agen LPG:</span> {stats.agen_lpg_3kg_total}</div>
                    <div><span className="font-semibold">Pangkalan LPG:</span> {stats.pangkalan_lpg_3kg_total}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Statistik belum tersedia. Tambahkan di halaman Region Stats.</p>
              )}
            </div>
          </Popup>
        )
      })()}
    </Map>
  )
}

