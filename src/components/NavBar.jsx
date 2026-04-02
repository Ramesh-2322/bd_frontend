import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function NavBar() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav-shell">
      <div className="brand">
        <Link to="/" className="brand-mark">BDMS</Link>
        <span className="brand-tag">Blood Donation Management</span>
      </div>
      <nav className="nav-links">
        <Link to="/donors">Donors</Link>
        <Link to="/request">Request Blood</Link>
        <Link to="/requests">All Requests</Link>
        {!token && <Link to="/register">Become a Donor</Link>}
        {!token && <Link to="/login" className="nav-cta">Login</Link>}
        {token && <Link to="/profile">Profile</Link>}
        {token && (
          <button className="nav-cta" onClick={onLogout} type="button">
            Logout {username ? `(${username})` : ''}
          </button>
        )}
      </nav>
    </header>
  );
}
