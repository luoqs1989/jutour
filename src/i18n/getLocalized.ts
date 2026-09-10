import type { Lang, LocalizedText } from '@/types/common'

const FALLBACK_ORDER: Lang[] = ['zh', 'en', 'ko']

export interface LocalizedResult {
  value: string
  /** true when the requested language was empty and we fell back to another one */
  isFallback: boolean
  sourceLang: Lang
}

/**
 * Resolves a LocalizedText field for display, falling back through
 * zh -> en -> ko (skipping the language already tried) when the requested
 * language has no content. Never fabricates a translation.
 */
export function getLocalized(text: LocalizedText | undefined, lang: Lang): LocalizedResult {
  if (!text) return { value: '', isFallback: false, sourceLang: lang }

  if (text[lang]?.trim()) {
    return { value: text[lang], isFallback: false, sourceLang: lang }
  }

  for (const candidate of FALLBACK_ORDER) {
    if (candidate !== lang && text[candidate]?.trim()) {
      return { value: text[candidate], isFallback: true, sourceLang: candidate }
    }
  }

  return { value: '', isFallback: false, sourceLang: lang }
}

/** Convenience helper for places that only need the string. */
export function t(text: LocalizedText | undefined, lang: Lang): string {
  return getLocalized(text, lang).value
}

/** Which languages are missing content, for admin-side completeness warnings. */
export function missingLanguages(text: LocalizedText): Lang[] {
  return (['ko', 'zh', 'en'] as Lang[]).filter((l) => !text[l]?.trim())
}
