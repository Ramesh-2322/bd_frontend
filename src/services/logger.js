const MAX_LOG_ENTRIES = 100;

const pushLog = (entry) => {
  try {
    const existing = JSON.parse(localStorage.getItem("bdms_client_logs") || "[]");
    const next = [entry, ...existing].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem("bdms_client_logs", JSON.stringify(next));
  } catch {
    // Ignore logging failures to avoid app interruption.
  }
};

export const logger = {
  info(message, context = {}) {
    const entry = { level: "info", message, context, timestamp: new Date().toISOString() };
    console.info("[BDMS]", message, context);
    pushLog(entry);
  },

  warn(message, context = {}) {
    const entry = { level: "warn", message, context, timestamp: new Date().toISOString() };
    console.warn("[BDMS]", message, context);
    pushLog(entry);
  },

  error(message, context = {}) {
    const entry = { level: "error", message, context, timestamp: new Date().toISOString() };
    console.error("[BDMS]", message, context);
    pushLog(entry);
  },
};
