import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong>CivicConnect</strong> — Crowdsourced Civic Issue Reporting & Resolution System
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Geethanjali College of Engineering & Technology | Department of CSE
        </div>
      </div>
    </footer>
  );
};
