import { useMemo, useState } from "react";
import { useNotificationStore } from "../store/notificationStore";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const connected = useNotificationStore((state) => state.connected);
  const markAllRead = useNotificationStore((state) => state.markAllRead);

  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          markAllRead();
        }}
        className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
        aria-label="Notifications"
      >
        <span className="text-sm">Notifications</span>
        <span
          className={`ml-2 inline-block h-2.5 w-2.5 rounded-full ${
            connected ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-medical-700 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Recent Alerts</p>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-4 text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-100 px-3 py-2">
                  <p className="mb-1 inline-flex rounded-full bg-medical-50 px-2 py-0.5 text-[10px] font-semibold text-medical-700">
                    {item.type}
                  </p>
                  <p className="text-sm font-medium text-slate-700">{item.message}</p>
                  <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
