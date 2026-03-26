import api from "./client.js";

export async function login(payload) {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get("/api/analytics/summary");
  return data;
}

export async function fetchDonors() {
  const { data } = await api.get("/api/donors");
  return data;
}

export async function createDonor(payload) {
  const { data } = await api.post("/api/donors", payload);
  return data;
}

export async function fetchRequests() {
  const { data } = await api.get("/api/requests");
  return data;
}

export async function createRequest(payload) {
  const { data } = await api.post("/api/requests", payload);
  return data;
}

export async function fetchInventory() {
  const { data } = await api.get("/api/inventory");
  return data;
}

export async function adjustInventory(payload) {
  const { data } = await api.post("/api/inventory/adjust", payload);
  return data;
}

export async function fetchAppointments() {
  const { data } = await api.get("/api/appointments");
  return data;
}

export async function createAppointment(payload) {
  const { data } = await api.post("/api/appointments", payload);
  return data;
}

export async function fetchDonations() {
  const { data } = await api.get("/api/donations");
  return data;
}

export async function createDonation(payload) {
  const { data } = await api.post("/api/donations", payload);
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/api/users");
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/api/users", payload);
  return data;
}

export async function fetchNotifications(userId) {
  const { data } = await api.get(`/api/notifications/user/${userId}`);
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/api/notifications/${id}/read`);
  return data;
}

export async function fetchAuditLogs() {
  const { data } = await api.get("/api/audit");
  return data;
}
