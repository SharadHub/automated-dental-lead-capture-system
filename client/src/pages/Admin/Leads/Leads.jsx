import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { prospectsApi } from '../../../services/api';
import phoneCallImg from '../../../assets/images/phone-call.png';
import sirenImg from '../../../assets/images/siren.png';

const STATUS_COLORS = {
  prospect: 'bg-yellow-100 text-yellow-700',
  lead: 'bg-blue-100 text-blue-700',
  patient: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const SOURCE_ICONS = {
  instagram: '📸',
  facebook: '👍',
  whatsapp: '💬',
  website: '🌐',
  email: '✉️',
  google: '🔍',
  referral: '🤝',
};

export default function Leads() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({ data: [], total: 0 });
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    source: '',
    search: '',
    page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await prospectsApi.getAll(filters);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProspects(); }, [fetchProspects]);

  const updateStatus = async (id, status) => {
    await prospectsApi.update(id, { status });
    fetchProspects();
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          className="input-field flex-1 min-w-[180px]"
          placeholder="Search name, email, phone..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
        />
        <select className="input-field w-36" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          <option value="prospect">Prospect</option>
          <option value="lead">Lead</option>
          <option value="patient">Patient</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="input-field w-36" value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value, page: 1 }))}>
          <option value="">All Sources</option>
          {['website', 'instagram', 'facebook', 'whatsapp', 'email', 'google', 'referral'].map(s => (
            <option key={s} value={s}>{SOURCE_ICONS[s]} {s}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">{data.total} records</span>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Name', 'Source', 'Service', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.data.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(p)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(p.name || p.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.name || '—'}</p>
                            <p className="text-xs text-gray-400">{p.email || p.phone || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{SOURCE_ICONS[p.source]} {p.source}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[150px] truncate">{p.service_interest || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          {p.phone && (
                            <a href={`tel:${p.phone}`} className="p-1 hover:bg-green-50 rounded-lg" title="Call">
                              <img src={phoneCallImg} alt="Call" className="w-4 h-4" />
                            </a>
                          )}
                          {p.status === 'prospect' && (
                            <button
                              onClick={() => updateStatus(p.id, 'lead')}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                            >
                              → Lead
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.data.length && (
                <p className="text-center text-gray-400 py-12">No prospects found</p>
              )}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 bg-white rounded-xl border border-gray-100 p-5 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Prospect Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              {(selected.name || selected.email || '?')[0].toUpperCase()}
            </div>
            <h4 className="text-center font-semibold text-gray-900 mb-1">{selected.name || 'Unknown'}</h4>
            <div className="flex justify-center mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              {selected.email && <div className="flex gap-2"><span className="text-gray-400">Email:</span><span className="text-gray-700">{selected.email}</span></div>}
              {selected.phone && <div className="flex gap-2"><span className="text-gray-400">Phone:</span><span className="text-gray-700">{selected.phone}</span></div>}
              <div className="flex gap-2"><span className="text-gray-400">Source:</span><span>{SOURCE_ICONS[selected.source]} {selected.source}</span></div>
              {selected.service_interest && <div className="flex gap-2"><span className="text-gray-400">Interest:</span><span className="text-gray-700">{selected.service_interest}</span></div>}
              {selected.message && (
                <div>
                  <span className="text-gray-400">Message:</span>
                  <p className="text-gray-700 mt-1 bg-gray-50 rounded p-2 text-xs">{selected.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Update Status</p>
              {['prospect', 'lead', 'patient', 'inactive'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`w-full text-sm py-2 rounded-lg border transition-all ${selected.status === s ? STATUS_COLORS[s] + ' border-current font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {selected.phone && (
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 mt-4 text-sm font-medium transition-colors"
              >
                <img src={phoneCallImg} alt="" className="w-4 h-4" />
                Call Now
              </a>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
          <span className="px-3 py-1.5 text-sm text-gray-600">Page {filters.page} of {Math.ceil(data.total / 20)}</span>
          <button disabled={filters.page >= Math.ceil(data.total / 20)} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
