  'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Region as UiRegion, Location as UiLocation } from '@/types/sa'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  const [regions, setRegions] = useState<UiRegion[]>([])
  const [selectedRegion, setSelectedRegion] = useState<UiRegion | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<UiLocation | null>(null)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [mapSvg, setMapSvg] = useState<string>('')
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Generate distinct colors for regions
  const regionColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Lavender
    '#85C1E9', // Sky Blue
    '#F8C471', // Orange
    '#82E0AA', // Light Green
  ]

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
      slug = el.getAttribute?.('data-region') || el.closest?.('[data-region]')?.getAttribute('data-region') || null
      if (debug) dlog('step1 target/closest slug =', slug)

      if (!slug) {
        const hits = (document.elementsFromPoint?.(e.clientX, e.clientY) || []) as Element[]
        for (const h of hits) {
          const s = h.getAttribute?.('data-region') || h.closest?.('[data-region]')?.getAttribute('data-region')
          if (s) { slug = s; break }
        }
        if (debug) dlog('step2 elementsFromPoint slug =', slug)
      }

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

      if (!slug) {
        // Final fallback: compute nearest label using current inline svg ids
        try {
          const idNodes = Array.from(svg.querySelectorAll('[id]')) as SVGGraphicsElement[]
          const centers: { slug: string; cx: number; cy: number }[] = []
          for (const n of idNodes) {
            const rawId = (n.getAttribute('id') || '').trim()
            const s = normalizeSlug(rawId)
            if (!regionsLookup.knownSlugs.has(s)) continue
            const b = n.getBBox()
            centers.push({ slug: s, cx: b.x + b.width / 2, cy: b.y + b.height / 2 })
          }
          const ctm = svg.getScreenCTM()
          if (centers.length && ctm) {
            const pt = svg.createSVGPoint()
            pt.x = e.clientX
            pt.y = e.clientY
            const loc = pt.matrixTransform(ctm.inverse())
            let bestSlug: string | null = null
            let bestD = Number.POSITIVE_INFINITY
            for (const c of centers) {
              const dx = c.cx - (loc as any).x
              const dy = c.cy - (loc as any).y
              const d = dx*dx + dy*dy
              if (d < bestD) { bestD = d; bestSlug = c.slug }
            }
            slug = bestSlug
          }
        } catch {}
        if (debug) dlog('step4 nearest-label slug =', slug)
      }

      if (!slug) return
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
    const loadMap = async () => {
      try {
        const res = await fetch('/map.svg', { cache: 'no-store' })
        if (!res.ok) return
        const raw = await res.text()
        if (!raw.trim().startsWith('<svg')) return

        const parser = new DOMParser()
        const doc = parser.parseFromString(raw, 'image/svg+xml')
        const svgEl = doc.documentElement as unknown as SVGSVGElement

        // Debug: Log SVG properties
        dlog('SVG Properties:', {
          width: svgEl.getAttribute('width'),
          height: svgEl.getAttribute('height'),
          viewBox: svgEl.getAttribute('viewBox'),
          preserveAspectRatio: svgEl.getAttribute('preserveAspectRatio')
        })

        const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style')
        styleEl.textContent = `
          [data-region] { cursor: pointer; transition: filter .15s ease; }
          text, tspan { pointer-events: none; }
          .region-hit { fill: var(--region-color, #e5e7eb); fill-opacity: 0.85; stroke: ${debug ? '#ff0000' : '#ffffff'}; stroke-width: 4; stroke-opacity: 1; pointer-events: auto; filter: drop-shadow(0 0 4px rgba(0,0,0,0.2)); }
          .region-hit:hover { fill-opacity: 0.95; filter: drop-shadow(0 0 12px rgba(0,0,0,0.4)); transform: scale(1.02); stroke-width: 5; }
          .region-hit.active { fill-opacity: 1; filter: drop-shadow(0 0 16px rgba(0,0,0,0.6)); stroke-width: 6; }
          .region-label { font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 16px; font-weight: 800; fill: #1f2937; text-anchor: middle; dominant-baseline: middle; pointer-events: none; text-shadow: 3px 3px 6px rgba(255,255,255,0.9); filter: drop-shadow(0 0 2px rgba(255,255,255,0.8)); }
          .region-border { stroke: ${debug ? '#ff0000' : '#ffffff'}; stroke-width: 3; stroke-opacity: 1; fill: none; pointer-events: none; }
        `
        svgEl.insertBefore(styleEl, svgEl.firstChild)

        // Clear previous overlays/tags on each re-process
        svgEl.querySelectorAll('.region-hit').forEach(n => n.parentElement?.removeChild(n))
        svgEl.querySelectorAll('[data-region]').forEach(n => n.removeAttribute('data-region'))

        // Build a set of normalized region names from DB
        const known = new Set<string>()
        regions.forEach(r => { known.add(normalizeSlug(r.name)); known.add(normalizeSlug(r.id)) })
        dlog('Known slugs from DB:', Array.from(known))

        // Find text elements that contain region names (visible labels on the map)
        const textElements = Array.from(svgEl.querySelectorAll('text, tspan'))
          .filter((el) => {
            const textContent = (el.textContent || '').trim()
            if (!textContent) return false
            
            // Check if this text matches any region name
            const normalizedText = normalizeSlug(textContent)
            return regions.some(region => 
              normalizeSlug(region.name) === normalizedText ||
              region.name.toLowerCase().includes(textContent.toLowerCase()) ||
              textContent.toLowerCase().includes(region.name.toLowerCase())
            )
          })
        
        dlog('Found text elements with region names:', textElements.length)
        textElements.forEach(el => dlog('Text element:', el.textContent))

        // Find candidate geometry shapes that represent areas (exclude tiny shapes)
        const candidates = Array.from(svgEl.querySelectorAll('path,polygon,rect,circle'))
          .filter((el) => {
            const tag = el.tagName.toLowerCase()
            if (!['path','polygon','rect','circle'].includes(tag)) return false
            // Prefer filled regions or shapes with visible white stroke borders
            const fill = (el.getAttribute('fill') || '').trim().toLowerCase()
            const stroke = (el.getAttribute('stroke') || '').trim().toLowerCase()
            const hasFill = !!fill && fill !== 'none'
            const hasWhiteStroke = stroke === '#fff' || stroke === '#ffffff' || stroke === 'white' || /rgb\(255\s*,\s*255\s*,\s*255\)/.test(stroke)
            if (!hasFill && !hasWhiteStroke) return false
            try {
              const b = (el as any as SVGGraphicsElement).getBBox()
              return b.width * b.height > 200
            } catch {
              return false
            }
          }) as SVGGraphicsElement[]
        dlog('Found geometry candidates:', candidates.length)

        // Pre-calc text centers for region mapping
        const textCenters = textElements.map((textEl) => {
          try {
            const textContent = (textEl.textContent || '').trim()
            // Find the matching region
            const region = regions.find((r: UiRegion) => 
              normalizeSlug(r.name) === normalizeSlug(textContent) ||
              r.name.toLowerCase().includes(textContent.toLowerCase()) ||
              textContent.toLowerCase().includes(r.name.toLowerCase())
            )
            
            if (!region) return null
            
            const b = (textEl as any as SVGGraphicsElement).getBBox()
            const cx = b.x + b.width / 2
            const cy = b.y + b.height / 2
            
            dlog(`Text "${textContent}" -> Region "${region.name}" at (${cx}, ${cy})`)
            
            return { 
              slug: normalizeSlug(region.name), 
              region: region,
              cx: cx, 
              cy: cy,
              textContent: textContent
            }
          } catch (e) {
            dlog(`Error processing text element:`, e)
            return null
          }
        }).filter(Boolean) as { slug: string; region: UiRegion; cx: number; cy: number; textContent: string }[]
        
        dlog('Text centers detected:', textCenters.length)

        let overlayCount = 0
        // Create clickable areas based on text positions
        if (textCenters.length > 0) {
          // Create region areas based on text positions
          textCenters.forEach((textCenter, index) => {
            const { slug, cx, cy, region } = textCenter
            
            // Use distinct color for better visibility
            const colorIndex = regions.indexOf(region) % regionColors.length
            const regionColor = regionColors[colorIndex]
            
            // Create a more sophisticated fill area that extends to boundaries
            // This will create an area that looks more like the actual region shape
            let fillRadius = 120 // Base radius for region fill
            
            // Calculate distance to nearest neighbor to avoid overlap
            let nearest = Number.POSITIVE_INFINITY
            for (let j = 0; j < textCenters.length; j++) {
              if (j === index) continue
              const dx = textCenters[j].cx - cx
              const dy = textCenters[j].cy - cy
              const d = Math.sqrt(dx*dx + dy*dy)
              if (d < nearest) nearest = d
            }
            
            // Adjust radius based on nearest neighbor distance
            // This ensures regions don't overlap too much but still fill the area
            if (nearest !== Number.POSITIVE_INFINITY) {
              fillRadius = Math.min(fillRadius, nearest * 0.6) // Reduced overlap factor
            }
            
            // Ensure minimum radius for good visual coverage
            fillRadius = Math.max(fillRadius, 80)
            
            dlog(`Creating region "${region.name}" at (${cx}, ${cy}) with radius ${fillRadius}`)
            
            // Create the main fill area with a more sophisticated shape
            let fillElement: SVGGraphicsElement
            
            // Create an enhanced circle with better visual appeal
            fillElement = doc.createElementNS('http://www.w3.org/2000/svg', 'circle') as unknown as SVGGraphicsElement
            fillElement.setAttribute('cx', String(cx))
            fillElement.setAttribute('cy', String(cy))
            fillElement.setAttribute('r', String(fillRadius))
            
            fillElement.setAttribute('data-region', slug)
            fillElement.classList.add('region-hit')
            fillElement.style.setProperty('--region-color', regionColor)
            svgEl.appendChild(fillElement)
            
            // Add white border around the fill area
            const border = doc.createElementNS('http://www.w3.org/2000/svg', 'circle') as unknown as SVGGraphicsElement
            border.setAttribute('cx', String(cx))
            border.setAttribute('cy', String(cy))
            border.setAttribute('r', String(fillRadius))
            border.classList.add('region-border')
            border.setAttribute('stroke', debug ? '#ff0000' : '#ffffff')
            border.setAttribute('stroke-width', debug ? '8' : '6')
            border.setAttribute('stroke-opacity', '1')
            border.setAttribute('fill-opacity', '0')
            svgEl.appendChild(border)
            
            // Add region label on top
            const label = doc.createElementNS('http://www.w3.org/2000/svg', 'text')
            label.setAttribute('x', String(cx))
            label.setAttribute('y', String(cy))
            label.setAttribute('class', 'region-label')
            label.textContent = region.name
            svgEl.appendChild(label)
            
            overlayCount += 1
          })
        } else {
          dlog('No text centers found; skip overlay creation to avoid errors')
        }
        dlog('Overlays created:', overlayCount, 'mode =', candidates.length > 0 ? 'geometry' : 'circle')
        
        // Enhanced debug logging
        if (debug) {
          dlog('=== DEBUG MAPPING INFO ===')
          dlog('Total regions from DB:', regions.length)
          dlog('SVG elements found:', svgEl.querySelectorAll('*').length)
          dlog('Text elements with region names:', textElements.length)
          dlog('Geometry candidates:', candidates.length)
          dlog('Text centers calculated:', textCenters.length)
          dlog('Overlays created:', overlayCount)
          
          // Log text elements found
          dlog('Text elements found:', textElements.map(el => el.textContent))
          
          // Log text centers mapping
          dlog('Text centers mapping:', textCenters.map(tc => ({
            text: tc.textContent,
            slug: tc.slug,
            region: tc.region.name,
            position: { x: tc.cx, y: tc.cy }
          })))
        }

        const serializer = new XMLSerializer()
        const out = serializer.serializeToString(doc)
        setMapSvg(out)
      } catch (e) {
        console.error('Failed to load map.svg', e)
      }
    }
    loadMap()
  }, [regions, debug])

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
    setShowRegionModal(false)
    setSelectedLocation(null)
  }

  return (
    <>
      <Header />
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
              <h2 className="text-2xl font-bold text-black mb-4">Peta SPBU dan SPBE Bandung</h2>
              <p className="text-black">Klik pada area wilayah untuk melihat detail SPBU dan SPBE</p>
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
                if (!slug) {
                  try {
                    const idNodes = Array.from(svg.querySelectorAll('[id]')) as SVGGraphicsElement[]
                    const centers: { slug: string; cx: number; cy: number }[] = []
                    for (const n of idNodes) {
                      const rawId = (n.getAttribute('id') || '').trim()
                      const s = normalizeSlug(rawId)
                      if (!regionsLookup.knownSlugs.has(s)) continue
                      const b = n.getBBox()
                      centers.push({ slug: s, cx: b.x + b.width / 2, cy: b.y + b.height / 2 })
                    }
                    const ctm = svg.getScreenCTM()
                    if (centers.length && ctm) {
                      const pt = svg.createSVGPoint()
                      pt.x = (e as any).clientX
                      pt.y = (e as any).clientY
                      const loc = pt.matrixTransform(ctm.inverse())
                      let bestSlug: string | null = null
                      let bestD = Number.POSITIVE_INFINITY
                      for (const c of centers) {
                        const dx = c.cx - (loc as any).x
                        const dy = c.cy - (loc as any).y
                        const d = dx*dx + dy*dy
                        if (d < bestD) { bestD = d; bestSlug = c.slug }
                      }
                      slug = bestSlug
                    }
                  } catch {}
                }
                if (!slug) return
                const region = getRegionByAny(slug)
                if (region) handleRegionClick(region)
              }}
            >
              {mapSvg ? (
                <div className="w-full" dangerouslySetInnerHTML={{ __html: mapSvg.replace('<svg ', '<svg style=\"width:100%;height:auto;min-height:650px\" ') }} />
              ) : (
                <div className="w-full h-[650px] flex items-center justify-center text-black">Peta sedang dimuat...</div>
              )}
            </div>

            {regions.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: region.color }}></div>
                    <span className="font-medium text-black">{region.name}</span>
                    <span className="text-black">({region.spbuCount} SPBU, {region.spbeCount} SPBE)</span>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Daftar Wilayah</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <div key={region.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleRegionClick(region)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-black">{region.name}</h3>
                      <p className="text-sm text-black">Wilayah Bandung</p>
                    </div>
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: region.color }}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-black"><span className="font-medium">SPBU:</span> {region.spbuCount} lokasi</p>
                    <p className="text-sm text-black"><span className="font-medium">SPBE:</span> {region.spbeCount} lokasi</p>
                    <p className="text-sm text-black"><span className="font-medium">Total:</span> {region.locations.length} lokasi</p>
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
                    <h3 className="text-2xl font-bold text-black">{selectedRegion.name}</h3>
                    <p className="text-black">Wilayah Bandung</p>
                  </div>
                </div>
                <button onClick={closeRegionModal} className="text-black hover:text-gray-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-black mb-4">Statistik</h4>
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
                  <h4 className="font-bold text-lg text-black mb-4">Daftar Lokasi</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedRegion.locations.map((location: UiLocation) => (
                      <div key={location.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200" onClick={() => handleLocationClick(location)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-black">{location.name}</h5>
                            <p className={`text-sm font-medium ${location.type === 'SPBU' ? 'text-red-600' : 'text-green-600'}`}>{location.type}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${location.type === 'SPBU' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        </div>
                        <p className="text-sm text-black mt-1">{location.address}</p>
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
                  <h3 className="text-xl font-bold text-black">{selectedLocation.name}</h3>
                  <p className={`text-sm font-medium ${selectedLocation.type === 'SPBU' ? 'text-red-600' : 'text-green-600'}`}>{selectedLocation.type}</p>
                </div>
                <button onClick={closeLocationModal} className="text-black hover:text-gray-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">Alamat</h4>
                  <p className="text-black">{selectedLocation.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Jam Operasional</h4>
                  <p className="text-black">{selectedLocation.hours}</p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Telepon</h4>
                  <p className="text-black">{selectedLocation.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Layanan</h4>
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
      <Footer />
    </>
  )
}


