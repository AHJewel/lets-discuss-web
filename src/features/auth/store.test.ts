import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './store'
import type { User } from './types'

const user: User = { id: 1, name: 'Ada', email: 'ada@example.com', role: 'user' }

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, status: 'idle' })
  })

  it('starts idle with no user', () => {
    const { user, status } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(status).toBe('idle')
  })

  it('setUser authenticates', () => {
    useAuthStore.getState().setUser(user)
    expect(useAuthStore.getState()).toMatchObject({ user, status: 'authenticated' })
  })

  it('clear unauthenticates', () => {
    useAuthStore.getState().setUser(user)
    useAuthStore.getState().clear()
    expect(useAuthStore.getState()).toMatchObject({ user: null, status: 'unauthenticated' })
  })

  it('setStatus supports loading', () => {
    useAuthStore.getState().setStatus('loading')
    expect(useAuthStore.getState().status).toBe('loading')
  })
})
