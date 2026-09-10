import { useState } from 'react'
import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { LocalizedInput } from '@/components/LocalizedInput'
import type { MedicalProcedure, PriceStatus } from '@/types/domain'
import { emptyLocalizedText } from '@/types/common'
import { generateId } from '@/utils/id'

export default function MedicalPricingAdmin() {
  const t = useT()
  const { medicalOrgs, setMedicalOrgs } = useAppData()
  const [activeOrgId, setActiveOrgId] = useState(medicalOrgs[0]?.id ?? '')
  const org = medicalOrgs.find((o) => o.id === activeOrgId)

  function updateProcedures(procedures: MedicalProcedure[]) {
    setMedicalOrgs(medicalOrgs.map((o) => (o.id === activeOrgId ? { ...o, procedures } : o)))
  }

  function addProcedure() {
    if (!org) return
    const proc: MedicalProcedure = {
      id: generateId('proc'),
      name: emptyLocalizedText(),
      originalPrice: null,
      discountAmount: null,
      discountPrice: null,
      currency: 'KRW',
      priceNote: emptyLocalizedText(),
      priceStatus: 'inquire',
    }
    updateProcedures([...org.procedures, proc])
  }

  return (
    <div>
      <h2>{t.t('admin.nav.medicalPricing')}</h2>
      <select value={activeOrgId} onChange={(e) => setActiveOrgId(e.target.value)} style={{ marginBottom: 16, maxWidth: 320 }}>
        {medicalOrgs.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>

      {org && (
        <div>
          {org.procedures.map((proc, i) => (
            <div key={proc.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <LocalizedInput
                label="Name"
                value={proc.name}
                onChange={(v) => {
                  const next = [...org.procedures]
                  next[i] = { ...proc, name: v }
                  updateProcedures(next)
                }}
              />
              <div className="field">
                <label>{t.t('common.inquireForPrice')} / {t.t('common.demoPrice')}</label>
                <select
                  value={proc.priceStatus}
                  onChange={(e) => {
                    const next = [...org.procedures]
                    next[i] = { ...proc, priceStatus: e.target.value as PriceStatus }
                    updateProcedures(next)
                  }}
                >
                  <option value="inquire">{t.t('common.inquireForPrice')}</option>
                  <option value="demo_price">{t.t('common.demoPrice')}</option>
                </select>
              </div>
              {proc.priceStatus === 'demo_price' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t.t('medical.originalPrice')}</label>
                    <input
                      type="number"
                      value={proc.originalPrice ?? 0}
                      onChange={(e) => {
                        const next = [...org.procedures]
                        next[i] = { ...proc, originalPrice: Number(e.target.value) }
                        updateProcedures(next)
                      }}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t.t('medical.discountAmount')}</label>
                    <input
                      type="number"
                      value={proc.discountAmount ?? 0}
                      onChange={(e) => {
                        const next = [...org.procedures]
                        next[i] = { ...proc, discountAmount: Number(e.target.value) }
                        updateProcedures(next)
                      }}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t.t('medical.discountPrice')}</label>
                    <input
                      type="number"
                      value={proc.discountPrice ?? 0}
                      onChange={(e) => {
                        const next = [...org.procedures]
                        next[i] = { ...proc, discountPrice: Number(e.target.value) }
                        updateProcedures(next)
                      }}
                    />
                  </div>
                </div>
              )}
              <LocalizedInput
                label={t.t('medical.priceNote')}
                value={proc.priceNote}
                onChange={(v) => {
                  const next = [...org.procedures]
                  next[i] = { ...proc, priceNote: v }
                  updateProcedures(next)
                }}
              />
              <button className="btn btn-ghost btn-sm" onClick={() => updateProcedures(org.procedures.filter((_, idx) => idx !== i))}>
                {t.t('common.delete')}
              </button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={addProcedure}>
            {t.t('common.add')}
          </button>
        </div>
      )}
    </div>
  )
}
