import { Link, useLocation } from "react-router-dom";

const routeNames = {
  dashboard: "Dashboard",
  donors: "Donors",
  requests: "Requests",
  create: "Create",
  my: "My",
  admin: "Admin",
  appointments: "Appointments",
  book: "Book",
  super: "Super Admin",
  pricing: "Pricing",
  audit: "Audit Logs",
  logs: "Logs",
  reports: "Reports",
  upload: "Upload",
};

function Breadcrumbs() {
  const location = useLocation();

  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:text-medical-700">
        Home
      </Link>
      {parts.map((part, index) => {
        const path = `/${parts.slice(0, index + 1).join("/")}`;
        const isLast = index === parts.length - 1;
        const label = routeNames[part] || part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <span key={path} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="font-semibold text-slate-700">{label}</span>
            ) : (
              <Link to={path} className="hover:text-medical-700">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
