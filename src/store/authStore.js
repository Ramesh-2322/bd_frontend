import { create } from "zustand";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const persistUserMeta = (user) => {
  if (!user) return;
  const role = (user.role || "DONOR").toUpperCase();
  const hospitalId = user.hospitalId || user.hospital?.id || "";
  const hospitalName = user.hospitalName || user.hospital?.name || "Global";

  localStorage.setItem("bdms_role", role);
  localStorage.setItem("bdms_hospital_id", String(hospitalId));
  localStorage.setItem("bdms_hospital_name", hospitalName);
};

const clearUserMeta = () => {
  localStorage.removeItem("bdms_token");
  localStorage.removeItem("bdms_refresh_token");
  localStorage.removeItem("bdms_role");
  localStorage.removeItem("bdms_hospital_id");
  localStorage.removeItem("bdms_hospital_name");
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("bdms_token") || null,
  refreshToken: localStorage.getItem("bdms_refresh_token") || null,
  loading: false,
  initialized: false,

  initializeAuth: async () => {
    const { token, initialized } = get();
    if (initialized) return;

    if (!window.__bdmsSessionExpiredListenerBound) {
      window.addEventListener("bdms:session-expired", () => {
        set({ token: null, refreshToken: null, user: null, initialized: true });
      });
      window.__bdmsSessionExpiredListenerBound = true;
    }

    if (!token) {
      set({ initialized: true });
      return;
    }

    try {
      const profile = await authService.getMyProfile();
      persistUserMeta(profile);
      set({ user: profile, initialized: true });
    } catch {
      clearUserMeta();
      set({ token: null, refreshToken: null, user: null, initialized: true });
    }
  },

  login: async (payload) => {
    set({ loading: true });
    try {
      const { token, refreshToken, user } = await authService.login(payload);
      if (!token) throw new Error("Missing JWT token in login response");
      localStorage.setItem("bdms_token", token);
      if (refreshToken) {
        localStorage.setItem("bdms_refresh_token", refreshToken);
      }
      persistUserMeta(user);
      set({ token, refreshToken: refreshToken || null, user, loading: false });
      toast.success("Login successful");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const { token, refreshToken, user } = await authService.register(payload);
      if (!token) throw new Error("Missing JWT token in register response");
      localStorage.setItem("bdms_token", token);
      if (refreshToken) {
        localStorage.setItem("bdms_refresh_token", refreshToken);
      }
      persistUserMeta(user);
      set({ token, refreshToken: refreshToken || null, user, loading: false });
      toast.success("Registration completed");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  },

  refreshProfile: async () => {
    try {
      const profile = await authService.getMyProfile();
      persistUserMeta(profile);
      set({ user: profile });
    } catch {
      toast.error("Unable to refresh profile");
    }
  },

  toggleAvailability: async (available) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ user: { ...currentUser, availabilityStatus: available } });
    try {
      const updated = await authService.updateAvailability(available);
      set({ user: updated });
      toast.success(`Availability set to ${available ? "Available" : "Unavailable"}`);
    } catch (error) {
      set({ user: currentUser });
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  },

  logout: () => {
    clearUserMeta();
    set({ token: null, refreshToken: null, user: null, initialized: true });
    toast.success("Logged out successfully");
  },
}));
