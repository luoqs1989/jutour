import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// DEMO-ONLY AUTH: the password is hardcoded and checked entirely in the
// browser. This proves the admin-gated UI flow for a demo, but it cannot
// protect a real back office or sensitive data — anyone can read this
// constant out of the shipped JavaScript bundle. Production use requires a
// real server-side authentication check.
const DEMO_ADMIN_PASSWORD = 'junet0123'
const STORAGE_KEY = 'jutour_admin_authed'

interface AdminAuthContextValue {
  isAuthed: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAuthed,
      login: (password: string) => {
        if (password === DEMO_ADMIN_PASSWORD) {
          setIsAuthed(true)
          try {
            localStorage.setItem(STORAGE_KEY, 'true')
          } catch {
            // ignore
          }
          return true
        }
        return false
      },
      logout: () => {
        setIsAuthed(false)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
      },
    }),
    [isAuthed],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
