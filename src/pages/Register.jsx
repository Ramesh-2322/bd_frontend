import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const [groups, setGroups] = useState([]);
  const defaultGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    gender: '',
    bloodGroup: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  const [image, setImage] = useState(null);
  const { setToken, setUsername } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/public/blood-groups')
      .then((res) => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  const effectiveGroups = groups.length
    ? groups.map((g) => g.name)
    : defaultGroups;

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      const res = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToken(res.data.token);
      setUsername(res.data.username);
      navigate('/profile');
    } catch (err) {
      setStatus(err?.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Become a donor</h1>
        <p>Register once, then toggle your availability when you are ready.</p>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={onChange} required />
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={onChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={onChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={onChange} required />
        <select name="gender" value={form.gender} onChange={onChange} required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
          <option value="">Blood group</option>
          {effectiveGroups.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input name="dateOfBirth" placeholder="Date of birth" value={form.dateOfBirth} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={onChange} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button className="button primary" type="submit">Create donor profile</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </section>
  );
}
