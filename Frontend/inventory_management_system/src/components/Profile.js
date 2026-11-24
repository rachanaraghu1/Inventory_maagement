import React from 'react';

export default function Profile() {
  const email = localStorage.getItem('userEmail');
  const businessName = localStorage.getItem('businessName');

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320, textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="48" height="48" fill="#1976d2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"/>
            <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
          </svg>
        </div>
        <h2 style={{ color: '#1976d2', marginBottom: 16 }}>My Profile</h2>
        <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Email:</strong> {email}</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Business Name:</strong> {businessName}</div>
      </div>
    </div>
  );
}
