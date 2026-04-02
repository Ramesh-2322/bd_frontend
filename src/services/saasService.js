import api from "./api";

export const saasService = {
  async getGlobalStats() {
    const { data } = await api.get("/super-admin/stats");
    return data;
  },

  async getHospitals() {
    const { data } = await api.get("/super-admin/hospitals");
    return Array.isArray(data) ? data : data.content || [];
  },

  async getSubscriptions() {
    const { data } = await api.get("/subscriptions/plans");
    return Array.isArray(data) ? data : data.plans || [];
  },

  async getCurrentSubscription() {
    const { data } = await api.get("/subscriptions/current");
    return data;
  },

  async upgradeSubscription(planCode) {
    const { data } = await api.post("/subscriptions/upgrade", { planCode });
    return data;
  },

  async getAuditLogs() {
    const { data } = await api.get("/audit/logs");
    return Array.isArray(data) ? data : data.content || [];
  },
};
