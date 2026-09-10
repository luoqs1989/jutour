import { useState } from 'react'
import { useT } from '@/i18n/I18nContext'
import { LocalizedInput } from '@/components/LocalizedInput'
import { TextListEditor } from '@/components/TextListEditor'
import { emptyLocalizedText, type Currency, type FeeUnit } from '@/types/common'
import type { Material, MaterialCategory, MaterialExtraFee, MaterialOption } from '@/types/domain'
import { generateId } from '@/utils/id'

const CATEGORIES: MaterialCategory[] = [
  'airport_transfer',
  'sightseeing',
  'medical_escort',
  'dining',
  'charter',
  'kpop_experience',
]
const FEE_UNITS: FeeUnit[] = ['per_person', 'per_vehicle', 'per_service']
const CURRENCIES: Currency[] = ['KRW', 'CNY', 'USD']

function blankMaterial(): Material {
  const now = new Date().toISOString()
  return {
    id: generateId('mat'),
    category: 'sightseeing',
    region: '',
    name: emptyLocalizedText(),
    summary: emptyLocalizedText(),
    description: emptyLocalizedText(),
    baseFee: 0,
    feeUnit: 'per_person',
    currency: 'KRW',
    options: [],
    extraFees: [],
    durationMinutes: 60,
    images: [],
    included: [],
    excluded: [],
    meetingPoint: emptyLocalizedText(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
}

export function MaterialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Material | null
  onSave: (m: Material) => void
  onCancel: () => void
}) {
  const t = useT()
  const [material, setMaterial] = useState<Material>(initial ?? blankMaterial())
  const [imageUrl, setImageUrl] = useState('')

  function update<K extends keyof Material>(key: K, value: Material[K]) {
    setMaterial((m) => ({ ...m, [key]: value }))
  }

  function addOption() {
    const opt: MaterialOption = { id: generateId('opt'), name: emptyLocalizedText(), fee: 0 }
    update('options', [...material.options, opt])
  }
  function addExtraFee() {
    const fee: MaterialExtraFee = { id: generateId('fee'), name: emptyLocalizedText(), fee: 0, note: emptyLocalizedText() }
    update('extraFees', [...material.extraFees, fee])
  }

  function handleSubmit() {
    onSave({ ...material, updatedAt: new Date().toISOString() })
  }

  return (
    <div>
      <h2>{initial ? t.t('common.edit') : t.t('admin.newMaterial')}</h2>

      <div className="field">
        <label>{t.t('common.allCategories')}</label>
        <select value={material.category} onChange={(e) => update('category', e.target.value as MaterialCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{t.t('attractions.filterRegion')}</label>
        <input type="text" value={material.region} onChange={(e) => update('region', e.target.value)} />
      </div>

      <LocalizedInput label={t.t('common.viewDetail')} value={material.name} onChange={(v) => update('name', v)} required />
      <LocalizedInput label="Summary" value={material.summary} onChange={(v) => update('summary', v)} />
      <LocalizedInput label="Description" value={material.description} onChange={(v) => update('description', v)} multiline />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div className="field">
          <label>Base fee</label>
          <input type="number" value={material.baseFee} onChange={(e) => update('baseFee', Number(e.target.value))} />
        </div>
        <div className="field">
          <label>Fee unit</label>
          <select value={material.feeUnit} onChange={(e) => update('feeUnit', e.target.value as FeeUnit)}>
            {FEE_UNITS.map((u) => (
              <option key={u} value={u}>
                {t.t(`common.${u === 'per_person' ? 'perPerson' : u === 'per_vehicle' ? 'perVehicle' : 'perService'}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Currency</label>
          <select value={material.currency} onChange={(e) => update('currency', e.target.value as Currency)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Duration (minutes)</label>
        <input
          type="number"
          value={material.durationMinutes}
          onChange={(e) => update('durationMinutes', Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label>Images (URL)</label>
        {material.images.map((img, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input type="text" value={img} readOnly />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update('images', material.images.filter((_, idx) => idx !== i))}
            >
              {t.t('common.delete')}
            </button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              if (imageUrl.trim()) {
                update('images', [...material.images, imageUrl.trim()])
                setImageUrl('')
              }
            }}
          >
            {t.t('common.add')}
          </button>
        </div>
        <div className="hint">仅支持图片 URL，不支持本地上传（Demo 存储限制）。</div>
      </div>

      <div className="field">
        <label>{t.t('attractions.address')} / Meeting point</label>
        <LocalizedInput label="" value={material.meetingPoint} onChange={(v) => update('meetingPoint', v)} />
      </div>

      <TextListEditor
        title={t.t('products.included')}
        items={material.included}
        onChange={(v) => update('included', v)}
      />
      <TextListEditor
        title={t.t('products.excluded')}
        items={material.excluded}
        onChange={(v) => update('excluded', v)}
      />

      <div className="field">
        <label>{t.t('products.optionalAddons')}</label>
        {material.options.map((opt, i) => (
          <div key={opt.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <LocalizedInput
              label="Name"
              value={opt.name}
              onChange={(v) => {
                const next = [...material.options]
                next[i] = { ...opt, name: v }
                update('options', next)
              }}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                value={opt.fee}
                onChange={(e) => {
                  const next = [...material.options]
                  next[i] = { ...opt, fee: Number(e.target.value) }
                  update('options', next)
                }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => update('options', material.options.filter((_, idx) => idx !== i))}
              >
                {t.t('common.delete')}
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addOption}>
          {t.t('common.add')}
        </button>
      </div>

      <div className="field">
        <label>{t.t('products.extraFees')}</label>
        {material.extraFees.map((fee, i) => (
          <div key={fee.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <LocalizedInput
              label="Name"
              value={fee.name}
              onChange={(v) => {
                const next = [...material.extraFees]
                next[i] = { ...fee, name: v }
                update('extraFees', next)
              }}
            />
            <input
              type="number"
              value={fee.fee}
              onChange={(e) => {
                const next = [...material.extraFees]
                next[i] = { ...fee, fee: Number(e.target.value) }
                update('extraFees', next)
              }}
            />
            <LocalizedInput
              label="Note"
              value={fee.note}
              onChange={(v) => {
                const next = [...material.extraFees]
                next[i] = { ...fee, note: v }
                update('extraFees', next)
              }}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update('extraFees', material.extraFees.filter((_, idx) => idx !== i))}
            >
              {t.t('common.delete')}
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addExtraFee}>
          {t.t('common.add')}
        </button>
      </div>

      <div className="field">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={material.status === 'published'}
            onChange={(e) => update('status', e.target.checked ? 'published' : 'draft')}
          />
          {t.t('admin.status.published')}
        </label>
      </div>

      <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {t.t('common.save')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          {t.t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
