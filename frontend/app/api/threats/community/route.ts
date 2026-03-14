import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

function analyzeVT(result: any) {

  if (!result || typeof result !== "object") {
    return {
      positives: 0,
      total: 0,
      verdict: "Unknown"
    }
  }

  const engines = Object.values(result)

  let positives = 0
  let total = engines.length

  engines.forEach((engine: any) => {

    const res = engine?.result?.toLowerCase?.()

    if (
      res &&
      ![
        "clean",
        "harmless",
        "undetected",
        "unrated",
        "safe"
      ].includes(res)
    ) {
      positives++
    }

  })

  let verdict = "Safe"

  if (positives > 5) verdict = "Malicious"
  else if (positives > 0) verdict = "Suspicious"

  return {
    positives,
    total,
    verdict
  }
}

export async function GET() {

  try {

    const client = await clientPromise
    const db = client.db()

    const users = await db
      .collection("users")
      .find({})
      .toArray()

    const recentThreats = await db
      .collection("phishingscans")
      .find({})
      .sort({ scannedAt: -1 })
      .limit(100)
      .toArray()

    let totalScanned = 0
    let activeReporters = users.length

    users.forEach((u: any) => {

      totalScanned +=
        (u?.linkVisits?.today || 0) +
        (u?.linkVisits?.thisWeek || 0) +
        (u?.linkVisits?.thisMonth || 0)

    })

    const attackCounts: Record<string, number> = {}

    let totalThreats = 0
    let safeLinks = 0

    const shapedThreats = recentThreats.map((doc: any) => {

      const vt = analyzeVT(doc.result)

      let verdict = vt.verdict

      if (doc.type === "phishing") verdict = "Phishing"

      if (verdict === "Safe") safeLinks++
      else totalThreats++

      attackCounts[verdict] = (attackCounts[verdict] || 0) + 1

      return {

        _id: doc._id.toString(),

        url: doc.input || doc.url || "",

        type: doc.type || "scan",

        verdict,

        reportedBy: doc.userId
          ? `user_${doc.userId.toString().slice(-4)}@phishguard`
          : undefined,

        scannedAt: doc.scannedAt,

        vtPositives: vt.positives,

        vtTotal: vt.total,

        country: doc.result?.country || "—"

      }

    })

    const attackTypes = Object.entries(attackCounts)
      .map(([type, count]) => ({
        type,
        count
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({

      totalScanned,

      totalThreats,

      safeLinks,

      activeReporters,

      attackTypes,

      recentThreats: shapedThreats

    })

  }

  catch (err) {

    console.error("community feed error:", err)

    return NextResponse.json(
      { error: "Failed to fetch community feed" },
      { status: 500 }
    )

  }

}