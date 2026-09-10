import { useState, type FormEvent } from 'react'
import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { generateId } from '@/utils/id'

const INTEREST_KEYS = ['airport', 'charter', 'custom', 'escort', 'kpop'] as const

export default function Consultation() {
  const t = useT()
  const { leads, setLeads } = useAppData()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [paxCount, setPaxCount] = useState(1)
  const [interests, setInterests] = useState<string[]>([])
  const [remarks, setRemarks] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function toggleInterest(key: string) {
    setInterests((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLeads([
      ...leads,
      {
        id: generateId('lead'),
        name,
        contact,
        travelDate,
        paxCount,
        interests,
        remarks,
        createdAt: new Date().toISOString(),
      },
    ])
    setSubmitted(true)
  }

  return (
    <section className="section container" style={{ maxWidth: 640 }}>
      <div className="section-head">
        <span className="kicker">{t.t('nav.consultation')}</span>
        <h2>{t.t('consultation.title')}</h2>
        <p className="section-subtitle">{t.t('consultation.subtitle')}</p>
      </div>

      <div className="notice" style={{ marginBottom: 24 }}>
        {t.t('consultation.demoWarning')}
      </div>

      {submitted ? (
        <div className="notice-muted">{t.t('consultation.submittedNotice')}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t.t('consultation.name')}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.t('consultation.contact')}</label>
            <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.t('consultation.travelDate')}</label>
            <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.t('consultation.paxCount')}</label>
            <input
              type="number"
              min={1}
              value={paxCount}
              onChange={(e) => setPaxCount(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>{t.t('consultation.interests')}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {INTEREST_KEYS.map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`chip-select ${interests.includes(key) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(key)}
                >
                  {t.t(`consultation.interest.${key}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>{t.t('consultation.remarks')}</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">
            {t.t('consultation.submit')}
          </button>
        </form>
      )}
    </section>
  )
}
