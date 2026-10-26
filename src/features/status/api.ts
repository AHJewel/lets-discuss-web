import { useQuery } from '@tanstack/react-query'
import { http } from '../../lib/http'

export type ServiceState = 'up' | 'down'

export interface HealthResponse {
  status: 'ok' | 'degraded'
  services: Record<string, ServiceState>
}

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await http.get<HealthResponse>('/api/health', {
    // A 503 still carries the body naming the service that is down
    validateStatus: (status) => status === 200 || status === 503,
  })
  return data
}

export function useApiHealth() {
  return useQuery({ queryKey: ['health'], queryFn: fetchHealth, refetchInterval: 10_000 })
}
