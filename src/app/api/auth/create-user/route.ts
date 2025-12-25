import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password harus diisi' }, { status: 400 })
    }
    
    const emailLower = email.toLowerCase().trim()
    
    // Untuk sekarang, allow semua email domain
    // Nanti bisa ditambahkan domain restriction jika diperlukan
    
    // Create user dengan password via Supabase Admin API
    const { data, error } = await supabaseAdmin?.auth.admin.createUser({
      email: emailLower,
      password: password,
      email_confirm: true, // Auto-confirm email (untuk development)
    })
    
    if (error) {
      console.error('Create user error:', error)
      // Jika user sudah ada, return success (tidak error)
      if (error.message.includes('already registered')) {
        return NextResponse.json({ 
          success: true,
          message: 'User sudah terdaftar. Silakan login dengan password yang sudah ada.',
          user: { email: emailLower }
        })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'User berhasil dibuat. Silakan login dengan email dan password.',
      user: data.user
    })
    
  } catch (e: any) {
    console.error('Create user error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

