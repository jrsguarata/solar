import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { UsersPage } from './pages/dashboard/UsersPage';
import { CompaniesPage } from './pages/dashboard/CompaniesPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { PasswordPage } from './pages/dashboard/PasswordPage';
import { AuditLogsPage } from './pages/dashboard/AuditLogsPage';
import { ConcessionairesPage } from './pages/dashboard/ConcessionairesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/companies" element={<CompaniesPage />} />
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
