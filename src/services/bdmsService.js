import api from "./api";

const unwrapList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.content)) return responseData.content;
  return [];
};

export const bdmsService = {
  async getRequests() {
    const { data } = await api.get("/requests");
    return unwrapList(data);
  },

  async createRequest(payload) {
    const { data } = await api.post("/requests", payload);
    return data;
  },

  async getAppointments() {
    const { data } = await api.get("/appointments");
    return unwrapList(data);
  },

  async createAppointment(payload) {
    const { data } = await api.post("/appointments", payload);
    return data;
  },

  async uploadReport(file) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
