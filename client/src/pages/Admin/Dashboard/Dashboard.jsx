import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../../services/api';
import doctorImg from '../../../assets/images/doctor.png';
import checkboxesImg from '../../../assets/images/undraw_checking-boxes_j0im.svg';

const SOURCE_COLORS = {
  instagram: 'bg-pink-100 text-pink-700',
  facebook: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  website: 'bg-purple-100 text-purple-700',
  email: 'bg-yellow-100 text-yellow-700',
  google: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.getOverview(), analyticsApi.getRecentActivity()])
      .then(([ov, rc]) => {
        setOverview(ov.data);
        setRecent(rc.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  const stats = [
    { label: 'Prospects', value: overview?.prospects || 0, icon: '👤', color: 'bg-blue-50 text-blue-600', link: '/admin/leads?status=prospect' },
    { label: 'Leads', value: overview?.leads || 0, icon: '🎯', color: 'bg-green-50 text-green-600', link: '/admin/leads?status=lead' },
    { label: 'Patients', value: overview?.patients || 0, icon: '😊', color: 'bg-purple-50 text-purple-600', link: '/admin/leads?status=patient' },
    { label: 'Appointments', value: overview?.appointments || 0, icon: '📅', color: 'bg-yellow-50 text-yellow-600', link: '/admin/appointments' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-xl mb-3`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      {/* Conversion rate + illustration */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Lead Conversion Rate</h2>
            <Link to="/admin/analytics" className="text-sm text-primary-500 hover:underline">View full analytics →</Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#0ea5e9" strokeWidth="3"
                    strokeDasharray={`${overview?.conversionRate || 0} ${100 - (overview?.conversionRate || 0)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{overview?.conversionRate}%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">of all prospects convert to leads or patients</p>
              <div className="flex gap-4 text-sm">
                <span className="text-blue-600">{overview?.leads} leads</span>
                <span className="text-purple-600">{overview?.patients} patients</span>
              </div>
            </div>
            <img src={checkboxesImg} alt="" className="ml-auto w-24 h-24 object-contain" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl p-6 text-white">
          <img src={doctorImg} alt="" className="w-12 h-12 mb-3" />
          <h3 className="font-bold text-lg mb-1">Today's Schedule</h3>
          <p className="text-white/80 text-sm mb-4">
            {recent?.recentAppointments?.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length || 0} appointments today
          </p>
          <Link to="/admin/appointments" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg inline-block transition-all">
            View Schedule →
          </Link>
        </div>
      </div>

      {/* Recent prospects + appointments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Prospects</h2>
            <Link to="/admin/leads" className="text-xs text-primary-500">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(recent?.recentProspects || []).map(p => (
              <div key={p.id} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {(p.name || p.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{p.name || p.email || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{p.service_interest || 'No service specified'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[p.source] || 'bg-gray-100 text-gray-600'}`}>
                  {p.source}
                </span>
              </div>
            ))}
            {!recent?.recentProspects?.length && (
              <p className="p-6 text-center text-gray-400 text-sm">No prospects yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Upcoming Appointments</h2>
            <Link to="/admin/appointments" className="text-xs text-primary-500">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(recent?.recentAppointments || []).map(a => (
              <div key={a.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{a.prospect_name || 'Unknown'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-600' : a.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{a.service} · {a.appointment_date} at {a.appointment_time?.slice(0, 5)}</p>
              </div>
            ))}
            {!recent?.recentAppointments?.length && (
              <p className="p-6 text-center text-gray-400 text-sm">No appointments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
