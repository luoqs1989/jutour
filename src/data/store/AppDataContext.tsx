import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ConsultationLead, KpopEvent, MedicalOrg, Material, Product } from '@/types/domain'
import { seedMaterials } from '@/data/seed/materials'
import { seedProducts } from '@/data/seed/products'
import { seedMedicalOrgs } from '@/data/seed/medicalOrgs'
import { seedKpopEvents } from '@/data/seed/kpopEvents'
import { useLocalStorageState } from './localStorageState'

const KEYS = {
  materials: 'jutour_materials',
  products: 'jutour_products',
  medicalOrgs: 'jutour_medical_orgs',
  kpopEvents: 'jutour_kpop_events',
  leads: 'jutour_leads',
} as const

export interface AppDataSnapshot {
  version: 1
  exportedAt: string
  materials: Material[]
  products: Product[]
  medicalOrgs: MedicalOrg[]
  kpopEvents: KpopEvent[]
  leads: ConsultationLead[]
}

interface AppDataContextValue {
  materials: Material[]
  setMaterials: (v: Material[]) => void
  products: Product[]
  setProducts: (v: Product[]) => void
  medicalOrgs: MedicalOrg[]
  setMedicalOrgs: (v: MedicalOrg[]) => void
  kpopEvents: KpopEvent[]
  leads: ConsultationLead[]
  setLeads: (v: ConsultationLead[]) => void
  exportAll: () => AppDataSnapshot
  importAll: (snapshot: AppDataSnapshot) => void
  resetToDemo: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useLocalStorageState<Material[]>(KEYS.materials, () => seedMaterials)
  const [products, setProducts] = useLocalStorageState<Product[]>(KEYS.products, () => seedProducts)
  const [medicalOrgs, setMedicalOrgs] = useLocalStorageState<MedicalOrg[]>(KEYS.medicalOrgs, () => seedMedicalOrgs)
  const [kpopEvents] = useLocalStorageState<KpopEvent[]>(KEYS.kpopEvents, () => seedKpopEvents)
  const [leads, setLeads] = useLocalStorageState<ConsultationLead[]>(KEYS.leads, () => [])

  const value = useMemo<AppDataContextValue>(
    () => ({
      materials,
      setMaterials,
      products,
      setProducts,
      medicalOrgs,
      setMedicalOrgs,
      kpopEvents,
      leads,
      setLeads,
      exportAll: () => ({
        version: 1,
        exportedAt: new Date().toISOString(),
        materials,
        products,
        medicalOrgs,
        kpopEvents,
        leads,
      }),
      importAll: (snapshot) => {
        setMaterials(snapshot.materials)
        setProducts(snapshot.products)
        setMedicalOrgs(snapshot.medicalOrgs)
        setLeads(snapshot.leads)
      },
      resetToDemo: () => {
        setMaterials(seedMaterials)
        setProducts(seedProducts)
        setMedicalOrgs(seedMedicalOrgs)
        setLeads([])
      },
    }),
    [materials, products, medicalOrgs, kpopEvents, leads, setMaterials, setProducts, setMedicalOrgs, setLeads],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
