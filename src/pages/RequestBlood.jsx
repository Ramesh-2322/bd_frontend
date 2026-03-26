import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function RequestBlood() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    bloodGroup: '',
    requestDate: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/public/blood-groups')
      .then((res) => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await api.post('/public/requests', form);
      setStatus('Request submitted. We will notify compatible donors.');
      setForm({
        name: '',
        email: '',
        phone: '',
        state: '',
        city: '',
        address: '',
        bloodGroup: '',
        requestDate: ''
      });
    } catch (err) {
      setStatus('Unable to submit request. Please check your details.');
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Request blood</h1>
        <p>Share your details to reach compatible donors fast.</p>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={onChange} />
        <input name="city" placeholder="City" value={form.city} onChange={onChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
        <select name="bloodGroup" value={form.bloodGroup} onChange={onChange} required>
          <option value="">Select blood group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.name}>{g.name}</option>
          ))}
        </select>
        <input name="requestDate" placeholder="Required date" value={form.requestDate} onChange={onChange} />
        <button className="button primary" type="submit">Submit Request</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </section>
  );
}
