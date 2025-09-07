import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const client = supabaseAdmin ?? supabase
    const { data, error } = await client.from('settings').select('*').eq('id', 'ui').maybeSingle()
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ data, source: supabaseAdmin ? 'admin' : 'anon' })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const secret = (await req.headers.get('x-shared-secret')) || body.secret
    if (!secret || secret !== process.env.CRUD_SECRET) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const client = supabaseAdmin ?? supabase
    const { mapSvg } = body
    const { error } = await client
      .from('settings')
      .upsert({ id: 'ui', map_svg: mapSvg }, { onConflict: 'id' })
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}






