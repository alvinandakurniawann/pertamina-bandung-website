import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper untuk create Supabase client dengan cookies
function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    }
  })
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ user: null, isAuthorized: false })
    }
    
    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()
    
    // Verify token
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ user: null, isAuthorized: false })
    }
    
    // Untuk sekarang, allow semua user yang sudah terkonfirmasi
    // Nanti bisa ditambahkan domain restriction jika diperlukan
    const isAuthorized = true
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
      },
      isAuthorized
    })
    
  } catch (e: any) {
    console.error('Session error:', e)
    return NextResponse.json({ user: null, isAuthorized: false })
  }
}

