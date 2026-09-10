import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAttractionList } from '@/services/attractionsAdapter'
import { ATTRACTION_CATEGORIES } from '@/data/attractionCategories'
import { DemoDataBadge, LiveDataBadge } from '@/components/Badges'

export default function AttractionsList() {
  const t = useT()
  const { lang } = useLangParam()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState(ATTRACTION_CATEGORIES[0].key)
  const { attractions, isLive, loading } = useAttractionList(lang, keyword, category)

  return (
    <section className="section container">
      <div className="section-head">
        <span className="kicker">{t.t('nav.attractions')}</span>
        <h2>{t.t('attractions.title')}</h2>
        <p className="section-subtitle">{t.t('attractions.subtitle')}</p>
      </div>

      <div className={isLive ? 'notice-muted' : 'notice'} style={{ marginBottom: 20 }}>
        {isLive ? t.t('attractions.apiLiveNotice') : t.t('attractions.apiFallbackNotice')}
      </div>

      <div className="tabs-row">
        {ATTRACTION_CATEGORIES.map((c) => (
          <button key={c.key} className={category === c.key ? 'active' : ''} onClick={() => setCategory(c.key)}>
            {t.t(`attractions.category.${c.key}`)}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder={t.t('attractions.filterKeyword')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        {isLive ? <LiveDataBadge /> : <DemoDataBadge />}
      </div>

      {loading ? (
        <p>{t.t('common.loading')}</p>
      ) : attractions.length === 0 ? (
        <p>{t.t('common.noResults')}</p>
      ) : (
        <div className="grid grid-3">
          {attractions.map((a) => (
            <Link to={`/${lang}/attractions/${a.id}`} className="card hoverable" key={a.id}>
              <div className="card-media">
                <img src={a.images[0] ?? ''} alt={a.name} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{a.name}</h3>
                <p className="card-desc">{a.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
