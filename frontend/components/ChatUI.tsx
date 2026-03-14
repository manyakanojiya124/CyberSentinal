'use client'

import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import ReactMarkdown from 'react-markdown'
import DecryptedText from './DecryptedText'
import '@/app/chat-markdown-fix.css'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  role: 'user' | 'bot'
  text: string
  fileUrl?: string
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hello! I’m CyberSentinel, your AI Security Companion.\nHow can I assist you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const endRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleSend = async () => {
    if (!input.trim() && !file && !fileName) return

    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      if (input.trim()) formData.append('message', input)

      setMessages((prev) => [...prev, { role: 'user', text: input || file.name }])
      resetInput()
      setLoading(true)

      try {
        const res = await fetch('/api/chat', { method: 'POST', body: formData })
        const data = await res.json()
        setMessages((prev) => [...prev, { role: 'bot', text: data?.message || 'Something went wrong.' }])
      } catch {
        setMessages((prev) => [...prev, { role: 'bot', text: 'Network error. Please try again.' }])
      } finally {
        setLoading(false)
      }
      return
    }

    const userMessage: Message = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    resetInput()
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'bot', text: data?.message || 'Something went wrong.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const resetInput = () => {
    setInput('')
    setFile(null)
    setFileName(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setFileName(selected.name)
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-2xl shadow-xl border bg-gradient-to-br p-6 flex flex-col h-[600px] transition-all duration-300
        ${isDark ? 'from-black via-zinc-900 to-black border-zinc-800' : 'from-white via-gray-100 to-white border-gray-300'}
      `}
    >
      {/* Chat messages */}
      <div className="overflow-y-auto flex-1 space-y-4 p-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`whitespace-pre-wrap break-words overflow-x-auto text-white px-5 py-3 max-w-[80%] rounded-2xl text-base border shadow-md transition-all duration-200
                  ${msg.role === 'user'
                    ? 'bg-purple-900 border-neon-purple dark:bg-gradient-to-br from-neon-purple/80 to-purple-900 dark:text-white text-black'
                    : 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-neon-purple border-neon-purple'}
                `}
              >
                {msg.fileUrl ? (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    📎 {msg.text}
                  </a>
                ) : msg.role === 'bot' ? (
                  <div className="prose prose-invert dark:prose-invert max-w-none text-sm leading-relaxed overflow-x-auto">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-2 mb-1" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-gray-300" {...props} />,
                        p: ({ node, ...props }) => <p className="my-1" {...props} />,
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto">
                            <table className="table-auto border-collapse border border-gray-700 text-white w-full text-sm" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => <th className="border border-gray-700 px-2 py-1 text-left" {...props} />,
                        td: ({ node, ...props }) => <td className="border border-gray-700 px-2 py-1" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="text-sm text-gray-500 italic pl-2 animate-pulse mt-2">
            CyberSentinel is typing...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input & Upload */}
      <div className="mt-6 flex shadow-inner rounded-xl overflow-hidden border border-neon-purple bg-black/80">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-neon-purple text-white hover:bg-purple-500 transition-all px-4 flex items-center justify-center border-r border-neon-purple"
        >
          <Plus size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.apk,.exe,.zip,.rar"
          className="hidden"
        />
        <input
          type="text"
          placeholder="Ask CyberSentinel something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 outline-none bg-transparent text-white placeholder:text-gray-400 text-base"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-neon-purple hover:bg-purple-500 transition-all text-white dark:text-white px-6 flex items-center justify-center font-bold text-lg"
        >
          <SendHorizonal size={22} />
        </button>
      </div>

      {fileName && (
        <p className="text-xs mt-2 text-neon-purple italic text-center">
          📎 Selected file: <span className="font-semibold">{fileName}</span>
        </p>
      )}
    </div>
  )
}