import axios from 'axios'

// Sanctum SPA auth: the session + XSRF cookies are scoped to .lets-discuss.localhost,
// and the API lives on a sibling subdomain, so credentials and the XSRF header must be sent explicitly.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { Accept: 'application/json' },
})

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

let csrfPromise: Promise<unknown> | null = null

// Fetches /sanctum/csrf-cookie once and caches the promise; a failed attempt is retried next time.
export function ensureCsrfCookie(): Promise<unknown> {
  csrfPromise ??= http.get('/sanctum/csrf-cookie').catch((error: unknown) => {
    csrfPromise = null
    throw error
  })
  return csrfPromise
}

export function resetCsrfCookie(): void {
  csrfPromise = null
}

http.interceptors.request.use(async (config) => {
  if (MUTATING_METHODS.has((config.method ?? 'get').toLowerCase())) {
    await ensureCsrfCookie()
  }
  return config
})
