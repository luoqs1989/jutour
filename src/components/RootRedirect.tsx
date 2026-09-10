import { Navigate } from 'react-router-dom'
import { getStoredLang } from '@/i18n/I18nContext'
import { DEFAULT_LANG } from '@/types/common'

export function RootRedirect() {
  const lang = getStoredLang() ?? DEFAULT_LANG
  return <Navigate to={`/${lang}`} replace />
}
