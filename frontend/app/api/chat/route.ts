import { NextResponse } from 'next/server'

export async function POST(req: Request) {
const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`;
  const contentType = req.headers.get('content-type') || '';

  if (contentType.startsWith('multipart/form-data')) {
    // Parse the incoming form data
    const form = await req.formData();
    const formData = new FormData();
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') {
        formData.append(key, value);
      } else {
        // value is a File
        formData.append(key, value, value.name);
      }
    }
    const res = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Otherwise, treat as JSON
  const body = await req.json();
  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
} 