const express = require("express")
const router = express.Router()

const User = require("../models/User")
const ScanHistory = require("../models/ScanHistory")

function analyzeVT(result) {

  if (!result || typeof result !== "object") {
    return {
      positives: 0,
      total: 0,
      verdict: "Unknown"
    }
  }

  const engines = Object.values(result)

  let positives = 0
  const total = engines.length

  engines.forEach((engine) => {

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

  if (positives === 0) verdict = "Safe"
  else if (positives <= 2) verdict = "Suspicious"
  else if (positives <= 10) verdict = "Phishing"
  else verdict = "Malicious"

  return {
    positives,
    total,
    verdict
  }

}

router.get("/community-threat-feed", async (req, res) => {

  try {

    const users = await User.find({})

    const scans = await ScanHistory.find({})
      .sort({ scannedAt: -1 })
      .limit(100)

    let totalScanned = 0
    let activeReporters = users.length

    users.forEach((u) => {

      totalScanned +=
        (u?.linkVisits?.today || 0) +
        (u?.linkVisits?.thisWeek || 0) +
        (u?.linkVisits?.thisMonth || 0)

    })

    const attackCounts = {}

    let totalThreats = 0
    let safeLinks = 0

    const recentThreats = scans.map((doc) => {

      const vt = analyzeVT(doc.result)

      const verdict = vt.verdict

      if (verdict === "Safe") safeLinks++
      else totalThreats++

      attackCounts[verdict] = (attackCounts[verdict] || 0) + 1

      return {

        _id: doc._id,

        url: doc.input,

        type: doc.type,

        verdict,

        reportedBy: doc.userId
          ? `user_${doc.userId.toString().slice(-4)}`
          : "anonymous",

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

    res.json({

      totalScanned,

      totalThreats,

      safeLinks,

      activeReporters,

      attackTypes,

      recentThreats

    })

  }

  catch (err) {

    console.error("Threat feed error:", err)

    res.status(500).json({
      error: "Failed to fetch community threat feed"
    })

  }

})

module.exports = router