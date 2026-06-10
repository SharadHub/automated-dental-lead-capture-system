import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin    from './pages/AdminLogin';
import AdminLayout   from './pages/AdminLayout';
import Dashboard     from './pages/Dashboard/Dashboard';
import Leads         from './pages/Leads/Leads';
import Appointments  from './pages/Appointments/Appointments';
import Analytics     from './pages/Analytics/Analytics';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index             element={<Dashboard />} />
            <Route path="leads"      element={<Leads />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="analytics"  element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
