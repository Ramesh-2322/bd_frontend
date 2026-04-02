import api from "./api";

const unwrapApiResponse = (payload) => payload?.data ?? payload;

const normalizeAuthPayload = (data) => ({
  token: data.token || data.accessToken,
  refreshToken: data.refreshToken || null,
  user: data.user || data.donor || null,
});

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return normalizeAuthPayload(unwrapApiResponse(data));
  },

  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return normalizeAuthPayload(unwrapApiResponse(data));
  },

  async getMyProfile() {
    const { data } = await api.get("/donors/me");
    return unwrapApiResponse(data);
  },

  async updateAvailability(available) {
    const { data } = await api.patch("/donors/me/availability", { available });
    return unwrapApiResponse(data);
  },
};
