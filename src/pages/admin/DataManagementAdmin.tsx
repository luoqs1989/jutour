import { useRef, useState } from 'react'
import { useT } from '@/i18n/I18nContext'
import { useAppData, type AppDataSnapshot } from '@/data/store/AppDataContext'
import { downloadJson, readJsonFile } from '@/utils/jsonIO'

function isValidSnapshot(value: unknown): value is AppDataSnapshot {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    v.version === 1 &&
    Array.isArray(v.materials) &&
    Array.isArray(v.products) &&
    Array.isArray(v.medicalOrgs) &&
    Array.isArray(v.leads)
  )
}

export default function DataManagementAdmin() {
  const t = useT()
  const { exportAll, importAll, resetToDemo } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      const data = await readJsonFile(file)
      if (!isValidSnapshot(data)) {
        setError('文件格式无效 / Invalid file format')
        return
      }
      if (confirm(t.t('admin.importConfirm'))) {
        importAll(data)
      }
    } catch {
      setError('文件解析失败 / Failed to parse JSON')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <h2>{t.t('admin.nav.data')}</h2>

      <div className="field">
        <label>{t.t('admin.exportJson')}</label>
        <button className="btn btn-outline btn-sm" onClick={() => downloadJson('jutour-data-export.json', exportAll())}>
          {t.t('admin.exportJson')}
        </button>
      </div>

      <div className="field">
        <label>{t.t('admin.importJson')}</label>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} />
        {error && <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</p>}
      </div>

      <div className="field">
        <label>{t.t('admin.resetDemo')}</label>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (confirm(t.t('admin.resetDemoConfirm'))) resetToDemo()
          }}
        >
          {t.t('admin.resetDemo')}
        </button>
      </div>
    </div>
  )
}
