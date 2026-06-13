'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6" aria-hidden="true">🌊</div>
        <h1 className="font-display font-bold text-3xl text-ink mb-3">Something went wrong</h1>
        <p className="text-muted mb-6">
          We&apos;re having trouble loading this page. The Adriatic sea is still beautiful though.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-ghost">
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <p className="mt-6 text-xs text-muted font-mono bg-mist p-3 rounded-lg text-left">{error.message}</p>
        )}
      </div>
    </div>
  )
}
