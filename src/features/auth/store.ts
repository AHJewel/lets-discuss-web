import { create } from 'zustand'
import type { AuthStatus, User } from './types'

interface AuthState {
  user: User | null
  status: AuthStatus
  setStatus: (status: AuthStatus) => void
  setUser: (user: User) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: 'idle',
  setStatus: (status) => set({ status }),
  setUser: (user) => set({ user, status: 'authenticated' }),
  clear: () => set({ user: null, status: 'unauthenticated' }),
}))
