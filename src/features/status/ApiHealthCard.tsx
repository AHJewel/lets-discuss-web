import { Card, Tag } from 'antd'
import { useApiHealth } from './api'

const COLORS: Record<string, string> = {
  checking: 'processing',
  ok: 'success',
  degraded: 'warning',
  unreachable: 'error',
}

export function ApiHealthCard() {
  const { data, isPending, isError } = useApiHealth()
  const status = isPending ? 'checking' : isError || !data ? 'unreachable' : data.status

  return (
    <Card title="Laravel API">
      <Tag color={COLORS[status]} data-testid="api-status">
        {status}
      </Tag>
      {data && !isError && (
        <ul className="mt-3 space-y-1">
          {Object.entries(data.services).map(([name, state]) => (
            <li key={name} data-testid={`service-${name}`}>
              {name}: {state}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
