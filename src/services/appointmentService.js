import api from "./api";

export const appointmentService = {
  async createAppointment(payload) {
    const { data } = await api.post("/appointments", payload);
    return data;
  },

  async getMyAppointments() {
    const { data } = await api.get("/appointments/my");
    return Array.isArray(data) ? data : data.content || [];
  },
};
