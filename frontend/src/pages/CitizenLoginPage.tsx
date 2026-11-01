import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';
import { Alert } from '../components/Alert';

export const CitizenLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = (location.state as any)?.registeredEmail || '';

  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await authService.loginCitizen({
        email: email.trim(),
        password,
      });

      // Redirect to target or citizen dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '440px', margin: '2.5rem auto' }}>
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center', display: 'block' }}>
          <div
            style={{
              background: '#eff6ff',
              color: '#2563eb',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogIn size={24} />
          </div>
          <h2 className="card-title" style={{ justifyContent: 'center' }}>
            Citizen Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Log in to submit new grievances and track resolution status.
          </p>
        </div>

        {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Address
            </label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. citizen@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Password
            </label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In as Citizen'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have a citizen account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
          Municipal Officer?{' '}
          <Link to="/department/login" style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>
            Access Department Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
