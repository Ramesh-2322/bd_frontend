import { create } from "zustand";
import toast from "react-hot-toast";
import { saasService } from "../services/saasService";
import { useAuthStore } from "./authStore";

const defaultStats = {
  totalHospitals: 0,
  totalDonors: 0,
  totalRequests: 0,
  activeSubscriptions: 0,
};

export const useSaasStore = create((set) => ({
  hospitals: [],
  globalStats: defaultStats,
  plans: [],
  currentPlan: "FREE",
  auditLogs: [],
  loading: false,
  error: "",

  fetchSuperAdminData: async () => {
    set({ loading: true, error: "" });
    try {
      const [globalStats, hospitals] = await Promise.all([
        saasService.getGlobalStats(),
        saasService.getHospitals(),
      ]);
      set({ globalStats: { ...defaultStats, ...globalStats }, hospitals, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load super admin data";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchSubscriptionData: async () => {
    set({ loading: true, error: "" });
    try {
      const [plans, current] = await Promise.all([
        saasService.getSubscriptions(),
        saasService.getCurrentSubscription(),
      ]);
      const fallbackPlans = [
        {
          code: "FREE",
          name: "FREE",
          price: "$0/mo",
          features: ["Basic donor management", "Up to 100 requests/month"],
        },
        {
          code: "PREMIUM",
          name: "PREMIUM",
          price: "$49/mo",
          features: ["Advanced analytics", "Priority matching", "Email alerts"],
        },
        {
          code: "ENTERPRISE",
          name: "ENTERPRISE",
          price: "$199/mo",
          features: ["Multi-hospital support", "Audit logs", "Dedicated support"],
        },
      ];

      set({
        plans: plans.length ? plans : fallbackPlans,
        currentPlan: (current?.planCode || useAuthStore.getState().user?.subscriptionPlan || "FREE").toUpperCase(),
        loading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load subscriptions";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  upgradePlan: async (planCode) => {
    set({ loading: true, error: "" });
    try {
      await saasService.upgradeSubscription(planCode);
      set({ currentPlan: planCode.toUpperCase(), loading: false });
      toast.success(`Subscription upgraded to ${planCode}`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to upgrade subscription";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchAuditLogs: async () => {
    set({ loading: true, error: "" });
    try {
      const auditLogs = await saasService.getAuditLogs();
      set({ auditLogs, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load audit logs";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
}));
