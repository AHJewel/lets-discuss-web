import { Card, Tag } from 'antd'
import { type ConnectionLike, useConnectionState } from './useConnectionState'

const LABELS: Record<string, { text: string; color: string }> = {
  initialized: { text: 'Initializing', color: 'default' },
  connecting: { text: 'Connecting', color: 'processing' },
  connected: { text: 'Connected', color: 'success' },
  unavailable: { text: 'Unavailable', color: 'error' },
  failed: { text: 'Failed', color: 'error' },
  disconnected: { text: 'Disconnected', color: 'default' },
}

export function ReverbStatusCard({ connection }: { connection: ConnectionLike }) {
  const state = useConnectionState(connection)
  const label = LABELS[state] ?? { text: state, color: 'default' }

  return (
    <Card title="Reverb WebSocket">
      <Tag color={label.color} data-testid="reverb-state">
        {label.text}
      </Tag>
    </Card>
  )
}
