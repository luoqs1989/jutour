import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'

export default function KpopList() {
  const t = useT()
  const { lang } = useLangParam()
  const { kpopEvents } = useAppData()
  const [date, setDate] = useState('')

  const filtered = date ? kpopEvents.filter((e) => e.date === date) : kpopEvents

  return (
    <section className="section container">
      <div className="section-head">
        <span className="kicker">{t.t('nav.kpop')}</span>
        <h2>{t.t('kpop.title')}</h2>
        <p className="section-subtitle">{t.t('kpop.subtitle')}</p>
      </div>

      <div className="notice" style={{ marginBottom: 20 }}>
        {t.t('kpop.demoNotice')}
      </div>

      <div className="toolbar">
        <label className="field" style={{ margin: 0 }}>
          <span style={{ fontSize: 12.5 }}>{t.t('kpop.filterDate')}</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        {date && (
          <button className="btn btn-ghost btn-sm" onClick={() => setDate('')}>
            {t.t('common.cancel')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p>{t.t('common.noResults')}</p>
      ) : (
        <div className="grid grid-3">
          {filtered.map((ev) => (
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
      )}
    </section>
  )
}
