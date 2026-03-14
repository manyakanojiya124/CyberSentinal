'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard')
  }, [status, router])

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error')
    if (!err) return
    if (err === 'OAuthAccountNotLinked') toast.error('Account exists with another provider. Use the original sign-in method.')
    else if (err === 'AccessDenied') toast.error('Access denied. Please try again.')
    else toast.error(`Authentication error: ${err}`)
  }, [])

  const loginWithProvider = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider)
      const res = await signIn(provider, {
        redirect: false,
        callbackUrl: `${window.location.origin}/dashboard`,
      } as any)
      if (!res) return
      if ((res as any).error) { toast.error((res as any).error); setLoadingProvider(null); return }
      if ((res as any).url) { window.location.href = (res as any).url; return }
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('Login failed')
    }
    setLoadingProvider(null)
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ping     { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .lp-card { animation: fadeUp 0.6s ease both; }
        .lp-btn  { transition: all 0.18s; }
        .lp-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .lp-btn-google:hover:not(:disabled) { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.2) !important; }
        .lp-btn-github:hover:not(:disabled) { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.2) !important; }
        .lp-link { color: #ff4545; text-decoration: none; transition: opacity 0.15s; }
        .lp-link:hover { opacity: 0.75; text-decoration: underline; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <ToastContainer
        position="top-right"
        toastStyle={{ background: '#0d1117', border: '1px solid rgba(255,69,69,0.3)', color: '#e5e7eb', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
      />

      <div style={{
        minHeight: '100vh',
        background: '#080b0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
      }}>

        {/* Grid bg */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Red radial glow */}
        <div style={{
          position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,69,69,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Scan line effect */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.025) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.4,
        }} />

        {/* Card */}
        <div className="lp-card" style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 420,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(255,69,69,0.06), 0 24px 48px rgba(0,0,0,0.4)',
        }}>

          {/* Top accent bar */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, #ff4545, #ff6b35, transparent)' }} />

          <div style={{ padding: '32px 32px 28px' }}>

            {/* Live dot + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#ff4545', opacity: 0.4, animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4545', display: 'block' }} />
              </span>
              <span style={{ fontSize: 9, color: '#ff4545', letterSpacing: '0.2em', fontWeight: 700 }}>SECURE AUTH</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: '#f9fafb',
              textAlign: 'center',
              letterSpacing: '-0.025em',
              marginBottom: 8,
              lineHeight: 1.1,
            }}>
              Sign in to{' '}
              <span style={{ color: '#ff4545' }}>CyberSentinel</span>
            </h1>

            <p style={{ fontSize: 11, color: '#4b5563', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
              Continue with your provider to access your threat dashboard
            </p>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 9, color: '#374151', letterSpacing: '0.1em' }}>CHOOSE PROVIDER</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Google */}
            <button
              className="lp-btn lp-btn-google"
              onClick={() => loginWithProvider('google')}
              disabled={!!loadingProvider}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '12px 0',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#d1d5db',
                fontSize: 12, fontWeight: 600,
                cursor: loadingProvider ? 'wait' : 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                opacity: loadingProvider && loadingProvider !== 'google' ? 0.5 : 1,
                marginBottom: 10,
              }}
            >
              {loadingProvider === 'google'
                ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing in…</>
                : <><FcGoogle style={{ fontSize: 18, flexShrink: 0 }} /> Continue with Google</>
              }
            </button>

            {/* GitHub */}
            <button
              className="lp-btn lp-btn-github"
              onClick={() => loginWithProvider('github')}
              disabled={!!loadingProvider}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '12px 0',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#d1d5db',
                fontSize: 12, fontWeight: 600,
                cursor: loadingProvider ? 'wait' : 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                opacity: loadingProvider && loadingProvider !== 'github' ? 0.5 : 1,
              }}
            >
              {loadingProvider === 'github'
                ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing in…</>
                : <><FaGithub style={{ fontSize: 17, flexShrink: 0, color: '#e5e7eb' }} /> Continue with GitHub</>
              }
            </button>

            {/* Footer */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#4b5563', marginBottom: 10 }}>
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/sign-up')}
                  className="lp-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: "'JetBrains Mono', monospace', color: '#ff4545" }}
                >
                  Sign Up
                </button>
              </p>
              <p style={{ fontSize: 10, color: '#374151', lineHeight: 1.7 }}>
                By continuing you agree to our{' '}
                <a href="/terms" className="lp-link">Terms</a>{' '}
                and{' '}
                <a href="/privacy" className="lp-link">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,69,69,0.2), transparent)' }} />
        </div>

        {/* Corner labels */}
        <div style={{ position: 'fixed', bottom: 20, left: 24, fontSize: 9, color: '#1f2937', letterSpacing: '0.08em', zIndex: 2 }}>
          CYBERSENTINEL · SECURE LOGIN
        </div>
        <div style={{ position: 'fixed', bottom: 20, right: 24, fontSize: 9, color: '#1f2937', letterSpacing: '0.08em', zIndex: 2 }}>
          v4.2 · ENCRYPTED
        </div>
      </div>
    </>
  )
}