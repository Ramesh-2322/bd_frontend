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
};
