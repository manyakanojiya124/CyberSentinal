'use client'

import { TrendingUp } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts'

const data = [
  { category: 'Phishing',   score: 85 },
  { category: 'Malware',    score: 90 },
  { category: 'DDoS',       score: 70 },
  { category: 'Leaks',      score: 75 },
  { category: 'Ransomware', score: 80 },
]

const tooltipStyle = {
  backgroundColor: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  color: '#e5e7eb',
  fontSize: 11,
  fontFamily: "'JetBrains Mono', monospace",
}

export default function AIStatsChart() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      fontFamily: "'JetBrains Mono', monospace",
      position: 'relative', overflow: 'hidden',
      height: '100%',
    }}>
      {/* top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #38bdf8, #a78bfa, transparent)' }} />

      <div style={{ padding: '20px 22px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>AI Detection Model</div>
          <div style={{ fontSize: 14, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f9fafb' }}>Cyber Attack Trends</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 9, color: '#374151', padding: '4px 8px',
          background: 'rgba(255,255,255,0.03)', borderRadius: 5,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <TrendingUp size={10} color="#38bdf8" />
          <span>Past Focus</span>
        </div>
      </div>

      <div style={{ padding: '0 22px 20px', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#6b7280', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            />
            <Radar
              name="Detection Score"
              dataKey="score"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.12}
              strokeWidth={2}
              dot={{ fill: '#38bdf8', r: 3, strokeWidth: 0 }}
            />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        padding: '0 22px 20px',
      }}>
        {data.map(d => (
          <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', display: 'inline-block', opacity: 0.7 }} />
            <span style={{ fontSize: 9, color: '#6b7280' }}>{d.category}</span>
            <span style={{ fontSize: 9, color: '#38bdf8', fontWeight: 700 }}>{d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}