'use client'

import { useSession } from 'next-auth/react'
import { ChatUI } from '@/components/ChatUI'

export default function ChatPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center text-lg font-medium">
        Loading your assistant...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-neon-purple">Access Denied</h2>
        <p className="mt-4 text-gray-400">Please log in to use the CyberSentinel AI Assistant.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center px-4 py-10 text-black dark:text-white">
      <h2 className="text-3xl font-techno text-neon-purple mb-6">
        CyberSentinel AI Assistant
      </h2>
      <ChatUI />
    </div>
  )
}
