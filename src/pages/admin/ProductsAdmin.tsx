import { useNavigate } from 'react-router-dom'
import { useT } from '@/i18n/I18nContext'
import { useAppData } from '@/data/store/AppDataContext'
import { t as localize } from '@/i18n/getLocalized'
import { StatusBadge } from '@/components/Badges'
import { formatCurrency } from '@/utils/price'

export default function ProductsAdmin() {
  const t = useT()
  const navigate = useNavigate()
  const { products, setProducts } = useAppData()

  function togglePublish(id: string) {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'published' ? 'draft' : 'published',
              publishedAt: p.status === 'published' ? p.publishedAt : new Date().toISOString(),
            }
          : p,
      ),
    )
  }

  function remove(id: string) {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h2>{t.t('admin.productsTitle')}</h2>
      <div className="toolbar">
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/products/new')}>
          {t.t('admin.newProduct')}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Days</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{localize(p.name, 'zh')}</td>
              <td>{p.days}</td>
              <td>{formatCurrency(p.sellingPrice, p.currency)}</td>
              <td>
                <StatusBadge status={p.status} />
              </td>
              <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/admin/products/${p.id}/edit`)}>
                  {t.t('common.edit')}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => togglePublish(p.id)}>
                  {p.status === 'published' ? t.t('admin.unpublish') : t.t('admin.publish')}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(p.id)}>
                  {t.t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
