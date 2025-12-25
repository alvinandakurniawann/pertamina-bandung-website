import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Coba select dengan latitude/longitude/num dulu
    let { data, error } = await supabase
      .from('regions')
      .select('id, name, color, latitude, longitude, num')
      .order('num', { ascending: true, nullsFirst: false })

    // Jika kolom belum ada, select tanpa kolom yang tidak ada
    if (error && error.code === '42703') {
      console.warn('Some columns not found, trying without num. Please run migration.')
      const result = await supabase
        .from('regions')
        .select('id, name, color, latitude, longitude')
        .order('name')
      data = result.data
      error = result.error
      
      // Jika masih error, coba tanpa latitude/longitude juga
      if (error && error.code === '42703') {
        console.warn('Columns latitude/longitude not found, selecting without them. Please run migration.')
        const result2 = await supabase
          .from('regions')
          .select('id, name, color')
          .order('name')
        data = result2.data
        error = result2.error
      }
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ message: error.message, error }, { status: 500 })
    }

    // Filter regions yang memiliki latitude dan longitude (jika kolom ada)
    const filteredData = (data || []).filter(
      (r: any) => {
        // Jika kolom latitude/longitude tidak ada, return empty array
        if (!('latitude' in r) || !('longitude' in r)) {
          return false
        }
        return r.latitude != null && r.longitude != null
      }
    )

    return NextResponse.json({ data: filteredData })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

