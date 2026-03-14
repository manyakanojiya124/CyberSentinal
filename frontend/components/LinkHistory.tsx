'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ExternalLink, Clock, CheckCircle, XCircle, Minus } from 'lucide-react'

interface Entry {
  url: string
  status: string
  time?: string
  scannedAt?: string
}

function truncUrl(url: string, max = 55) {
  try {
    const u = new URL(url)
    const s = u.hostname + u.pathname
    return s.length > max ? s.slice(0, max) + '…' : s
  } catch {
    return url.length > max ? url.slice(0, max) + '…' : url
  }
}

function timeAgo(str: string) {
  const diff = Date.now() - new Date(str).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = '#ffb347', bg = 'rgba(255,179,71,0.1)', border = 'rgba(255,179,71,0.3)'
  let Icon = Minus
  if (s === 'safe' || s === 'clean') { color = '#4ade80'; bg = 'rgba(74,222,128,0.1)'; border = 'rgba(74,222,128,0.3)'; Icon = CheckCircle }
  else if (s === 'malicious' || s === 'phishing') { color = '#ff4545'; bg = 'rgba(255,69,69,0.1)'; border = 'rgba(255,69,69,0.3)'; Icon = XCircle }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      color, background: bg, border: `1px solid ${border}`,
      padding: '3px 8px', borderRadius: 4,
      fontFamily: "'JetBrains Mono', monospace",
      whiteSpace: 'nowrap', textTransform: 'uppercase',
    }}>
      <Icon size={10} />
      {status}
    </span>
  )
}

export default function LinkHistory() {
  const { data: session } = useSession()
  const [history, setHistory] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'Safe' | 'Malicious'>('All')

  const fetchHistory = async () => {
    if (!session?.user) { setHistory([]); setLoading(false); return }
    try {
      setLoading(true)
      const res = await fetch('/api/user/stats')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setHistory(data.linkHistory || [])
    } catch { setHistory([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchHistory() }, [session?.user])

  const filtered = history.filter(h => {
    if (filter === 'All') return true
    return h.status.toLowerCase() === filter.toLowerCase()
  })

  const safeCount = history.filter(h => h.status.toLowerCase() === 'safe' || h.status.toLowerCase() === 'clean').length
  const malCount = history.filter(h => h.status.toLowerCase() === 'malicious' || h.status.toLowerCase() === 'phishing').length

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      fontFamily: "'JetBrains Mono', monospace",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #38bdf8, #4ade80, transparent)' }} />

      {/* header */}
      <div style={{
        padding: '20px 22px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Scan History</div>
          <div style={{ fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f9fafb' }}>Recent Link Scans</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Summary pills */}
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
            {safeCount} safe
          </span>
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(255,69,69,0.08)', color: '#ff4545', border: '1px solid rgba(255,69,69,0.2)' }}>
            {malCount} threats
          </span>
          {/* Filter */}
          {(['All', 'Safe', 'Malicious'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '3px 9px', fontSize: 9, fontWeight: 700,
              border: filter === f ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 4,
              background: filter === f ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: filter === f ? '#e5e7eb' : '#6b7280',
              cursor: 'pointer', letterSpacing: '0.06em',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.15s',
            }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 11, color: '#374151' }}>Loading history…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 11, color: '#374151' }}>
            {history.length === 0 ? 'No scans yet.' : 'No results for this filter.'}
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 100px 110px',
              padding: '8px 22px', gap: 12,
              fontSize: 9, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span>URL</span><span>Status</span><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> Time</span>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {filtered.map((h, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 100px 110px',
                  padding: '10px 22px', gap: 12, alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <a href={h.url} target="_blank" rel="noreferrer" style={{
                    fontSize: 11, color: '#38bdf8', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden',
                  }}>
                    <ExternalLink size={10} style={{ flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {truncUrl(h.url)}
                    </span>
                  </a>
                  <StatusBadge status={h.status} />
                  <span style={{ fontSize: 10, color: '#4b5563' }}>
                    {h.time || (h.scannedAt ? timeAgo(h.scannedAt) : '—')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}