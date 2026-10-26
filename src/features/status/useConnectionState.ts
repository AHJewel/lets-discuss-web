import { useCallback, useSyncExternalStore } from 'react'

/** The slice of pusher-js's ConnectionManager this app depends on. */
export interface ConnectionLike {
  state: string
  bind(event: 'state_change', listener: () => void): void
  unbind(event: 'state_change', listener: () => void): void
}

export function useConnectionState(connection: ConnectionLike): string {
  const subscribe = useCallback(
    (notify: () => void) => {
      connection.bind('state_change', notify)
      return () => connection.unbind('state_change', notify)
    },
    [connection],
  )

  return useSyncExternalStore(subscribe, () => connection.state)
}
