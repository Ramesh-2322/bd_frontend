import api from "./api";

export const requestService = {
  async createRequest(payload) {
    const { data } = await api.post("/requests", payload);
    return data;
  },

  async getMyRequests() {
    const { data } = await api.get("/requests/my");
    return Array.isArray(data) ? data : data.content || [];
  },

  async getAllRequests() {
    const { data } = await api.get("/requests");
    return Array.isArray(data) ? data : data.content || [];
  },

  async getRequestById(id) {
    const { data } = await api.get(`/requests/${id}`);
    return data;
  },

  async updateRequestStatus(id, status) {
    const { data } = await api.patch(`/requests/${id}/status`, { status });
    return data;
  },

  async getMatchingDonors(requestId) {
    const { data } = await api.get(`/requests/${requestId}/matches`);
    return Array.isArray(data) ? data : data.content || [];
  },
};
