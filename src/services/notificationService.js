import api from "./api";

const unwrapList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

export const notificationService = {
  async getMyNotifications() {
    const endpoints = ["/notifications/my", "/notifications", "/users/me/notifications"];
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const { data } = await api.get(endpoint);
        return unwrapList(data);
      } catch (error) {
        const status = error.response?.status;
        if (status === 404 || status === 405) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    throw lastError || new Error("Unable to load notifications");
  },
};
