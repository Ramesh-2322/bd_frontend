import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import Breadcrumbs from "./Breadcrumbs";
import NotificationBell from "./NotificationBell";
import Sidebar from "./Sidebar";
import { useNotificationStore } from "../store/notificationStore";

function Layout() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const connectRealtime = useNotificationStore((state) => state.connectRealtime);
  const disconnectRealtime = useNotificationStore((state) => state.disconnectRealtime);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    connectRealtime(token);
    return () => {
      disconnectRealtime();
    };
  }, [connectRealtime, disconnectRealtime, token]);

  return (
    <div className="min-h-screen bg-medical-bg dark:bg-slate-950 lg:flex">
      <Sidebar />

      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-medical-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Welcome</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user?.fullName || user?.name || "Team Member"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-sm"
                onClick={() => {
                  disconnectRealtime();
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
