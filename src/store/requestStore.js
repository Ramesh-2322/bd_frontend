import { create } from "zustand";
import toast from "react-hot-toast";
import { requestService } from "../services/requestService";
import { useNotificationStore } from "./notificationStore";
import { useAuthStore } from "./authStore";

const filterByTenant = (items = []) => {
  const role = (useAuthStore.getState().user?.role || "DONOR").toUpperCase();
  const hospitalId = useAuthStore.getState().user?.hospitalId;
  if (role === "SUPER_ADMIN" || !hospitalId) return items;
  return items.filter((item) => String(item.hospitalId || item.hospital?.id || "") === String(hospitalId));
};

export const useRequestStore = create((set, get) => ({
  requests: [],
  selectedRequest: null,
  matches: [],
  loading: false,
  submitting: false,
  modalOpen: false,
  error: "",

  setModalOpen: (modalOpen) => set({ modalOpen }),
  setSelectedRequest: (selectedRequest) => set({ selectedRequest }),

  createRequest: async (payload) => {
    set({ submitting: true, error: "" });
    try {
      const created = await requestService.createRequest(payload);
      set((state) => ({
        requests: [created, ...state.requests],
        submitting: false,
      }));
      toast.success("Blood request submitted successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit request";
      set({ submitting: false, error: message });
      toast.error(message);
      return false;
    }
  },

  fetchMyRequests: async () => {
    set({ loading: true, error: "" });
    try {
      const previous = get().requests;
      const requests = filterByTenant(await requestService.getMyRequests());

      requests.forEach((request) => {
        const existing = previous.find((item) => item.id === request.id);
        if (existing && existing.status !== "APPROVED" && request.status === "APPROVED") {
          toast.success(`Request approved for ${request.patientName || "patient"}`);
          useNotificationStore.getState().addNotification("Request approved", "success");
        }
      });

      set({ requests, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load your requests";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchAllRequests: async () => {
    set({ loading: true, error: "" });
    try {
      const requests = filterByTenant(await requestService.getAllRequests());
      set({ requests, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load all requests";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchRequestById: async (id) => {
    set({ loading: true, error: "" });
    try {
      const request = await requestService.getRequestById(id);
      const inTenant = filterByTenant([request]).length > 0;
      set({ selectedRequest: inTenant ? request : null, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load request details";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  updateRequestStatus: async (id, status) => {
    const prev = get().requests;
    set({ submitting: true, error: "" });

    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, status } : request
      ),
      selectedRequest:
        state.selectedRequest?.id === id
          ? { ...state.selectedRequest, status }
          : state.selectedRequest,
    }));

    try {
      const updated = await requestService.updateRequestStatus(id, status);
      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updated, status: updated.status || status } : request
        ),
        selectedRequest:
          state.selectedRequest?.id === id
            ? { ...state.selectedRequest, ...updated, status: updated.status || status }
            : state.selectedRequest,
        submitting: false,
      }));
      toast.success(`Request marked as ${status.toLowerCase()}`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update request";
      set({ requests: prev, submitting: false, error: message });
      toast.error(message);
    }
  },

  fetchMatches: async (requestId) => {
    set({ loading: true, error: "" });
    try {
      const matches = await requestService.getMatchingDonors(requestId);
      set({ matches, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load matching donors";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
}));
