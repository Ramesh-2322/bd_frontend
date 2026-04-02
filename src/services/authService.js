import api from "./api";

const unwrapApiResponse = (payload) => payload?.data ?? payload;

const normalizeAuthPayload = (data) => ({
  token: data.token || data.accessToken,
  refreshToken: data.refreshToken || null,
  user: data.user || data.donor || data.profile || null,
});

const profileEndpoints = ["/auth/me", "/users/me", "/donors/me", "/profile"];

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
    let lastError = null;

    for (const endpoint of profileEndpoints) {
      try {
        const { data } = await api.get(endpoint);
        return unwrapApiResponse(data);
      } catch (error) {
        const status = error.response?.status;
        if (status === 404 || status === 405) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error("Unable to load profile");
  },

  async updateAvailability(available) {
    const { data } = await api.patch("/donors/me/availability", { available });
    return unwrapApiResponse(data);
  },
};
