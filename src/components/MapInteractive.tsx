"use client"
import React, { useEffect, useRef } from 'react'

type Props = {
  onSelect: (key: string, displayName: string) => void
}

function toKeyFromClassList(classList: DOMTokenList): { key?: string; display?: string } {
  const tokens = Array.from(classList)
  if (!tokens.length) return {}
  const isKab = tokens.includes('Kabupaten')
  const isKota = tokens.includes('Kota')
  if (!isKab && !isKota) return {}
  const nameTokens = tokens.filter(t => t !== 'Kabupaten' && t !== 'Kota')
  if (nameTokens.length === 0) return {}
  const display = `${isKab ? 'Kabupaten' : 'Kota'} ${nameTokens.join(' ')}`
  const key = `${isKab ? 'kab' : 'kota'}-${nameTokens.join('-').toLowerCase()}`
  return { key, display }
}

export default function MapInteractive({ onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let aborted = false
    async function load() {
      const res = await fetch('/map terbatu.svg')
      const svgText = await res.text()
      if (aborted) return
      const el = containerRef.current
      if (!el) return
      el.innerHTML = svgText

      const svgRoot = el.querySelector('svg') as SVGSVGElement | null
      if (!svgRoot) return

      // Style: pointer cursor for labels
      const style = document.createElement('style')
      style.textContent = `
        .kab-kota-hover { cursor: pointer; }
      `
      svgRoot.appendChild(style)

      const attach = (node: Element) => {
        const { key, display } = toKeyFromClassList(node.classList)
        if (!key || !display) return
        node.classList.add('kab-kota-hover')
        ;(node as any).style && ((node as any).style.pointerEvents = 'all')
        node.addEventListener('click', () => onSelect(key, display))
      }

      // Cari elemen label berbasis class di SVG
      const candidates = Array.from(svgRoot.querySelectorAll('[class]'))
      candidates.forEach(attach)
    }
    load()
    return () => { aborted = true }
  }, [onSelect])

  return (
    <div ref={containerRef} className="w-full h-auto" aria-label="Peta Wilayah Interaktif" />
  )
}



