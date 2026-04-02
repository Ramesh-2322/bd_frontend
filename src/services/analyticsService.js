import api from "./api";

export const analyticsService = {
  async getAdminAnalytics() {
    const { data } = await api.get("/admin/analytics");
    return data;
  },
};
