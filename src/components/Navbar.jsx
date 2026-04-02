import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Navbar() {
  const token = useAuthStore((state) => state.token);
  const hospitalName =
    useAuthStore((state) => state.user?.hospitalName || state.user?.hospital?.name) ||
    localStorage.getItem("bdms_hospital_name") ||
    "Global";
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-medical-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-content-center rounded-lg bg-medical-700 font-bold text-white">B</div>
          <div>
            <p className="text-sm font-semibold text-medical-800">BDMS</p>
            <p className="text-xs text-slate-500">{hospitalName}</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-medical-50 text-medical-800" : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            Home
          </NavLink>

          {token && (
            <>
              <Link to="/dashboard" className="btn-primary px-4 py-2 text-sm">
                Open App
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
                Logout
              </button>
            </>
          )}

          {!token && (
            <Link to="/login" className="btn-primary px-4 py-2 text-sm">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
