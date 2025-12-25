'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AuthPanel from './AuthPanel'
import { supabase } from '@/lib/supabase'

export default function CrudPanel() {
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check Supabase auth session
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        verifyUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthorized(false)
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        verifyUser(session.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const verifyUser = async (user: any) => {
    try {
      // Untuk sekarang, allow semua user yang sudah terkonfirmasi
      // Nanti bisa ditambahkan domain restriction jika diperlukan
      const authorized = true // Allow semua user untuk sekarang
      
      setIsAuthorized(authorized)
    } catch (error) {
      console.error('Verify error:', error)
      // Jika error, tetap allow user (untuk development)
      setIsAuthorized(true)
    }
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
          <AuthPanel />
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


