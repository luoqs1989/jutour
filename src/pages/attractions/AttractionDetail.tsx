import { Link, useParams } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAttractionDetail } from '@/services/attractionsAdapter'
import { DemoDataBadge, LiveDataBadge } from '@/components/Badges'

export default function AttractionDetail() {
  const t = useT()
  const { lang } = useLangParam()
  const { id } = useParams<{ id: string }>()
  const { attraction, isLive, loading } = useAttractionDetail(id, lang)

  if (loading) return <div className="container section">{t.t('common.loading')}</div>
  if (!attraction) return <div className="container section">{t.t('common.noResults')}</div>

  return (
    <div className="container section">
      <Link to={`/${lang}/attractions`} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← {t.t('common.backToList')}
      </Link>
      <div className="card-media" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 20, aspectRatio: '16/7' }}>
        <img src={attraction.images[0] ?? ''} alt={attraction.name} />
      </div>
      <div style={{ marginBottom: 12 }}>{isLive ? <LiveDataBadge /> : <DemoDataBadge />}</div>
      <h1>{attraction.name}</h1>
      <p style={{ maxWidth: '72ch', whiteSpace: 'pre-line' }}>{attraction.description}</p>

      <div className="two-col" style={{ marginTop: 24, gridTemplateColumns: '1fr' }}>
        <div style={{ background: 'var(--color-surface-tint)' }}>
          <h3>{t.t('attractions.usefulInfo')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
            <li>
              <strong>{t.t('attractions.address')}：</strong>
              {attraction.address || '—'}
            </li>
            <li>
              <strong>{t.t('attractions.openHours')}：</strong>
              {attraction.openHours || t.t('common.inquireForPrice')}
            </li>
            <li>
              <strong>{t.t('attractions.phone')}：</strong>
              {attraction.phone || '—'}
            </li>
            <li>
              <strong>{t.t('attractions.website')}：</strong>
              {attraction.website ? (
                <a href={attraction.website} target="_blank" rel="noreferrer">
                  {attraction.website}
                </a>
              ) : (
                '—'
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
