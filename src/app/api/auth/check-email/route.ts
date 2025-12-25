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
    const emailDomain = emailLower.split('@')[1]
    
    if (!emailDomain) {
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 })
    }
    
    // Untuk sekarang, allow semua email domain (akan ditambahkan rule @pertamina.com nanti)
    // Skip domain check untuk development
    return NextResponse.json({ 
      allowed: true
    })
    
  } catch (e: any) {
    console.error('Check email error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}

