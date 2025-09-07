'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CrudPanel() {
  const pathname = usePathname()
  const [sharedKey, setSharedKey] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('pertamina-auth')
      if (savedAuth) {
        const authData = JSON.parse(savedAuth)
        if (authData.isAuthorized && authData.sharedKey) {
          setSharedKey(authData.sharedKey)
          setIsAuthorized(true)
        }
      }
    } catch {}
  }, [])

  const verify = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: sharedKey.trim() }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsAuthorized(true)
          localStorage.setItem('pertamina-auth', JSON.stringify({ isAuthorized: true, sharedKey }))
        } else {
          alert('Shared key tidak valid!')
        }
      } else {
        alert('Shared key tidak valid!')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat verifikasi!')
    }
  }

  const logout = () => {
    setIsAuthorized(false)
    setSharedKey('')
    localStorage.removeItem('pertamina-auth')
  }

  const navItem = (href: string, label: string) => {
    const active = pathname === href
    const cls = active
      ? 'block w-full bg-blue-700 text-white px-4 py-3 rounded-lg font-medium'
      : 'block w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50'
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-center">
          <img src="/logopertamina.svg" alt="Pertamina" className="h-10" />
        </div>
        

        <div suppressHydrationWarning>
          {!isAuthorized ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Akses Write</h3>
              <input
                type="password"
                value={sharedKey}
                onChange={e=>setSharedKey(e.target.value)}
                placeholder="Masukkan Shared Key"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md text-sm text-gray-900 placeholder:text-gray-400 mb-2"
              />
              <button onClick={verify} className="w-full bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium">Verifikasi</button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800 mb-2">✓ Akses Write Aktif</div>
              <button onClick={logout} className="text-xs text-green-700 underline">Logout</button>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          <Link 
            href="/" 
            className="block w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 mb-4"
          >
            ← Kembali ke Homepage
          </Link>
          {navItem('/crud', 'Overview')}
          {/* Hidden: Data Fuel & Data LPG */}
          {navItem('/crud/regions', 'Regions')}
          {navItem('/crud/region-stats', 'Region Stats')}
        </nav>
      </div>
    </div>
  )
}


