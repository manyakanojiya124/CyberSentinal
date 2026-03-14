'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) { setVal(0); return }
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

export default function DashboardStats() {
  const { data: session } = useSession()
  const [visits, setVisits] = useState({ today: 0, thisWeek: 0, thisMonth: 0 })
  const [loaded, setLoaded] = useState(false)

  const today = useCountUp(loaded ? visits.today : 0)
  const week = useCountUp(loaded ? visits.thisWeek : 0)
  const month = useCountUp(loaded ? visits.thisMonth : 0)

  const fetchStats = async () => {
    if (!session?.user) return
    try {
      const res = await fetch('/api/user/stats')
      if (!res.ok) return
      const data = await res.json()
      setVisits({
        today: data.linkVisits?.today || 0,
        thisWeek: data.linkVisits?.thisWeek || 0,
        thisMonth: data.linkVisits?.thisMonth || 0,
      })
      setLoaded(true)
    } catch (err) {
      console.error('Failed to load stats', err)
    }
  }

  useEffect(() => {
    fetchStats()
    const iv = setInterval(fetchStats, 15000)
    return () => clearInterval(iv)
  }, [session?.user])

  const cards = [
    { label: 'Today', value: today, color: '#38bdf8', icon: '◎', sub: 'scans today' },
    { label: 'This Week', value: week, color: '#a78bfa', icon: '◈', sub: 'last 7 days' },
    { label: 'This Month', value: month, color: '#ff4545', icon: '◉', sub: 'last 30 days' },
  ]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: '20px 22px',
      fontFamily: "'JetBrains Mono', monospace",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #ff4545, #a78bfa, transparent)' }} />

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
          Link Scan Summary
        </div>
        <div style={{ fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f9fafb' }}>
          Your Activity
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {cards.map((c) => (
          <div key={c.label} style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${c.color}20`,
            borderRadius: 8,
            padding: '14px 10px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.color}50, transparent)` }} />
            <div style={{ fontSize: 18, opacity: 0.08, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: c.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {c.value}
            </div>
            <div style={{ fontSize: 9, color: '#6b7280', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontSize: 9, color: '#374151', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255,69,69,0.04)', borderRadius: 6, border: '1px solid rgba(255,69,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: '#6b7280' }}>Total scanned</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#ff4545' }}>{(today + week + month).toLocaleString()}</span>
      </div>
    </div>
  )
}