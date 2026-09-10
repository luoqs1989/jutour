import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { LocalizedInput } from '@/components/LocalizedInput'
import { TextListEditor } from '@/components/TextListEditor'
import { t as localize } from '@/i18n/getLocalized'
import { emptyLocalizedText, type Currency } from '@/types/common'
import type { Material, Product, ProductDay, ProductItineraryItem } from '@/types/domain'
import { generateId } from '@/utils/id'
import { addMinutes, findTimeConflicts } from '@/utils/time'
import { computeCostBreakdown, feeUnitLabelKey, formatCurrency, sumCostBreakdown } from '@/utils/price'

function newItem(material: Material): ProductItineraryItem {
  const startTime = '09:00'
  return {
    id: generateId('item'),
    materialId: material.id,
    materialSnapshot: material,
    startTime,
    endTime: addMinutes(startTime, material.durationMinutes),
    transitMinutesBefore: 0,
    freeTimeNote: emptyLocalizedText(),
    remarks: emptyLocalizedText(),
  }
}

function blankProduct(days: number, itinerary: ProductDay[]): Product {
  const now = new Date().toISOString()
  return {
    id: generateId('prod'),
    name: emptyLocalizedText(),
    summary: emptyLocalizedText(),
    coverImage: '',
    days,
    itinerary,
    targetAudience: emptyLocalizedText(),
    pricingInput: { paxCount: 2, vehicleCount: 1 },
    sellingPrice: 0,
    discountAmount: 0,
    currency: 'KRW',
    priceNote: emptyLocalizedText(),
    optionalAddons: [],
    includedSummary: [],
    excludedSummary: [],
    extraFeesNote: emptyLocalizedText(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  }
}

export default function ProductBuilder() {
  const t = useT()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { materials, products, setProducts } = useAppData()
  const existing = id ? products.find((p) => p.id === id) ?? null : null

  const [phase, setPhase] = useState<'select' | 'build'>(existing ? 'build' : 'select')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [product, setProduct] = useState<Product | null>(existing)
  const [preview, setPreview] = useState(false)

  function toggleSelect(matId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(matId)) next.delete(matId)
      else next.add(matId)
      return next
    })
  }

  function createFromSelection() {
    const chosen = materials.filter((m) => selectedIds.has(m.id))
    const items = chosen.map((m) => newItem(m))
    setProduct(blankProduct(1, [{ day: 1, items }]))
    setPhase('build')
  }

  if (phase === 'select') {
    return (
      <div>
        <h2>{t.t('admin.newProduct')}</h2>
        <p className="section-subtitle">{t.t('admin.selectMaterialsHint')}</p>
        {materials.map((m) => (
          <label className="material-picker-item" key={m.id}>
            <input type="checkbox" checked={selectedIds.has(m.id)} onChange={() => toggleSelect(m.id)} />
            {m.images[0] && <img src={m.images[0]} alt="" />}
            <div>
              <strong>{localize(m.name, 'zh')}</strong>
              <div style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
                {m.category} · {m.baseFee} {m.currency} / {m.feeUnit}
              </div>
            </div>
          </label>
        ))}
        <button className="btn btn-primary" disabled={selectedIds.size === 0} onClick={createFromSelection}>
          {t.t('admin.createProductFromSelection', { n: selectedIds.size })}
        </button>
      </div>
    )
  }

  if (!product) return null

  return (
    <ProductEditor
      product={product}
      setProduct={setProduct}
      materials={materials}
      preview={preview}
      setPreview={setPreview}
      onSave={(status) => {
        const toSave = { ...product, status, updatedAt: new Date().toISOString() }
        if (status === 'published' && !toSave.publishedAt) toSave.publishedAt = new Date().toISOString()
        const exists = products.some((p) => p.id === toSave.id)
        setProducts(exists ? products.map((p) => (p.id === toSave.id ? toSave : p)) : [...products, toSave])
        navigate('/admin/products')
      }}
      onCancel={() => navigate('/admin/products')}
    />
  )
}

function ProductEditor({
  product,
  setProduct,
  materials,
  preview,
  setPreview,
  onSave,
  onCancel,
}: {
  product: Product
  setProduct: (p: Product) => void
  materials: Material[]
  preview: boolean
  setPreview: (v: boolean) => void
  onSave: (status: 'draft' | 'published') => void
  onCancel: () => void
}) {
  const t = useT()
  const [activeDay, setActiveDay] = useState(1)
  const [addingMaterialId, setAddingMaterialId] = useState('')

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct({ ...product, [key]: value })
  }

  function setDays(days: number) {
    const itinerary = [...product.itinerary]
    while (itinerary.length < days) itinerary.push({ day: itinerary.length + 1, items: [] })
    while (itinerary.length > days) itinerary.pop()
    update('days', days)
    update('itinerary', itinerary)
    if (activeDay > days) setActiveDay(days)
  }

  function updateDayItems(day: number, items: ProductItineraryItem[]) {
    update(
      'itinerary',
      product.itinerary.map((d) => (d.day === day ? { ...d, items } : d)),
    )
  }

  function addMaterialToDay(day: number, materialId: string) {
    const material = materials.find((m) => m.id === materialId)
    if (!material) return
    const dayItems = product.itinerary.find((d) => d.day === day)?.items ?? []
    updateDayItems(day, [...dayItems, newItem(material)])
  }

  function moveItemToDay(fromDay: number, itemId: string, toDay: number) {
    const from = product.itinerary.find((d) => d.day === fromDay)
    const item = from?.items.find((i) => i.id === itemId)
    if (!from || !item) return
    const to = product.itinerary.find((d) => d.day === toDay)
    if (!to) return
    updateDayItems(fromDay, from.items.filter((i) => i.id !== itemId))
    updateDayItems(toDay, [...to.items, item])
  }

  function reorder(day: number, index: number, dir: -1 | 1) {
    const items = [...(product.itinerary.find((d) => d.day === day)?.items ?? [])]
    const target = index + dir
    if (target < 0 || target >= items.length) return
    ;[items[index], items[target]] = [items[target], items[index]]
    updateDayItems(day, items)
  }

  function updateItem(day: number, itemId: string, patch: Partial<ProductItineraryItem>) {
    const items = (product.itinerary.find((d) => d.day === day)?.items ?? []).map((i) =>
      i.id === itemId ? { ...i, ...patch } : i,
    )
    updateDayItems(day, items)
  }

  function removeItem(day: number, itemId: string) {
    updateDayItems(day, (product.itinerary.find((d) => d.day === day)?.items ?? []).filter((i) => i.id !== itemId))
  }

  const costLines = useMemo(() => computeCostBreakdown(product), [product])
  const costTotal = sumCostBreakdown(costLines)
  const currentDay = product.itinerary.find((d) => d.day === activeDay)
  const conflicts = currentDay ? findTimeConflicts(currentDay.items) : new Set<string>()

  if (preview) {
    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPreview(false)} style={{ marginBottom: 16 }}>
          ← {t.t('common.edit')}
        </button>
        <h2>{localize(product.name, 'zh') || '(未命名)'}</h2>
        <p>{localize(product.summary, 'zh')}</p>
        {product.itinerary.map((day) => (
          <div key={day.day}>
            <h3>{t.t('common.day', { n: day.day })}</h3>
            {day.items.map((it) => (
              <div key={it.id} style={{ marginBottom: 8 }}>
                {it.startTime}–{it.endTime} {localize(it.materialSnapshot.name, 'zh')}
              </div>
            ))}
          </div>
        ))}
        <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
          <button className="btn btn-outline" onClick={() => onSave('draft')}>
            {t.t('common.save')} ({t.t('admin.status.draft')})
          </button>
          <button className="btn btn-primary" onClick={() => onSave('published')}>
            {t.t('admin.publish')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>{t.t('admin.newProduct')}</h2>

      <LocalizedInput label="Name" value={product.name} onChange={(v) => update('name', v)} required />
      <LocalizedInput label="Summary" value={product.summary} onChange={(v) => update('summary', v)} multiline />
      <div className="field">
        <label>Cover image (URL)</label>
        <input type="text" value={product.coverImage} onChange={(e) => update('coverImage', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="field">
          <label>{t.t('products.days')}</label>
          <input type="number" min={1} value={product.days} onChange={(e) => setDays(Math.max(1, Number(e.target.value)))} />
        </div>
      </div>
      <LocalizedInput label={t.t('products.audience')} value={product.targetAudience} onChange={(v) => update('targetAudience', v)} />

      <h3>{t.t('products.itinerary')}</h3>
      <div className="tabs-row">
        {product.itinerary.map((d) => (
          <button key={d.day} className={activeDay === d.day ? 'active' : ''} onClick={() => setActiveDay(d.day)}>
            {t.t('common.day', { n: d.day })}
          </button>
        ))}
      </div>

      {currentDay && (
        <div>
          {currentDay.items.map((it, index) => (
            <div key={it.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong>{localize(it.materialSnapshot.name, 'zh')}</strong>
                {conflicts.has(it.id) && <span className="conflict-badge">⚠ 时间冲突</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 8 }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>{t.t('products.startTime')}</label>
                  <input
                    type="time"
                    value={it.startTime}
                    onChange={(e) =>
                      updateItem(activeDay, it.id, {
                        startTime: e.target.value,
                        endTime: addMinutes(e.target.value, it.materialSnapshot.durationMinutes),
                      })
                    }
                  />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>{t.t('products.endTime')}</label>
                  <input type="time" value={it.endTime} readOnly />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>{t.t('products.transit')} (min)</label>
                  <input
                    type="number"
                    value={it.transitMinutesBefore}
                    onChange={(e) => updateItem(activeDay, it.id, { transitMinutesBefore: Number(e.target.value) })}
                  />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>{t.t('products.days')}</label>
                  <select value={activeDay} onChange={(e) => moveItemToDay(activeDay, it.id, Number(e.target.value))}>
                    {product.itinerary.map((d) => (
                      <option key={d.day} value={d.day}>
                        {t.t('common.day', { n: d.day })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginTop: 8 }}>
                <label>{t.t('products.freeTime')}</label>
                <LocalizedInput label="" value={it.freeTimeNote} onChange={(v) => updateItem(activeDay, it.id, { freeTimeNote: v })} />
              </div>
              <div className="field">
                <label>{t.t('products.remarks')}</label>
                <LocalizedInput label="" value={it.remarks} onChange={(v) => updateItem(activeDay, it.id, { remarks: v })} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => reorder(activeDay, index, -1)}>
                  ↑
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => reorder(activeDay, index, 1)}>
                  ↓
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeItem(activeDay, it.id)}>
                  {t.t('common.delete')}
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8 }}>
            <select value={addingMaterialId} onChange={(e) => setAddingMaterialId(e.target.value)}>
              <option value="">-- {t.t('common.add')} --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {localize(m.name, 'zh')}
                </option>
              ))}
            </select>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                if (addingMaterialId) {
                  addMaterialToDay(activeDay, addingMaterialId)
                  setAddingMaterialId('')
                }
              }}
            >
              {t.t('common.add')}
            </button>
          </div>
        </div>
      )}

      <h3>{t.t('products.priceBreakdown')}</h3>
      <table className="price-table">
        <tbody>
          {costLines.map((line, i) => (
            <tr key={i}>
              <td>{localize(line.label, 'zh')}</td>
              <td>{t.t(feeUnitLabelKey[line.feeUnit])}</td>
              <td>
                {formatCurrency(line.unitFee, product.currency)} × {line.quantity}
              </td>
              <td>{formatCurrency(line.subtotal, product.currency)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <strong>{t.t('products.costSubtotal')}</strong>
            </td>
            <td>
              <strong>{formatCurrency(costTotal, product.currency)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="field">
          <label>Pax count</label>
          <input
            type="number"
            min={1}
            value={product.pricingInput.paxCount}
            onChange={(e) => update('pricingInput', { ...product.pricingInput, paxCount: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>vehicles</label>
          <input
            type="number"
            min={1}
            value={product.pricingInput.vehicleCount}
            onChange={(e) => update('pricingInput', { ...product.pricingInput, vehicleCount: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>Currency</label>
          <select value={product.currency} onChange={(e) => update('currency', e.target.value as Currency)}>
            {(['KRW', 'CNY', 'USD'] as Currency[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="field">
          <label>{t.t('products.sellingPrice')}</label>
          <input type="number" value={product.sellingPrice} onChange={(e) => update('sellingPrice', Number(e.target.value))} />
        </div>
        <div className="field">
          <label>{t.t('products.discount')}</label>
          <input type="number" value={product.discountAmount} onChange={(e) => update('discountAmount', Number(e.target.value))} />
        </div>
      </div>
      <LocalizedInput label={t.t('products.priceBreakdown')} value={product.priceNote} onChange={(v) => update('priceNote', v)} multiline />

      <TextListEditor title={t.t('products.included')} items={product.includedSummary} onChange={(v) => update('includedSummary', v)} />
      <TextListEditor title={t.t('products.excluded')} items={product.excludedSummary} onChange={(v) => update('excludedSummary', v)} />
      <LocalizedInput label={t.t('products.extraFees')} value={product.extraFeesNote} onChange={(v) => update('extraFeesNote', v)} multiline />

      <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn btn-outline" onClick={() => setPreview(true)}>
          {t.t('admin.preview')}
        </button>
        <button className="btn btn-primary" onClick={() => onSave('draft')}>
          {t.t('common.save')} ({t.t('admin.status.draft')})
        </button>
        <button className="btn btn-gold" onClick={() => onSave('published')}>
          {t.t('admin.publish')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          {t.t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
