import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { Alert } from '../components/Alert';

export const CitizenRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate form fields
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Phone number must be a valid 10-digit number.';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMsg('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const res = await authService.registerCitizen({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      setSuccessMsg(res.message || 'Citizen account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: form.email.trim() } });
      }, 1500);
    } catch (err: any) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '2rem auto' }}>
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
            <UserPlus size={24} />
          </div>
          <h2 className="card-title" style={{ justifyContent: 'center' }}>
            Citizen Registration
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Create an official account to report and track municipal grievances.
          </p>
        </div>

        {generalError && <Alert type="error" message={generalError} onClose={() => setGeneralError('')} />}
        {successMsg && <Alert type="success" message={successMsg} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Full Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {fieldErrors.name && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldErrors.email && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Contact Phone Number
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. 9876543210 (10 digits)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {fieldErrors.phone && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{fieldErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {fieldErrors.password && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{fieldErrors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Confirm Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            {fieldErrors.confirmPassword && (
              <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating Citizen Account...' : 'Register as Citizen'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Citizen Login
          </Link>
        </div>
      </div>
    </div>
  );
};
