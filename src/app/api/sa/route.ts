import { NextRequest, NextResponse } from 'next/server';
import saData from '@/data/sa.json';
import { Region } from '@/types/sa';

let regions: Region[] = (saData as { regions: Region[] }).regions;

export async function GET() {
  return NextResponse.json({ regions });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.regions)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    regions = body.regions as Region[];
    return NextResponse.json({ message: 'Updated', regions });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


