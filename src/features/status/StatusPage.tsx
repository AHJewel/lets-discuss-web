import { getEcho } from '../../lib/echo'
import { ApiHealthCard } from './ApiHealthCard'
import { ReverbStatusCard } from './ReverbStatusCard'
import type { ConnectionLike } from './useConnectionState'

export function StatusPage() {
  const connection = getEcho().connector.pusher.connection as unknown as ConnectionLike

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Lets Discuss — environment status</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <ApiHealthCard />
        <ReverbStatusCard connection={connection} />
      </div>
    </main>
  )
}
