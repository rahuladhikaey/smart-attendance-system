import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationService.getNotifications()
  );

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setNotifications(notificationService.getNotifications());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Low attendance thresholds, geofence breaches, and biometric enrollment notices
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => notificationService.markAllAsRead()}
          className="text-xs"
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              notif.read ? 'bg-[#0B0B0B] border-[#262626]' : 'bg-[#111111] border-neutral-700'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2 rounded-xl border shrink-0 ${
                  notif.type === 'ALERT'
                    ? 'bg-red-950/40 border-red-900/50 text-red-400'
                    : notif.type === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-900/50 text-amber-300'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                {notif.type === 'ALERT' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.type === 'WARNING' ? (
                  <Bell className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
                  {!notif.read && <Badge variant="verified">NEW</Badge>}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{notif.message}</p>
                <div className="text-[10px] font-mono text-neutral-500 mt-1.5">{notif.timestamp}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {notif.link && (
                <Link to={notif.link}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Inspect Issue
                  </Button>
                </Link>
              )}
              {!notif.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => notificationService.markAsRead(notif.id)}
                  className="text-xs text-neutral-400"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
