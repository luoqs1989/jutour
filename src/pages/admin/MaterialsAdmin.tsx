import { useState } from 'react'
import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { StatusBadge } from '@/components/Badges'
import { MaterialForm } from './MaterialForm'
import type { Material } from '@/types/domain'

export default function MaterialsAdmin() {
  const t = useT()
  const { materials, setMaterials } = useAppData()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [editing, setEditing] = useState<Material | null | 'new'>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  if (editing) {
    return (
      <MaterialForm
        initial={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSave={(m) => {
          const exists = materials.some((x) => x.id === m.id)
          setMaterials(exists ? materials.map((x) => (x.id === m.id ? m : x)) : [...materials, m])
          setEditing(null)
        }}
      />
    )
  }

  const filtered = materials.filter((m) => {
    if (category !== 'all' && m.category !== category) return false
    if (search && !localize(m.name, 'zh').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const categories = Array.from(new Set(materials.map((m) => m.category)))

  return (
    <div>
      <h2>{t.t('admin.materialsTitle')}</h2>
      <div className="toolbar">
        <input type="text" placeholder={t.t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">{t.t('common.allCategories')}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          {t.t('admin.newMaterial')}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Fee</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{localize(m.name, 'zh')}</td>
              <td>{m.category}</td>
              <td>
                {m.baseFee} {m.currency} / {m.feeUnit}
              </td>
              <td>
                <StatusBadge status={m.status} />
              </td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(m)}>
                  {t.t('common.edit')}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDeleteId(m.id)}>
                  {t.t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{t.t('common.delete')}?</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(null)}>
                {t.t('common.cancel')}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setMaterials(materials.filter((m) => m.id !== confirmDeleteId))
                  setConfirmDeleteId(null)
                }}
              >
                {t.t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
