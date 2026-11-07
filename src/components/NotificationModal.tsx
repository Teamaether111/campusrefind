import React from 'react';
import { X, Bell, Sparkles, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const NotificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Alerts</h3>
              <p className="text-xs text-slate-500">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition px-2 py-1"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-3 space-y-2.5 flex-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification && onSelectNotification(n)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  n.read
                    ? 'bg-slate-50 border-slate-200/70 text-slate-600'
                    : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'match' && <Sparkles className="w-4 h-4 text-blue-600" />}
                    {n.type === 'claim' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    {n.type === 'recovery' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    {n.type === 'system' && <Clock className="w-4 h-4 text-amber-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
