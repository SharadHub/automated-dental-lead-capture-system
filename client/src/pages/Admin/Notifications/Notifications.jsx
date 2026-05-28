import { useState, useEffect } from 'react';
import { notificationsApi } from '../../../services/api';
import sirenImg from '../../../assets/images/siren.png';

const TYPE_ICONS = {
  new_lead: '👤',
  appointment_booked: '📅',
  message_received: '💬',
  form_submitted: '📋',
};

const TYPE_COLORS = {
  new_lead: 'border-l-blue-500',
  appointment_booked: 'border-l-green-500',
  message_received: 'border-l-purple-500',
  form_submitted: 'border-l-yellow-500',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const res = await notificationsApi.getAll();
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const markRead = async (id) => {
    await notificationsApi.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={sirenImg} alt="" className="w-8 h-8" />
          <div>
            <h2 className="font-bold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-400">{unread} unread</p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-500 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`bg-white rounded-xl border-l-4 ${TYPE_COLORS[n.type] || 'border-l-gray-300'} border border-gray-100 p-4 flex items-start gap-3 ${!n.read ? 'bg-primary-50/30' : ''}`}
          >
            <span className="text-2xl flex-shrink-0">{TYPE_ICONS[n.type] || '🔔'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {n.title}
                </p>
                {!n.read && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
              {n.body && <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-primary-500 hover:underline">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!notifications.length && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔔</div>
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
