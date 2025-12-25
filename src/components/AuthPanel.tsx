'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPanel() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setIsAuthorized(true)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthorized(false)
        router.push('/login')
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setIsAuthorized(true)
      }
    } catch (error) {
      console.error('Session check error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!isAuthorized || !user) {
    return null
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="text-sm text-green-800 mb-2">
        ✓ Akses Write Aktif
      </div>
      <div className="text-xs text-green-700 mb-2">{user.email}</div>
      <button 
        onClick={handleLogout} 
        className="text-xs text-green-700 underline"
      >
        Logout
      </button>
    </div>
  )
}
