import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReverbStatusCard } from './ReverbStatusCard'
import type { ConnectionLike } from './useConnectionState'

function createFakeConnection(initial: string) {
  const listeners = new Set<() => void>()
  const connection: ConnectionLike = {
    state: initial,
    bind: (_event, listener) => void listeners.add(listener),
    unbind: (_event, listener) => void listeners.delete(listener),
  }
  const transition = (next: string) => {
    connection.state = next
    listeners.forEach((listener) => listener())
  }
  return { connection, transition, listeners }
}

describe('ReverbStatusCard', () => {
  it('shows the current state and follows transitions', () => {
    const { connection, transition } = createFakeConnection('connecting')

    render(<ReverbStatusCard connection={connection} />)
    expect(screen.getByTestId('reverb-state')).toHaveTextContent('Connecting')

    act(() => transition('connected'))
    expect(screen.getByTestId('reverb-state')).toHaveTextContent('Connected')

    act(() => transition('unavailable'))
    expect(screen.getByTestId('reverb-state')).toHaveTextContent('Unavailable')

    act(() => transition('connected'))
    expect(screen.getByTestId('reverb-state')).toHaveTextContent('Connected')
  })

  it('falls back to the raw state name for unknown states', () => {
    const { connection } = createFakeConnection('reticulating')

    render(<ReverbStatusCard connection={connection} />)

    expect(screen.getByTestId('reverb-state')).toHaveTextContent('reticulating')
  })

  it('unsubscribes from the connection on unmount', () => {
    const { connection, listeners } = createFakeConnection('connected')

    const { unmount } = render(<ReverbStatusCard connection={connection} />)
    expect(listeners.size).toBe(1)

    unmount()
    expect(listeners.size).toBe(0)
  })
})
