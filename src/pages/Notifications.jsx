import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { notificationService } from "../services/notificationService";
import { useNotificationStore } from "../store/notificationStore";

function Notifications() {
  const [loading, setLoading] = useState(true);
  const [serverNotifications, setServerNotifications] = useState([]);
  const liveNotifications = useNotificationStore((state) => state.notifications);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getMyNotifications();
        setServerNotifications(data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const notifications = useMemo(() => {
    const normalizedServer = serverNotifications.map((item) => ({
      id: item.id || `${item.title || "event"}-${item.createdAt || Date.now()}`,
      type: (item.type || "INFO").toUpperCase(),
      message: item.message || item.title || "Notification",
      createdAt: item.createdAt || new Date().toISOString(),
      read: Boolean(item.read),
    }));

    return [...liveNotifications, ...normalizedServer]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);
  }, [liveNotifications, serverNotifications]);

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">Notifications</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Real-time alerts and system updates.</p>
      </div>

      <div className="card mt-6 p-4">
        {loading ? (
          <LoadingSpinner text="Loading notifications" />
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You are all caught up for now." />
        ) : (
          <ul className="space-y-3">
            {notifications.map((item) => (
              <li key={item.id} className="rounded-xl border border-medical-100 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-medical-50 px-2.5 py-1 text-xs font-semibold text-medical-700">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-100">{item.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Notifications;
