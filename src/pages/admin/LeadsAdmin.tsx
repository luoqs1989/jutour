import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { downloadJson } from '@/utils/jsonIO'

export default function LeadsAdmin() {
  const t = useT()
  const { leads, setLeads } = useAppData()

  return (
    <div>
      <h2>{t.t('admin.leadsTitle')}</h2>
      <div className="toolbar">
        <button className="btn btn-outline btn-sm" onClick={() => downloadJson('jutour-leads.json', leads)}>
          {t.t('admin.exportJson')}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => confirm(t.t('admin.resetDemoConfirm')) && setLeads([])}>
          {t.t('admin.clearLeads')}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>{t.t('consultation.name')}</th>
            <th>{t.t('consultation.contact')}</th>
            <th>{t.t('consultation.travelDate')}</th>
            <th>{t.t('consultation.paxCount')}</th>
            <th>{t.t('consultation.interests')}</th>
            <th>{t.t('consultation.remarks')}</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.contact}</td>
              <td>{lead.travelDate}</td>
              <td>{lead.paxCount}</td>
              <td>{lead.interests.join(', ')}</td>
              <td>{lead.remarks}</td>
              <td>{new Date(lead.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && <p>{t.t('common.noResults')}</p>}
    </div>
  )
}
