'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CrudPanel() {
  const pathname = usePathname()
  const [sharedKey, setSharedKey] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Auto-verify jika NEXT_PUBLIC_CRUD_SECRET tersedia
    const envSecret = process.env.NEXT_PUBLIC_CRUD_SECRET
    if (envSecret) {
      autoVerify(envSecret)
      return
    }

    // Fallback: cek localStorage
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

  const autoVerify = async (secret: string) => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CrudPanel.tsx:33',message:'Auto-verify attempt',data:{secretLength:secret?.length||0,secretPrefix:secret?.substring(0,5)||''},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: secret.trim() }),
      })
      
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CrudPanel.tsx:45',message:'Auto-verify response',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsAuthorized(true)
          setSharedKey(secret)
          localStorage.setItem('pertamina-auth', JSON.stringify({ isAuthorized: true, sharedKey: secret }))
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CrudPanel.tsx:52',message:'Auto-verify invalid',data:{valid:data.valid},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
        }
      } else {
        // #region agent log
        const errorText = await response.text().catch(() => '')
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CrudPanel.tsx:57',message:'Auto-verify failed',data:{status:response.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CrudPanel.tsx:62',message:'Auto-verify exception',data:{error:(error as Error)?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Auto-verify failed:', error)
    }
  }

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


