import { Link, useParams } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'

export default function KpopDetail() {
  const t = useT()
  const { lang } = useLangParam()
  const { id } = useParams<{ id: string }>()
  const { kpopEvents } = useAppData()
  const ev = kpopEvents.find((e) => e.id === id)

  if (!ev) return <div className="container section">{t.t('common.noResults')}</div>

  return (
    <div className="container section">
      <Link to={`/${lang}/kpop`} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← {t.t('common.backToList')}
      </Link>
      <div className="notice" style={{ marginBottom: 20 }}>
        {t.t('kpop.demoNotice')}
      </div>
      <div className="two-col" style={{ gridTemplateColumns: '320px 1fr' }}>
        <div style={{ padding: 0 }}>
          <img src={ev.poster} alt={ev.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
        </div>
        <div style={{ background: '#fff' }}>
          <h1>{ev.name}</h1>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 15 }}>
            <li>
              <strong>{t.t('kpop.artist')}：</strong>
              {ev.artist}
            </li>
            <li>
              <strong>{t.t('kpop.date')}：</strong>
              {ev.date}
            </li>
            <li>
              <strong>{t.t('kpop.venue')}：</strong>
              {ev.venue}
            </li>
          </ul>
          <a href={ev.officialTicketUrl} target="_blank" rel="noreferrer" className="btn btn-gold">
            {t.t('kpop.officialTicket')}
          </a>
        </div>
      </div>
    </div>
  )
}
