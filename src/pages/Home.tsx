import { Link } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { getSeedAttractions } from '@/data/seed/attractions'
import { formatCurrency } from '@/utils/price'

const SERVICES = ['airport', 'charter', 'custom', 'escort', 'kpop'] as const

export default function Home() {
  const t = useT()
  const { lang } = useLangParam()
  const { products, medicalOrgs, kpopEvents } = useAppData()
  const featuredProducts = products.filter((p) => p.status === 'published').slice(0, 4)
  const featuredOrgs = medicalOrgs.slice(0, 3)
  const featuredAttractions = getSeedAttractions(lang).slice(0, 3)
  const featuredKpop = kpopEvents.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1800&q=80"
            alt=""
          />
        </div>
        <div className="hero-in">
          <h1>{t.t('home.heroTitle')}</h1>
          <p>{t.t('home.heroSubtitle')}</p>
          <div className="hero-actions">
            <Link to={`/${lang}/consultation`} className="btn btn-gold">
              {t.t('home.ctaCustomize')}
            </Link>
            <Link to={`/${lang}/products`} className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              {t.t('nav.products')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">{t.t('home.servicesTitle')}</span>
          <h2>{t.t('home.servicesSubtitle')}</h2>
        </div>
        <div className="grid grid-3">
          {SERVICES.map((key) => (
            <div className="card" key={key}>
              <div className="card-body">
                <h3 className="card-title">{t.t(`home.service.${key}.title`)}</h3>
                <p className="card-desc" style={{ WebkitLineClamp: 4 }}>
                  {t.t(`home.service.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">{t.t('home.productsTitle')}</span>
          <h2>{t.t('home.productsTitle')}</h2>
          <p className="section-subtitle">{t.t('home.productsSubtitle')}</p>
        </div>
        <div className="grid grid-4">
          {featuredProducts.map((p) => (
            <Link to={`/${lang}/products/${p.id}`} className="card hoverable" key={p.id}>
              <div className="card-media">
                <img src={p.coverImage} alt={localize(p.name, lang)} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{localize(p.name, lang)}</h3>
                <p className="card-desc">{localize(p.summary, lang)}</p>
                <strong>{formatCurrency(p.sellingPrice, p.currency)}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">{t.t('home.attractionsTitle')}</span>
          <h2>{t.t('home.attractionsTitle')}</h2>
          <p className="section-subtitle">{t.t('home.attractionsSubtitle')}</p>
        </div>
        <div className="grid grid-3">
          {featuredAttractions.map((a) => (
            <Link to={`/${lang}/attractions/${a.id}`} className="card hoverable" key={a.id}>
              <div className="card-media">
                <img src={a.images[0]} alt={a.name} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{a.name}</h3>
                <p className="card-desc">{a.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">{t.t('home.medicalTitle')}</span>
          <h2>{t.t('home.medicalTitle')}</h2>
          <p className="section-subtitle">{t.t('home.medicalSubtitle')}</p>
        </div>
        <div className="grid grid-3">
          {featuredOrgs.map((org) => (
            <Link to={`/${lang}/medical/${org.id}`} className="card hoverable" key={org.id}>
              <div className="card-media">
                <img src={org.images[0]} alt={org.name} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{org.name}</h3>
                <p className="card-desc">{localize(org.description, lang)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">{t.t('home.kpopTitle')}</span>
          <h2>{t.t('home.kpopTitle')}</h2>
          <p className="section-subtitle">{t.t('home.kpopSubtitle')}</p>
        </div>
        <div className="grid grid-3">
          {featuredKpop.map((ev) => (
            <Link to={`/${lang}/kpop/${ev.id}`} className="card hoverable" key={ev.id}>
              <div className="card-media">
                <img src={ev.poster} alt={ev.name} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{ev.name}</h3>
                <p className="card-desc">
                  {ev.artist} · {ev.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--color-green-tint)', border: 'none' }}>
          <h2>{t.t('home.consultTitle')}</h2>
          <p style={{ maxWidth: '56ch', margin: '0 auto 20px' }}>{t.t('home.consultSubtitle')}</p>
          <Link to={`/${lang}/consultation`} className="btn btn-primary">
            {t.t('home.ctaConsult')}
          </Link>
        </div>
      </section>
    </>
  )
}
