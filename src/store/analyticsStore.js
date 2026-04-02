import { create } from "zustand";
import toast from "react-hot-toast";
import { analyticsService } from "../services/analyticsService";

const defaultAnalytics = {
  totalDonors: 0,
  totalRequests: 0,
  completedDonations: 0,
  activeDonors: 0,
  monthlyDonations: [],
  requestsByBloodGroup: [],
};

export const useAnalyticsStore = create((set) => ({
  analytics: defaultAnalytics,
  loading: false,
  error: "",
  lastFetchedAt: 0,

  fetchAnalytics: async () => {
    const state = useAnalyticsStore.getState();
    const now = Date.now();
    if (state.lastFetchedAt && now - state.lastFetchedAt < 30000) {
      return;
    }

    set({ loading: true, error: "" });
    try {
      const payload = await analyticsService.getAdminAnalytics();
      set({
        analytics: {
          ...defaultAnalytics,
          ...payload,
          monthlyDonations: payload.monthlyDonations || [],
          requestsByBloodGroup: payload.requestsByBloodGroup || [],
        },
        loading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load analytics";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
}));
