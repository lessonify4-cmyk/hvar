import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/events/EventCard'
import { Category, Municipality } from '@prisma/client'

export const metadata = {
  title: 'Search Events | HvarLive',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; municipality?: string }
}) {
  const q = searchParams.q || ''
  const category = searchParams.category as Category | undefined
  const municipality = searchParams.municipality as Municipality | undefined

  const whereClause: any = { status: 'APPROVED' }

  if (q) {
    whereClause.title = { contains: q, mode: 'insensitive' }
  }
  if (category) {
    whereClause.category = category
  }
  if (municipality) {
    whereClause.municipality = municipality
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    orderBy: { startDate: 'asc' },
    include: { organizer: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-playfair font-bold text-[var(--ink)] mb-8">
        Search Results {q && `for "${q}"`}
      </h1>

      {/* Basic Filter Bar (Normally would be a separate interactive component) */}
      <form className="mb-12 flex gap-4 flex-wrap bg-white p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <input 
          type="text" 
          name="q" 
          defaultValue={q} 
          placeholder="Search events..." 
          className="border border-[var(--border)] rounded px-4 py-2 flex-1 min-w-[200px]"
        />
        <select name="category" defaultValue={category} className="border border-[var(--border)] rounded px-4 py-2">
          <option value="">All Categories</option>
          {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="municipality" defaultValue={municipality} className="border border-[var(--border)] rounded px-4 py-2">
          <option value="">All Municipalities</option>
          {Object.values(Municipality).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <button type="submit" className="bg-[var(--sea)] text-white px-6 py-2 rounded font-bold hover:bg-[var(--sea-dark)] transition-colors">
          Search
        </button>
      </form>

      {events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-[var(--border)]">
          <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">No events found</h3>
          <p className="text-[var(--muted)]">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
