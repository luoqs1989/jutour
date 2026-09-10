import { LANGS, type LocalizedText } from '@/types/common'
import { useT } from '@/i18n/I18nContext'

const LANG_LABEL: Record<string, string> = { zh: '中文', en: 'English', ko: '한국어' }

interface Props {
  label: string
  value: LocalizedText
  onChange: (value: LocalizedText) => void
  multiline?: boolean
  required?: boolean
}

/** Editable name/summary/description field across all three languages, with
 * an inline warning (not a fabricated translation) when one is left empty. */
export function LocalizedInput({ label, value, onChange, multiline, required }: Props) {
  const t = useT()
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="field">
      <label>
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      <div style={{ display: 'grid', gap: 8 }}>
        {LANGS.map((l) => (
          <div key={l}>
            <div style={{ fontSize: 11.5, color: 'var(--color-ink-soft)', marginBottom: 3 }}>{LANG_LABEL[l]}</div>
            <Tag
              type={multiline ? undefined : 'text'}
              value={value[l]}
              onChange={(e) => onChange({ ...value, [l]: e.target.value })}
            />
            {!value[l]?.trim() && (
              <div className="hint" style={{ color: 'var(--color-gold-dark)' }}>
                {t.t('admin.translationMissing', { lang: LANG_LABEL[l] })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
