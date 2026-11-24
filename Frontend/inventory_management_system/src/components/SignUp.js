import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Frontend validation
    if (!email.trim() || !password.trim() || !businessName.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, businessName }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! You can now sign in.');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <h2 style={{ color: '#1976d2', marginBottom: 8 }}>Create an Account</h2>
      <p style={{ color: '#555', marginBottom: 24 }}>Sign up to manage your inventory.</p>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320, textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="48" height="48" fill="#1976d2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"/>
            <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
          </svg>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ paddingRight: 40 }}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              zIndex: 2
            }}
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off SVG
              <svg width="22" height="22" fill="#888" viewBox="0 0 24 24">
                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/>
              </svg>
            ) : (
              // Eye SVG
              <svg width="22" height="22" fill="#888" viewBox="0 0 24 24">
                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/>
              </svg>
            )}
          </span>
        </div>
        <input
          type="text"
          placeholder="Business Name"
          className="form-control mb-3"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100 mb-2">Sign Up</button>
        <div>
          <span style={{ fontSize: 14 }}>Already have an account? </span>
          <Link to="/signin" style={{ color: '#1976d2', fontSize: 14 }}>Sign In</Link>
        </div>
      </form>
    </div>
  );
} 