import api from "./api";

const unwrapApiResponse = (payload) => payload?.data ?? payload;

const normalizeAuthPayload = (data) => ({
  token: data.token || data.accessToken,
  refreshToken: data.refreshToken || null,
  user: data.user || data.donor || data.profile || null,
});

const profileEndpoints = ["/auth/me", "/users/me", "/donors/me", "/profile"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientError = (error) => {
  const status = error.response?.status;
  const code = error.code || "";
  const message = (error.message || "").toLowerCase();
  return (
    !status ||
    status >= 500 ||
    code === "ECONNABORTED" ||
    message.includes("timeout") ||
    message.includes("network")
  );
};

const withTransientRetry = async (operation, maxAttempts = 2) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const retryable = isTransientError(error);
      if (!retryable || attempt >= maxAttempts) {
        throw error;
      }
      await sleep(500 * attempt);
    }
  }

  throw lastError;
};

export const authService = {
  async login(payload) {
    const { data } = await withTransientRetry(
      () => api.post("/auth/login", payload, { timeout: 60000 }),
      2
    );
    return normalizeAuthPayload(unwrapApiResponse(data));
  },

  async register(payload) {
    const { data } = await withTransientRetry(
      () => api.post("/auth/register", payload, { timeout: 60000 }),
      2
    );
    return normalizeAuthPayload(unwrapApiResponse(data));
  },

  async getMyProfile() {
    let lastError = null;

    for (const endpoint of profileEndpoints) {
      try {
        const { data } = await withTransientRetry(() => api.get(endpoint, { timeout: 20000 }), 2);
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
