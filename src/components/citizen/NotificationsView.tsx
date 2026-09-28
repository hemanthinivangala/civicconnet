import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Bell, CheckCheck, Trash2, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

interface NotificationsViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotifsCount,
  } = useCivic();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <span>Citizen Communication Center</span>
            <span>&bull;</span>
            <span>Live Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Notifications & Grievance Updates
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time notifications on your lodged complaints, status transitions, staff assignments, and municipal public advisories.
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-2 px-4 rounded-xl border border-blue-200 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Bell className="w-12 h-12 mx-auto text-slate-200 mb-3" />
            <p className="font-semibold text-slate-700">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">
              You will receive updates here whenever you submit a complaint or when announcements are issued.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.complaintId) {
                  onNavigate('track', n.complaintId);
                }
              }}
              className={`p-5 transition cursor-pointer flex items-start gap-4 hover:bg-slate-50 ${
                !n.isRead ? 'bg-blue-50/40' : 'bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  n.type === 'COMPLAINT'
                    ? 'bg-blue-100 text-blue-700'
                    : n.type === 'ANNOUNCEMENT'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {n.type === 'COMPLAINT' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>

                {n.complaintId && (
                  <div className="pt-1.5 flex items-center gap-1.5 text-xs text-blue-700 font-semibold group">
                    <span>Inspect Complaint {n.complaintId}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Future Integration Channels Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <strong className="text-slate-800 block">Multichannel Notification Architecture:</strong>
          <span>CivicConnect event dispatchers support email, SMS gateway, and WhatsApp alert hooks.</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">
          Status: In-App Active (SMS / WhatsApp Ready)
        </span>
      </div>
    </div>
  );
};
