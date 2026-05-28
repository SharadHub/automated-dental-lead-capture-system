import { useState, useEffect, useCallback } from 'react';
import { appointmentsApi } from '../../../services/api';
import clockImg from '../../../assets/images/clock.png';

const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-500',
};

export default function Appointments() {
  const [data, setData] = useState({ data: [], total: 0 });
  const [filters, setFilters] = useState({ status: '', date: '', page: 1 });
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentsApi.getAll(filters);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    await appointmentsApi.updateStatus(id, status);
    fetch();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="date"
          className="input-field w-44"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value, page: 1 }))}
        />
        <select className="input-field w-40" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-sm text-gray-400">{data.total} total</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Patient', 'Service', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.data.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{a.prospect_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{a.prospect_phone || a.prospect_email || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.service}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <img src={clockImg} alt="" className="w-4 h-4" />
                      <div>
                        <p className="font-medium text-gray-900">{a.appointment_date}</p>
                        <p className="text-xs text-gray-400">{a.appointment_time?.slice(0, 5)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {a.status === 'scheduled' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'confirmed')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100">Confirm</button>
                          <button onClick={() => updateStatus(a.id, 'cancelled')} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">Cancel</button>
                        </>
                      )}
                      {a.status === 'confirmed' && (
                        <button onClick={() => updateStatus(a.id, 'completed')} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !data.data.length && (
          <p className="text-center text-gray-400 py-12">No appointments found</p>
        )}
      </div>
    </div>
  );
}
