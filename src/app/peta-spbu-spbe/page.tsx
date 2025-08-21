  'use client'
// ini versi yang keacak mapnya
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Region as UiRegion, Location as UiLocation } from '@/types/sa'
import { supabase } from '@/lib/supabase'

type DbRegion = {
  id: string
  name: string
  color: string
  spbu_count?: number
  spbe_count?: number
}

type DbLocation = {
  id: string
  region_id: string
  name: string
  type: 'SPBU' | 'SPBE'
  address: string
  services: string[]
  hours: string
  phone: string
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeCompact(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function toUiRegion(r: DbRegion, locations: UiLocation[]): UiRegion {
  const spbuCount = r.spbu_count ?? locations.filter(l => l.type === 'SPBU').length
  const spbeCount = r.spbe_count ?? locations.filter(l => l.type === 'SPBE').length
  return {
    id: r.id,
    name: r.name,
    color: r.color,
    spbuCount,
    spbeCount,
    locations,
  }
}

export default function PetaSPBUSPBEPage() {
  const searchParams = useSearchParams()
  const debug = (searchParams?.get('debug') === '1')
  const dlog = (...args: any[]) => { if (debug) console.log('[PETA]', ...args) }

  // Helper function to calculate text similarity
  const calculateTextSimilarity = (text1: string, text2: string): number => {
    const t1 = text1.toLowerCase().trim()
    const t2 = text2.toLowerCase().trim()
    
    if (t1 === t2) return 1.0
    if (t1.includes(t2) || t2.includes(t1)) return 0.8
    
    // Simple character-based similarity
    const chars1 = new Set(t1.split(''))
    const chars2 = new Set(t2.split(''))
    const intersection = new Set([...chars1].filter(x => chars2.has(x)))
    const union = new Set([...chars1, ...chars2])
    
    return intersection.size / union.size
  }

  const [regions, setRegions] = useState<UiRegion[]>([])
  const [selectedRegion, setSelectedRegion] = useState<UiRegion | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<UiLocation | null>(null)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [mapSvg, setMapSvg] = useState<string>('')
  const svgContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        dlog('Fetching data from Supabase ...')
        const [{ data: dbRegions, error: regionsError }, { data: dbLocations, error: locationsError }] = await Promise.all([
          supabase.from('regions').select('*'),
          supabase.from('locations').select('*'),
        ])
        if (regionsError) throw regionsError
          if (locationsError) throw locationsError
          
        const locsByRegion = new Map<string, UiLocation[]>()
        for (const loc of (dbLocations || []) as DbLocation[]) {
          const arr = locsByRegion.get(loc.region_id) || []
          arr.push({
            id: loc.id,
            name: loc.name,
            type: loc.type,
            address: loc.address,
            services: loc.services || [],
            hours: loc.hours,
            phone: loc.phone,
          })
          locsByRegion.set(loc.region_id, arr)
        }

        const uiRegions: UiRegion[] = (dbRegions || []).map((r: any) =>
          toUiRegion(r as DbRegion, locsByRegion.get(r.id) || [])
        )
        dlog('Loaded', (dbRegions || []).length, 'regions and', (dbLocations || []).length, 'locations')
        setRegions(uiRegions)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    const subscription = supabase
      .channel('peta-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'regions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, fetchData)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!svgContainerRef.current) return
    const container = svgContainerRef.current
    const svg = container.querySelector('svg') as SVGSVGElement | null
    if (!svg) return

    const handler = (e: MouseEvent) => {
      dlog('click', e.type)
      let slug: string | null = null
      const el = e.target as Element
      
      // Step 1: Check clicked element or closest parent with data-region
      slug = el.getAttribute?.('data-region') || el.closest?.('[data-region]')?.getAttribute('data-region') || null
      if (debug) dlog('step1 target/closest slug =', slug)

      // Step 2: Check elementsFromPoint if step 1 failed
      if (!slug) {
        const hits = (document.elementsFromPoint?.(e.clientX, e.clientY) || []) as Element[]
        for (const h of hits) {
          const s = h.getAttribute?.('data-region') || h.closest?.('[data-region]')?.getAttribute('data-region')
          if (s) { slug = s; break }
        }
        if (debug) dlog('step2 elementsFromPoint slug =', slug)
      }

      // Step 3: Check bounding box of existing data-region elements if step 2 failed
      if (!slug) {
        try {
          const candidates = Array.from(svg.querySelectorAll('[data-region]')) as SVGGraphicsElement[]
          if (candidates.length) {
            const ctm = svg.getScreenCTM()
            if (ctm) {
              const pt = svg.createSVGPoint()
              pt.x = e.clientX
              pt.y = e.clientY
              const loc = pt.matrixTransform(ctm.inverse())
              for (const cand of candidates) {
                const b = cand.getBBox()
                if (loc.x >= b.x && loc.x <= b.x + b.width && loc.y >= b.y && loc.y <= b.y + b.height) {
                  slug = cand.getAttribute('data-region')
                  break
                }
              }
            }
          }
        } catch {}
        if (debug) dlog('step3 bbox slug =', slug)
      }

      // No more fallbacks - if we can't find a region, don't guess
      if (!slug) {
        dlog('No region found for click at', e.clientX, e.clientY)
        return
      }

      if (debug) {
        try { svg.querySelectorAll('.region-hit.active').forEach(n => n.classList.remove('active')) } catch {}
        try { svg.querySelectorAll(`[data-region="${slug}"]`).forEach(n => n.classList.add('active')) } catch {}
      }
      
      const region = getRegionByAny(slug)
      if (region) handleRegionClick(region)
      else dlog('No region matched for slug', slug)
    }

    svg.addEventListener('click', handler)
    return () => {
      svg.removeEventListener('click', handler)
    }
  }, [regions, mapSvg])

  useEffect(() => {
    if (regions.length === 0) return // Wait for regions to be loaded
    
    const loadMap = async () => {
      try {
        const res = await fetch('/map.svg', { cache: 'no-store' })
        if (!res.ok) return
        const raw = await res.text()
        if (!raw.trim().startsWith('<svg')) return

        const parser = new DOMParser()
        const doc = parser.parseFromString(raw, 'image/svg+xml')
        const svgEl = doc.documentElement as unknown as SVGSVGElement

        // Add CSS for clickable areas
        const styleEl = document.createElement('style')
        styleEl.textContent = `
          .region-hit {
            pointer-events: auto !important;
            cursor: pointer !important;
            ${debug ? `
              stroke: red !important;
              stroke-width: 3px !important;
              fill: rgba(255, 0, 0, 0.2) !important;
              opacity: 0.8 !important;
            ` : ''}
          }
          text, tspan {
            pointer-events: none !important;
          }
        `
        svgEl.appendChild(styleEl)

        // Clear previous overlays/tags on each re-process
        svgEl.querySelectorAll('.region-hit').forEach(n => n.parentElement?.removeChild(n))
        svgEl.querySelectorAll('[data-region]').forEach(n => n.removeAttribute('data-region'))

        // known slugs from DB
        const knownSlugs = regions.map(r => r.id)
        dlog('known slugs:', knownSlugs)

        // find all text nodes that might be region labels
        const textNodes = svgEl.querySelectorAll('text, tspan')
        let labelCenters: Array<{ slug: string; cx: number; cy: number }> = []
        
        // Also look for paths with fill="black" which might be text labels
        const blackPaths = svgEl.querySelectorAll('path[fill="black"]')
        dlog(`Found ${blackPaths.length} black paths (potential text labels)`)
        
        // Try to match black paths to region names by analyzing their position
        blackPaths.forEach((pathEl, index) => {
          try {
            const path = pathEl as SVGGraphicsElement
            const bbox = path.getBBox()
            // Black paths are usually small and positioned near region centers
            if (bbox.width < 100 && bbox.height < 100) {
              const cx = bbox.x + bbox.width / 2
              const cy = bbox.y + bbox.height / 2
              
              // Find the closest region by position
              let bestSlug: string | null = null
              let bestD = Number.POSITIVE_INFINITY
              
              for (const region of regions) {
                // Use region name similarity as a fallback
                const score = calculateTextSimilarity(region.name, `region_${index}`)
                if (score > 0.3) {
                  const d = Math.abs(cx - 360) + Math.abs(cy - 247) // Distance from map center
                  if (d < bestD) {
                    bestD = d
                    bestSlug = region.id
                  }
                }
              }
              
              if (bestSlug) {
                labelCenters.push({ slug: bestSlug, cx, cy })
                dlog(`Black path ${index} -> ${bestSlug} at (${cx}, ${cy})`)
              }
            }
          } catch (e) {
            dlog(`Failed to process black path ${index}:`, e)
          }
        })
        
        textNodes.forEach((textEl) => {
          const text = textEl.textContent?.trim()
          if (!text) return
          
          // try to match text to known region names
          let bestSlug: string | null = null
          let bestScore = 0
          
          for (const region of regions) {
            const score = calculateTextSimilarity(text, region.name)
            if (score > bestScore && score > 0.6) {
              bestScore = score
              bestSlug = region.id
            }
          }
          
          if (bestSlug) {
            try {
              const bbox = (textEl as SVGTextElement | SVGTSpanElement).getBBox()
              const cx = bbox.x + bbox.width / 2
              const cy = bbox.y + bbox.height / 2
              labelCenters.push({ slug: bestSlug, cx, cy })
              dlog(`Label "${text}" -> ${bestSlug} at (${cx}, ${cy})`)
            } catch (e) {
              dlog(`Failed to get bbox for text "${text}":`, e)
            }
          }
        })

        // find area geometry candidates (paths without id that have fill attribute)
        const candidates: SVGGraphicsElement[] = []
        svgEl.querySelectorAll('path:not([id]), polygon:not([id]), rect:not([id]), circle:not([id])').forEach((el) => {
          const path = el as SVGGraphicsElement
          // Check for fill attribute directly
          const fill = path.getAttribute('fill')
          const hasFill = fill && fill !== 'none' && fill !== 'transparent'
          
          if (hasFill) {
            candidates.push(path)
            dlog(`Found path with fill: ${fill}`)
          }
        })
        
        dlog('Geometry candidates:', candidates.length)

        // Create a grid-based mapping system since black paths have invalid coordinates
        const vb = svgEl.viewBox && svgEl.viewBox.baseVal
        const x0 = vb?.x ?? 0
        const y0 = vb?.y ?? 0
        const W = vb?.width ?? 720
        const H = vb?.height ?? 495
        
        // Create a grid for region mapping
        const GRID_SIZE = 20
        const grid: Array<{ x: number; y: number; regionId: string | null }> = []
        
        for (let y = y0; y < y0 + H; y += GRID_SIZE) {
          for (let x = x0; x < x0 + W; x += GRID_SIZE) {
            grid.push({ x, y, regionId: null })
          }
        }
        
        // Map each candidate to grid cells based on their position
        candidates.forEach((cand, index) => {
          try {
            const bbox = cand.getBBox()
            const centerX = bbox.x + bbox.width / 2
            const centerY = bbox.y + bbox.height / 2
            
            // Find which grid cells this region covers
            const startGridX = Math.floor((centerX - x0) / GRID_SIZE)
            const startGridY = Math.floor((centerY - y0) / GRID_SIZE)
            const endGridX = Math.ceil((centerX + bbox.width / 2 - x0) / GRID_SIZE)
            const endGridY = Math.ceil((centerY + bbox.height / 2 - y0) / GRID_SIZE)
            
            // Assign region ID to covered grid cells
            for (let gy = startGridY; gy <= endGridY; gy++) {
              for (let gx = startGridX; gx <= endGridX; gx++) {
                const gridIndex = gy * Math.ceil(W / GRID_SIZE) + gx
                if (gridIndex >= 0 && gridIndex < grid.length) {
                  grid[gridIndex].regionId = regions[index]?.id || null
                }
              }
            }
            
            dlog(`Region ${index} covers grid cells (${startGridX},${startGridY}) to (${endGridX},${endGridY})`)
          } catch (e) {
            dlog(`Failed to process candidate ${index}:`, e)
          }
        })

        // filter label centers to be within viewBox
        if (vb) {
          labelCenters = labelCenters.filter(({ cx, cy }) => 
            cx >= vb.x && cx <= vb.x + vb.width && 
            cy >= vb.y && cy <= vb.y + vb.height
          )
        }

        let overlayCount = 0
        
        // Create clickable areas based on filled paths (these are the actual region areas)
        if (candidates.length > 0) {
          // Use filled paths to create precise region boundaries
          candidates.forEach((cand, index) => {
            try {
              const bbox = cand.getBBox()
              const regionId = regions[index]?.id
              
              if (regionId) {
                // Create a clickable area overlay
                const overlay = cand.cloneNode(true) as SVGGraphicsElement
                overlay.setAttribute('data-region', regionId)
                overlay.classList.add('region-hit')
                // Make the overlay transparent but clickable
                overlay.setAttribute('fill', 'transparent')
                overlay.setAttribute('stroke', 'transparent')
                cand.parentElement?.appendChild(overlay)
                overlayCount += 1
                dlog(`Area overlay for ${regionId} at (${bbox.x}, ${bbox.y})`)
              }
            } catch (e) {
              dlog(`Failed to process area:`, e)
            }
          })
        } else {
          // Fallback: create a more precise Voronoi-like grid
          if (!labelCenters.length) {
            dlog('No labels found; skip overlay creation to avoid errors')
          } else {
            // Create a finer grid for better precision
            const STEP = Math.max(12, Math.min(W, H) / 60)
            
            for (let y = y0 + STEP / 2; y < y0 + H; y += STEP) {
              for (let x = x0 + STEP / 2; x < x0 + W; x += STEP) {
                // find nearest label center
                let bestSlug: string | null = null
                let bestD = Number.POSITIVE_INFINITY
                
                for (const c of labelCenters) {
                  const dx = c.cx - x
                  const dy = c.cy - y
                  const d = dx * dx + dy * dy
                  if (d < bestD) { 
                    bestD = d; 
                    bestSlug = c.slug 
                  }
                }
                
                if (!bestSlug) continue
                
                const dot = doc.createElementNS('http://www.w3.org/2000/svg', 'circle') as unknown as SVGGraphicsElement
                dot.setAttribute('cx', String(x))
                dot.setAttribute('cy', String(y))
                dot.setAttribute('r', String(STEP * 0.5)) // Smaller dots for better precision
                dot.setAttribute('data-region', bestSlug)
                dot.classList.add('region-hit')
                svgEl.appendChild(dot)
                overlayCount += 1
              }
            }
          }
        }

        dlog('Overlays created:', overlayCount, 'mode =', candidates.length > 0 ? 'geometry' : 'circle')
        setMapSvg(doc.documentElement.outerHTML)
      } catch (e) { console.error('Failed to load map.svg', e) }
    }
    loadMap()
  }, [regions, debug]) // Now depends on regions

  const regionsLookup = useMemo(() => {
    const bySlug = new Map<string, UiRegion>()
    const byCompact = new Map<string, UiRegion>()
    const knownSlugs = new Set<string>()
    for (const r of regions) {
      const idSlug = normalizeSlug(r.id)
      const nameSlug = normalizeSlug(r.name)
      bySlug.set(idSlug, r)
      bySlug.set(nameSlug, r)
      byCompact.set(normalizeCompact(r.id), r)
      byCompact.set(normalizeCompact(r.name), r)
      knownSlugs.add(idSlug)
      knownSlugs.add(nameSlug)
    }
    return { bySlug, byCompact, knownSlugs }
  }, [regions])

  const getRegionByAny = (raw: string): UiRegion | null => {
    const slug = normalizeSlug(raw)
    const compact = normalizeCompact(raw)
    return (
      regionsLookup.bySlug.get(slug) ||
      regionsLookup.byCompact.get(compact) ||
      null
    )
  }

  const handleRegionClick = (region: UiRegion) => {
    // Reset previously selected location/modal state to avoid stale handlers
    setSelectedLocation(null)
    setShowLocationModal(false)
    setSelectedRegion(region)
    setShowRegionModal(true)
  }

  const handleLocationClick = (location: UiLocation) => {
    setSelectedLocation(location)
    setShowLocationModal(true)
  }

  const closeRegionModal = () => {
    setShowRegionModal(false)
    setSelectedRegion(null)
  }

  const closeLocationModal = () => {
    setShowLocationModal(false)
    setSelectedLocation(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Peta SPBU dan SPBE Bandung</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Temukan lokasi SPBU dan SPBE terdekat di wilayah Bandung dan sekitarnya</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-red-500 rounded-full"></div><span>SPBU</span></div>
            <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-green-500 rounded-full"></div><span>SPBE</span></div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Peta SPBU dan SPBE Bandung</h2>
              <p className="text-gray-900">Klik pada area wilayah untuk melihat detail SPBU dan SPBE</p>
            </div>

            <div
              className="relative bg-white rounded-lg overflow-hidden border-2 border-gray-200 mx-auto max-w-[1200px]"
              ref={svgContainerRef}
              onClick={(e) => {
                const svg = svgContainerRef.current?.querySelector('svg') as SVGSVGElement | null
                if (!svg) return
                dlog('click container', e.type)
                let slug: string | null = null
                const el = e.target as Element
                slug = el.getAttribute?.('data-region') || el.closest?.('[data-region]')?.getAttribute('data-region') || null
                if (!slug) {
                  const hits = (document.elementsFromPoint?.(e.clientX, e.clientY) || []) as Element[]
                  for (const h of hits) {
                    const s = h.getAttribute?.('data-region') || h.closest?.('[data-region]')?.getAttribute('data-region')
                    if (s) { slug = s; break }
                  }
                }
                if (!slug) {
                  try {
                    const candidates = Array.from(svg.querySelectorAll('[data-region]')) as SVGGraphicsElement[]
                    if (candidates.length) {
                      const ctm = svg.getScreenCTM()
                      if (ctm) {
                        const pt = svg.createSVGPoint()
                        pt.x = (e as any).clientX
                        pt.y = (e as any).clientY
                        const loc = pt.matrixTransform(ctm.inverse())
                        for (const cand of candidates) {
                          const b = cand.getBBox()
                          if (loc.x >= b.x && loc.x <= b.x + b.width && loc.y >= b.y && loc.y <= b.y + b.height) {
                            slug = cand.getAttribute('data-region')
                            break
                          }
                        }
                      }
                    }
                  } catch {}
                }
                // Do not use nearest-label fallback to avoid wrong matches
                if (!slug) return
                const region = getRegionByAny(slug)
                if (region) handleRegionClick(region)
              }}
            >
              {mapSvg ? (
                <div className="w-full" dangerouslySetInnerHTML={{ __html: mapSvg.replace('<svg ', '<svg style=\"width:100%;height:auto;min-height:650px\" ') }} />
              ) : (
                <div className="w-full h-[650px] flex items-center justify-center text-gray-900">Peta sedang dimuat...</div>
              )}
            </div>

            {regions.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: region.color }}></div>
                    <span className="font-medium">{region.name}</span>
                    <span className="text-gray-900">({region.spbuCount} SPBU, {region.spbeCount} SPBE)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {regions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Daftar Wilayah</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <div key={region.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleRegionClick(region)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{region.name}</h3>
                      <p className="text-sm text-gray-900">Wilayah Bandung</p>
                    </div>
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: region.color }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">SPBU:</span> {region.spbuCount} lokasi</p>
                    <p className="text-sm"><span className="font-medium">SPBE:</span> {region.spbeCount} lokasi</p>
                    <p className="text-sm"><span className="font-medium">Total:</span> {region.locations.length} lokasi</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Detail →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showRegionModal && selectedRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: selectedRegion.color }}></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedRegion.name}</h3>
                    <p className="text-gray-900">Wilayah Bandung</p>
                  </div>
                </div>
                <button onClick={closeRegionModal} className="text-gray-900 hover:text-gray-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Statistik</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-red-800">SPBU</span>
                      <span className="text-2xl font-bold text-red-600">{selectedRegion.spbuCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">SPBE</span>
                      <span className="text-2xl font-bold text-green-600">{selectedRegion.spbeCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-800">Total Lokasi</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedRegion.locations.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Daftar Lokasi</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedRegion.locations.map((location: UiLocation) => (
                      <div key={location.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200" onClick={() => handleLocationClick(location)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-800">{location.name}</h5>
                            <p className={`text-sm font-medium ${location.type === 'SPBU' ? 'text-red-600' : 'text-green-600'}`}>{location.type}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${location.type === 'SPBU' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        </div>
                        <p className="text-sm text-gray-900 mt-1">{location.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button onClick={closeRegionModal} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLocationModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedLocation.name}</h3>
                  <p className={`text-sm font-medium ${selectedLocation.type === 'SPBU' ? 'text-red-600' : 'text-green-600'}`}>{selectedLocation.type}</p>
                </div>
                <button onClick={closeLocationModal} className="text-gray-900 hover:text-gray-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Alamat</h4>
                  <p className="text-gray-900">{selectedLocation.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Jam Operasional</h4>
                  <p className="text-gray-900">{selectedLocation.hours}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Telepon</h4>
                  <p className="text-gray-900">{selectedLocation.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Layanan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.services.map((service: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{service}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button onClick={closeLocationModal} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">Tutup</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Hubungi kami untuk informasi lebih lanjut tentang layanan dan lokasi SPBU/SPBE</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/peta-spbu-spbe" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg transition duration-300">Lihat Peta SPBU & SPBE</Link>
          </div>
        </div>
      </section>
    </main>
  )
}


