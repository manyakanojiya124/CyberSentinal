'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Zap, Eye, BarChart2, Users, Box, Search,
  Trophy, Smartphone, ArrowRight, ChevronDown,
  Shield, Globe, Lock, Cpu,
} from 'lucide-react'

// ── Feature data ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap, color: '#ff4545', accent: 'rgba(255,69,69,0.1)',
    title: 'Real-time Threat Detection',
    desc: 'Scans suspicious files and links instantly using LLMs and heuristic engines with sub-second response times.',
    tag: 'CORE',
  },
  {
    icon: Eye, color: '#38bdf8', accent: 'rgba(56,189,248,0.1)',
    title: 'Interactive Awareness Mode',
    desc: 'Trains users with real-world scam examples and gamified quizzes that adapt to your knowledge level.',
    tag: 'TRAINING',
  },
  {
    icon: BarChart2, color: '#a78bfa', accent: 'rgba(167,139,250,0.1)',
    title: 'Threat Analytics Dashboard',
    desc: 'Visualizes scam trends, user risks, dark web alerts, and red-flag activity across a rich live dashboard.',
    tag: 'ANALYTICS',
  },
  {
    icon: Users, color: '#4ade80', accent: 'rgba(74,222,128,0.1)',
    title: 'Crowdsourced Threat Learning',
    desc: 'Learns from community-reported threats and dynamically retrains AI models for better accuracy over time.',
    tag: 'COMMUNITY',
  },
  {
    icon: Box, color: '#ffb347', accent: 'rgba(255,179,71,0.1)',
    title: 'Mini Virtual Sandbox',
    desc: 'Simulates file and link behavior in a secure isolated virtual environment — no execution on your system.',
    tag: 'SANDBOX',
  },
  {
    icon: Search, color: '#ff6b35', accent: 'rgba(255,107,53,0.1)',
    title: 'Data Leak Checker',
    desc: 'Monitors breach databases for your email and credential exposure in real time across the dark web.',
    tag: 'PRIVACY',
  },
  {
    icon: Trophy, color: '#f59e0b', accent: 'rgba(245,158,11,0.1)',
    title: 'Gamified Learning',
    desc: 'Fun cybersecurity missions, streak rewards, and daily challenges that turn security into a habit.',
    tag: 'GAMIFIED',
  },
  {
    icon: Smartphone, color: '#06b6d4', accent: 'rgba(6,182,212,0.1)',
    title: 'Browser Extension & Mobile',
    desc: 'Cross-platform protection via browser extension and mobile app that monitors threats in real time.',
    tag: 'PLATFORM',
  },
]

// ── Flow steps ─────────────────────────────────────────────────────
const FLOW_STEPS = [
  { icon: Globe,  label: 'User', sub: 'Encounters a link', color: '#38bdf8' },
  { icon: Search, label: 'Scan', sub: 'URL / file submitted', color: '#a78bfa' },
  { icon: Cpu,    label: 'Detect', sub: 'AI + heuristics fire', color: '#ff4545' },
  { icon: Shield, label: 'Educate', sub: 'Risk report shown', color: '#4ade80' },
  { icon: Zap,    label: 'Improve', sub: 'Model learns & adapts', color: '#ffb347' },
]

// ── Future items ───────────────────────────────────────────────────
const FUTURE_ITEMS = [
  { icon: '⚡', text: 'Advanced AI for deeper threat pattern detection across multiple vectors.' },
  { icon: '📱', text: 'Seamless Web + Mobile integration with real-time cross-device sync.' },
  { icon: '🌐', text: 'Global crowdsourced threat intelligence network with verified nodes.' },
  { icon: '🤝', text: 'Government, corporate & EdTech partnerships for enterprise coverage.' },
  { icon: '💡', text: 'Ethical monetization model built on transparency and user trust.' },
]

// ── Stat items ─────────────────────────────────────────────────────
const STATS = [
  { value: '1.2M+', label: 'URLs scanned', color: '#ff4545' },
  { value: '98.7%', label: 'Detection accuracy', color: '#4ade80' },
  { value: '50+', label: 'Threat feeds', color: '#38bdf8' },
  { value: '<1s', label: 'Scan response time', color: '#ffb347' },
]

function useCounterAnimation(target: string, inView: boolean) {
  const [displayed, setDisplayed] = useState('0')
  useEffect(() => {
    if (!inView) return
    setDisplayed(target)
  }, [inView, target])
  return displayed
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '20px 20px 22px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      whileHover={{ y: -3, borderColor: feature.color + '40' } as any}
    >
      {/* bottom accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${feature.color}50, transparent)` }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: feature.accent,
          border: `1px solid ${feature.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={feature.color} />
        </div>
        <div>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: '0.14em',
            color: feature.color, display: 'block', marginBottom: 4,
          }}>
            {feature.tag}
          </span>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f9fafb', lineHeight: 1.3 }}>
            {feature.title}
          </h3>
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.75 }}>{feature.desc}</p>
    </motion.div>
  )
}

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${stat.color}20`,
        borderRadius: 10,
        padding: '18px 16px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${stat.color}60, transparent)` }} />
      <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
        {inView ? stat.value : '—'}
      </div>
      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 6, letterSpacing: '0.08em' }}>{stat.label}</div>
    </motion.div>
  )
}

export default function KnowMorePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const heroRef = useRef(null)

  const FAQS = [
    { q: 'Is CyberSentinel free to use?', a: 'Yes. The core scanning and awareness features are free. Enterprise and API tiers will be available for teams.' },
    { q: 'How does the AI detect phishing?', a: 'We combine domain heuristics, SSL certificate analysis, visual similarity checks, and LLM-based intent classification for multi-layer detection.' },
    { q: 'Is my scan data stored?', a: 'Scanned URLs are anonymized and used only to improve the community threat model. We never store personal identifiers alongside scan results.' },
    { q: 'Can I use this via API?', a: 'API access is on our roadmap for Q3. Contact us at support@cybersentinel.app to join the early-access list.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes ping      { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .km-faq:hover        { border-color: rgba(255,255,255,0.12) !important; }
        .km-flow-arrow       { color: #374151; }
        ::-webkit-scrollbar  { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        @media (max-width: 640px) {
          .km-flow { flex-direction: column !important; }
          .km-flow-arrow { transform: rotate(90deg); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#080b0f',
        color: '#e5e7eb',
        fontFamily: "'JetBrains Mono', monospace",
      }}>

        {/* BG grid */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Amber glow — new colour for docs page */}
        <div style={{
          position: 'fixed', top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 500,
          background: 'radial-gradient(ellipse, rgba(255,179,71,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,5vw,64px) clamp(16px,4vw,32px) 80px' }}>

          {/* ── HERO ──────────────────────────────────────────── */}
          <section ref={heroRef} style={{ textAlign: 'center', paddingBottom: 64 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 16px', borderRadius: 100,
                border: '1px solid rgba(255,179,71,0.25)',
                background: 'rgba(255,179,71,0.05)',
                marginBottom: 28,
              }}>
                <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#ffb347', opacity: 0.4, animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffb347', display: 'block' }} />
                </span>
                <span style={{ fontSize: 9, color: '#ffb347', letterSpacing: '0.18em', fontWeight: 700 }}>DOCUMENTATION</span>
              </div>

              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(32px, 6vw, 60px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: '#f9fafb',
                marginBottom: 20,
              }}>
                Know{' '}
                <span style={{ color: '#ffb347', textShadow: '0 0 40px rgba(255,179,71,0.3)' }}>
                  CyberSentinel
                </span>
              </h1>

              <p style={{
                fontSize: 14, color: '#4b5563', lineHeight: 1.8,
                maxWidth: 520, margin: '0 auto 40px',
              }}>
                Dive deep into CyberSentinel's mission to turn users from targets into defenders — platform architecture, features, and future roadmap.
              </p>
            </motion.div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, maxWidth: 720, margin: '0 auto' }}>
              {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
            </div>
          </section>

          {/* ── TICKER ────────────────────────────────────────── */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            padding: '8px 0', marginBottom: 64, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'ticker 22s linear infinite' }}>
              {[...FEATURES, ...FEATURES].map((f, i) => (
                <span key={i} style={{ fontSize: 10, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: f.color }}>◆</span>
                  {f.title.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* ── FEATURES GRID ─────────────────────────────────── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Platform Features</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em' }}>
                  What We Protect You With
                </h2>
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)', marginLeft: 16 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 12 }}>
              {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
            </div>
          </section>

          {/* ── HOW IT WORKS ──────────────────────────────────── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Architecture</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em' }}>
                How CyberSentinel Works
              </h2>
              <p style={{ fontSize: 11, color: '#4b5563', marginTop: 8 }}>User → Scan → Detect → Educate → Improve</p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: 'clamp(20px,4vw,40px)',
            }}>
              <div className="km-flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {FLOW_STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12, duration: 0.4 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', minWidth: 90 }}
                      >
                        <div style={{
                          width: 52, height: 52, borderRadius: 12, margin: '0 auto 10px',
                          background: step.color + '12',
                          border: `1px solid ${step.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon size={20} color={step.color} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: step.color }}>{step.label}</div>
                        <div style={{ fontSize: 9, color: '#4b5563', marginTop: 3 }}>{step.sub}</div>
                      </motion.div>
                      {i < FLOW_STEPS.length - 1 && (
                        <ArrowRight size={16} className="km-flow-arrow" color="#374151" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── FUTURE VISION ─────────────────────────────────── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 24, alignItems: 'start' }}>
              {/* Left: title */}
              <div>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Roadmap</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>
                  Future{' '}
                  <span style={{ color: '#ffb347' }}>Vision</span>
                </h2>
                <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.8, maxWidth: 360 }}>
                  We're building toward a world where everyday users are as protected as enterprise security teams — through AI, community, and education.
                </p>

                <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', fontSize: 9, color: '#ffb347', fontWeight: 700, letterSpacing: '0.1em' }}>
                    OPEN ROADMAP
                  </div>
                  <div style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 9, color: '#6b7280', fontWeight: 700, letterSpacing: '0.1em' }}>
                    Q4 2025 →
                  </div>
                </div>
              </div>

              {/* Right: items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FUTURE_ITEMS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    viewport={{ once: true }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '14px 16px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.65 }}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>FAQ</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f9fafb' }}>
                  Common Questions
                </h2>
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)', marginLeft: 16 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="km-faq"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', padding: '16px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: "'JetBrains Mono', monospace", textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#d1d5db' }}>{faq.q}</span>
                    <ChevronDown
                      size={14} color="#6b7280"
                      style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 18px 16px',
                      fontSize: 11, color: '#6b7280', lineHeight: 1.75,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: 14,
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────── */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                textAlign: 'center',
                padding: 'clamp(32px,6vw,56px) clamp(24px,5vw,48px)',
                background: 'rgba(255,179,71,0.04)',
                border: '1px solid rgba(255,179,71,0.15)',
                borderRadius: 14,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #ffb347, transparent)' }} />
              <div style={{ fontSize: 9, color: '#ffb347', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 14 }}>GET STARTED</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.02em', marginBottom: 12 }}>
                Ready to Stay Protected?
              </h2>
              <p style={{ fontSize: 12, color: '#4b5563', marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                Join thousands of users securing their digital lives with CyberSentinel's real-time threat intelligence.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/sign-up" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 28px', borderRadius: 8,
                  background: '#ffb347', color: '#080b0f',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.15s',
                }}>
                  Start Free <ArrowRight size={13} />
                </a>
                <a href="/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 28px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#9ca3af',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.15s',
                }}>
                  View Dashboard
                </a>
              </div>
            </motion.div>
          </section>

          {/* Footer note */}
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 9, color: '#1f2937', letterSpacing: '0.06em' }}>
            CYBERSENTINEL DOCS · LAST UPDATED MARCH 2026 · OPEN PLATFORM
          </div>
        </div>
      </div>
    </>
  )
}