import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { I18nProvider, getStoredLang } from '@/i18n/I18nContext'
import { useT } from '@/i18n/I18nContext'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { DEFAULT_LANG } from '@/types/common'

const NAV = [
  { to: '/admin/materials', key: 'admin.nav.materials' },
  { to: '/admin/products', key: 'admin.nav.products' },
  { to: '/admin/medical-pricing', key: 'admin.nav.medicalPricing' },
  { to: '/admin/leads', key: 'admin.nav.leads' },
  { to: '/admin/data', key: 'admin.nav.data' },
]

function AdminShell() {
  const t = useT()
  const { logout } = useAdminAuth()
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {t.t(item.key)}
          </NavLink>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={logout}>
          {t.t('admin.logout')}
        </button>
      </aside>
      <div className="admin-main">
        <div className="notice-muted" style={{ marginBottom: 20 }}>
          {t.t('admin.localStorageNotice')}
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export function ProtectedAdminLayout() {
  const { isAuthed } = useAdminAuth()
  const lang = getStoredLang() ?? DEFAULT_LANG
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return (
    <I18nProvider lang={lang}>
      <AdminShell />
    </I18nProvider>
  )
}
