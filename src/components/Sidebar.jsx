import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/donors", label: "Donors" },
  { path: "/requests", label: "Requests" },
  { path: "/inventory", label: "Inventory" },
  { path: "/appointments", label: "Appointments" },
  { path: "/donations", label: "Donations" },
  { path: "/users", label: "Users" },
  { path: "/notifications", label: "Notifications" },
  { path: "/audit", label: "Audit Logs" },
  { path: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">BDMS</div>
        <div>
          <div className="brand-title">PulseGrid</div>
          <div className="brand-subtitle">Blood Donation HQ</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="badge">Live Inventory</div>
        <p>Track donors, requests, and blood stock with precision.</p>
      </div>
    </aside>
  );
}
