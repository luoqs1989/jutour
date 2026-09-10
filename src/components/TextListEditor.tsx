import { useT } from '@/i18n/I18nContext'
import { emptyLocalizedText, type LocalizedText } from '@/types/common'
import { LocalizedInput } from './LocalizedInput'

export function TextListEditor({
  title,
  items,
  onChange,
}: {
  title: string
  items: LocalizedText[]
  onChange: (v: LocalizedText[]) => void
}) {
  const t = useT()
  return (
    <div className="field">
      <label>{title}</label>
      {items.map((item, i) => (
        <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <LocalizedInput
            label=""
            value={item}
            onChange={(v) => {
              const next = [...items]
              next[i] = v
              onChange(next)
            }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            {t.t('common.delete')}
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...items, emptyLocalizedText()])}>
        {t.t('common.add')}
      </button>
    </div>
  )
}
