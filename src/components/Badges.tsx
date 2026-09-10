import { useT } from '@/i18n/I18nContext'

export function DemoDataBadge() {
  const t = useT()
  return <span className="badge badge-demo">{t.t('common.demoData')}</span>
}

export function LiveDataBadge() {
  const t = useT()
  return <span className="badge badge-live">{t.t('attractions.apiLiveNotice')}</span>
}

export function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  const t = useT()
  return (
    <span className={`badge ${status === 'published' ? 'badge-published' : 'badge-draft'}`}>
      {t.t(`admin.status.${status}`)}
    </span>
  )
}

export function DemoPriceBadge() {
  const t = useT()
  return <span className="badge badge-demo">{t.t('common.demoPrice')}</span>
}
