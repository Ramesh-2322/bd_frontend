import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const initialized = useAuthStore((state) => state.initialized);
  const location = useLocation();

  if (!initialized) {
    return <div className="p-6 text-center text-sm text-slate-600">Checking session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
