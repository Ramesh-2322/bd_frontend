import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth.js";

export default function Topbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <h1>Blood Donation Management</h1>
        <p>Operational overview and rapid response console.</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-search">
          <input type="text" placeholder="Search donors, requests, or cities..." />
        </div>
        <div className="user-chip">
          <div className="avatar">{user?.name?.[0] || "U"}</div>
          <div>
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">{user?.roles?.[0] || "STAFF"}</div>
          </div>
        </div>
        <button className="btn ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
