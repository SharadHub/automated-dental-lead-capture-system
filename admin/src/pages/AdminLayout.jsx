import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiUsers, FiCalendar, FiTrendingUp, FiLogOut, FiSmile } from 'react-icons/fi';

const navItems = [
  { path: '/',             label: 'Dashboard',    icon: FiBarChart2  },
  { path: '/leads',        label: 'Leads',         icon: FiUsers      },
  { path: '/appointments', label: 'Appointments',  icon: FiCalendar   },
  { path: '/analytics',    label: 'Analytics',     icon: FiTrendingUp },
];

export default function AdminLayout() {
  const { user, logout }    = useAuth();
  const location            = useLocation();
  const navigate            = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-[#F5F5F5] text-gray-800 flex flex-col transition-all duration-300 flex-shrink-0 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <FiSmile className="w-6 h-6 text-primary-500" />
          {sidebarOpen && <span className="font-bold text-sm text-gray-900">Apex Dental</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-gray-500'}`} />
                {sidebarOpen && <span className="flex-1">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          {sidebarOpen && (
            <div className="text-xs text-gray-500 mb-2 px-3">
              <p className="font-medium text-gray-700">{user?.name}</p>
              <p>{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all w-full"
          >
            <FiLogOut className="w-5 h-5" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            ☰
          </button>
          <h1 className="font-semibold text-gray-900 flex-1">
            {navItems.find(n => (n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)))?.label || 'Dashboard'}
          </h1>
          <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-gray-700">
            ← View Site
          </a>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
