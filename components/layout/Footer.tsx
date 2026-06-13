import Link from 'next/link'
import { APP_NAME, FOOTER_LINKS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white mt-16" role="contentinfo">
      <div className="container-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-sea"
                aria-hidden="true"
              >
                H
              </div>
              <span className="font-display font-bold text-xl">{APP_NAME}</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              The premium events portal for Hvar Island, Croatia. Discover concerts, sports, culture, and nightlife.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {/* Social Icons */}
              {[
                { href: '#', label: 'Facebook', icon: '📘' },
                { href: '#', label: 'Instagram', icon: '📷' },
                { href: '#', label: 'Twitter', icon: '🐦' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Explore</h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Organizers</h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.organizers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">About</h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/30 text-center">
            Co-funded by the European Union — Tourism & Digital Innovation
          </p>
          <p className="text-xs text-white/40">🇭🇷 Made in Croatia</p>
        </div>
      </div>
    </footer>
  )
}
