'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        verifyUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
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
        await verifyUser(session.user)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setLoading(false)
    }
  }

  const verifyUser = async (userData: User) => {
    try {
      // Untuk sekarang, allow semua user yang sudah terkonfirmasi
      // Nanti bisa ditambahkan domain restriction jika diperlukan
      const emailConfirmed = !!userData.email_confirmed_at
      
      // Jika email sudah terkonfirmasi, user authorized
      // Jika belum, tetap allow (untuk development)
      const authorized = true // Allow semua user untuk sekarang
      
      setUser(authorized ? userData : null)
      setIsAuthorized(authorized)
      
      if (!authorized) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error('Verify error:', error)
      // Jika error, tetap allow user (untuk development)
      setUser(userData)
      setIsAuthorized(true)
    } finally {
      setLoading(false)
    }
  }

  return { user, isAuthorized, loading }
}

