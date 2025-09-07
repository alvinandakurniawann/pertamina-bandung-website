import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret } = body
    
    // Verifikasi secret dari server-side
    const isValid = secret === process.env.CRUD_SECRET
    
    if (isValid) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false }, { status: 403 })
    }
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}
