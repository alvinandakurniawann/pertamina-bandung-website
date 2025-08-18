import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const secret = (await req.headers.get('x-shared-secret')) || body.secret
    if (!secret || secret !== process.env.NEXT_PUBLIC_CRUD_SECRET) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    if (!supabaseAdmin) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 })

    const { mapSvg } = body
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ id: 'ui', map_svg: mapSvg }, { onConflict: 'id' })
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}






