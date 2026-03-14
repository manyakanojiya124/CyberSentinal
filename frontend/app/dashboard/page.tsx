'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PhishingMalwareScanner from '@/components/PhishingMalwareScanner'
import DashboardStats from '@/components/DashboardStats'
import LinkHistory from '@/components/LinkHistory'
import SecurityQuiz from '@/components/SecurityQuiz'
import AttackHistoryChart from '@/components/AttackHistoryChart'
import DecryptedText from '@/components/DecryptedText'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/sign-up')
  }, [status, router])

  if (status === 'loading' || !mounted) {
    return (
      <div style={{
        minHeight: '100vh', background: '#080b0f', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid rgba(255,69,69,0.2)',
            borderTopColor: '#ff4545',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 11, color: '#ff4545', letterSpacing: '0.18em', fontWeight: 700 }}>
            LOADING DASHBOARD…
          </span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  if (!session) return null

  const username =
    session.user?.name ||
    (session.user?.email ? session.user.email.split('@')[0] : 'User')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes ping      { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .dash-section { animation: fadeUp 0.5s ease both; }
        .dash-section:nth-child(1){ animation-delay:0.05s }
        .dash-section:nth-child(2){ animation-delay:0.12s }
        .dash-section:nth-child(3){ animation-delay:0.19s }
        .dash-section:nth-child(4){ animation-delay:0.26s }
        .dash-section:nth-child(5){ animation-delay:0.33s }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080b0f',
        color: '#e5e7eb',
        fontFamily: "'JetBrains Mono', monospace",
        position: 'relative',
      }}>
        {/* BG grid */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.013) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Red glow top */}
        <div style={{
          position: 'fixed', top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,69,69,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px,4vw,32px)' }}>

          {/* ── HEADER ── */}
          <div className="dash-section" style={{
            paddingBottom: 24,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 28,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#ff4545', opacity: 0.4, animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4545', display: 'block' }} />
                </span>
                <span style={{ fontSize: 9, color: '#ff4545', letterSpacing: '0.18em', fontWeight: 700 }}>DASHBOARD ACTIVE</span>
              </div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(24px, 4vw, 42px)',
                fontWeight: 800, letterSpacing: '-0.025em',
                lineHeight: 1.1, color: '#f9fafb', margin: 0,
              }}>
                Welcome back,{' '}
                <span style={{ color: '#ff4545' }}>
                  <DecryptedText
                    text={username}
                    speed={60}
                    maxIterations={12}
                    className="inline-block"
                    encryptedClassName="inline-block text-gray-600"
                    animateOn="view"
                  />
                </span>
              </h1>
              <p style={{ fontSize: 11, color: '#4b5563', marginTop: 8, letterSpacing: '0.03em' }}>
                Your personal CyberSentinel threat intelligence dashboard.
              </p>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 9, color: '#374151', letterSpacing: '0.1em' }}>SIGNED IN AS</span>
              <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{session.user?.email || username}</span>
            </div>
          </div>

          {/* ── STATS + SCANNER ── */}
          <div className="dash-section" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 16, marginBottom: 16,
          }}>
            <DashboardStats />
            <PhishingMalwareScanner />
          </div>

          {/* ── LINK HISTORY ── */}
          <div className="dash-section" style={{ marginBottom: 16 }}>
            <LinkHistory />
          </div>

          {/* ── CHARTS + QUIZ ── */}
          <div className="dash-section" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 16, marginBottom: 16,
          }}>
            <AttackHistoryChart />
            <SecurityQuiz />
          </div>

          <div style={{ textAlign: 'center', fontSize: 9, color: '#1f2937', letterSpacing: '0.06em', paddingTop: 8, paddingBottom: 24 }}>
            CYBERSENTINEL DASHBOARD · AUTO-REFRESHES EVERY 15S · ALL DATA ENCRYPTED
          </div>
        </div>
      </div>
    </>
  )
}