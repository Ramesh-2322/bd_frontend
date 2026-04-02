import { create } from "zustand";
import toast from "react-hot-toast";
import { websocketService } from "../services/websocketService";

export const useNotificationStore = create((set) => ({
  notifications: [],
  connected: false,

  addNotification: (message, type = "info", meta = {}) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          message,
          type,
          meta,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  pushLiveEvent: (payload) => {
    const normalizedType = (payload?.type || "INFO").toUpperCase();
    const message =
      payload?.message ||
      (normalizedType === "REQUEST_APPROVED"
        ? "Request approved"
        : normalizedType === "DONOR_MATCHED"
          ? "Donor matched"
          : normalizedType === "APPOINTMENT_UPDATED"
            ? "Appointment updated"
            : "New notification");

    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          message,
          type: normalizedType,
          meta: payload,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    }));

    toast.success(message);
  },

  connectRealtime: (token) => {
    if (!token) return;
    websocketService.connect(token, (payload) => useNotificationStore.getState().pushLiveEvent(payload));
    set({ connected: true });
  },

  disconnectRealtime: () => {
    websocketService.disconnect();
    set({ connected: false });
  },

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
    })),
}));
