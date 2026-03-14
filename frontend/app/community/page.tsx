"use client"

import { useEffect, useState, useCallback } from "react"

interface ThreatEntry {
  _id: string
  url: string
  type: string
  verdict: string
  reportedBy?: string
  scannedAt: string
  vtPositives?: number
  vtTotal?: number
  country?: string
}

interface PlatformStats {
  totalScanned: number
  totalThreats: number
  safeLinks: number
  activeReporters: number
  attackTypes: { type: string; count: number }[]
  recentThreats: ThreatEntry[]
}

const VERDICT_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  Malicious:  { label: "MALICIOUS",  color: "#ff4545", bg: "rgba(255,69,69,0.1)",    dot: "#ff4545" },
  Phishing:   { label: "PHISHING",   color: "#ff6b35", bg: "rgba(255,107,53,0.1)",   dot: "#ff6b35" },
  Suspicious: { label: "SUSPICIOUS", color: "#ffb347", bg: "rgba(255,179,71,0.1)",   dot: "#ffb347" },
  Safe:       { label: "SAFE",       color: "#4ade80", bg: "rgba(74,222,128,0.1)",   dot: "#4ade80" },
  Clean:      { label: "CLEAN",      color: "#4ade80", bg: "rgba(74,222,128,0.1)",   dot: "#4ade80" },
  Unknown:    { label: "UNKNOWN",    color: "#6b7280", bg: "rgba(107,114,128,0.1)",  dot: "#6b7280" },
}

const ATTACK_COLORS = ["#ff4545", "#ff6b35", "#ffb347", "#a78bfa", "#38bdf8", "#4ade80"]

function truncateUrl(url: string, max = 48) {
  try {
    const u = new URL(url)
    const full = u.hostname + u.pathname
    return full.length > max ? full.slice(0, max) + "…" : full
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function anonymize(reporter?: string) {
  if (!reporter) return "anonymous"
  const parts = reporter.split("@")
  return parts[0].slice(0, 2) + "***" + (parts[1] ? "@" + parts[1] : "")
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await fetch(
    "/api/community/community-threat-feed",
    { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
  )
  if (!res.ok) throw new Error("Failed to fetch threat feed")
  return res.json()
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let v = 0
    const step = target / (duration / 16)
    const t = setInterval(() => {
      v += step
      if (v >= target) { setVal(target); clearInterval(t) }
      else setVal(Math.floor(v))
    }, 16)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false)
  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 900)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isTablet
}

function PulseDot({ color }: { color: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.4, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
      <span style={{ borderRadius: "50%", width: 10, height: 10, background: color, display: "block" }} />
    </span>
  )
}

function StatCard({ label, value, sub, color, icon }: {
  label: string; value: number; sub?: string; color: string; icon: string
}) {
  const displayed = useCountUp(value)
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 10,
      padding: "16px 18px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 12, right: 14, fontSize: 18, opacity: 0.1 }}>{icon}</div>
      <div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>
        {displayed.toLocaleString()}
      </div>
      {sub && <div style={{ fontSize: 9, color: "#4b5563", marginTop: 3 }}>{sub}</div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  )
}

function AttackDonut({ data }: { data: { type: string; count: number }[] }) {
  const isMobile = useIsMobile()
  const total = data.reduce((s, d) => s + d.count, 0) || 1
  let offset = 0
  const r = 54, cx = 70, cy = 70
  const circumference = 2 * Math.PI * r

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
            {data.map((d, i) => {
              const pct = d.count / total
              const dash = pct * circumference
              const seg = (
                <circle key={d.type} cx={cx} cy={cy} r={r}
                  fill="none" stroke={ATTACK_COLORS[i % ATTACK_COLORS.length]}
                  strokeWidth={14}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset * circumference}
                  strokeLinecap="round"
                  style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)" }}
                />
              )
              offset += pct
              return seg
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#e5e7eb" fontSize={18} fontWeight={700} fontFamily="'JetBrains Mono', monospace">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize={10}>total</text>
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((d, i) => {
            const cfg = VERDICT_CONFIG[d.type] || VERDICT_CONFIG.Unknown
            return (
              <div key={d.type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: ATTACK_COLORS[i % ATTACK_COLORS.length], flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#9ca3af", flex: 1 }}>{d.type}</span>
                <span style={{ fontSize: 12, color: cfg.color, fontFamily: "monospace", fontWeight: 600 }}>{d.count}</span>
                <span style={{ fontSize: 10, color: "#374151", minWidth: 28, textAlign: "right" }}>{Math.round(d.count / total * 100)}%</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
        {data.map((d, i) => {
          const pct = d.count / total
          const dash = pct * circumference
          const seg = (
            <circle key={d.type} cx={cx} cy={cy} r={r}
              fill="none" stroke={ATTACK_COLORS[i % ATTACK_COLORS.length]}
              strokeWidth={14}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              strokeLinecap="round"
              style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)" }}
            />
          )
          offset += pct
          return seg
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#e5e7eb" fontSize={18} fontWeight={700} fontFamily="'JetBrains Mono', monospace">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize={10}>total</text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => {
          const cfg = VERDICT_CONFIG[d.type] || VERDICT_CONFIG.Unknown
          return (
            <div key={d.type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: ATTACK_COLORS[i % ATTACK_COLORS.length], flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#9ca3af", flex: 1 }}>{d.type}</span>
              <span style={{ fontSize: 12, color: cfg.color, fontFamily: "monospace", fontWeight: 600 }}>{d.count}</span>
              <span style={{ fontSize: 10, color: "#374151", minWidth: 28, textAlign: "right" }}>{Math.round(d.count / total * 100)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ThreatRowMobile({ entry, index }: { entry: ThreatEntry; index: number }) {
  const cfg = VERDICT_CONFIG[entry.verdict] || VERDICT_CONFIG.Unknown
  const isNew = index < 3
  return (
    <div style={{
      padding: "12px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: isNew ? "rgba(255,255,255,0.015)" : "transparent",
      animation: isNew ? "fadeSlideIn 0.4s ease both" : "none",
      animationDelay: `${index * 0.04}s`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {isNew ? <PulseDot color={cfg.dot} /> : <span style={{ fontSize: 10, color: "#374151", fontFamily: "monospace", flexShrink: 0 }}>{String(index + 1).padStart(2, "0")}</span>}
          <div style={{ fontSize: 11, color: "#d1d5db", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
            {truncateUrl(entry.url, 32)}
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
          color: cfg.color, background: cfg.bg,
          padding: "2px 6px", borderRadius: 4,
          border: `1px solid ${cfg.color}30`,
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {cfg.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#4b5563" }}>
        <span>by {anonymize(entry.reportedBy)}</span>
        {entry.vtPositives !== undefined && (
          <span style={{ color: entry.vtPositives > 0 ? cfg.color : "#4ade80" }}>VT: {entry.vtPositives}/{entry.vtTotal}</span>
        )}
        {entry.country && <span>{entry.country}</span>}
        <span style={{ marginLeft: "auto" }}>{timeAgo(entry.scannedAt)}</span>
      </div>
    </div>
  )
}

function ThreatRow({ entry, index }: { entry: ThreatEntry; index: number }) {
  const cfg = VERDICT_CONFIG[entry.verdict] || VERDICT_CONFIG.Unknown
  const isNew = index < 3
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px minmax(0,1fr) 108px 80px 64px 72px",
        gap: 10,
        alignItems: "center",
        padding: "9px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: isNew ? "rgba(255,255,255,0.015)" : "transparent",
        transition: "background 0.15s",
        animation: isNew ? "fadeSlideIn 0.4s ease both" : "none",
        animationDelay: `${index * 0.04}s`,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={e => (e.currentTarget.style.background = isNew ? "rgba(255,255,255,0.015)" : "transparent")}
    >
      <span style={{ fontSize: 10, color: "#374151" }}>
        {isNew
          ? <PulseDot color={cfg.dot} />
          : <span style={{ fontFamily: "monospace" }}>{String(index + 1).padStart(2, "0")}</span>
        }
      </span>
      <div style={{ overflow: "hidden", minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#d1d5db", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {truncateUrl(entry.url)}
        </div>
        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>
          by {anonymize(entry.reportedBy)}
        </div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
        color: cfg.color, background: cfg.bg,
        padding: "3px 7px", borderRadius: 4,
        border: `1px solid ${cfg.color}30`,
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        display: "block",
      }}>
        {cfg.label}
      </span>
      <div style={{ fontSize: 11, fontFamily: "monospace" }}>
        {entry.vtPositives !== undefined
          ? <span style={{ color: entry.vtPositives > 0 ? cfg.color : "#4ade80" }}>{entry.vtPositives}/{entry.vtTotal}</span>
          : <span style={{ color: "#374151" }}>—</span>
        }
      </div>
      <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{entry.country || "—"}</span>
      <span style={{ fontSize: 10, color: "#4b5563" }}>{timeAgo(entry.scannedAt)}</span>
    </div>
  )
}

const FILTERS = ["All", "Phishing", "Malicious", "Suspicious", "Safe"]

function FilterBar({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {FILTERS.map(f => {
        const cfg = VERDICT_CONFIG[f]
        const isActive = active === f
        return (
          <button key={f} onClick={() => onChange(f)} style={{
            padding: "4px 10px", fontSize: 10, fontWeight: 600,
            borderRadius: 5,
            border: isActive && cfg ? `1px solid ${cfg.color}60` : "1px solid rgba(255,255,255,0.08)",
            background: isActive && cfg ? cfg.bg : "rgba(255,255,255,0.03)",
            color: isActive ? (cfg?.color || "#e5e7eb") : "#6b7280",
            cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.15s",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {f.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

function LiveTicker({ threats }: { threats: ThreatEntry[] }) {
  const malicious = threats.filter(t => t.verdict === "Malicious" || t.verdict === "Phishing").slice(0, 6)
  if (!malicious.length) return null
  return (
    <div style={{
      background: "rgba(255,69,69,0.05)",
      borderTop: "1px solid rgba(255,69,69,0.15)",
      borderBottom: "1px solid rgba(255,69,69,0.15)",
      padding: "7px 0", overflow: "hidden",
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          flexShrink: 0, padding: "0 16px",
          fontSize: 9, fontWeight: 700, color: "#ff4545",
          letterSpacing: "0.15em",
          borderRight: "1px solid rgba(255,69,69,0.2)",
          marginRight: 16, whiteSpace: "nowrap",
        }}>
          ⚠ LIVE
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ display: "flex", gap: 40, whiteSpace: "nowrap", animation: "ticker 20s linear infinite" }}>
            {[...malicious, ...malicious].map((t, i) => (
              <span key={i} style={{ fontSize: 11, color: "#ff6b6b", fontFamily: "monospace" }}>
                {truncateUrl(t.url, 40)}
                <span style={{ color: "#374151", marginLeft: 6 }}>{timeAgo(t.scannedAt)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunityThreatFeed() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchPlatformStats()
      setStats(data)
      setLastUpdated(new Date())
    } catch (e: any) {
      setError(e.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  const filtered = (stats?.recentThreats || []).filter(t => {
    const matchFilter = filter === "All" || t.verdict === filter
    const matchSearch = !search || t.url.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Stat cards grid: 2 cols on mobile, 4 on desktop
  const statGridCols = isMobile ? "repeat(2, 1fr)" : "repeat(4, minmax(0, 1fr))"
  // Chart grid: 1 col on tablet/mobile, 2 on desktop
  const chartGridCols = isTablet ? "1fr" : "1fr 300px"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ping       { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes ticker     { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeSlideIn{ from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink      { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        ::-webkit-scrollbar       { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#080b0f",
        color: "#e5e7eb",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "0 16px 48px" : "0 24px 64px",
        }}>

          {/* HEADER */}
          <div style={{
            padding: isMobile ? "20px 0 16px" : "32px 0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ff4545", opacity: 0.4, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4545", display: "block" }} />
                  </span>
                  <span style={{ fontSize: 9, color: "#ff4545", letterSpacing: "0.18em", fontWeight: 700 }}>LIVE FEED</span>
                </div>
                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? 28 : 36,
                  fontWeight: 800,
                  color: "#f9fafb",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}>
                  Community<br />
                  <span style={{ color: "#ff4545" }}>Threat</span> Feed
                </h1>
                <p style={{ fontSize: 12, color: "#4b5563", marginTop: 10, maxWidth: 400, lineHeight: 1.75 }}>
                  Real-time phishing &amp; malware URLs reported by the community.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, paddingTop: 4 }}>
                <span style={{ fontSize: 9, color: "#374151" }}>
                  {lastUpdated ? lastUpdated.toLocaleTimeString("en-IN") : "—"}
                </span>
                <button onClick={load} style={{
                  padding: "6px 14px", fontSize: 10, fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7,
                  background: "rgba(255,255,255,0.03)", color: "#9ca3af",
                  cursor: "pointer", letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ↻ REFRESH
                </button>
              </div>
            </div>
          </div>

          {stats && <LiveTicker threats={stats.recentThreats} />}

          {loading && !stats && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#374151", fontSize: 12 }}>
              Loading threat data…
            </div>
          )}
          {error && !stats && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#ff4545", fontSize: 12 }}>
              {error}
            </div>
          )}

          {stats && (
            <>
              {/* STAT CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: statGridCols, gap: 10, marginBottom: 16 }}>
                <StatCard label="Total Scanned"     value={stats.totalScanned}    color="#e5e7eb" icon="🔍" sub="all time" />
                <StatCard label="Threats Detected"  value={stats.totalThreats}    color="#ff4545" icon="☠"  sub="phishing + malicious" />
                <StatCard label="Safe Links"         value={stats.safeLinks}       color="#4ade80" icon="✓"  sub="verified clean" />
                <StatCard label="Active Reporters"   value={stats.activeReporters} color="#38bdf8" icon="👥" sub="community members" />
              </div>

              {/* DONUT + BARS */}
              <div style={{ display: "grid", gridTemplateColumns: chartGridCols, gap: 10, marginBottom: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Attack type breakdown</div>
                  <AttackDonut data={stats.attackTypes} />
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 9, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Severity breakdown</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {stats.attackTypes.map((a, i) => {
                      const total = stats.attackTypes.reduce((s, x) => s + x.count, 0) || 1
                      const pct = Math.round(a.count / total * 100)
                      const cfg = VERDICT_CONFIG[a.type] || VERDICT_CONFIG.Unknown
                      return (
                        <div key={a.type}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: cfg.color }}>{a.type}</span>
                            <span style={{ fontSize: 10, color: "#4b5563", fontFamily: "monospace" }}>{a.count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: ATTACK_COLORS[i % ATTACK_COLORS.length], borderRadius: 3, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase" }}>Recent Reports</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,69,69,0.08)", color: "#ff4545", fontWeight: 600 }}>
                      {filtered.length} URLs
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
                    <input
                      type="text"
                      placeholder="Search URLs…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{
                        padding: "5px 10px", fontSize: 11,
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5,
                        background: "rgba(255,255,255,0.03)", color: "#e5e7eb",
                        outline: "none", fontFamily: "monospace",
                        width: isMobile ? "100%" : 170,
                      }}
                    />
                    <FilterBar active={filter} onChange={setFilter} />
                  </div>
                </div>

                {/* Desktop table header */}
                {!isMobile && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "28px minmax(0,1fr) 108px 80px 64px 72px",
                    gap: 10, padding: "7px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    fontSize: 9, color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>
                    <span>#</span><span>URL</span><span>Verdict</span><span>VT Score</span><span>Country</span><span>Time</span>
                  </div>
                )}

                <div style={{ maxHeight: 480, overflowY: "auto" }}>
                  {filtered.length === 0
                    ? <div style={{ textAlign: "center", padding: "40px 0", color: "#374151", fontSize: 12 }}>No results</div>
                    : filtered.map((entry, i) =>
                        isMobile
                          ? <ThreatRowMobile key={entry._id} entry={entry} index={i} />
                          : <ThreatRow key={entry._id} entry={entry} index={i} />
                      )
                  }
                </div>
              </div>

              <div style={{ marginTop: 20, textAlign: "center", fontSize: 9, color: "#1f2937", letterSpacing: "0.06em" }}>
                AUTO-REFRESHES EVERY 30s · ALL URLS ANONYMIZED · POWERED BY PHISHGUARD COMMUNITY
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}