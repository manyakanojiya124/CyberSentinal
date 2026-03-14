import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({
    email: session.user.email
  })

  if (!user) {
    console.log("User not found for email:", session.user.email)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const linkVisits = user.linkVisits || {
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  }

  const history = user.linkHistory || []

  const attackCounts: Record<string, number> = {}

  history.forEach((entry: any) => {
    if (entry.status) {
      attackCounts[entry.status] =
        (attackCounts[entry.status] || 0) + 1
    }
  })

  const attackTypes = Object.entries(attackCounts).map(
    ([type, count]) => ({ type, count })
  )

  return NextResponse.json({
    username: user.username || user.name || user.email,
    email: user.email,
    linkVisits,
    attackTypes,
    linkHistory: history,
    quizHighScore: user.quizHighScore || 0
  })
}