'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded hover:bg-gray-800 transition"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="text-yellow-400 w-5 h-5" />
      ) : (
        <Moon className="text-purple-700 w-5 h-5" />
      )}
    </button>
  )
}
