import { Link, useParams } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { computeCostBreakdown, feeUnitLabelKey, formatCurrency, sumCostBreakdown } from '@/utils/price'

export default function ProductDetail() {
  const t = useT()
  const { lang } = useLangParam()
  const { id } = useParams<{ id: string }>()
  const { products } = useAppData()
  const product = products.find((p) => p.id === id)

  if (!product) return <div className="container section">{t.t('common.noResults')}</div>

  const costLines = computeCostBreakdown(product)
  const costTotal = sumCostBreakdown(costLines)

  return (
    <div className="container section">
      <Link to={`/${lang}/products`} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← {t.t('common.backToList')}
      </Link>

      <div className="card-media" style={{ borderRadius: 'var(--radius-lg)', marginBottom: 20, aspectRatio: '16/7' }}>
        <img src={product.coverImage} alt={localize(product.name, lang)} />
      </div>

      <span className="badge badge-live">{t.t('common.days', { n: product.days })}</span>
      <h1 style={{ marginTop: 10 }}>{localize(product.name, lang)}</h1>
      <p style={{ maxWidth: '72ch' }}>{localize(product.summary, lang)}</p>
      <p style={{ fontSize: 13.5, color: 'var(--color-ink-soft)' }}>
        <strong>{t.t('products.audience')}：</strong>
        {localize(product.targetAudience, lang)}
      </p>

      <div className="notice" style={{ margin: '20px 0' }}>
        {t.t('products.medicalDisclaimer')}
      </div>

      <h2>{t.t('products.itinerary')}</h2>
      {product.itinerary.map((day) => (
        <div className="day-block" key={day.day}>
          <div className="day-num">
            DAY
            <em>{String(day.day).padStart(2, '0')}</em>
          </div>
          <div>
            {day.items.map((it) => {
              const m = it.materialSnapshot
              const freeNote = localize(it.freeTimeNote, lang)
              const remarks = localize(it.remarks, lang)
              return (
                <div className="timeline-item" key={it.id}>
                  <div className="timeline-time">
                    {it.startTime}
                    <small>→ {it.endTime}</small>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, margin: '0 0 4px' }}>{localize(m.name, lang)}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--color-ink-soft)', margin: '0 0 8px' }}>
                      {localize(m.summary, lang)}
                    </p>
                    {m.images[0] && (
                      <div className="card-media" style={{ aspectRatio: '16/8', marginBottom: 8, borderRadius: 'var(--radius-sm)' }}>
                        <img src={m.images[0]} alt={localize(m.name, lang)} />
                      </div>
                    )}
                    {it.transitMinutesBefore > 0 && (
                      <p style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
                        {t.t('products.transit')}: {it.transitMinutesBefore} min
                      </p>
                    )}
                    {freeNote && (
                      <p style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
                        {t.t('products.freeTime')}: {freeNote}
                      </p>
                    )}
                    {remarks && (
                      <p style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
                        {t.t('products.remarks')}: {remarks}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {product.optionalAddons.length > 0 && (
        <>
          <h2>{t.t('products.optionalAddons')}</h2>
          <ul>
            {product.optionalAddons.map((a) => (
              <li key={a.id}>
                {localize(a.name, lang)} — {formatCurrency(a.fee, product.currency)}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>{t.t('products.priceBreakdown')}</h2>
      <table className="price-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {costLines.map((line, i) => (
            <tr key={`${line.materialItemId}_${i}`}>
              <td>{localize(line.label, lang)}</td>
              <td>{t.t(feeUnitLabelKey[line.feeUnit])}</td>
              <td>
                {formatCurrency(line.unitFee, product.currency)} × {line.quantity}
              </td>
              <td>{formatCurrency(line.subtotal, product.currency)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <strong>{t.t('products.costSubtotal')}</strong>
            </td>
            <td>
              <strong>{formatCurrency(costTotal, product.currency)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="price-total">
        <div>
          <div style={{ fontSize: 12.5, opacity: 0.75 }}>{t.t('products.sellingPrice')}</div>
          <div className="big">{formatCurrency(product.sellingPrice, product.currency)}</div>
          {product.discountAmount > 0 && (
            <div style={{ fontSize: 12.5, opacity: 0.75 }}>
              {t.t('products.discount')}: {formatCurrency(product.discountAmount, product.currency)}
            </div>
          )}
        </div>
        <div style={{ maxWidth: '34ch', fontSize: 13, opacity: 0.8 }}>{localize(product.priceNote, lang)}</div>
      </div>

      <div className="two-col" style={{ margin: '32px 0' }}>
        <div className="yes">
          <h3>{t.t('products.included')}</h3>
          <ul>
            {product.includedSummary.map((line, i) => (
              <li key={i}>{localize(line, lang)}</li>
            ))}
          </ul>
        </div>
        <div className="no">
          <h3>{t.t('products.excluded')}</h3>
          <ul>
            {product.excludedSummary.map((line, i) => (
              <li key={i}>{localize(line, lang)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="notice-muted" style={{ marginBottom: 24 }}>
        <strong>{t.t('products.extraFees')}：</strong>
        {localize(product.extraFeesNote, lang)}
      </div>

      <Link to={`/${lang}/consultation`} className="btn btn-primary">
        {t.t('products.consultAboutProduct')}
      </Link>
    </div>
  )
}
