import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import type { MedicalCategory } from '@/types/domain'

const CATEGORIES: MedicalCategory[] = ['dental', 'dermatology', 'plastic_surgery']

export default function MedicalList() {
  const t = useT()
  const { lang } = useLangParam()
  const { medicalOrgs } = useAppData()
  const [category, setCategory] = useState<MedicalCategory | 'all'>('all')

  const filtered = category === 'all' ? medicalOrgs : medicalOrgs.filter((o) => o.category === category)

  return (
    <section className="section container">
      <div className="section-head">
        <span className="kicker">{t.t('nav.medical')}</span>
        <h2>{t.t('medical.title')}</h2>
        <p className="section-subtitle">{t.t('medical.subtitle')}</p>
      </div>

      <div className="notice-muted" style={{ marginBottom: 20 }}>
        {t.t('medical.sourceNotice')}
      </div>

      <div className="tabs-row">
        <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>
          {t.t('common.allCategories')}
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
            {t.t(`medical.category.${c}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {filtered.map((org) => (
          <Link to={`/${lang}/medical/${org.id}`} className="card hoverable" key={org.id}>
            <div className="card-media">
              <img src={org.images[0]} alt={org.name} />
            </div>
            <div className="card-body">
              <span className="badge badge-live" style={{ alignSelf: 'flex-start' }}>
                {t.t(`medical.category.${org.category}`)}
              </span>
              <h3 className="card-title">{org.name}</h3>
              <p className="card-desc">{localize(org.description, lang)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
