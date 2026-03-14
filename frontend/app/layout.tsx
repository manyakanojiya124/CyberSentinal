import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: 'CyberSentinel',
  description: 'AI-Powered Cybersecurity Companion',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="font-sans bg-dark-bg dark:text-white text-black transition-colors duration-300">
           <Providers>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
           </Providers>
      </body>
    </html>
  )
}
