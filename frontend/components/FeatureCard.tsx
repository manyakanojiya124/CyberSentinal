'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`border p-6 rounded-lg shadow-lg backdrop-blur-md hover:scale-105 transition-transform ${
        isDark
          ? 'border-neon-purple bg-black/30 hover:shadow-neon-purple'
          : 'border-purple-400 bg-white/70 hover:shadow-purple-300'
      }`}
    >
      <h3
        className={`text-xl font-techno mb-2 ${
          isDark ? 'text-neon-purple' : 'text-purple-600'
        }`}
      >
        {title}
      </h3>
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
        {description}
      </p>
    </motion.div>
  )
}
