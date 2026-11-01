import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', margin: '0 auto', padding: '2.5rem' }}>
        <AlertCircle size={52} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>404 — Page Not Found</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          The requested route does not exist in CivicConnect.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
          <Home size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};
