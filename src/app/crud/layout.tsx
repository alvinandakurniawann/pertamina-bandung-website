'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CrudLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthorized(true)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthorized(false)
        router.push('/login')
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const checkAuth = async () => {
    try {
      // Cek session beberapa kali dengan delay untuk memastikan session sudah tersimpan
      let session = null
      for (let i = 0; i < 3; i++) {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        // Log untuk debug
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'crud/layout.tsx:35',message:'Auth check attempt',data:{attempt:i+1,hasSession:!!currentSession,userId:currentSession?.user?.id,emailConfirmed:currentSession?.user?.email_confirmed_at,error:error?.message},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        
        if (currentSession?.user) {
          session = currentSession
          break
        }
        
        // Tunggu sebentar sebelum cek lagi
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
      
      if (session?.user) {
        setIsAuthorized(true)
      } else {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'crud/layout.tsx:50',message:'No session after retries, redirecting to login',data:{},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        router.push('/login')
      }
    } catch (error: any) {
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'crud/layout.tsx:54',message:'Auth check error',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect to login
  }

  return <>{children}</>
}

