'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronLeft, ChevronRight, Trophy, RotateCcw, Play, Info } from 'lucide-react'
import axios from 'axios'

interface QuizItem {
  question: string
  options: string[]
  answer: number
  hint: string
}

const shell: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  fontFamily: "'JetBrains Mono', monospace",
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 480,
}

export default function SecurityQuiz() {
  const [quizData, setQuizData] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [started, setStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('cyberQuizHighScore')
    if (saved) setHighScore(Number(saved))
  }, [])

  const loadQuestions = () => {
    setLoading(true)
    axios
      .get('/api/quiz')
      .then(res => {
        setQuizData(res.data)
        setAnswers(new Array(res.data.length).fill(null))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadQuestions() }, [])

  const handleSubmit = () => {
    let s = 0
    quizData.forEach((q, i) => { if (answers[i] === q.answer) s++ })
    setScore(s)
    setSubmitted(true)
    const prev = Number(localStorage.getItem('cyberQuizHighScore') || 0)
    if (s > prev) {
      localStorage.setItem('cyberQuizHighScore', s.toString())
      setHighScore(s)
    }
  }

  const handleSelect = (idx: number) => {
    const updated = [...answers]
    updated[current] = idx
    setAnswers(updated)
  }

  const restartQuiz = () => {
    setCurrent(0)
    setScore(0)
    setSubmitted(false)
    setStarted(false)
    setShowHint(false)
    setQuizData([])
    setAnswers([])
    loadQuestions()
  }

  const question = quizData?.[current]
  const selected = answers[current]
  const answered = answers.filter(a => a !== null).length
  const progress = quizData.length ? ((current + 1) / quizData.length) * 100 : 0
  const pct = quizData.length ? Math.round(score / quizData.length * 100) : 0

  // ── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={shell}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #ffb347, #ff4545, transparent)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid rgba(255,179,71,0.15)',
            borderTopColor: '#ffb347',
            animation: 'qs-spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.12em' }}>LOADING QUESTIONS…</span>
        </div>
        <style>{`@keyframes qs-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Invalid question guard ────────────────────────────────────────
  if (started && !submitted && (!question || !Array.isArray(question.options))) {
    return (
      <div style={shell}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #ff4545, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <p style={{ fontSize: 12, color: '#ff4545', textAlign: 'center', padding: '0 24px' }}>
            Failed to load quiz. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes qs-spin   { to { transform: rotate(360deg); } }
        @keyframes qs-fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .qs-opt:hover:not(.qs-selected)  { border-color:rgba(255,179,71,0.35)!important; background:rgba(255,179,71,0.05)!important; color:#e5e7eb!important; }
        .qs-restart:hover                { background:rgba(255,179,71,0.2)!important; }
        .qs-start:hover                  { background:rgba(255,179,71,0.2)!important; }
        .qs-nav:hover:not(:disabled)     { border-color:rgba(255,255,255,0.18)!important; color:#e5e7eb!important; }
        .qs-submit:hover:not(:disabled)  { background:rgba(255,179,71,0.22)!important; }
        .qs-hint-btn:hover               { background:rgba(255,179,71,0.18)!important; }
      `}</style>

      <div style={shell}>
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #ffb347, #ff4545, transparent)' }} />

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{
          padding: '20px 22px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              Knowledge Check
            </div>
            <div style={{ fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f9fafb' }}>
              CyberSentinel Quiz
            </div>
          </div>

          {started && !submitted && (
            <button
              className="qs-hint-btn"
              onClick={() => setShowHint(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 6,
                background: showHint ? 'rgba(255,179,71,0.15)' : 'rgba(255,255,255,0.04)',
                border: showHint ? '1px solid rgba(255,179,71,0.45)' : '1px solid rgba(255,255,255,0.08)',
                color: showHint ? '#ffb347' : '#6b7280',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.15s',
              }}
            >
              <Lightbulb size={11} /> Hint
            </button>
          )}
        </div>

        {/* ── PROGRESS BAR ───────────────────────────────────────── */}
        {started && !submitted && quizData.length > 0 && (
          <div style={{ padding: '10px 22px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 9, color: '#6b7280' }}>
                Question <span style={{ color: '#ffb347' }}>{current + 1}</span> / {quizData.length}
              </span>
              <span style={{ fontSize: 9, color: '#6b7280' }}>{answered} answered</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, #ffb347, #ff8c42)',
                borderRadius: 99, transition: 'width 0.35s ease',
              }} />
            </div>
          </div>
        )}

        {/* ── BODY ───────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 22px' }}>

          {/* ─── SUBMITTED ─── */}
          {submitted && (
            <div style={{ textAlign: 'center', paddingTop: 8, animation: 'qs-fadeUp 0.4s ease both' }}>
              <Trophy
                size={40} color="#ffb347"
                style={{ margin: '0 auto 16px', filter: 'drop-shadow(0 0 12px rgba(255,179,71,0.4))' }}
              />
              <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                Quiz Complete
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f9fafb', lineHeight: 1 }}>
                {score}
                <span style={{ fontSize: 20, color: '#4b5563', fontWeight: 400 }}>/{quizData.length}</span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, marginBottom: 20 }}>
                {[
                  { label: 'SCORE', val: `${pct}%`, color: pct >= 70 ? '#4ade80' : pct >= 40 ? '#ffb347' : '#ff4545' },
                  { label: 'HIGH SCORE', val: highScore, color: '#ffb347' },
                  { label: 'CORRECT', val: score, color: '#4ade80' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: '#4b5563', marginTop: 3, letterSpacing: '0.1em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Per-question result dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                {quizData.map((q, i) => (
                  <div
                    key={i}
                    title={`Q${i + 1}: ${answers[i] === q.answer ? 'Correct' : 'Wrong'}`}
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: answers[i] === q.answer ? '#4ade80' : '#ff4545',
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>

              <button
                className="qs-restart"
                onClick={restartQuiz}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '10px 28px',
                  background: 'rgba(255,179,71,0.1)',
                  border: '1px solid rgba(255,179,71,0.35)',
                  borderRadius: 7, color: '#ffb347',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.15s',
                }}
              >
                <RotateCcw size={12} /> Play Again
              </button>
            </div>
          )}

          {/* ─── WELCOME ─── */}
          {!started && !submitted && (
            <div style={{ animation: 'qs-fadeUp 0.4s ease both' }}>
              <div style={{
                padding: '14px 16px', borderRadius: 8, marginBottom: 18,
                background: 'rgba(255,179,71,0.04)',
                border: '1px solid rgba(255,179,71,0.15)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 10, color: '#ffb347', fontWeight: 700,
                  letterSpacing: '0.08em', marginBottom: 10,
                }}>
                  <Info size={12} /> RULES TO PLAY
                </div>
                {[
                  'Each question is AI-generated for freshness.',
                  'Use the Hint button if you need a nudge.',
                  '+1 point for every correct answer.',
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, color: '#6b7280', marginBottom: 6, lineHeight: 1.55 }}>
                    <span style={{ color: '#ffb347', flexShrink: 0 }}>›</span>{r}
                  </div>
                ))}
              </div>

              {highScore > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 6, marginBottom: 16,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <Trophy size={12} color="#ffb347" />
                  <span style={{ fontSize: 10, color: '#6b7280' }}>Your high score:</span>
                  <span style={{ fontSize: 10, color: '#ffb347', fontWeight: 700, marginLeft: 'auto' }}>{highScore}</span>
                </div>
              )}

              <button
                className="qs-start"
                onClick={() => setStarted(true)}
                style={{
                  width: '100%', padding: '12px 0',
                  background: 'rgba(255,179,71,0.1)',
                  border: '1px solid rgba(255,179,71,0.35)',
                  borderRadius: 7, color: '#ffb347',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <Play size={12} /> Start Quiz
              </button>
            </div>
          )}

          {/* ─── ACTIVE QUESTION ─── */}
          {started && !submitted && question && Array.isArray(question.options) && (
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', lineHeight: 1.7, marginBottom: 16 }}>
                  {question.question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {question.options.map((opt, idx) => {
                    const isSel = selected === idx
                    return (
                      <button
                        key={idx}
                        className={`qs-opt${isSel ? ' qs-selected' : ''}`}
                        onClick={() => handleSelect(idx)}
                        style={{
                          padding: '10px 14px', borderRadius: 7, textAlign: 'left', width: '100%',
                          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                          border: isSel ? '1px solid rgba(255,179,71,0.55)' : '1px solid rgba(255,255,255,0.07)',
                          background: isSel ? 'rgba(255,179,71,0.12)' : 'rgba(255,255,255,0.025)',
                          color: isSel ? '#ffb347' : '#9ca3af',
                          cursor: 'pointer', transition: 'all 0.12s',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}
                      >
                        <span style={{
                          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                          border: isSel ? '1px solid rgba(255,179,71,0.5)' : '1px solid rgba(255,255,255,0.1)',
                          background: isSel ? 'rgba(255,179,71,0.2)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: isSel ? '#ffb347' : '#374151', fontWeight: 700,
                        }}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {/* Hint */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '10px 13px', borderRadius: 7, marginBottom: 14,
                        background: 'rgba(255,179,71,0.06)',
                        border: '1px solid rgba(255,179,71,0.25)',
                        fontSize: 11, color: '#d1d5db', lineHeight: 1.65,
                      }}>
                        <span style={{ color: '#ffb347', fontWeight: 700 }}>💡 Hint: </span>
                        {question.hint}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                  <button
                    className="qs-nav"
                    disabled={current === 0}
                    onClick={() => { setCurrent(p => p - 1); setShowHint(false) }}
                    style={{
                      padding: '8px 14px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: current === 0 ? '#2d3748' : '#6b7280',
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                      cursor: current === 0 ? 'not-allowed' : 'pointer',
                      fontFamily: "'JetBrains Mono', monospace",
                      display: 'flex', alignItems: 'center', gap: 5,
                      transition: 'all 0.12s',
                    }}
                  >
                    <ChevronLeft size={13} /> PREV
                  </button>

                  {current === quizData.length - 1 ? (
                    <button
                      className="qs-submit"
                      onClick={handleSubmit}
                      disabled={selected === null || selected === undefined}
                      style={{
                        padding: '8px 22px', borderRadius: 6,
                        background: 'rgba(255,179,71,0.1)',
                        border: `1px solid ${(selected === null || selected === undefined) ? 'rgba(255,255,255,0.06)' : 'rgba(255,179,71,0.45)'}`,
                        color: (selected === null || selected === undefined) ? '#2d3748' : '#ffb347',
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        cursor: (selected === null || selected === undefined) ? 'not-allowed' : 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        transition: 'all 0.12s',
                      }}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      className="qs-nav"
                      onClick={() => { setCurrent(p => p + 1); setShowHint(false) }}
                      disabled={selected === null || selected === undefined}
                      style={{
                        padding: '8px 14px', borderRadius: 6,
                        background: (selected === null || selected === undefined) ? 'rgba(255,255,255,0.02)' : 'rgba(255,179,71,0.1)',
                        border: `1px solid ${(selected === null || selected === undefined) ? 'rgba(255,255,255,0.06)' : 'rgba(255,179,71,0.35)'}`,
                        color: (selected === null || selected === undefined) ? '#2d3748' : '#ffb347',
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                        cursor: (selected === null || selected === undefined) ? 'not-allowed' : 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.12s',
                      }}
                    >
                      NEXT <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </div>
    </>
  )
}