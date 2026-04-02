import { create } from "zustand";
import toast from "react-hot-toast";
import { donorService } from "../services/donorService";
import { useAuthStore } from "./authStore";

const filterByTenant = (items = []) => {
  const hospitalId = useAuthStore.getState().user?.hospitalId;
  if (!hospitalId) return items;
  return items.filter((item) => String(item.hospitalId || item.hospital?.id || "") === String(hospitalId));
};

export const useDonorStore = create((set) => ({
  donors: [],
  loading: false,
  filters: {
    bloodGroup: "",
    location: "",
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchDonors: async () => {
    set({ loading: true });
    try {
      const donors = await donorService.getDonors();
      set({ donors: filterByTenant(donors), loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to load donors");
    }
  },

  fetchFilteredDonors: async () => {
    set({ loading: true });
    try {
      const state = useDonorStore.getState();
      const donors = await donorService.getDonors(state.filters);
      set({ donors: filterByTenant(donors), loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to filter donors");
    }
  },
}));
