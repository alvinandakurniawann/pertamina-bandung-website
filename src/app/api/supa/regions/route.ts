import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function forbidden() { return NextResponse.json({ message: 'Forbidden' }, { status: 403 }) }
function check(req: NextRequest) {
  const s = req.headers.get('x-shared-secret')
  return s && s === process.env.CRUD_SECRET
}

export async function POST(req: NextRequest) {
  if (!check(req)) return forbidden()
  if (!supabaseAdmin) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 })
  const body = await req.json()
  const { error } = await supabaseAdmin.from('regions').insert(body)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  if (!check(req)) return forbidden()
  if (!supabaseAdmin) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 })
  const body = await req.json()
  const { id, ...rest } = body
  const { error } = await supabaseAdmin.from('regions').update(rest).eq('id', id)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!check(req)) return forbidden()
  if (!supabaseAdmin) return NextResponse.json({ message: 'Supabase not configured' }, { status: 500 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { error } = await supabaseAdmin.from('regions').delete().eq('id', id)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}






