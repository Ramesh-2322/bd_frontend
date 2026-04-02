import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function RoleRoute({ allowedRoles = [], children }) {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return <div className="p-6 text-center text-sm text-slate-600">Checking permissions...</div>;
  }

  const role = (user?.role || "DONOR").toUpperCase();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;
