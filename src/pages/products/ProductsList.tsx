import { Link } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { formatCurrency } from '@/utils/price'

export default function ProductsList() {
  const t = useT()
  const { lang } = useLangParam()
  const { products } = useAppData()
  const published = products.filter((p) => p.status === 'published')

  return (
    <section className="section container">
      <div className="section-head">
        <span className="kicker">{t.t('nav.products')}</span>
        <h2>{t.t('products.title')}</h2>
        <p className="section-subtitle">{t.t('products.subtitle')}</p>
      </div>

      <div className="notice-muted" style={{ marginBottom: 20 }}>
        {t.t('products.demoPriceNotice')}
      </div>

      <div className="grid grid-3">
        {published.map((p) => (
          <Link to={`/${lang}/products/${p.id}`} className="card hoverable" key={p.id}>
            <div className="card-media">
              <img src={p.coverImage} alt={localize(p.name, lang)} />
            </div>
            <div className="card-body">
              <span className="badge badge-live" style={{ alignSelf: 'flex-start' }}>
                {t.t('common.days', { n: p.days })}
              </span>
              <h3 className="card-title">{localize(p.name, lang)}</h3>
              <p className="card-desc">{localize(p.summary, lang)}</p>
              <strong>{formatCurrency(p.sellingPrice, p.currency)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
