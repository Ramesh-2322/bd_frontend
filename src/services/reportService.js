import api from "./api";

export const reportService = {
  async uploadReport(file, metadata = {}) {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const { data } = await api.post("/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async getMyReports() {
    const endpoints = ["/reports/my", "/reports"];
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const { data } = await api.get(endpoint);
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.content)) return data.content;
        return [];
      } catch (error) {
        const status = error.response?.status;
        if (status === 404 || status === 405) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    if (lastError) {
      throw lastError;
    }
    return [];
  },
};
