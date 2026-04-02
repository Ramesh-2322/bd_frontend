import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    email: '',
    phone: '',
    state: '',
    city: '',
    address: ''
  });
  const [image, setImage] = useState(null);

  const loadProfile = () => {
    api.get('/profile')
      .then((res) => {
        setProfile(res.data);
        setForm({
          email: res.data.email || '',
          phone: res.data.phone || '',
          state: res.data.state || '',
          city: res.data.city || '',
          address: res.data.address || ''
        });
      })
      .catch(() => setProfile(null));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      const res = await api.put('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      setStatus('Profile updated.');
    } catch (err) {
      setStatus('Update failed.');
    }
  };

  const toggleReady = async () => {
    try {
      const res = await api.post('/profile/toggle-ready');
      setProfile(res.data);
    } catch (err) {
      setStatus('Unable to change status.');
    }
  };

  if (!profile) {
    return (
      <section className="page">
        <p>Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Donor profile</h1>
        <p>Manage your availability and contact details.</p>
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <div className="card-badge">{profile.bloodGroup}</div>
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p>{profile.city}, {profile.state}</p>
          <p className={profile.readyToDonate ? 'status ready' : 'status pending'}>
            {profile.readyToDonate ? 'Ready to donate' : 'Not available'}
          </p>
          <button className="button ghost" onClick={toggleReady} type="button">Toggle availability</button>
          {profile.imageUrl && (
            <img className="donor-photo" src={`http://localhost:8080${profile.imageUrl}`} alt="Donor" />
          )}
        </div>
        <form className="form-grid" onSubmit={onSave}>
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
          <input name="state" placeholder="State" value={form.state} onChange={onChange} />
          <input name="city" placeholder="City" value={form.city} onChange={onChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button className="button primary" type="submit">Save changes</button>
        </form>
      </div>
      {status && <p className="status-message">{status}</p>}
    </section>
  );
}
