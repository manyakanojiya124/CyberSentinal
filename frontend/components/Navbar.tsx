'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Shield } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Community', href: '/community' },
    { name: 'Documentation', href: '/docs' },
    ...(isLoggedIn
      ? [
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'AI Chat', href: '/chat' },
        ]
      : []),
  ]

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: #ff4545;
          box-shadow: 0 0 8px rgba(255,69,69,0.6);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          right: 50%;
          height: 1px;
          background: #ff4545;
          transition: left 0.2s ease, right 0.2s ease;
          opacity: 0;
        }
        .nav-link:hover::after {
          left: 0;
          right: 0;
          opacity: 0.5;
        }
        .mobile-menu-enter {
          animation: slideDown 0.2s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <nav
        style={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          fontFamily: "'JetBrains Mono', monospace",
          background: scrolled
            ? 'rgba(8,11,15,0.97)'
            : 'rgba(8,11,15,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* subtle top accent line */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,69,69,0.4), transparent)',
        }} />

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              border: '1.5px solid rgba(255,69,69,0.5)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,69,69,0.07)',
              position: 'relative',
            }}>
              <Shield size={14} color="#ff4545" />
              <span style={{
                position: 'absolute',
                top: 3, right: 3,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#ff4545',
                animation: 'blink 2s ease-in-out infinite',
              }} />
            </div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.01em' }}>
                CYBER
              </span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: '#ff4545', letterSpacing: '-0.01em' }}>
                SENTINEL
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
            {links.map(({ name, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={name}
                  href={href}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  style={{
                    textDecoration: 'none',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isActive ? '#ff4545' : '#6b7280',
                    transition: 'color 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#e5e7eb' }}
                  onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#6b7280' }}
                >
                  {name}
                </Link>
              )
            })}
          </div>

          {/* Desktop Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-nav">
            {isLoggedIn ? (
              <>
                <span style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.05em' }}>
                  {session.user?.email?.split('@')[0].slice(0, 12)}
                </span>
                <button
                  onClick={() => signOut()}
                  style={{
                    padding: '6px 14px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ff4545',
                    border: '1px solid rgba(255,69,69,0.3)',
                    borderRadius: 6,
                    background: 'rgba(255,69,69,0.05)',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,69,69,0.12)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,69,69,0.5)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,69,69,0.05)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,69,69,0.3)'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    textDecoration: 'none',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#e5e7eb')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = '#6b7280')}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  style={{
                    textDecoration: 'none',
                    padding: '7px 16px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#080b0f',
                    background: '#ff4545',
                    border: '1px solid #ff4545',
                    borderRadius: 6,
                    transition: 'all 0.15s',
                    boxShadow: '0 0 16px rgba(255,69,69,0.3)',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.background = '#ff6060'
                    ;(e.target as HTMLElement).style.boxShadow = '0 0 24px rgba(255,69,69,0.5)'
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.background = '#ff4545'
                    ;(e.target as HTMLElement).style.boxShadow = '0 0 16px rgba(255,69,69,0.3)'
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: 6,
              cursor: 'pointer',
              color: '#ff4545',
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="mobile-menu-enter"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 24px 20px',
              background: 'rgba(8,11,15,0.98)',
            }}
          >
            {links.map(({ name, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={name}
                  href={href}
                  style={{
                    display: 'block',
                    padding: '10px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? '#ff4545' : '#6b7280',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isActive ? 'rgba(255,69,69,0.05)' : 'transparent',
                    borderRadius: 4,
                    marginBottom: 2,
                  }}
                >
                  {isActive && <span style={{ marginRight: 8, color: '#ff4545' }}>›</span>}
                  {name}
                </Link>
              )
            })}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
              {isLoggedIn ? (
                <button
                  onClick={() => signOut()}
                  style={{
                    padding: '8px 16px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ff4545',
                    border: '1px solid rgba(255,69,69,0.3)',
                    borderRadius: 6,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" style={{ textDecoration: 'none', padding: '8px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6 }}>Login</Link>
                  <Link href="/sign-up" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#080b0f', background: '#ff4545', borderRadius: 6 }}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </nav>
    </>
  )
}