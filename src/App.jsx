import { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";

function App() {
  const location = useLocation();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const showNavbar = false;

  return (
    <div className="min-h-screen bg-medical-bg text-medical-text">
      {showNavbar && <Navbar />}

      <Suspense fallback={<LoadingSpinner text="Loading page" />}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}

export default App;
