'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ExternalLink, Radio, AlertCircle, RefreshCw } from 'lucide-react'

interface NewsArticle {
  title: string
  url: string
  publishedAt: string
  source: { name: string }
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  async function fetchNews() {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.get('/api/news')
      setArticles(data.articles.slice(0, 6))
      setLastUpdated(new Date())
    } catch (err) {
      console.error('News fetch error:', err)
      setError('Failed to fetch latest intelligence.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .news-item { animation: fadeIn 0.4s ease forwards; }
        .news-link:hover .news-title { color: #ff4545 !important; }
        .news-link:hover .news-arrow { color: #ff4545 !important; opacity: 1 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              background: 'rgba(255,69,69,0.08)',
              border: '1px solid rgba(255,69,69,0.2)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Radio size={13} color="#ff4545" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f9fafb', letterSpacing: '0.05em' }}>
                Threat Intelligence
              </div>
              <div style={{ fontSize: 9, color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>
                Live cyber updates
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastUpdated && (
              <span style={{ fontSize: 9, color: '#374151' }}>
                {lastUpdated.toLocaleTimeString('en-IN')}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ff4545',
                display: 'inline-block',
                boxShadow: '0 0 6px rgba(255,69,69,0.6)',
                animation: 'blink 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 9, color: '#ff4545', letterSpacing: '0.12em', fontWeight: 700 }}>LIVE</span>
            </div>
            <button
              onClick={fetchNews}
              disabled={loading}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 5,
                padding: '3px 6px',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={11} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: 380 }}>
          {loading && articles.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#374151', letterSpacing: '0.1em' }}>
                Loading intelligence data…
              </div>
            </div>
          )}

          {error && (
            <div style={{
              margin: 16,
              padding: '10px 14px',
              background: 'rgba(255,69,69,0.05)',
              border: '1px solid rgba(255,69,69,0.2)',
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertCircle size={13} color="#ff4545" />
              <span style={{ fontSize: 11, color: '#ff6b6b' }}>{error}</span>
            </div>
          )}

          {!loading && !error && articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-link"
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#ff4545',
                      background: 'rgba(255,69,69,0.08)',
                      border: '1px solid rgba(255,69,69,0.2)',
                      padding: '1px 6px',
                      borderRadius: 3,
                      letterSpacing: '0.08em',
                    }}>
                      {article.source.name}
                    </span>
                    <span style={{ fontSize: 9, color: '#374151' }}>{timeAgo(article.publishedAt)}</span>
                  </div>
                  <p
                    className="news-title"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#d1d5db',
                      lineHeight: 1.6,
                      transition: 'color 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {article.title}
                  </p>
                </div>
                <ExternalLink
                  size={11}
                  className="news-arrow"
                  style={{ color: '#374151', flexShrink: 0, marginTop: 2, opacity: 0.5, transition: 'all 0.15s' }}
                />
              </div>
            </a>
          ))}
        </div>

        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: 9,
          color: '#1f2937',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          AUTO-REFRESHES EVERY 60s · POWERED BY PHISHGUARD INTEL
        </div>
      </div>
    </>
  )
}