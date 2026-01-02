import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AdminLandingPage } from './pages/landing/AdminLandingPage';
import { CompanyLandingPage } from './pages/landing/CompanyLandingPage';
import { CompanyLoginPage } from './pages/auth/CompanyLoginPage';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { UsersPage } from './pages/dashboard/UsersPage';
import { CompaniesPage } from './pages/dashboard/CompaniesPage';
import { MyCompanyPage } from './pages/dashboard/MyCompanyPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { PasswordPage } from './pages/dashboard/PasswordPage';
import { AuditLogsPage } from './pages/dashboard/AuditLogsPage';
import { ConcessionairesPage } from './pages/dashboard/ConcessionairesPage';
import { PlantsPage } from './pages/dashboard/PlantsPage';
import { CooperativesPage } from './pages/dashboard/CooperativesPage';
import { PartnersPage } from './pages/dashboard/PartnersPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <div className="min-h-screen">
        <Routes>
          {/* Admin Landing Page - Rota Raiz */}
          <Route path="/" element={<AdminLandingPage />} />

          {/* Admin Routes (sem companyCode) */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Home antigo (com Header) - Manter para compatibilidade temporária */}
          <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />

          {/* Company Landing Pages - Rotas Dinâmicas */}
          <Route path="/:companyCode" element={<CompanyLandingPage />} />
          <Route path="/:companyCode/login" element={<CompanyLoginPage />} />
          <Route path="/:companyCode/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes (protegidas) */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/companies" element={<CompaniesPage />} />
          <Route path="/dashboard/my-company" element={<MyCompanyPage />} />
          <Route path="/dashboard/plants" element={<PlantsPage />} />
          <Route path="/dashboard/cooperatives" element={<CooperativesPage />} />
          <Route path="/dashboard/partners" element={<PartnersPage />} />
          <Route path="/dashboard/concessionaires" element={<ConcessionairesPage />} />
          <Route path="/dashboard/audit-logs" element={<AuditLogsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/password" element={<PasswordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
