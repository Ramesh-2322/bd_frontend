import AdminDashboardPage from "./AdminDashboardPage";
import DashboardPage from "./DashboardPage";
import HospitalDashboardPage from "./HospitalDashboardPage";
import SuperAdminDashboardPage from "./SuperAdminDashboardPage";
import { useAuthStore } from "../store/authStore";

function RoleDashboardPage() {
  const role = (useAuthStore((state) => state.user?.role) || "DONOR").toUpperCase();

  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboardPage />;
  }

  if (role === "ADMIN") {
    return <AdminDashboardPage />;
  }

  if (role === "HOSPITAL") {
    return <HospitalDashboardPage />;
  }

  return <DashboardPage />;
}

export default RoleDashboardPage;
