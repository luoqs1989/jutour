import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { I18nProvider, getStoredLang, useT } from '@/i18n/I18nContext'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { DEFAULT_LANG } from '@/types/common'

function LoginForm() {
  const t = useT()
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin/materials')
    } else {
      setError(true)
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 420 }}>
      <h2>{t.t('admin.loginTitle')}</h2>
      <div className="notice" style={{ marginBottom: 20 }}>
        {t.t('admin.demoAuthWarning')}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>{t.t('admin.passwordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            autoFocus
          />
        </div>
        {error && (
          <p style={{ color: 'var(--color-danger)', fontSize: 13.5 }}>{t.t('admin.wrongPassword')}</p>
        )}
        <button type="submit" className="btn btn-primary">
          {t.t('admin.login')}
        </button>
      </form>
      <p className="section-subtitle" style={{ marginTop: 16 }}>
        {t.t('admin.sessionPersistNotice')}
      </p>
    </div>
  )
}

export default function AdminLogin() {
  const { isAuthed } = useAdminAuth()
  const lang = getStoredLang() ?? DEFAULT_LANG
  if (isAuthed) return <Navigate to="/admin/materials" replace />
  return (
    <I18nProvider lang={lang}>
      <LoginForm />
    </I18nProvider>
  )
}
