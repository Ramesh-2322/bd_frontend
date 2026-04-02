import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/requests", label: "My Requests" },
  { to: "/create-request", label: "Create Request" },
  { to: "/appointments", label: "My Appointments" },
  { to: "/book-appointment", label: "Book Appointment" },
  { to: "/upload-reports", label: "Upload Reports" },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-medical-100 bg-white dark:border-slate-800 dark:bg-slate-900 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-medical-100 px-5 py-4 dark:border-slate-800">
        <p className="text-sm font-semibold text-medical-800 dark:text-medical-300">BDMS Dashboard</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Blood Donation Management</p>
      </div>

      <nav className="grid gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
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
  );
}

export default Sidebar;
