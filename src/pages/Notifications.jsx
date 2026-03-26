import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import { fetchNotifications, markNotificationRead } from "../api/bdms.js";
import { getUser } from "../utils/auth.js";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    const user = getUser();
    if (!user) {
      setError("User not available.");
      return;
    }
    fetchNotifications(user.id)
      .then(setNotifications)
      .catch(() => setError("Unable to load notifications."));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      load();
    } catch {
      setError("Failed to update notification.");
    }
  };

  return (
    <div className="page">
      <SectionHeader title="Notifications" subtitle="Alerts and updates from the system." />
      {error && <div className="alert error">{error}</div>}
      <div className="panel">
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty">No notifications yet.</div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className={`notification ${item.read ? "read" : ""}`}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.message}</p>
                </div>
                <div className="notification-meta">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  {!item.read && (
                    <button className="btn ghost" onClick={() => handleRead(item.id)}>
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
