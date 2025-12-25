import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret } = body
    
    // Verifikasi secret dari server-side
    // NEXT_PUBLIC_CRUD_SECRET tidak tersedia di server, jadi hanya cek CRUD_SECRET
    const serverSecret = process.env.CRUD_SECRET
    const isValid = secret && serverSecret && secret.trim() === serverSecret.trim()
    
    if (isValid) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false }, { status: 403 })
    }
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}
