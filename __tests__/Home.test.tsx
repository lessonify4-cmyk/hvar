import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from '@/app/page'

// Mock the components that fetch data or use browser APIs
vi.mock('@/components/events/EventGrid', () => ({
  EventGrid: () => <div data-testid="event-grid">Mock Event Grid</div>
}))
vi.mock('@/components/layout/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Mock Sidebar</div>
}))
vi.mock('@/components/search/FilterBar', () => ({
  FilterBar: () => <div data-testid="filter-bar">Mock Filter Bar</div>
}))

describe('Home Page', () => {
  it('renders the main hero heading', async () => {
    // The page is an async component, so we await it
    const Page = await HomePage({ searchParams: {} })
    render(Page)

    const heading = screen.getByText(/Everything happening on Hvar island/i)
    expect(heading).toBeDefined()
  })

  it('renders the layout components', async () => {
    const Page = await HomePage({ searchParams: {} })
    render(Page)

    expect(screen.getByTestId('filter-bar')).toBeDefined()
    expect(screen.getByTestId('sidebar')).toBeDefined()
  })
})
