import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

const Layout = lazy(() => import("./components/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const CreateRequest = lazy(() => import("./pages/CreateRequest"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const UploadReports = lazy(() => import("./pages/UploadReports"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  const location = useLocation();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const publicPaths = ["/login", "/register"];
  const showNavbar = publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-medical-bg text-medical-text">
      {showNavbar && <Navbar />}

      <Suspense fallback={<LoadingSpinner text="Loading page" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/upload-reports" element={<UploadReports />} />

            <Route path="/my-requests" element={<Navigate to="/requests" replace />} />
            <Route path="/requests/my" element={<Navigate to="/requests" replace />} />
            <Route path="/requests/create" element={<Navigate to="/create-request" replace />} />
            <Route path="/my-appointments" element={<Navigate to="/appointments" replace />} />
            <Route path="/appointments/book" element={<Navigate to="/book-appointment" replace />} />
            <Route path="/reports/upload" element={<Navigate to="/upload-reports" replace />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
