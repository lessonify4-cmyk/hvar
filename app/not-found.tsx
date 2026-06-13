import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center max-w-md px-6">
        <div className="text-8xl mb-6 font-display font-bold text-border">404</div>
        <h1 className="font-display font-bold text-3xl text-ink mb-3">Page not found</h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Perhaps the event has already sailed away?
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/search" className="btn btn-ghost">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  )
}
