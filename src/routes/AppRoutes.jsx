import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuthStore } from "../store/authStore";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const RoleDashboardPage = lazy(() => import("../pages/RoleDashboardPage"));
const MyRequests = lazy(() => import("../pages/MyRequests"));
const CreateRequest = lazy(() => import("../pages/CreateRequest"));
const MyAppointments = lazy(() => import("../pages/MyAppointments"));
const BookAppointment = lazy(() => import("../pages/BookAppointment"));
const UploadReports = lazy(() => import("../pages/UploadReports"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function PublicOnlyRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<RoleDashboardPage />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/upload-reports" element={<UploadReports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
