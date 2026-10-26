import { http } from '../../lib/http'
import type { User } from './types'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await http.post<{ data: User }>('/api/register', payload)
  return data.data
}
