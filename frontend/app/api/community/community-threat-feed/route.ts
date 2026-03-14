import { NextResponse } from "next/server"

export async function GET() {

  try {

const res = await fetch(
  `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/community/community-threat-feed`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  }
)

    if (!res.ok) {
      throw new Error("Backend fetch failed")
    }

    const data = await res.json()

    return NextResponse.json(data)

  } catch (err) {

    console.error("Community Threat Feed API Error:", err)

    return NextResponse.json(
      { error: "Failed to fetch community threat feed" },
      { status: 500 }
    )

  }

}