'use client'

import React, { useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface Position {
  x: number
  y: number
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor,
}) => {
  const { resolvedTheme } = useTheme()
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState<number>(0)

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const dynamicColor =
    spotlightColor ||
    (resolvedTheme === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.1)')

  const baseClasses = `p-6 rounded-2xl border h-full transition-colors` // ⬅️ Removed shadow
  const darkModeStyles = `bg-black border-neon-purple`
  const lightModeStyles = `bg-gradient-to-br from-white to-gray-100 border-gray-300`

  const bgClass =
    resolvedTheme === 'dark'
      ? `${baseClasses} ${darkModeStyles}`
      : `${baseClasses} ${lightModeStyles}`

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl border p-6 overflow-hidden transition-shadow hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] ${bgClass} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${dynamicColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}

export default SpotlightCard
