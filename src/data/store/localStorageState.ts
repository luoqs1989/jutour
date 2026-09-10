import { useCallback, useEffect, useState } from 'react'

/**
 * A localStorage-backed piece of state. All data managed by the admin (and
 * the consultation form) lives only in the visiting browser's localStorage —
 * it is never synced to other visitors or devices. See DataManagement for
 * the export/import path used to move data between browsers or into a
 * redeployment.
 */
export function useLocalStorageState<T>(key: string, initial: () => T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {
      // corrupted or inaccessible storage — fall back to the initial value
    }
    return initial()
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // storage full or unavailable — the in-memory state still works for
      // the current page view, it just won't survive a refresh
    }
  }, [key, state])

  const reset = useCallback((value: T) => setState(value), [])

  return [state, setState, reset] as const
}
