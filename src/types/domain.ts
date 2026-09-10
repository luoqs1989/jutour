import type { ContentStatus, Currency, FeeUnit, LocalizedText } from './common'

export type MaterialCategory =
  | 'airport_transfer'
  | 'sightseeing'
  | 'medical_escort'
  | 'dining'
  | 'charter'
  | 'kpop_experience'

export interface MaterialOption {
  id: string
  name: LocalizedText
  fee: number
}

export interface MaterialExtraFee {
  id: string
  name: LocalizedText
  fee: number
  note: LocalizedText
}

export interface Material {
  id: string
  category: MaterialCategory
  region: string
  name: LocalizedText
  summary: LocalizedText
  description: LocalizedText
  baseFee: number
  feeUnit: FeeUnit
  currency: Currency
  options: MaterialOption[]
  extraFees: MaterialExtraFee[]
  durationMinutes: number
  images: string[]
  included: LocalizedText[]
  excluded: LocalizedText[]
  meetingPoint: LocalizedText
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

export interface ProductItineraryItem {
  id: string
  materialId: string
  /** Frozen copy of the material at the time it was added, so later edits to
   * the material library never silently change a published product. */
  materialSnapshot: Material
  startTime: string // "HH:mm"
  endTime: string // computed, "HH:mm"
  transitMinutesBefore: number
  freeTimeNote: LocalizedText
  remarks: LocalizedText
}

export interface ProductDay {
  day: number
  items: ProductItineraryItem[]
}

export interface ProductPricingInput {
  paxCount: number
  vehicleCount: number
}

export interface ProductCostLine {
  materialItemId: string
  label: LocalizedText
  feeUnit: FeeUnit
  unitFee: number
  quantity: number
  subtotal: number
}

export interface Product {
  id: string
  name: LocalizedText
  summary: LocalizedText
  coverImage: string
  days: number
  itinerary: ProductDay[]
  targetAudience: LocalizedText
  pricingInput: ProductPricingInput
  sellingPrice: number
  discountAmount: number
  currency: Currency
  priceNote: LocalizedText
  optionalAddons: MaterialOption[]
  includedSummary: LocalizedText[]
  excludedSummary: LocalizedText[]
  extraFeesNote: LocalizedText
  status: ContentStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export type MedicalCategory = 'dental' | 'dermatology' | 'plastic_surgery'

export type PriceStatus = 'demo_price' | 'inquire'

export interface MedicalProcedure {
  id: string
  name: LocalizedText
  originalPrice: number | null
  discountAmount: number | null
  discountPrice: number | null
  currency: Currency
  priceNote: LocalizedText
  priceStatus: PriceStatus
}

export interface MedicalOrg {
  id: string
  name: string
  category: MedicalCategory
  address: string
  description: LocalizedText
  images: string[]
  website: string | null
  languages: string[]
  sourceUrl: string
  procedures: MedicalProcedure[]
}

export interface KpopEvent {
  id: string
  name: string
  artist: string
  date: string // ISO date
  venue: string
  poster: string
  officialTicketUrl: string
  isDemo: true
}

export interface ConsultationLead {
  id: string
  name: string
  contact: string
  travelDate: string
  paxCount: number
  interests: string[]
  remarks: string
  createdAt: string
}

/** The 5 top-level browsing categories requested for the attractions page,
 * mapped to the Visit Seoul API's real level-1 category ids — see
 * src/data/attractionCategories.ts. Order matters: it drives tab order. */
export type AttractionCategoryKey = 'history' | 'food' | 'nature' | 'shopping' | 'culture'

export interface AttractionInfo {
  id: string
  name: string
  summary: string
  description: string
  address: string
  images: string[]
  phone: string | null
  website: string | null
  openHours: string | null
  region: string
  isDemo: boolean
  /** Which of the 5 browsing categories this item belongs to. Known for
   * every list result (we filter by category server-side) and for demo
   * data; may be absent for a detail lookup reached some other way. */
  category?: AttractionCategoryKey
}
