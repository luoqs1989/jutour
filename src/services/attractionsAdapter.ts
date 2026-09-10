import { useEffect, useState } from 'react'
import type { Lang } from '@/types/common'
import type { AttractionCategoryKey, AttractionInfo } from '@/types/domain'
import { categoryToCtgrySn } from '@/data/attractionCategories'
import { getSeedAttractionById, getSeedAttractions } from '@/data/seed/attractions'
import { fetchAttractionDetail, fetchAttractionList, hasLiveApiKey } from './visitSeoulApi'

interface AttractionsState {
  attractions: AttractionInfo[]
  isLive: boolean
  loading: boolean
}

/** Lists attractions from the live Visit Seoul API when a key is configured,
 * silently falling back to bundled demo data (clearly flagged via isDemo)
 * if the key is missing or the request fails. Always scoped to one of the
 * 5 top-level browsing categories. */
export function useAttractionList(lang: Lang, keyword: string, category: AttractionCategoryKey): AttractionsState {
  const [state, setState] = useState<AttractionsState>({ attractions: [], isLive: false, loading: true })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState((s) => ({ ...s, loading: true }))
      if (hasLiveApiKey()) {
        try {
          const list = await fetchAttractionList({ lang, keyword, categoryId: categoryToCtgrySn(category), categoryKey: category })
          if (!cancelled && list.length > 0) {
            setState({ attractions: list, isLive: true, loading: false })
            return
          }
        } catch {
          // fall through to demo data below
        }
      }
      if (!cancelled) {
        const all = getSeedAttractions(lang).filter((a) => a.category === category)
        const filtered = keyword ? all.filter((a) => a.name.includes(keyword) || a.summary.includes(keyword)) : all
        setState({ attractions: filtered, isLive: false, loading: false })
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [lang, keyword, category])

  return state
}

export function useAttractionDetail(id: string | undefined, lang: Lang) {
  const [state, setState] = useState<{ attraction: AttractionInfo | null; isLive: boolean; loading: boolean }>({
    attraction: null,
    isLive: false,
    loading: true,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setState((s) => ({ ...s, loading: true }))
      if (!id) {
        setState({ attraction: null, isLive: false, loading: false })
        return
      }
      if (hasLiveApiKey() && !id.startsWith('demo_attraction_')) {
        try {
          const detail = await fetchAttractionDetail(id, lang)
          if (!cancelled) {
            setState({ attraction: detail, isLive: true, loading: false })
            return
          }
        } catch {
          // fall through
        }
      }
      if (!cancelled) {
        const demo = getSeedAttractionById(id, lang)
        setState({ attraction: demo, isLive: false, loading: false })
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id, lang])

  return state
}
