import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppDataProvider } from '@/data/store/AppDataContext'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { PublicLayout } from '@/components/PublicLayout'
import { ProtectedAdminLayout } from '@/components/AdminLayout'
import { RootRedirect } from '@/components/RootRedirect'
import Home from '@/pages/Home'
import AttractionsList from '@/pages/attractions/AttractionsList'
import AttractionDetail from '@/pages/attractions/AttractionDetail'
import MedicalList from '@/pages/medical/MedicalList'
import MedicalDetail from '@/pages/medical/MedicalDetail'
import KpopList from '@/pages/kpop/KpopList'
import KpopDetail from '@/pages/kpop/KpopDetail'
import ProductsList from '@/pages/products/ProductsList'
import ProductDetail from '@/pages/products/ProductDetail'
import Consultation from '@/pages/Consultation'
import AdminLogin from '@/pages/admin/AdminLogin'
import MaterialsAdmin from '@/pages/admin/MaterialsAdmin'
import ProductsAdmin from '@/pages/admin/ProductsAdmin'
import ProductBuilder from '@/pages/admin/ProductBuilder'
import MedicalPricingAdmin from '@/pages/admin/MedicalPricingAdmin'
import LeadsAdmin from '@/pages/admin/LeadsAdmin'
import DataManagementAdmin from '@/pages/admin/DataManagementAdmin'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppDataProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route index element={<Navigate to="materials" replace />} />
              <Route path="materials" element={<MaterialsAdmin />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="products/new" element={<ProductBuilder />} />
              <Route path="products/:id/edit" element={<ProductBuilder />} />
              <Route path="medical-pricing" element={<MedicalPricingAdmin />} />
              <Route path="leads" element={<LeadsAdmin />} />
              <Route path="data" element={<DataManagementAdmin />} />
            </Route>

            <Route path="/:lang" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="attractions" element={<AttractionsList />} />
              <Route path="attractions/:id" element={<AttractionDetail />} />
              <Route path="medical" element={<MedicalList />} />
              <Route path="medical/:id" element={<MedicalDetail />} />
              <Route path="kpop" element={<KpopList />} />
              <Route path="kpop/:id" element={<KpopDetail />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="consultation" element={<Consultation />} />
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AdminAuthProvider>
      </AppDataProvider>
    </BrowserRouter>
  )
}
