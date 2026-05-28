import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage    from './pages/Landing/LandingPage';
import ServicesPage   from './pages/Services/ServicesPage';
import AboutPage      from './pages/About/AboutPage';
import BookPage       from './pages/Book/BookPage';
import ContactPage    from './pages/Contact/ContactPage';
import AdminLogin     from './pages/Admin/AdminLogin';
import AdminLayout    from './pages/Admin/AdminLayout';
import Dashboard      from './pages/Admin/Dashboard/Dashboard';
import Leads          from './pages/Admin/Leads/Leads';
import Appointments   from './pages/Admin/Appointments/Appointments';
import Analytics      from './pages/Admin/Analytics/Analytics';
import Notifications  from './pages/Admin/Notifications/Notifications';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  );
  return user ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public pages ── */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/book"    element={<BookPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── Admin (accessible only by typing /admin in URL) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index          element={<Dashboard />} />
            <Route path="leads"   element={<Leads />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="analytics"    element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
