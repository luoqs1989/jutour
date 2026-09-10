import { useNavigate, useParams } from 'react-router-dom'
import { LANGS, type Lang } from '@/types/common'

export function isValidLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as string[]).includes(value)
}

/** Reads the :lang path segment and exposes a helper to switch it while
 * keeping the rest of the current path intact. */
export function useLangParam() {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()

  const switchLang = (next: Lang) => {
    const rest = window.location.pathname.split('/').slice(2).join('/')
    navigate(`/${next}${rest ? `/${rest}` : ''}${window.location.search}`)
  }

  return { lang: (isValidLang(lang) ? lang : 'zh') as Lang, switchLang }
}
