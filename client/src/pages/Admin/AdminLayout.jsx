import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationsApi } from '../../services/api';
import sirenImg from '../../assets/images/siren.png';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/leads', label: 'Leads', icon: '👥' },
  { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCount = () => {
      notificationsApi.getUnreadCount()
        .then(res => setUnreadCount(res.data.count))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <span className="text-2xl">🦷</span>
          {sidebarOpen && <span className="font-bold text-sm">Bright Smile</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, label, icon }) => {
            const active = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">{icon}</span>
                {sidebarOpen && (
                  <span className="flex-1">{label}</span>
                )}
                {sidebarOpen && label === 'Notifications' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-700">
          {sidebarOpen && (
            <div className="text-xs text-gray-400 mb-2 px-3">
              <p className="font-medium text-gray-300">{user?.name}</p>
              <p>{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full`}
          >
            <span>🚪</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            ☰
          </button>
          <h1 className="font-semibold text-gray-900 flex-1">
            {navItems.find(n => (n.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.path)))?.label || 'Dashboard'}
          </h1>
          {unreadCount > 0 && (
            <Link to="/admin/notifications" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm">
              <img src={sirenImg} alt="" className="w-4 h-4" />
              {unreadCount} new alert{unreadCount !== 1 ? 's' : ''}
            </Link>
          )}
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-700">← View Site</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
