import Link from 'next/link'
import { Shield, Twitter, Github } from 'lucide-react'

const FOOTER_LINKS: Record<string, { name: string; href: string }[]> = {
  Tools: [
    { name: 'URL Analyzer', href: '/analyzer' },
    { name: 'Email Scanner', href: '/email-scanner' },
    { name: 'API Access', href: '/docs' },
    { name: 'Extension', href: '/extension' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  Security: [
    { name: 'Compliance', href: '/compliance' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'SLA', href: '/sla' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#060a0f] border-t border-cyan-500/10">

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 border-2 border-cyan-400 rounded-md flex items-center justify-center group-hover:bg-cyan-400/10 transition-colors">
                <Shield size={15} className="text-cyan-400" />
              </div>
              <span className="font-mono text-[14px] tracking-[3px] font-bold uppercase">
                <span className="text-white">CYBER</span>
                <span className="text-cyan-400">SENTINEL</span>
              </span>
            </Link>

            <p className="text-gray-500 text-[13px] leading-relaxed max-w-[260px]">
              Empowering users and enterprises with real-time cybersecurity intelligence to navigate the digital world safely.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 border border-cyan-500/20 rounded-md flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 border border-cyan-500/20 rounded-md flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
              >
                <Github size={14} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-gray-500 mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href} className="text-[13px] text-gray-500 hover:text-cyan-400 transition-colors duration-200">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-gray-600 font-mono">
            © 2025 CyberSentinel Security Inc. All systems monitored.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-cyan-600 tracking-[2px] uppercase">
              All systems operational
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}