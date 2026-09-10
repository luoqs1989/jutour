import { Link, useParams } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { formatCurrency } from '@/utils/price'
import { DemoPriceBadge } from '@/components/Badges'

export default function MedicalDetail() {
  const t = useT()
  const { lang } = useLangParam()
  const { id } = useParams<{ id: string }>()
  const { medicalOrgs } = useAppData()
  const org = medicalOrgs.find((o) => o.id === id)

  if (!org) return <div className="container section">{t.t('common.noResults')}</div>

  return (
    <div className="container section">
      <Link to={`/${lang}/medical`} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← {t.t('common.backToList')}
      </Link>
      <div className="card-media" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 20, aspectRatio: '16/7' }}>
        <img src={org.images[0]} alt={org.name} />
      </div>
      <span className="badge badge-live">{t.t(`medical.category.${org.category}`)}</span>
      <h1 style={{ marginTop: 10 }}>{org.name}</h1>
      <p style={{ maxWidth: '72ch' }}>{localize(org.description, lang)}</p>

      <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, marginBottom: 24 }}>
        <li>
          <strong>{t.t('attractions.address')}：</strong>
          {org.address}
        </li>
        <li>
          <strong>{t.t('medical.languages')}：</strong>
          {org.languages.map((l) => t.t(`medical.lang.${l}`)).join(' / ')}
        </li>
        <li>
          <strong>{t.t('attractions.website')}：</strong>
          {org.website ? (
            <a href={org.website} target="_blank" rel="noreferrer">
              {org.website}
            </a>
          ) : (
            t.t('common.inquireForPrice')
          )}
        </li>
        <li>
          <strong>{t.t('common.sourceLabel')}：</strong>
          <a href={org.sourceUrl} target="_blank" rel="noreferrer">
            medical.visitseoul.net
          </a>
        </li>
      </ul>

      <h3>{t.t('medical.procedures')}</h3>
      <table className="price-table">
        <thead>
          <tr>
            <th></th>
            <th>{t.t('medical.originalPrice')}</th>
            <th>{t.t('medical.discountAmount')}</th>
            <th>{t.t('medical.discountPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {org.procedures.map((proc) => (
            <tr key={proc.id}>
              <td>
                <div>{localize(proc.name, lang)}</div>
                <div style={{ fontSize: 12, color: 'var(--color-ink-soft)' }}>{localize(proc.priceNote, lang)}</div>
              </td>
              {proc.priceStatus === 'inquire' ? (
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-ink-soft)' }}>
                  {t.t('common.inquireForPrice')}
                </td>
              ) : (
                <>
                  <td style={{ textDecoration: 'line-through', color: 'var(--color-ink-soft)' }}>
                    {proc.originalPrice != null ? formatCurrency(proc.originalPrice, proc.currency) : '—'}
                  </td>
                  <td>{proc.discountAmount != null ? formatCurrency(proc.discountAmount, proc.currency) : '—'}</td>
                  <td>
                    <strong>{proc.discountPrice != null ? formatCurrency(proc.discountPrice, proc.currency) : '—'}</strong>{' '}
                    <DemoPriceBadge />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={`/${lang}/consultation`} className="btn btn-primary">
        {t.t('medical.consultForProcedure')}
      </Link>
    </div>
  )
}
