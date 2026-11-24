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
    <nav style={{ background: '#0fd0fc', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontFamily: "'Poppins', sans-serif", position: 'relative' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '1.2rem 2.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#222',
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'color 0.2s',
            fontFamily: "'Poppins', sans-serif"
          }} className="navbar-link">Smart Inventory</Link>
          <Link to="/products" style={{
            textDecoration: 'none',
            color: '#222',
            fontSize: '1.25rem',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontFamily: "'Poppins', sans-serif"
          }} className="navbar-link">Products</Link>
          <Link to="/about" style={{
            textDecoration: 'none',
            color: '#222',
            fontSize: '1.25rem',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontFamily: "'Poppins', sans-serif"
          }} className="navbar-link">About</Link>
          {isAdmin() && (
            <Link to="/admin" style={{
              textDecoration: 'none',
              color: '#222',
              fontSize: '1.25rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              fontFamily: "'Poppins', sans-serif"
            }} className="navbar-link">Admin Dashboard</Link>
          )}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 18, right: 32, zIndex: 1100, display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Profile Avatar */}
        <div
          style={{
            height: 44,
            width: 44,
            borderRadius: '50%',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onClick={handleProfileClick}
          onMouseOver={e => e.currentTarget.style.background = '#b2ebf2'}
          onMouseOut={e => e.currentTarget.style.background = '#e0e0e0'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#555" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"/>
            <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
          </svg>
        </div>
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: 54,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            minWidth: 140,
            zIndex: 1000,
            fontFamily: "'Poppins', sans-serif"
          }}>
            <div style={{ padding: 12, cursor: 'pointer' }} onClick={() => { setShowDropdown(false); navigate('/profile'); }}>Profile</div>
            <div style={{ padding: 12, cursor: 'pointer', color: 'red' }} onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
      <style>{`
        .navbar-link:hover {
          color: #007bff !important;
        }
      `}</style>
    </nav>
  );
}
