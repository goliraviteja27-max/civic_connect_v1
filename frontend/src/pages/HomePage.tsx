import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, FileText, ShieldCheck, ArrowRight, Building2, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { KpiStatsBar } from '../components/KpiStatsBar';
import { departmentService } from '../services/departmentService';
import { Department } from '../types';

export const HomePage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    departmentService
      .getAllDepartments()
      .then((data) => {
        setDepartments(data);
        setLoadingDepts(false);
      })
      .catch((err) => {
        console.error('Error loading departments', err);
        setLoadingDepts(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #38bdf8 100%)',
          color: 'white',
          padding: '4rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Sparkles size={16} /> Official Municipal Grievance Platform
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Empowering Citizens. <br /> Resolving Civic Issues Fast.
          </h1>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            CivicConnect bridges local communities with municipal authorities. Report potholes, streetlights, garbage,
            and drainage issues with smart rule-based prioritization and real-time tracking.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/submit" className="btn" style={{ background: 'white', color: '#1e3a8a', padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 700 }}>
              <Send size={18} /> Submit a Complaint
            </Link>
            <Link to="/dashboard" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <FileText size={18} /> Track Existing Issues
            </Link>
          </div>
        </div>
      </section>

      {/* KPI METRICS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
          Municipal Resolution Overview
        </h2>
        <KpiStatsBar />
      </div>

      {/* THREE PILLARS CARDS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ margin: 0 }}>
          <div style={{ background: '#eff6ff', color: '#2563eb', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Send size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Report Complaint</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Citizens report issues with descriptions and landmarks. The built-in rule engine detects urgency and targets the right department automatically.
          </p>
          <Link to="/submit" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            Report an issue now <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div style={{ background: '#f0fdf4', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Live Status Tracking</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Transparent progress tracking. Monitor your complaint through stages: <em>Reported</em>, <em>In Progress with Field Crew</em>, and <em>Resolved</em>.
          </p>
          <Link to="/dashboard" style={{ color: '#10b981', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            View your dashboard <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div style={{ background: '#fffbeb', color: '#f59e0b', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Department Resolution</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Municipal officers log in to their department-specific queue to address on-ground complaints and record verified resolution updates.
          </p>
          <Link to="/department/login" style={{ color: '#b45309', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            Access Officer Portal <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* MUNICIPAL DEPARTMENTS SECTION */}
      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title"><Building2 size={22} color="#2563eb" /> Active Municipal Departments</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Connected municipal service divisions handling citizen grievances</p>
          </div>
        </div>

        {loadingDepts ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading departments from backend...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {departments.map((dept) => (
              <div
                key={dept.departmentId}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '6px', color: '#334155' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{dept.departmentName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <MapPin size={12} style={{ verticalAlign: 'middle' }} /> {dept.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
