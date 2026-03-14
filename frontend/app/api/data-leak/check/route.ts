import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json();
  const backendUrl = '`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data-leak/check';

  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
} 