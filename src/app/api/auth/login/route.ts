import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    const emailLower = email.toLowerCase().trim()
    
    // Untuk sekarang, allow semua email domain
    // Nanti bisa ditambahkan domain restriction jika diperlukan
    
    // Send magic link via Supabase Auth
    // Note: Supabase akan mengirim email OTP/magic link
    // Untuk development, kita bisa skip email verification dengan setting di Supabase Dashboard
    const { data, error } = await supabaseAdmin?.auth.admin.generateLink({
      type: 'magiclink',
      email: emailLower,
    })
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Return success (Supabase akan mengirim email)
    return NextResponse.json({ 
      success: true,
      message: 'Link verifikasi telah dikirim ke email Anda. Silakan cek inbox email.'
    })
    
  } catch (e: any) {
    console.error('Login error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

