export type UserRole = 'user' | 'verified' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
