import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Building2, Send, FileText, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const citizen = authService.getCurrentUser();
  const officer = authService.getCurrentOfficer();

  const handleCitizenLogout = () => {
    authService.logoutCitizen();
    navigate('/login');
  };

  const handleOfficerLogout = () => {
    authService.logoutDepartment();
    navigate('/department/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <div>
          <div className="brand-title">CivicConnect</div>
          <div className="brand-subtitle">Municipal Issue Reporting & Resolution</div>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink
          to="/submit"
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Send size={15} /> Submit Complaint
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <FileText size={15} /> Citizen Portal
        </NavLink>

        <NavLink
          to={officer ? '/department/dashboard' : '/department/login'}
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <ShieldCheck size={15} /> Department Portal
        </NavLink>
      </nav>

      <div className="user-actions">
        {citizen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: 'white' }}>{citizen.name}</div>
              <div style={{ color: '#94a3b8' }}>ID: #{citizen.userId}</div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ color: '#cbd5e1', borderColor: '#475569' }}
              onClick={handleCitizenLogout}
              title="Citizen Logout"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : officer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8' }}>{officer.departmentName}</div>
              <div style={{ color: '#94a3b8' }}>Officer: {officer.username}</div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ color: '#cbd5e1', borderColor: '#475569' }}
              onClick={handleOfficerLogout}
              title="Officer Logout"
            >
              <LogOut size={14} /> Exit Dept
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#e2e8f0', borderColor: '#475569' }}>
              <LogIn size={14} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              <UserPlus size={14} /> Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
