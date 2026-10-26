import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { http, resetCsrfCookie } from './http'

const calls: string[] = []

const adapter: AxiosAdapter = (config: InternalAxiosRequestConfig) => {
  calls.push(`${config.method?.toUpperCase()} ${config.url}`)
  return Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config })
}

describe('http CSRF bootstrap', () => {
  beforeEach(() => {
    calls.length = 0
    resetCsrfCookie()
    http.defaults.adapter = adapter
  })

  it('does not fetch the csrf cookie for GET requests', async () => {
    await http.get('/api/health')
    expect(calls).toEqual(['GET /api/health'])
  })

  it('fetches the csrf cookie before the first mutating request, then only once', async () => {
    await http.post('/api/login', {})
    await http.put('/api/x', {})
    await Promise.all([http.patch('/api/y', {}), http.delete('/api/z')])

    expect(calls).toEqual([
      'GET /sanctum/csrf-cookie',
      'POST /api/login',
      'PUT /api/x',
      'PATCH /api/y',
      'DELETE /api/z',
    ])
  })

  it('shares one csrf fetch between concurrent first mutations', async () => {
    await Promise.all([http.post('/a', {}), http.post('/b', {})])
    expect(calls.filter((c) => c === 'GET /sanctum/csrf-cookie')).toHaveLength(1)
  })
})
