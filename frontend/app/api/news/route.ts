import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      "https://gnews.io/api/v4/search?q=cyber+attack&lang=en&token=1f75b561ae9f6be4080fa580f1ef595b"
    )

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}