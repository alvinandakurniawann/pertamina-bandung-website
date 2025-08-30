"use client"
import React, { useEffect, useRef } from 'react'

type Props = {
  onSelect: (key: string, displayName: string) => void
  debug?: boolean
}

function toKeyFromClassList(classList: DOMTokenList): { key?: string; display?: string } {
  const tokens = Array.from(classList)
  if (!tokens.length) return {}
  const isKab = tokens.includes('Kabupaten')
  const isKota = tokens.includes('Kota')
  if (!isKab && !isKota) return {}
  const nameTokens = tokens.filter(t => t !== 'Kabupaten' && t !== 'Kota' && t !== 'kab-kota-hover' && t !== 'kab-kota-pointer')
  if (nameTokens.length === 0) return {}
  const display = `${isKab ? 'Kabupaten' : 'Kota'} ${nameTokens.join(' ')}`
  const key = `${isKab ? 'kab' : 'kota'}-${nameTokens.join('-').toLowerCase()}`
  return { key, display }
}

export default function MapInteractive({ onSelect, debug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<Array<{ el: Element; key: string; display: string }>>([])
  const overlayNodesRef = useRef<HTMLElement[]>([])
  const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(window.location.host)
  const isDebug = isLocal ? (debug ?? (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1')) : false
  const connectorsRef = useRef<Array<{ el: Element; key: string; display: string }>>([])
  const editMode = isLocal && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('edit') === '1'
  const secret = typeof window !== 'undefined' ? (localStorage.getItem('crudSecret') || '') : ''

  useEffect(() => {
    let aborted = false
    async function load() {
      // 1) Coba ambil dari DB settings.map_svg
      let svgText = ''
      try {
        const s = await fetch('/api/supa/settings', { cache: 'no-store' })
        const j = await s.json()
        svgText = j?.data?.map_svg || ''
      } catch {}
      // 2) Fallback ke file publik jika kosong (kecuali edit mode: paksa DB)
      if (!svgText && !editMode) {
        const res = await fetch('/map terbatu.svg?ts=' + Date.now(), { cache: 'no-store' })
        svgText = await res.text()
      }
      if (aborted) return
      const el = containerRef.current
      if (!el) return
      el.innerHTML = svgText

      const svgRoot = el.querySelector('svg') as SVGSVGElement | null
      if (!svgRoot) return

      // Make embedded SVG responsive
      try {
        const widthAttr = svgRoot.getAttribute('width') || ''
        const heightAttr = svgRoot.getAttribute('height') || ''
        const hasViewBox = !!svgRoot.getAttribute('viewBox')
        const w = parseFloat(widthAttr)
        const h = parseFloat(heightAttr)
        if (!hasViewBox && isFinite(w) && isFinite(h) && w > 0 && h > 0) {
          svgRoot.setAttribute('viewBox', `0 0 ${w} ${h}`)
        }
        svgRoot.removeAttribute('width')
        svgRoot.removeAttribute('height')
        svgRoot.setAttribute('preserveAspectRatio', svgRoot.getAttribute('preserveAspectRatio') || 'xMidYMid meet')
        ;(svgRoot as unknown as HTMLElement).style.width = '100%'
        ;(svgRoot as unknown as HTMLElement).style.height = 'auto'
        ;(svgRoot as unknown as HTMLElement).style.maxWidth = '100%'
        ;(el as HTMLElement).style.width = '100%'
        ;(el as HTMLElement).style.maxWidth = '100%'
        ;(el as HTMLElement).style.overflowX = 'hidden'
      } catch {}

      // Style: pointer cursor untuk label dan pastikan elemen bisa diklik
      const style = document.createElement('style')
      style.textContent = `
        /* pastikan semua elemen wilayah & garis bisa menerima klik */
        g, path, polygon { pointer-events: all !important; }
        /* shape yang dinonaktifkan klik */
        [data-region-disabled="1"] { pointer-events: none !important; }
        :root, svg { max-width: 100%; height: auto; }
      `
      svgRoot.appendChild(style)

      const hasAnyDataRegion = !!svgRoot.querySelector('[data-region]')
      const strictClicks = hasAnyDataRegion && !editMode

      // Matikan klik pada konektor/garis berwarna merah
      try {
        const redish = ['#ff0000', '#f00', 'red', 'rgb(255,0,0)']
        const connectorEls = Array.from(svgRoot.querySelectorAll('path, line, polyline'))
          .filter(el => redish.includes((el.getAttribute('stroke') || '').trim().toLowerCase()))
        connectorEls.forEach(el => {
          el.setAttribute('data-region-disabled', '1')
          ;(el as unknown as HTMLElement).style.pointerEvents = 'none'
        })
      } catch {}

      const attach = (node: Element) => {
        const { key, display } = toKeyFromClassList(node.classList)
        if (!key || !display) return
        ;(node as any).style && ((node as any).style.pointerEvents = 'all')
        ;(node as any).style && ((node as any).style.cursor = 'pointer')
        node.addEventListener('click', () => onSelect(key, display))
        labelsRef.current.push({ el: node, key, display })
      }

      // Cari elemen label berbasis class di SVG
      const candidates = Array.from(svgRoot.querySelectorAll('[class]'))
      candidates.forEach(attach)

      // Tambah overlay untuk wilayah kecil: Kota Tasikmalaya (mempermudah klik)
      try {
        const tas = labelsRef.current.find(x => /Kota\s+Tasikmalaya/i.test(x.display))
        if (tas) {
          const containerRect2 = el.getBoundingClientRect()
          const r = (tas.el as HTMLElement).getBoundingClientRect()
          const cx = r.left + r.width / 2 - containerRect2.left
          const cy = r.top + r.height / 2 - containerRect2.top
          const hit = document.createElement('div')
          hit.style.position = 'absolute'
          hit.style.left = `${cx - 16}px`
          hit.style.top = `${cy - 16}px`
          hit.style.width = `32px`
          hit.style.height = `32px`
          hit.style.borderRadius = '50%'
          hit.style.background = 'rgba(42,130,191,0.15)'
          hit.style.pointerEvents = 'auto'
          hit.style.zIndex = '9'
          hit.title = 'Klik: Kota Tasikmalaya'
          hit.addEventListener('click', (e) => { e.stopPropagation(); onSelect(tas.key, tas.display) })
          el.style.position = 'relative'
          el.appendChild(hit)
          overlayNodesRef.current.push(hit)
        }
      } catch {}

      // Konektor garis merah: nonaktifkan klik/edit sesuai permintaan (hanya area & label)
      const allPaths = Array.from(svgRoot.querySelectorAll('path, polygon'))
      const toCenter = (elem: Element) => {
        const r = (elem as HTMLElement).getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
      }
      // (Klik garis merah dinonaktifkan sesuai instruksi)

      // Klik pada keseluruhan SVG: fallback ke label terdekat jika target bukan label/elemen beridentitas
      const getDataRegion = (node: Element | null): string | undefined => {
        if (!node) return undefined
        // If current node or any ancestor has data-region-disabled="1", stop
        const isDisabledHere = (node as HTMLElement).getAttribute?.('data-region-disabled') === '1'
        if (isDisabledHere) return undefined
        const v = (node as HTMLElement).getAttribute?.('data-region') || undefined
        if (v) return v
        // Pada mode normal + sudah ada data-region di SVG, izinkan panjat parent jika klik pada label teks
        if (strictClicks) {
          const tag = (node as HTMLElement).tagName?.toLowerCase?.() || ''
          if (tag !== 'text' && tag !== 'tspan') return undefined
        }
        return getDataRegion(node.parentElement)
      }

      const trySelectFromNode = (node: Element): boolean => {
        // 1) data-region eksplisit pada area
        const dataRegion = getDataRegion(node)
        if (dataRegion) {
          const display = dataRegion.startsWith('kab-') ? `Kabupaten ${dataRegion.replace('kab-','').split('-').map(s=>s[0]?.toUpperCase()+s.slice(1)).join(' ')}`
                         : dataRegion.startsWith('kota-') ? `Kota ${dataRegion.replace('kota-','').split('-').map(s=>s[0]?.toUpperCase()+s.slice(1)).join(' ')}`
                         : dataRegion
          onSelect(dataRegion, display)
          return true
        }
        // 2) class token berisi Kabupaten/Kota (kalau area juga punya)
        if (hasAnyDataRegion) return false
        const { key, display } = toKeyFromClassList(node.classList)
        if (key && display) {
          onSelect(key, display)
          return true
        }
        return false
      }

      svgRoot.addEventListener('click', (ev: MouseEvent) => {
        const target = ev.target as Element
        // Jika klik sudah ditangani oleh handler elemen label, biarkan
        if (trySelectFromNode(target)) return
        // Saat edit mode: jangan lakukan heuristik klik di luar shape beridentitas
        if (editMode) return
        // Fallback: pilih label terdekat
        if (hasAnyDataRegion) return
        const clickX = ev.clientX, clickY = ev.clientY
        const nearestFrom = (arr: Array<{ el: Element; key: string; display: string }>) => {
          let best: { key: string; display: string; d: number } | null = null
          for (const info of arr) {
            const r = (info.el as HTMLElement).getBoundingClientRect()
            const cx = r.left + r.width / 2
            const cy = r.top + r.height / 2
            const dx = cx - clickX
            const dy = cy - clickY
            const d = dx*dx + dy*dy
            if (!best || d < best.d) best = { key: info.key, display: info.display, d }
          }
          return best
        }
        let best = labelsRef.current.length ? nearestFrom(labelsRef.current) : null
        if (best) onSelect(best.key, best.display)
      })

      // ==========================
      // Debug overlay
      // ==========================
      if (isDebug) {
        const containerRect = el.getBoundingClientRect()
        const shapes = Array.from(svgRoot.querySelectorAll('path, polygon'))
        let i = 0
        for (const shape of shapes) {
          const r = (shape as HTMLElement).getBoundingClientRect()
          if (r.width === 0 && r.height === 0) continue
          // rekomendasi key: dari data-region, class, atau label terdekat
          let recKey: string | undefined
          let recDisplay: string | undefined
          const dr = getDataRegion(shape)
          if (dr) {
            recKey = dr
            recDisplay = dr
          } else {
            const fromClass = toKeyFromClassList(shape.classList)
            if (fromClass.key) {
              recKey = fromClass.key
              recDisplay = fromClass.display
            } else if (labelsRef.current.length) {
              const cx = r.left + r.width / 2
              const cy = r.top + r.height / 2
              let best: { key: string; display: string; d: number } | null = null
              for (const info of labelsRef.current) {
                const lr = (info.el as HTMLElement).getBoundingClientRect()
                const lx = lr.left + lr.width / 2
                const ly = lr.top + lr.height / 2
                const dx = lx - cx
                const dy = ly - cy
                const d = dx*dx + dy*dy
                if (!best || d < best.d) best = { key: info.key, display: info.display, d }
              }
              if (best) { recKey = best.key; recDisplay = best.display }
            }
          }

          const badge = document.createElement('div')
          badge.style.position = 'absolute'
          badge.style.left = `${r.left - containerRect.left}px`
          badge.style.top = `${r.top - containerRect.top}px`
          badge.style.padding = '2px 4px'
          badge.style.fontSize = '10px'
          badge.style.background = 'rgba(255,0,0,0.75)'
          badge.style.color = '#fff'
          badge.style.borderRadius = '3px'
          badge.style.pointerEvents = 'auto'
          badge.style.zIndex = '10'
          badge.textContent = `#${i} ${(recKey || '').slice(0, 28)}`
          badge.title = `Klik untuk salin: data-region="${recKey || 'kab-.../kota-...'}"\n${recDisplay || ''}`
          badge.addEventListener('click', (e) => {
            e.stopPropagation()
            const text = `data-region="${recKey || 'kab-...'}"`
            navigator.clipboard?.writeText(text)
          })

          // outline shape saat hover badge
          badge.addEventListener('mouseenter', () => {
            ;(shape as any).dataset._origStroke = (shape as SVGElement).getAttribute('stroke') || ''
            ;(shape as SVGElement).setAttribute('stroke', '#ff0000')
            ;(shape as SVGElement).setAttribute('stroke-width', '2')
          })
          badge.addEventListener('mouseleave', () => {
            const orig = (shape as any).dataset._origStroke
            if (orig) (shape as SVGElement).setAttribute('stroke', orig)
          })

          el.style.position = 'relative'
          el.appendChild(badge)
          overlayNodesRef.current.push(badge)
          i += 1
        }
      }

      // ==========================
      // Edit/Save Mode (klik path/polygon lalu pilih wilayah → inject data-region & simpan ke DB)
      // params: ?edit=1
      // Panel menyediakan input secret, disimpan ke localStorage key: crudSecret
      // ==========================
      if (editMode) {
        const palette: Array<{ label: string; key: string }> = [
          { label: 'Kab. Bandung', key: 'kab-bandung' },
          { label: 'Kota Bandung', key: 'kota-bandung' },
          { label: 'Kab. Garut', key: 'kab-garut' },
          { label: 'Kab. Sumedang', key: 'kab-sumedang' },
          { label: 'Kab. Tasikmalaya', key: 'kab-tasikmalaya' },
          { label: 'Kota Tasikmalaya', key: 'kota-tasikmalaya' },
          { label: 'Kab. Ciamis', key: 'kab-ciamis' },
          { label: 'Kab. Pangandaran', key: 'kab-pangandaran' },
          { label: 'Kota Banjar', key: 'kota-banjar' },
          { label: 'Kab. Bandung Barat', key: 'kab-bandung-barat' },
          { label: 'Kota Cimahi', key: 'kota-cimahi' },
        ]
        const panel = document.createElement('div')
        panel.style.position = 'fixed'
        panel.style.right = '12px'
        panel.style.top = '12px'
        panel.style.background = 'rgba(0,0,0,0.75)'
        panel.style.color = '#fff'
        panel.style.padding = '8px'
        panel.style.borderRadius = '6px'
        panel.style.zIndex = '50'

        const title = document.createElement('div')
        title.textContent = 'Edit Wilayah (klik shape lalu pilih)'
        title.style.fontSize = '12px'
        title.style.marginBottom = '6px'
        panel.appendChild(title)

        const btns = document.createElement('div')
        btns.style.display = 'grid'
        btns.style.gridTemplateColumns = '1fr 1fr'
        btns.style.gap = '6px'
        for (const p of palette) {
          const b = document.createElement('button')
          b.textContent = p.label
          b.style.fontSize = '12px'
          b.style.padding = '6px'
          b.style.background = '#2a82bf'
          b.style.borderRadius = '4px'
          b.style.border = 'none'
          b.style.cursor = 'pointer'
          b.addEventListener('click', () => {
            const active = (svgRoot as any)._activeShape as SVGElement | null
            if (!active) return
            active.setAttribute('data-region', p.key)
          })
          btns.appendChild(b)
        }
        panel.appendChild(btns)

        // Row for click disable/enable on active shape
        const clickCtl = document.createElement('div')
        clickCtl.style.display = 'grid'
        clickCtl.style.gridTemplateColumns = '1fr 1fr'
        clickCtl.style.gap = '6px'
        clickCtl.style.marginTop = '8px'
        const disableBtn = document.createElement('button')
        disableBtn.textContent = 'Nonaktifkan klik (shape aktif)'
        disableBtn.style.fontSize = '12px'
        disableBtn.style.padding = '6px'
        disableBtn.style.background = '#ef4444'
        disableBtn.style.borderRadius = '4px'
        disableBtn.style.border = 'none'
        disableBtn.style.cursor = 'pointer'
        disableBtn.addEventListener('click', () => {
          const active = (svgRoot as any)._activeShape as SVGElement | null
          if (!active) { alert('Pilih shape pada peta terlebih dahulu'); return }
          active.setAttribute('data-region-disabled', '1')
        })
        const enableBtn = document.createElement('button')
        enableBtn.textContent = 'Aktifkan klik (shape aktif)'
        enableBtn.style.fontSize = '12px'
        enableBtn.style.padding = '6px'
        enableBtn.style.background = '#22c55e'
        enableBtn.style.borderRadius = '4px'
        enableBtn.style.border = 'none'
        enableBtn.style.cursor = 'pointer'
        enableBtn.addEventListener('click', () => {
          const active = (svgRoot as any)._activeShape as SVGElement | null
          if (!active) { alert('Pilih shape pada peta terlebih dahulu'); return }
          active.removeAttribute('data-region-disabled')
        })
        clickCtl.appendChild(disableBtn)
        clickCtl.appendChild(enableBtn)
        panel.appendChild(clickCtl)

        const secretWrap = document.createElement('div')
        secretWrap.style.marginTop = '8px'
        const secretLabel = document.createElement('div')
        secretLabel.textContent = 'Secret'
        secretLabel.style.fontSize = '11px'
        secretLabel.style.marginBottom = '4px'
        const secretInput = document.createElement('input')
        secretInput.type = 'password'
        secretInput.placeholder = 'x-shared-secret'
        secretInput.value = secret
        secretInput.style.width = '100%'
        secretInput.style.padding = '6px'
        secretInput.style.borderRadius = '4px'
        secretInput.style.border = '1px solid #444'
        secretInput.style.background = '#111'
        secretInput.style.color = '#fff'
        const saveSecretBtn = document.createElement('button')
        saveSecretBtn.textContent = 'Simpan Secret'
        saveSecretBtn.style.marginTop = '6px'
        saveSecretBtn.style.width = '100%'
        saveSecretBtn.style.padding = '6px'
        saveSecretBtn.style.background = '#525252'
        saveSecretBtn.style.border = 'none'
        saveSecretBtn.style.borderRadius = '4px'
        saveSecretBtn.style.color = '#fff'
        saveSecretBtn.style.cursor = 'pointer'
        saveSecretBtn.addEventListener('click', () => {
          try {
            localStorage.setItem('crudSecret', secretInput.value || '')
            alert('Secret disimpan di browser')
          } catch {}
        })
        secretWrap.appendChild(secretLabel)
        secretWrap.appendChild(secretInput)
        secretWrap.appendChild(saveSecretBtn)
        panel.appendChild(secretWrap)

        // Tombol reset: replace map_svg di DB dengan file di public
        const resetBtn = document.createElement('button')
        resetBtn.textContent = 'Reset ke File Public'
        resetBtn.style.marginTop = '8px'
        resetBtn.style.width = '100%'
        resetBtn.style.padding = '8px'
        resetBtn.style.background = '#f59e0b' // amber
        resetBtn.style.border = 'none'
        resetBtn.style.borderRadius = '4px'
        resetBtn.style.color = '#000'
        resetBtn.style.cursor = 'pointer'
        resetBtn.addEventListener('click', async () => {
          try {
            if (!confirm('Ganti peta dari file public? Perubahan di DB akan ditimpa.')) return
            const res = await fetch('/map terbatu.svg?ts=' + Date.now(), { cache: 'no-store' })
            if (!res.ok) throw new Error('Gagal memuat file public')
            const mapSvg = await res.text()
            const finalSecret = secretInput.value || localStorage.getItem('crudSecret') || ''
            if (!finalSecret) { alert('Isi secret lalu klik Simpan Secret'); return }
            const put = await fetch('/api/supa/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'x-shared-secret': finalSecret },
              body: JSON.stringify({ mapSvg })
            })
            const json = await put.json()
            if (!put.ok) throw new Error(json?.message || 'Gagal reset')
            alert('Berhasil reset peta dari file public')
          } catch (e: any) {
            alert(e?.message || 'Gagal reset')
          }
        })
        panel.appendChild(resetBtn)

        const save = document.createElement('button')
        save.textContent = 'Simpan ke DB'
        save.style.marginTop = '8px'
        save.style.width = '100%'
        save.style.padding = '8px'
        save.style.background = '#16a34a'
        save.style.border = 'none'
        save.style.borderRadius = '4px'
        save.style.color = '#fff'
        save.style.cursor = 'pointer'
        save.addEventListener('click', async () => {
          try {
            const serialized = svgRoot.outerHTML
            const finalSecret = secretInput.value || localStorage.getItem('crudSecret') || ''
            if (!finalSecret) { alert('Isi secret lalu klik Simpan Secret'); return }
            const res = await fetch('/api/supa/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'x-shared-secret': finalSecret },
              body: JSON.stringify({ mapSvg: serialized })
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.message || 'Gagal simpan')
            alert('Berhasil disimpan ke DB (kolom settings.map_svg)')
          } catch (e: any) {
            alert(e?.message || 'Gagal simpan')
          }
        })
        panel.appendChild(save)

        document.body.appendChild(panel)
        overlayNodesRef.current.push(panel)

        // Tandai shape aktif saat diklik
        const markActive = (shape: SVGElement | null) => {
          const prev = (svgRoot as any)._activeShape as SVGElement | null
          if (prev) prev.removeAttribute('data-active')
          if (shape) shape.setAttribute('data-active', '1')
          ;(svgRoot as any)._activeShape = shape
        }
        svgRoot.addEventListener('click', (ev: any) => {
          const t = ev.target as SVGElement
          if (!t) return
          if (['path','polygon','polyline'].includes(t.tagName.toLowerCase())) {
            markActive(t)
          }
        })

        // Izinkan memilih shape aktif melalui klik label (text/tspan)
        try {
          const toSvgPoint = (clientX: number, clientY: number) => {
            const ctm = svgRoot.getScreenCTM()
            if (!ctm) return null
            const pt = svgRoot.createSVGPoint()
            pt.x = clientX
            pt.y = clientY
            return pt.matrixTransform(ctm.inverse())
          }
          const regionElems = Array.from(svgRoot.querySelectorAll('[data-region]')) as SVGGraphicsElement[]
          const centers = regionElems.map(el => {
            try {
              const b = el.getBBox()
              return { el, slug: el.getAttribute('data-region') || '', cx: b.x + b.width/2, cy: b.y + b.height/2 }
            } catch { return null }
          }).filter(Boolean) as { el: SVGGraphicsElement; slug: string; cx: number; cy: number }[]

          const pickNearest = (x: number, y: number) => {
            let best: { slug: string; el: SVGGraphicsElement; d: number } | null = null
            for (const c of centers) {
              const dx = c.cx - x, dy = c.cy - y
              const d = dx*dx + dy*dy
              if (!best || d < best.d) best = { slug: c.slug, el: c.el, d }
            }
            return best
          }

          const labelNodes = Array.from(svgRoot.querySelectorAll('text, tspan')) as SVGGraphicsElement[]
          labelNodes.forEach(n => {
            (n as unknown as HTMLElement).style.pointerEvents = 'auto'
            ;(n as unknown as HTMLElement).style.cursor = 'pointer'
            n.addEventListener('click', (ev: MouseEvent) => {
              ev.stopPropagation()
              const p = toSvgPoint(ev.clientX, ev.clientY)
              if (!p) return
              const nearest = pickNearest((p as any).x, (p as any).y)
              if (!nearest) return
              // Set active shape agar tombol aktif/nonaktif klik berfungsi
              markActive(nearest.el as unknown as SVGElement)
            })
          })
        } catch {}
      }
    }
    load()
    return () => {
      aborted = true
      // bersihkan overlay debug
      const el = containerRef.current
      if (el && overlayNodesRef.current.length) {
        for (const node of overlayNodesRef.current) {
          try { el.removeChild(node) } catch {}
        }
        overlayNodesRef.current = []
      }
    }
  }, [onSelect, isDebug])

  return (
    <div ref={containerRef} className="w-full h-auto" aria-label="Peta Wilayah Interaktif" />
  )
}



