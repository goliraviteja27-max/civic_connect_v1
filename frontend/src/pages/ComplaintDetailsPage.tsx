import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Tag, CheckCircle2, Clock, AlertCircle, RefreshCw, User, Phone } from 'lucide-react';
import { issueService } from '../services/issueService';
import { Issue } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Alert } from '../components/Alert';

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDetails = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await issueService.getComplaintById(parseInt(id, 10));
      setIssue(data);
    } catch (err: any) {
      setErrorMsg(err.message || `Unable to locate complaint #${id}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#64748b', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} />}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
          <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
          <p>Loading complaint record from municipal database...</p>
        </div>
      ) : !issue ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <AlertCircle size={44} color="#ef4444" style={{ marginBottom: '0.75rem' }} />
          <h3>Complaint Not Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            No complaint record matching #{id} exists in the database.
          </p>
        </div>
      ) : (
        <div className="card">
          {/* HEADER */}
          <div className="card-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  Complaint Ticket #{issue.issueId}
                </h1>
                <StatusBadge status={issue.status} />
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Registered in civic database under User ID #{issue.userId}
              </p>
            </div>

            <PriorityBadge priority={issue.priority} />
          </div>

          {/* STATUS PROGRESS TRACKER */}
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Resolution Progress Workflow:
            </div>
            <div className="timeline">
              <div className="timeline-step completed">
                <CheckCircle2 size={16} /> 1. Reported
              </div>
              <div
                className={`timeline-divider ${
                  (issue.status || '').toUpperCase().includes('PROGRESS') || (issue.status || '').toUpperCase() === 'RESOLVED'
                    ? 'completed'
                    : ''
                }`}
              />
              <div
                className={`timeline-step ${
                  (issue.status || '').toUpperCase().includes('PROGRESS')
                    ? 'active'
                    : (issue.status || '').toUpperCase() === 'RESOLVED'
                    ? 'completed'
                    : ''
                }`}
              >
                {(issue.status || '').toUpperCase() === 'RESOLVED' ? <CheckCircle2 size={16} /> : <Clock size={16} />} 2. In Progress
              </div>
              <div
                className={`timeline-divider ${(issue.status || '').toUpperCase() === 'RESOLVED' ? 'completed' : ''}`}
              />
              <div className={`timeline-step ${(issue.status || '').toUpperCase() === 'RESOLVED' ? 'completed' : ''}`}>
                <CheckCircle2 size={16} /> 3. Resolved
              </div>
            </div>
          </div>

          {/* METADATA GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                <Tag size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Category
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{issue.category}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                <Building2 size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Assigned Department
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {issue.departmentName || `Department ID #${issue.departmentId}`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Location
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{issue.location}</div>
            </div>

            {issue.userName && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  <User size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Reported By
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                  {issue.userName} {issue.userPhone && `(${issue.userPhone})`}
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              Citizen Submitted Description:
            </h3>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: '#1e293b',
              }}
            >
              {issue.description}
            </div>
          </div>

          {/* REFRESH ACTION */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={loadDetails}>
              <RefreshCw size={14} /> Refresh Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
