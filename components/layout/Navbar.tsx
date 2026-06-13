'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { APP_NAME, NAV_LINKS } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-border'
          : 'bg-white border-b border-border'
      )}
    >
      <div className="container-xl">
        <nav className="flex items-center h-16 gap-6" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="HvarLive home">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--sea)' }}
              aria-hidden="true"
            >
              H
            </div>
            <span className="font-display font-bold text-xl text-ink">{APP_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-sea-light text-sea'
                    : 'text-muted hover:text-ink hover:bg-mist'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            {session?.user ? (
              <>
                {(session.user.role === 'ORGANIZER' || session.user.role === 'ADMIN') && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      'hidden md:flex btn btn-secondary btn-sm',
                      pathname.startsWith('/dashboard') && 'bg-sea-light'
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={cn(
                      'hidden md:flex btn btn-sm',
                      'bg-sand/20 text-amber-800 border border-sand/30 hover:bg-sand/30'
                    )}
                  >
                    Admin
                  </Link>
                )}
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-mist transition-colors"
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ background: 'var(--sea)' }}
                        aria-hidden="true"
                      >
                        {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-12 bg-white border border-border rounded-card shadow-card-hover py-2 min-w-44 z-50 animate-scaleIn"
                      role="menu"
                      aria-label="User options"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-semibold text-ink truncate">{session.user.name}</p>
                        <p className="text-xs text-muted truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/dashboard/saved"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-mist w-full"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ❤️ Saved Events
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-mist w-full"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-coral hover:bg-mist w-full text-left"
                        role="menuitem"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm hidden md:flex">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-mist transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {mobileOpen ? (
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-sea-light text-sea' : 'text-ink hover:bg-mist'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session?.user && (
            <Link
              href="/dashboard"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-mist"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!session?.user && (
            <Link
              href="/login"
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-sea hover:bg-sea-light"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
