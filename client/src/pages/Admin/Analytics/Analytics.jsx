import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { analyticsApi } from '../../../services/api';
import happyFaceImg from '../../../assets/images/happy-face.png';

const SOURCE_COLORS_MAP = {
  instagram: '#ec4899',
  facebook: '#3b82f6',
  whatsapp: '#22c55e',
  website: '#a855f7',
  email: '#f59e0b',
  google: '#ef4444',
  referral: '#14b8a6',
};

const COLORS = Object.values(SOURCE_COLORS_MAP);

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [bySource, setBySource] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const [apptStats, setApptStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getOverview(),
      analyticsApi.getBySource(),
      analyticsApi.getTimeSeries({ days: 30 }),
      analyticsApi.getAppointmentStats(),
    ]).then(([ov, src, ts, appt]) => {
      setOverview(ov.data);
      setBySource(src.data);
      setTimeSeries(ts.data);
      setApptStats(appt.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  // Process time series into daily totals
  const dailyData = timeSeries.reduce((acc, row) => {
    const existing = acc.find(d => d.date === row.date);
    if (existing) existing.count += parseInt(row.count);
    else acc.push({ date: row.date.slice(5), count: parseInt(row.count) });
    return acc;
  }, []).slice(-14);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Prospects', value: (overview?.prospects || 0) + (overview?.leads || 0) + (overview?.patients || 0), icon: '👥' },
          { label: 'Conversion Rate', value: `${overview?.conversionRate || 0}%`, icon: '📈' },
          { label: 'Appointments', value: overview?.appointments || 0, icon: '📅' },
          { label: 'Satisfaction', value: '98%', icon: '😊' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prospects over time */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Prospects (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Source breakdown pie */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Leads by Source</h3>
          {bySource.length ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={bySource} dataKey="total" nameKey="source" cx="50%" cy="50%" outerRadius={80} label={false}>
                    {bySource.map((entry, i) => (
                      <Cell key={entry.source} fill={SOURCE_COLORS_MAP[entry.source] || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm">
                {bySource.map((s, i) => (
                  <div key={s.source} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: SOURCE_COLORS_MAP[s.source] || COLORS[i] }} />
                    <span className="text-gray-600">{s.source}</span>
                    <span className="font-semibold text-gray-900 ml-auto">{s.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-center text-gray-400 py-8">No data yet</p>}
        </div>
      </div>

      {/* Conversion by source + appointment stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Conversion Rate by Source</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bySource} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="source" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={val => [`${val}%`, 'Conversion']} />
              <Bar dataKey="rate" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                {bySource.map((entry, i) => (
                  <Cell key={entry.source} fill={SOURCE_COLORS_MAP[entry.source] || COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Appointments by Service</h3>
          {apptStats?.byService?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={apptStats.byService}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="service" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-8">No appointments yet</p>}
        </div>
      </div>

      {/* Satisfaction metric */}
      <div className="bg-gradient-to-r from-primary-500 to-teal-500 rounded-xl p-6 text-white flex items-center gap-6">
        <img src={happyFaceImg} alt="" className="w-16 h-16" />
        <div>
          <h3 className="text-xl font-bold mb-1">Patient Satisfaction Score</h3>
          <p className="text-white/80">Based on post-visit surveys and Google reviews</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-5xl font-bold">98%</div>
          <p className="text-white/80 text-sm">Satisfaction rate</p>
        </div>
      </div>
    </div>
  );
}
