'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'

const ACCENT = '#ff4545'
const ACCENT2 = '#a78bfa'
const GRID = 'rgba(255,255,255,0.05)'
const AXIS_COLOR = '#4b5563'

const tooltipStyle = {
  backgroundColor: '#0d1117',
  borderColor: 'rgba(255,255,255,0.08)',
  borderRadius: 6,
  color: '#e5e7eb',
  fontSize: 11,
  fontFamily: "'JetBrains Mono', monospace",
  border: '1px solid rgba(255,255,255,0.08)',
}

function ChartShell({ title, sub, children, accent }: {
  title: string; sub: string; children: React.ReactNode; accent: string
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      fontFamily: "'JetBrains Mono', monospace",
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ padding: '20px 22px 12px' }}>
        <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{sub}</div>
        <div style={{ fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f9fafb' }}>{title}</div>
      </div>
      <div style={{ flex: 1, padding: '0 22px 20px', minHeight: 220 }}>
        {children}
      </div>
    </div>
  )
}

export default function AttackHistoryChart() {
  const { data: session } = useSession()
  const [linkVisits, setLinkVisits] = useState<any[]>([
    { date: 'Today', visits: 0 },
    { date: 'This Week', visits: 0 },
    { date: 'This Month', visits: 0 },
  ])
  const [attackTypesData, setAttackTypesData] = useState<any[]>([])

  const fetchStats = async () => {
    if (!session?.user) return
    try {
      const res = await fetch('/api/user/stats')
      if (!res.ok) return
      const data = await res.json()
      setLinkVisits([
        { date: 'Today', visits: data.linkVisits?.today || 0 },
        { date: 'This Week', visits: data.linkVisits?.thisWeek || 0 },
        { date: 'This Month', visits: data.linkVisits?.thisMonth || 0 },
      ])
      setAttackTypesData(data.attackTypes || [])
    } catch {}
  }

  useEffect(() => {
    fetchStats()
    const iv = setInterval(fetchStats, 10000)
    return () => clearInterval(iv)
  }, [session?.user?.email])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ChartShell title="Link Visit Trend" sub="Activity over time" accent={ACCENT}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={linkVisits}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
            <XAxis dataKey="date" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.08)' }} />
            <Line
              type="monotone" dataKey="visits" stroke={ACCENT} strokeWidth={2.5}
              dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: ACCENT, stroke: 'rgba(255,69,69,0.3)', strokeWidth: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="Common Attack Types" sub="Threat breakdown" accent={ACCENT2}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={attackTypesData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="type" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" fill={ACCENT2} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  )
}