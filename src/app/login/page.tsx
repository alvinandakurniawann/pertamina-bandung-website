'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // Check if already logged in
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.push('/crud')
      }
    } catch (error) {
      console.error('Session check error:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      if (!email || !password) {
        setMessage({ type: 'error', text: 'Email dan password harus diisi' })
        setLoading(false)
        return
      }
      
      const emailLower = email.toLowerCase().trim()
      
      // Log sebelum login
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:44',message:'Attempting login',data:{email:emailLower,rememberMe},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      
      // Login dengan password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: password,
      })
      
      if (error) {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:52',message:'Login error',data:{error:error.message,code:error.status},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        setMessage({ type: 'error', text: error.message || 'Email atau password salah' })
        setLoading(false)
        return
      }
      
      // Log setelah login berhasil
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:59',message:'Login success',data:{userId:data?.user?.id,emailConfirmed:data?.user?.email_confirmed_at,hasSession:!!data?.session},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      
      // Jika remember me dicentang, session akan persist (default behavior)
      // Jika tidak dicentang, session akan expire saat browser ditutup
      // Supabase client sudah dikonfigurasi dengan persistSession: true
      
      // Verifikasi session setelah login
      const { data: { session: verifiedSession } } = await supabase.auth.getSession()
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:65',message:'Session verified after login',data:{hasSession:!!verifiedSession,userId:verifiedSession?.user?.id},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      
      if (!verifiedSession) {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'login/page.tsx:68',message:'No session after login',data:{},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        setMessage({ type: 'error', text: 'Login berhasil tapi session tidak tersimpan' })
        setLoading(false)
        return
      }
      
      // Login berhasil, redirect ke CRUD - gunakan window.location untuk hard redirect
      window.location.href = '/crud'
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Terjadi kesalahan' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <img src="/logopertamina.svg" alt="Pertamina" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <div>
            <Link href="/register" className="text-sm text-blue-600 hover:text-blue-700">
              Belum punya akun? Daftar
            </Link>
          </div>
          <div>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Kembali ke Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
