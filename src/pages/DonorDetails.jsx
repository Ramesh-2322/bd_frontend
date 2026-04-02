import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';

export default function DonorDetails() {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);

  useEffect(() => {
    api.get(`/public/donors/${id}`)
      .then((res) => setDonor(res.data))
      .catch(() => setDonor(null));
  }, [id]);

  if (!donor) {
    return (
      <section className="page">
        <p>Loading donor...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <div className="card-badge">{donor.bloodGroup}</div>
            <h1>{donor.fullName || donor.username}</h1>
            <p>{donor.city}, {donor.state}</p>
          </div>
          <div className={donor.readyToDonate ? 'status ready' : 'status pending'}>
            {donor.readyToDonate ? 'Ready now' : 'Not available'}
          </div>
        </div>
        <div className="detail-body">
          <div>
            <h4>Contact</h4>
            <p>{donor.phone}</p>
            <p>{donor.email}</p>
            <p>{donor.address}</p>
          </div>
          <div>
            <h4>Personal</h4>
            <p>Gender: {donor.gender}</p>
            <p>Date of birth: {donor.dateOfBirth}</p>
          </div>
          {donor.imageUrl && (
            <div>
              <h4>Photo</h4>
              <img className="donor-photo" src={`http://localhost:8080${donor.imageUrl}`} alt="Donor" />
            </div>
          )}
        </div>
      </div>
      <div className="inline-actions">
        <Link to="/request" className="button primary">Request Blood</Link>
        <Link to="/donors" className="button ghost">Back to donors</Link>
      </div>
    </section>
  );
}
