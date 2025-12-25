'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      // Validation
      if (!username.trim()) {
        setMessage({ type: 'error', text: 'Username harus diisi' })
        setLoading(false)
        return
      }
      
      if (username.length < 3) {
        setMessage({ type: 'error', text: 'Username minimal 3 karakter' })
        setLoading(false)
        return
      }
      
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'Password minimal 6 karakter' })
        setLoading(false)
        return
      }
      
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak sama' })
        setLoading(false)
        return
      }
      
      const emailLower = email.toLowerCase().trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailLower)) {
        setMessage({ type: 'error', text: 'Format email tidak valid' })
        setLoading(false)
        return
      }
      
      // Register dengan password
      // Catatan: Supabase akan membuat user tapi email belum terkonfirmasi
      // User perlu verifikasi email dulu sebelum bisa login dengan password
      const { data, error } = await supabase.auth.signUp({
        email: emailLower,
        password: password,
        options: {
          data: {
            username: username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/crud`,
        }
      })
      
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Gagal mendaftar' })
        setLoading(false)
        return
      }
      
      // Log untuk debug
      fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:70',message:'SignUp success',data:{email:emailLower,user:data?.user?.id,emailConfirmed:data?.user?.email_confirmed_at},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      
      // Setelah signup, kirim OTP untuk verifikasi email
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      })
      
      const otpData = await response.json()
      
      if (!response.ok) {
        // User sudah terdaftar, tapi OTP gagal dikirim
        // User bisa request OTP lagi di step verify
        console.error('OTP send error:', otpData.error)
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:95',message:'OTP send failed',data:{error:otpData.error},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:98',message:'OTP send success',data:{email:emailLower},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
      }
      
      setMessage({ type: 'success', text: 'Akun berhasil dibuat! Kode verifikasi telah dikirim ke email Anda.' })
      setStep('verify')
      setResendCooldown(60)
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      const emailLower = email.toLowerCase().trim()
      const otpTrimmed = otp.trim()
      
      if (otpTrimmed.length !== 6) {
        setMessage({ type: 'error', text: 'Kode verifikasi harus 6 digit' })
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, token: otpTrimmed }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Kode verifikasi tidak valid' })
        setLoading(false)
        return
      }
      
      // Set session di client
      if (data.session) {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:145',message:'Setting session',data:{hasSession:!!data.session,userId:data.session?.user?.id,emailConfirmed:data.session?.user?.email_confirmed_at},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        
        const { error: sessionError, data: sessionData } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        
        if (sessionError) {
          fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:152',message:'Session error',data:{error:sessionError.message},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
          setMessage({ type: 'error', text: 'Gagal menyimpan session' })
          setLoading(false)
          return
        }
        
        // Verifikasi session setelah set - cek beberapa kali untuk memastikan
        let verifiedSession = null
        for (let i = 0; i < 3; i++) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            verifiedSession = session
            break
          }
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:158',message:'Session set successfully',data:{userId:sessionData?.user?.id,emailConfirmed:sessionData?.user?.email_confirmed_at,verifiedSession:!!verifiedSession},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        
        if (!verifiedSession) {
          fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:165',message:'Session not verified after set',data:{},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
          setMessage({ type: 'error', text: 'Session tidak tersimpan. Silakan coba login lagi.' })
          setLoading(false)
          return
        }
      } else {
        fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'register/page.tsx:161',message:'No session in response',data:{},timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
        setMessage({ type: 'error', text: 'Verifikasi berhasil tapi session tidak tersedia' })
        setLoading(false)
        return
      }
      
      // Redirect ke CRUD page setelah verifikasi - gunakan window.location untuk hard redirect
      window.location.href = '/crud'
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return
    
    setLoading(true)
    setMessage(null)
    
    try {
      const emailLower = email.toLowerCase().trim()
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Gagal mengirim ulang kode verifikasi' })
        setLoading(false)
        return
      }
      
      setMessage({ type: 'success', text: 'Kode verifikasi telah dikirim ulang ke email Anda' })
      setResendCooldown(60)
      setOtp('')
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <img src="/logopertamina.svg" alt="Pertamina" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Verifikasi Email</h1>
            <p className="text-sm text-gray-600 mt-2">Masukkan kode verifikasi yang dikirim ke email Anda</p>
          </div>

          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Verifikasi
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Kode telah dikirim ke <strong>{email}</strong>
              </p>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('form')
                  setOtp('')
                  setMessage(null)
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || loading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : 'Kirim Ulang'}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
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

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              Sudah punya akun? Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <img src="/logopertamina.svg" alt="Pertamina" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
          <p className="text-sm text-gray-600 mt-2">Buat akun baru untuk mengakses CRUD</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={3}
              autoFocus
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
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
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              Sudah punya akun? Login
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

