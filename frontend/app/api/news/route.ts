import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      "https://gnews.io/api/v4/search?q=cyber+attack&lang=en&token=10aea1f2968ad9f60111f0b0f0c55915"
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