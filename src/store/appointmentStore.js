import { create } from "zustand";
import toast from "react-hot-toast";
import { appointmentService } from "../services/appointmentService";
import { useNotificationStore } from "./notificationStore";
import { useAuthStore } from "./authStore";

const filterByTenant = (items = []) => {
  const role = (useAuthStore.getState().user?.role || "DONOR").toUpperCase();
  const hospitalId = useAuthStore.getState().user?.hospitalId;
  if (role === "SUPER_ADMIN" || !hospitalId) return items;
  return items.filter((item) => String(item.hospitalId || item.hospital?.id || "") === String(hospitalId));
};

export const useAppointmentStore = create((set) => ({
  appointments: [],
  loading: false,
  submitting: false,
  error: "",
  pendingRetry: null,

  createAppointment: async (payload) => {
    set({ submitting: true, error: "" });
    const optimisticId = `temp-${Date.now()}`;

    set((state) => ({
      appointments: [
        {
          id: optimisticId,
          requestId: payload.requestId,
          appointmentDateTime: payload.appointmentDateTime,
          status: "SCHEDULED",
          hospitalName: payload.hospitalName || "Pending confirmation",
          optimistic: true,
        },
        ...state.appointments,
      ],
    }));

    try {
      const created = await appointmentService.createAppointment(payload);
      set((state) => ({
        appointments: state.appointments.map((item) => (item.id === optimisticId ? created : item)),
        submitting: false,
        pendingRetry: null,
      }));
      toast.success("Appointment booked successfully");
      useNotificationStore.getState().addNotification("Appointment booked", "success");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to book appointment";
      set((state) => ({
        appointments: state.appointments.filter((item) => item.id !== optimisticId),
        submitting: false,
        error: message,
        pendingRetry: payload,
      }));
      toast.error(message);
      return false;
    }
  },

  retryPendingAppointment: async () => {
    const state = useAppointmentStore.getState();
    if (!state.pendingRetry) return;
    await state.createAppointment(state.pendingRetry);
  },

  fetchMyAppointments: async () => {
    set({ loading: true, error: "" });
    try {
      const appointments = await appointmentService.getMyAppointments();
      set({ appointments: filterByTenant(appointments), loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to fetch appointments";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
}));
