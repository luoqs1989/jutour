import type { AttractionCategoryKey } from '@/types/domain'

/**
 * The 5 top-level attraction categories the client asked for, in the exact
 * order they should appear as tabs. `ctgrySn` is the real level-1
 * `com_ctgry_sn` id from the Visit Seoul API's own category tree
 * (`GET /api/v1/category/list`), confirmed live:
 *   History (Ca1z6p7, 85 items), Cuisine (Cl9s3y9, 1100), Nature (Co6c2n2, 67),
 *   Shopping (Cu8e6t5, 271), Culture (Ca0o2d4, 809) — as of 2026-09-10.
 * The API's own category names are English-only regardless of lang_code_id,
 * so display labels are localized ourselves via i18n instead.
 */
export const ATTRACTION_CATEGORIES: { key: AttractionCategoryKey; ctgrySn: string }[] = [
  { key: 'history', ctgrySn: 'Ca1z6p7' },
  { key: 'food', ctgrySn: 'Cl9s3y9' },
  { key: 'nature', ctgrySn: 'Co6c2n2' },
  { key: 'shopping', ctgrySn: 'Cu8e6t5' },
  { key: 'culture', ctgrySn: 'Ca0o2d4' },
]

export function categoryToCtgrySn(key: AttractionCategoryKey): string {
  return ATTRACTION_CATEGORIES.find((c) => c.key === key)?.ctgrySn ?? ''
}
