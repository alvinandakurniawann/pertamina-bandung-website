import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (key) {
    const { data, error } = await supabase.from('region_stats').select('*').eq('key', key).maybeSingle()
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ data })
  }
  const { data, error } = await supabase.from('region_stats').select('*')
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ data })
}



