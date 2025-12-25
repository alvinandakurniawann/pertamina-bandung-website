import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create server-side Supabase client
function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    const emailLower = email.toLowerCase().trim()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 })
    }
    
    // Send OTP via Supabase Auth
    // Untuk mendapatkan OTP (bukan magic link), pastikan di Supabase Dashboard:
    // Authentication → Settings → Auth Providers → Email → 
    // Enable "Confirm email" dan set "Email template" ke OTP
    const supabaseClient = createServerClient()
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: emailLower,
      options: {
        shouldCreateUser: true, // Auto-create user jika belum ada
        // Force OTP instead of magic link
        // Note: Supabase akan mengirim OTP jika email confirmation enabled
      }
    })
    
    if (error) {
      console.error('OTP send error:', error)
      return NextResponse.json({ error: error.message || 'Gagal mengirim kode verifikasi' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Kode verifikasi telah dikirim ke email Anda. Silakan cek inbox email.'
    })
    
  } catch (e: any) {
    console.error('Send OTP error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

