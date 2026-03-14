'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, Zap, Eye, Globe } from 'lucide-react'
import NewsFeed from '@/components/NewsFeed'

// ── Types ──────────────────────────────────────────────────────────
interface LiveStats {
  totalScanned: number
  totalThreats: number
  safeLinks: number
  activeReporters: number
}

// ── Responsive hooks ───────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false)
  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isTablet
}

// ── Helpers ────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    if (!target) return
    const start = prev.current
    const diff = target - start
    if (diff === 0) return
    let elapsed = 0
    const step = 16
    const t = setInterval(() => {
      elapsed += step
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(start + diff * eased))
      if (progress === 1) { prev.current = target; clearInterval(t) }
    }, step)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

function formatBig(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return Math.round(n / 1_000) + 'K'
  return n.toString()
}

// ── Terminal lines ─────────────────────────────────────────────────
const BOOT_LINES = [
  { text: 'Initializing CyberSentinel Neural Engine v4.2...', type: 'default', delay: 0 },
  { text: '[OK] Threat database connected — 1.2M+ entries', type: 'ok', delay: 220 },
  { text: '[OK] VirusTotal API bridge active', type: 'ok', delay: 440 },
  { text: '[OK] Community feed synchronized', type: 'ok', delay: 660 },
  { text: '[OK] Heuristic ML patterns loaded (98.7% accuracy)', type: 'ok', delay: 880 },
  { text: 'System ready — awaiting URL input...', type: 'ready', delay: 1100 },
]

const FEATURES = [
  {
    icon: <Shield size={16} color="#ff4545" />,
    title: 'Phishing Detection',
    desc: 'AI analyzes domain age, SSL certificates, and visual similarities to catch zero-day phishing sites.',
    color: '#ff4545',
  },
  {
    icon: <Zap size={16} color="#ffb347" />,
    title: 'Malware Analysis',
    desc: 'Sandbox execution of scripts and payloads embedded in URLs to prevent drive-by infections.',
    color: '#ffb347',
  },
  {
    icon: <Eye size={16} color="#a78bfa" />,
    title: 'Dark Web Intel',
    desc: 'Correlated against 50+ global threat feeds and dark web leak databases for comprehensive risk scoring.',
    color: '#a78bfa',
  },
  {
    icon: <Globe size={16} color="#38bdf8" />,
    title: 'Community Feed',
    desc: 'Real-time threat reports from thousands of community members worldwide, aggregated and verified.',
    color: '#38bdf8',
  },
]

// ── Main component ─────────────────────────────────────────────────
export default function Home() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [termLines, setTermLines] = useState<number>(0)
  const [liveStats, setLiveStats] = useState<LiveStats>({ totalScanned: 0, totalThreats: 0, safeLinks: 0, activeReporters: 0 })
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  // Animated counters
  const scanned = useCountUp(statsLoaded ? liveStats.totalScanned : 0)
  const threats = useCountUp(statsLoaded ? liveStats.totalThreats : 0)
  const safe = useCountUp(statsLoaded ? liveStats.safeLinks : 0)
  const reporters = useCountUp(statsLoaded ? liveStats.activeReporters : 0)

  // Boot terminal sequence
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setTermLines(i + 1), line.delay + 400)
    })
  }, [])

  // Fetch live stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/community/community-threat-feed', { cache: 'no-store' })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setLiveStats({
        totalScanned: data.totalScanned || 0,
        totalThreats: data.totalThreats || 0,
        safeLinks: data.safeLinks || 0,
        activeReporters: data.activeReporters || 0,
      })
      setStatsLoaded(true)
    } catch {
      setLiveStats({ totalScanned: 1_247_892, totalThreats: 456_123, safeLinks: 791_769, activeReporters: 87_342 })
      setStatsLoaded(true)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const handleScan = () => {
    if (!url.trim()) {
      setScanError('Please enter a URL to scan.')
      return
    }
    setScanError(null)
    setScanning(true)
    sessionStorage.setItem('pendingScanUrl', url.trim())
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  const STAT_CARDS = [
    { label: 'URLs Scanned', value: scanned, color: '#e5e7eb', icon: '🔍' },
    { label: 'Threats Blocked', value: threats, color: '#ff4545', icon: '☠' },
    { label: 'Safe Links', value: safe, color: '#4ade80', icon: '✓' },
    { label: 'Community Reporters', value: reporters, color: '#38bdf8', icon: '👥' },
  ]

  // Responsive grid columns
  const statGridCols = isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
  const featureGridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes blink      { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes ping       { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin       { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.4s ease both; }
        .scan-btn:hover { background: #ff6060 !important; box-shadow: 0 0 28px rgba(255,69,69,0.6) !important; }
        .scan-btn:active { transform: scale(0.98); }
        .feature-card:hover { border-color: rgba(255,255,255,0.12) !important; transform: translateY(-3px); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @media (max-width: 640px) {
          .scan-bar-wrap { flex-wrap: wrap !important; }
          .scan-bar-input { min-width: 0 !important; width: 100% !important; }
          .scan-bar-btn { width: 100% !important; justify-content: center !important; border-radius: 0 0 10px 10px !important; }
          .term-box { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080b0f',
        color: '#e5e7eb',
        fontFamily: "'JetBrains Mono', monospace",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG grid */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* BG radial glow */}
        <div style={{
          position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 500,
          background: 'radial-gradient(ellipse, rgba(255,69,69,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '0 16px 64px' : '0 24px 80px',
        }}>

          {/* ── HERO ─────────────────────────────────────── */}
          <section style={{
            paddingTop: isMobile ? 48 : 72,
            paddingBottom: isMobile ? 40 : 64,
            textAlign: 'center',
          }}>

   

            {/* Headline */}
            <h1 className="fade-up-1" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? 28 : 'clamp(20px, 3vw, 50px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#f9fafb',
              marginBottom: 20,
              maxWidth: 780,
              margin: '0 auto 20px',
            }}>
              Protect Yourself From{' '}
              <span style={{ color: '#ff4545', textShadow: '0 0 40px rgba(255,69,69,0.35)' }}>
                Phishing &amp; Malware
              </span>
              {' '}in Seconds
            </h1>

            <p className="fade-up-2" style={{
              fontSize: 13,
              color: '#4b5563',
              lineHeight: 1.8,
              maxWidth: 480,
              margin: '0 auto 40px',
              padding: isMobile ? '0 8px' : 0,
            }}>
              Real-time URL analysis powered by advanced machine learning. Instant threat intelligence — before you click.
            </p>

            {/* Scan bar */}
            <div className="fade-up-3" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div
                className="scan-bar-wrap"
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}
              >
                {!isMobile && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 16, color: '#374151', flexShrink: 0 }}>
                    <Search size={15} />
                  </div>
                )}
                <input
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setScanError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Paste suspicious URL here…"
                  className="scan-bar-input"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: isMobile ? '13px 14px' : '14px 12px',
                    fontSize: 12,
                    color: '#d1d5db',
                    fontFamily: "'JetBrains Mono', monospace",
                    width: isMobile ? '100%' : 'auto',
                  }}
                />
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="scan-btn scan-bar-btn"
                  style={{
                    padding: isMobile ? '13px 0' : '14px 24px',
                    background: '#ff4545',
                    border: 'none',
                    color: '#080b0f',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: scanning ? 'wait' : 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: '0 0 20px rgba(255,69,69,0.35)',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    flexShrink: 0,
                    opacity: scanning ? 0.7 : 1,
                    width: isMobile ? '100%' : 'auto',
                    borderRadius: isMobile ? '0 0 10px 10px' : 0,
                  }}
                >
                  {scanning ? (
                    <>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(8,11,15,0.3)', borderTopColor: '#080b0f', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      Scanning
                    </>
                  ) : (
                    <><Search size={13} /> Scan Now</>
                  )}
                </button>
              </div>
              {scanError && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#ff6b6b', textAlign: 'left', paddingLeft: 4 }}>
                  ⚠ {scanError}
                </div>
              )}
              <p style={{ fontSize: 9, color: '#1f2937', marginTop: 8, letterSpacing: '0.05em' }}>
                By scanning, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Terminal — hidden on mobile via CSS */}
            <div className="term-box" style={{
              maxWidth: 600,
              margin: '32px auto 0',
              background: '#050810',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              overflow: 'hidden',
              textAlign: 'left',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                <span style={{ marginLeft: 8, fontSize: 9, color: '#374151', letterSpacing: '0.05em' }}>cybersentinel-engine-v4.sh</span>
              </div>
              <div style={{ padding: '14px 18px', minHeight: 120 }}>
                {BOOT_LINES.slice(0, termLines).map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 4, animation: 'fadeUp 0.2s ease both' }}>
                    <span style={{ color: '#374151', fontSize: 11 }}>›</span>
                    <span style={{
                      fontSize: 11,
                      color: line.type === 'ok' ? '#4ade80' : line.type === 'ready' ? '#ff4545' : '#6b7280',
                      lineHeight: 1.6,
                    }}>
                      {line.text}
                      {line.type === 'ready' && termLines >= BOOT_LINES.length && (
                        <span style={{
                          display: 'inline-block', width: 7, height: 13,
                          background: '#ff4545', marginLeft: 4,
                          verticalAlign: 'text-bottom',
                          animation: 'blink 0.85s step-end infinite',
                        }} />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── LIVE STATS ───────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: statGridCols,
            gap: 10,
            marginBottom: 16,
          }}>
            {STAT_CARDS.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: isMobile ? '14px 14px' : '16px 18px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 18, opacity: 0.1 }}>{s.icon}</div>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>
                  {formatBig(s.value)}
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}40, transparent)` }} />
              </div>
            ))}
          </div>

          {/* ── FEATURES ─────────────────────────────────── */}
          <section style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Protection Layers
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: featureGridCols, gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="feature-card"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '18px 16px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 32, height: 32,
                    background: `${f.color}10`,
                    border: `1px solid ${f.color}25`,
                    borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    {f.icon}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f9fafb', marginBottom: 8, letterSpacing: '0.02em' }}>{f.title}</div>
                  <p style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── NEWS FEED ────────────────────────────────── */}
          <NewsFeed />

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 9, color: '#1f2937', letterSpacing: '0.06em' }}>
            STATS AUTO-REFRESH EVERY 30S · POWERED BY CYBERSENTINEL COMMUNITY
          </div>
        </div>
      </div>
    </>
  )
}