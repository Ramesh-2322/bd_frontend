import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";
import Breadcrumbs from "./Breadcrumbs";
import NotificationBell from "./NotificationBell";

function AppShell() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const logout = useAuthStore((state) => state.logout);
  const role = (useAuthStore((state) => state.user?.role) || "DONOR").toUpperCase();
  const connectRealtime = useNotificationStore((state) => state.connectRealtime);
  const disconnectRealtime = useNotificationStore((state) => state.disconnectRealtime);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("bdms_theme") === "dark");

  useEffect(() => {
    if (!user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (!token) return;
    connectRealtime(token);

    return () => {
      disconnectRealtime();
    };
  }, [token, connectRealtime, disconnectRealtime]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("bdms_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("bdms_theme", "light");
    }
  }, [darkMode]);

  const navItems = useMemo(() => {
    const common = [
      { to: "/dashboard", label: "Overview" },
      { to: "/pricing", label: "Pricing" },
    ];

    if (role === "SUPER_ADMIN") {
      return [
        ...common,
        { to: "/super/dashboard", label: "Hospitals" },
        { to: "/audit/logs", label: "Audit Logs" },
      ];
    }

    if (role === "ADMIN") {
      return [
        ...common,
        { to: "/admin/dashboard", label: "Admin Analytics" },
        { to: "/donors", label: "Manage Donors" },
        { to: "/admin/requests", label: "Manage Requests" },
        { to: "/reports/upload", label: "Upload Reports" },
        { to: "/audit/logs", label: "Audit Logs" },
      ];
    }

    return [
      ...common,
      { to: "/requests/my", label: "My Requests" },
      { to: "/requests/create", label: "Create Request" },
      { to: "/appointments", label: "My Appointments" },
      { to: "/appointments/book", label: "Book Appointment" },
      { to: "/reports/upload", label: "Upload Reports" },
    ];
  }, [role]);

  const hospitalName = user?.hospitalName || user?.hospital?.name || localStorage.getItem("bdms_hospital_name") || "Global";

  return (
    <div className="min-h-screen bg-medical-bg dark:bg-slate-950 lg:flex">
      <aside className="w-full border-b border-medical-100 bg-white dark:border-slate-800 dark:bg-slate-900 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-medical-100 px-5 py-4 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-medical-700 text-sm font-bold text-white">B</div>
            <div>
              <p className="text-sm font-semibold text-medical-800 dark:text-medical-300">BDMS SaaS</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{hospitalName}</p>
            </div>
          </Link>
        </div>

        <nav className="grid gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-medical-700 text-white"
                    : "text-slate-600 hover:bg-medical-50 hover:text-medical-800 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-medical-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Welcome</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.fullName || user?.name || "Team Member"}</p>
              <p className="text-xs text-medical-700 dark:text-medical-300">Role: {role.replace("_", " ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? "Light" : "Dark"}
              </button>
              <NotificationBell />
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-sm"
                onClick={() => {
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

export default AppShell;
