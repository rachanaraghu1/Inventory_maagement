import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function isAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export default function Navbar(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('businessName');
    window.location.href = '/signin';
  };

  return (
   <nav className="navbar navbar-expand-lg bg-info">
      <div className="container-fluid position-relative">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active text-dark fs-4" to="/">Smart Inventory</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active text-dark fs-4" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active text-dark fs-4" to="/about">About</Link>
            </li>
            {isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link active text-dark fs-4" to="/admin">Admin Dashboard</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center ms-auto" style={{ position: 'relative' }}>
            <div
              style={{
                height: 40,
                width: 40,
                borderRadius: '50%',
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer'
              }}
              onClick={handleProfileClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#555" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
              </svg>
            </div>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: 50,
                right: 0,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                minWidth: 140,
                zIndex: 1000
              }}>
                <div style={{ padding: 12, cursor: 'pointer' }} onClick={() => { setShowDropdown(false); navigate('/profile'); }}>Profile</div>
                <div style={{ padding: 12, cursor: 'pointer', color: 'red' }} onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
