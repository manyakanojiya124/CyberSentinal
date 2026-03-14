import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    // attach userId for backend bookkeeping
    body.userId = session.user.id

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phishing/scan`
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("phishing scan route error:", err)
    return NextResponse.json({ error: "Server error", details: err?.message }, { status: 500 })
  }
}