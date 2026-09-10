export type Lang = 'ko' | 'zh' | 'en'

export const LANGS: Lang[] = ['zh', 'en', 'ko']

export const DEFAULT_LANG: Lang = 'zh'

/** Text that must be supplied in all three languages, though any may be empty. */
export interface LocalizedText {
  ko: string
  zh: string
  en: string
}

export function emptyLocalizedText(): LocalizedText {
  return { ko: '', zh: '', en: '' }
}

export type FeeUnit = 'per_person' | 'per_vehicle' | 'per_service'

export type Currency = 'KRW' | 'CNY' | 'USD'

export type ContentStatus = 'draft' | 'published'
