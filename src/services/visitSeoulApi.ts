import type { Lang } from '@/types/common'
import type { AttractionCategoryKey, AttractionInfo } from '@/types/domain'
import { stripHtml } from '@/utils/html'

const API_BASE = 'https://api-call.visitseoul.net/api/v1'
const API_KEY = import.meta.env.VITE_VISITSEOUL_API_KEY as string | undefined

export function hasLiveApiKey(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0)
}

// The Seoul Tourism Organization gateway uses zh-CN for simplified Chinese.
const LANG_CODE: Record<Lang, string> = { zh: 'zh-CN', en: 'en', ko: 'ko' }

interface RawContentListItem {
  cid: string
  post_sj?: string
  sumry?: string
  main_img?: string
}

interface RawContentDetail extends RawContentListItem {
  post_desc?: string
  relate_img?: string[]
  extra?: {
    cmmn_telno?: string
    cmmn_hmpg_url?: string
    cmmn_use_time?: string
  }
  traffic?: {
    adres?: string
    new_adres?: string
  }
}

interface ApiEnvelope<T> {
  data: T
  result_code: number
  result_message: string
}

async function callApi<T>(path: string, body: Record<string, unknown>): Promise<T> {
  if (!API_KEY) throw new Error('VISITSEOUL_API_KEY is not configured')
  // Optional params are only included when set — the API treats an empty
  // string filter (e.g. com_ctgry_sn: '') as "match nothing" rather than
  // "no filter", so omitting the key entirely is required for an unfiltered
  // list.
  const cleanBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== '' && v !== undefined))
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'VISITSEOUL-API-KEY': API_KEY,
    },
    body: JSON.stringify(cleanBody),
  })
  if (!res.ok) throw new Error(`Visit Seoul API request failed: ${res.status}`)
  const envelope = (await res.json()) as ApiEnvelope<T>
  if (envelope.result_code !== 200) throw new Error(`Visit Seoul API error ${envelope.result_code}: ${envelope.result_message}`)
  return envelope.data
}

function toAttractionInfo(raw: RawContentListItem | RawContentDetail, category?: AttractionCategoryKey): AttractionInfo {
  const detail = raw as RawContentDetail
  const address = detail.traffic?.new_adres || detail.traffic?.adres || ''
  return {
    id: raw.cid,
    name: raw.post_sj ?? '',
    summary: raw.sumry ?? '',
    description: detail.post_desc ? stripHtml(detail.post_desc) : (raw.sumry ?? ''),
    address,
    images: [raw.main_img, ...(detail.relate_img ?? [])].filter((v): v is string => Boolean(v)),
    phone: detail.extra?.cmmn_telno ?? null,
    website: detail.extra?.cmmn_hmpg_url ?? null,
    openHours: detail.extra?.cmmn_use_time ?? null,
    region: address,
    isDemo: false,
    category,
  }
}

export interface AttractionListParams {
  lang: Lang
  keyword?: string
  categoryId?: string
  /** The category key being filtered by, so results can be tagged with it
   * directly rather than parsed back out of the raw API item. */
  categoryKey?: AttractionCategoryKey
  pageNo?: number
}

export async function fetchAttractionList(params: AttractionListParams): Promise<AttractionInfo[]> {
  const list = await callApi<RawContentListItem[]>('/contents/list', {
    lang_code_id: LANG_CODE[params.lang],
    keyword: params.keyword ?? '',
    com_ctgry_sn: params.categoryId ?? '',
    page_no: params.pageNo ?? 1,
  })
  return list.map((item) => toAttractionInfo(item, params.categoryKey))
}

export async function fetchAttractionDetail(cid: string, lang: Lang): Promise<AttractionInfo> {
  const detail = await callApi<RawContentDetail>('/contents/info', {
    cid,
    lang_code_id: LANG_CODE[lang],
  })
  return toAttractionInfo(detail)
}
