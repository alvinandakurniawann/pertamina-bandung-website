import { NextRequest, NextResponse } from 'next/server'
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
    const { email, token } = body
    
    if (!email || !token) {
      return NextResponse.json({ error: 'Email dan kode verifikasi harus diisi' }, { status: 400 })
    }
    
    const emailLower = email.toLowerCase().trim()
    const tokenTrimmed = token.trim()
    
    // Verify OTP via Supabase Auth
    const supabaseClient = createServerClient()
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email: emailLower,
      token: tokenTrimmed,
      type: 'email',
    })
    
    if (error) {
      console.error('OTP verify error:', error)
      return NextResponse.json({ error: error.message || 'Kode verifikasi tidak valid' }, { status: 400 })
    }
    
    if (!data.session) {
      return NextResponse.json({ error: 'Verifikasi gagal. Silakan coba lagi.' }, { status: 400 })
    }
    
    // Log untuk debug
    console.log('OTP verify success:', {
      userId: data.session.user.id,
      email: data.session.user.email,
      emailConfirmed: data.session.user.email_confirmed_at,
      hasSession: !!data.session
    })
    
    // Return session token untuk client
    return NextResponse.json({ 
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          email_confirmed_at: data.session.user.email_confirmed_at,
        }
      }
    })
    
  } catch (e: any) {
    console.error('Verify OTP error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

