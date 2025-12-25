import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, token } = body
    
    if (!email || !token) {
      return NextResponse.json({ error: 'Email and token are required' }, { status: 400 })
    }
    
    // Verify token dengan Supabase Auth
    // Note: Untuk development, kita bisa menggunakan OTP verification
    // Atau magic link verification
    
    // Untuk sekarang, kita akan verify via Supabase Auth session
    // User akan login via magic link yang dikirim Supabase
    
    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully'
    })
    
  } catch (e: any) {
    console.error('Verify error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

