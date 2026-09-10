import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_LANG, type Lang } from '@/types/common'
import zh from './dictionaries/zh.json'
import en from './dictionaries/en.json'
import ko from './dictionaries/ko.json'

const DICTIONARIES: Record<Lang, Record<string, unknown>> = { zh, en, ko }

const STORAGE_KEY = 'jutour_lang'

export function getStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'zh' || stored === 'en' || stored === 'ko') return stored
  } catch {
    // localStorage unavailable (private mode, etc.) — ignore
  }
  return null
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore
  }
}

// Dictionary keys are "section.restOfKey" where "section" is a top-level
// group (home, nav, common, ...) and "restOfKey" is a flat key that may
// itself contain dots (e.g. "service.airport.title", "category.dental") —
// it is looked up as a single property, not traversed further.
function readPath(dict: Record<string, unknown>, path: string): unknown {
  const dotIndex = path.indexOf('.')
  if (dotIndex === -1) return undefined
  const section = path.slice(0, dotIndex)
  const rest = path.slice(dotIndex + 1)
  const sectionDict = dict[section]
  if (!sectionDict || typeof sectionDict !== 'object') return undefined
  return (sectionDict as Record<string, unknown>)[rest]
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key]
    return value === undefined ? match : String(value)
  })
}

interface I18nContextValue {
  lang: Lang
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTIONARIES[lang] ?? DICTIONARIES[DEFAULT_LANG]
    const fallbackDict = DICTIONARIES[DEFAULT_LANG]
    return {
      lang,
      t: (key, vars) => {
        const raw = readPath(dict, key) ?? readPath(fallbackDict, key)
        if (typeof raw !== 'string') return key
        return interpolate(raw, vars)
      },
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useT() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used within I18nProvider')
  return ctx
}
