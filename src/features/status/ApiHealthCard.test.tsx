import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { http } from '../../lib/http'
import { ApiHealthCard } from './ApiHealthCard'

vi.mock('../../lib/http', () => ({ http: { get: vi.fn() } }))

// Loosely typed so tests can resolve partial axios responses ({ data } only)
const get = http.get as unknown as Mock

function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('ApiHealthCard', () => {
  beforeEach(() => {
    get.mockReset()
  })

  it('shows ok and every service when the API is healthy', async () => {
    get.mockResolvedValue({
      data: { status: 'ok', services: { database: 'up', redis: 'up' } },
    })

    renderWithQuery(<ApiHealthCard />)

    expect(screen.getByTestId('api-status')).toHaveTextContent('checking')
    expect(await screen.findByText('ok')).toBeInTheDocument()
    expect(screen.getByTestId('service-database')).toHaveTextContent('database: up')
    expect(screen.getByTestId('service-redis')).toHaveTextContent('redis: up')
  })

  it('shows degraded and which service is down when the API answers 503', async () => {
    get.mockResolvedValue({
      data: { status: 'degraded', services: { database: 'up', redis: 'down' } },
    })

    renderWithQuery(<ApiHealthCard />)

    expect(await screen.findByText('degraded')).toBeInTheDocument()
    expect(screen.getByTestId('service-redis')).toHaveTextContent('redis: down')
  })

  it('shows unreachable when the request fails', async () => {
    get.mockRejectedValue(new Error('Network Error'))

    renderWithQuery(<ApiHealthCard />)

    expect(await screen.findByText('unreachable')).toBeInTheDocument()
    expect(screen.queryByTestId('service-database')).not.toBeInTheDocument()
  })
})
