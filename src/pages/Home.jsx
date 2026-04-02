import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function Home() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    api.get('/public/blood-groups')
      .then((res) => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-text">
          <h1>Give blood, move a city forward.</h1>
          <p>
            Find ready donors by blood group, or register as a donor and toggle your
            availability in seconds. Built for speed, privacy, and local impact.
          </p>
          <div className="hero-actions">
            <Link to="/donors" className="button primary">Find Donors</Link>
            <Link to="/register" className="button ghost">Become a Donor</Link>
          </div>
        </div>
        <div className="hero-card">
          <h3>Real-time availability</h3>
          <p>Only donors who are ready to donate appear first in searches.</p>
          <div className="hero-stats">
            <div>
              <span className="stat-label">Groups</span>
              <span className="stat-value">{groups.length || 8}</span>
            </div>
            <div>
              <span className="stat-label">Requests</span>
              <span className="stat-value">Always open</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>Search by blood group</h2>
        <p>Choose a group to see available donors in your area.</p>
      </div>

      <div className="grid">
        {groups.map((g) => (
          <Link to={`/donors?group=${g.id}`} className="card" key={g.id}>
            <div className="card-badge">{g.name}</div>
            <h3>{g.name} donors</h3>
            <p>{g.donorCount} registered donors</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
