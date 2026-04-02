import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { createUser, fetchUsers } from "../api/bdms.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "ROLE_STAFF" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError("Unable to load users."));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createUser(form);
      setSuccess("User created.");
      setForm({ name: "", email: "", phone: "", password: "", role: "ROLE_STAFF" });
      load();
    } catch {
      setError("Failed to create user.");
    }
  };

  const rows = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles?.join(", ") || "-",
    status: user.status,
  }));

  return (
    <div className="page">
      <SectionHeader title="User Access" subtitle="Create and manage staff or admin accounts." />
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="grid two">
        <div className="panel">
          <h3>Access Control</h3>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "roles", label: "Roles" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
          />
        </div>
        <div className="panel">
          <h3>Create User</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Temporary password"
              required
            />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="ROLE_STAFF">ROLE_STAFF</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
            <button className="btn primary" type="submit">
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
