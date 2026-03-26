export default function Settings() {
  return (
    <div className="page">
      <div className="panel">
        <h2>Settings</h2>
        <p>Configure environment variables and system defaults.</p>
        <div className="settings-grid">
          <div>
            <h4>API Base URL</h4>
            <p>{import.meta.env.VITE_API_URL || "http://localhost:8080"}</p>
          </div>
          <div>
            <h4>Frontend Port</h4>
            <p>5173</p>
          </div>
          <div>
            <h4>Security</h4>
            <p>JWT secured endpoints with role-based access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
