import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, Building2 } from 'lucide-react';
import { authService } from '../services/authService';
import { Alert } from '../components/Alert';

export const DepartmentLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter your department username and password.');
      return;
    }

    setLoading(true);
    try {
      // Backend validates credentials against the department_accounts table
      await authService.loginDepartment({
        username: username.trim(),
        password,
      });

      navigate('/department/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Department authentication failed. Verify username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuickDept = (deptName: string) => {
    setUsername(deptName);
    setPassword('1234');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '520px', margin: '2.5rem auto' }}>
      <div className="card">
        <div className="card-header" style={{ textAlign: 'center', display: 'block' }}>
          <div
            style={{
              background: '#ecfdf5',
              color: '#059669',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h2 className="card-title" style={{ justifyContent: 'center' }}>
            Municipal Department Officer Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Restricted access for authorized municipal field teams and department staff.
          </p>
        </div>

        {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Department Username
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. roads, sanitation, electrical"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Officer Password
            </label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', background: '#059669' }}
            disabled={loading}
          >
            <ShieldCheck size={16} /> {loading ? 'Verifying Department Credentials...' : 'Access Department Queue'}
          </button>
        </form>

        {/* QUICK SELECTION FOR EVALUATION */}
        <div style={{ marginTop: '1.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.5rem' }}>
            Quick Department Select (Database Seed Accounts, Default Pass: <code>1234</code>):
          </div>
          <div className="dept-chips-wrapper">
            {[
              { id: 'electrical', label: 'Electrical' },
              { id: 'sanitation', label: 'Sanitation' },
              { id: 'roads', label: 'Roads' },
              { id: 'drainage', label: 'Drainage' },
              { id: 'watersupply', label: 'Water Supply' },
              { id: 'sewerage', label: 'Sewerage' },
              { id: 'animalcontrol', label: 'Animal Control' },
              { id: 'parks', label: 'Parks' },
              { id: 'enforcement', label: 'Enforcement' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                className="dept-select-chip"
                onClick={() => handleSelectQuickDept(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
          Are you a resident citizen?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Access Citizen Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
