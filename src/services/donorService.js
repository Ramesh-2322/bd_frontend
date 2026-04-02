import api from "./api";

export const donorService = {
  async getDonors(filters = {}) {
    const params = {};
    if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
    if (filters.location) params.location = filters.location;

    const { data } = await api.get("/donors", { params });
    return Array.isArray(data) ? data : data.content || [];
  },
};
