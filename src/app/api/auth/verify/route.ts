import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret } = body
    
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/verify/route.ts:10',message:'Verification attempt',data:{secretLength:secret?.length||0,hasCrudSecret:!!process.env.CRUD_SECRET,crudSecretLength:process.env.CRUD_SECRET?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Verifikasi secret dari server-side
    // NEXT_PUBLIC_CRUD_SECRET tidak tersedia di server, jadi hanya cek CRUD_SECRET
    const serverSecret = process.env.CRUD_SECRET
    const isValid = secret && serverSecret && secret.trim() === serverSecret.trim()
    
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/verify/route.ts:18',message:'Verification result',data:{isValid,secretMatch:secret?.trim()===serverSecret?.trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (isValid) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false }, { status: 403 })
    }
  } catch (e: any) {
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/ea528f33-46a3-45fd-854b-ff27e6e33f6a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/verify/route.ts:26',message:'Verification error',data:{error:e?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ message: e?.message || 'Bad Request' }, { status: 400 })
  }
}
