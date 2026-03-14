import { NextResponse } from 'next/server'

export async function GET() {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/extension/ping`;
  const res = await fetch(backendUrl);
  const data = await res.json();
  return NextResponse.json(data);
} 