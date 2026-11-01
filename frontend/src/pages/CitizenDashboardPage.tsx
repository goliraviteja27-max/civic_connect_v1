import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Send, RefreshCw, Search, Filter, AlertCircle, Eye, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { issueService } from '../services/issueService';
import { Issue } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Alert } from '../components/Alert';

export const CitizenDashboardPage: React.FC = () => {
  const citizen = authService.getCurrentUser();
  const userId = citizen?.userId;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComplaints = async () => {
    if (!userId) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await issueService.getCitizenComplaints(userId);
      setIssues(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  // Compute status summary counts
  const totalCount = issues.length;
  const reportedCount = issues.filter((i) => (i.status || '').toUpperCase() === 'REPORTED').length;
  const inProgressCount = issues.filter((i) => (i.status || '').toUpperCase().includes('PROGRESS')).length;
  const resolvedCount = issues.filter((i) => (i.status || '').toUpperCase() === 'RESOLVED').length;

  // Filter and search
  const filteredIssues = issues.filter((issue) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'REPORTED' && (issue.status || '').toUpperCase() === 'REPORTED') ||
      (statusFilter === 'IN_PROGRESS' && (issue.status || '').toUpperCase().includes('PROGRESS')) ||
      (statusFilter === 'RESOLVED' && (issue.status || '').toUpperCase() === 'RESOLVED');

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !search ||
      issue.description.toLowerCase().includes(search) ||
      issue.location.toLowerCase().includes(search) ||
      issue.category.toLowerCase().includes(search) ||
      String(issue.issueId).includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* CITIZEN WELCOME BAR */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome, {citizen?.name} 👋
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
            Registered Citizen Account #{citizen?.userId} • Email: {citizen?.email} • Phone: {citizen?.phone}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={fetchComplaints} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/submit" className="btn btn-primary btn-sm">
            <Send size={14} /> New Complaint
          </Link>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS FOR CITIZEN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            My Total Complaints
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>{totalCount}</div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Reported (Pending)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '0.25rem' }}>{reportedCount}</div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            In Progress
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>{inProgressCount}</div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Resolved
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>{resolvedCount}</div>
        </div>
      </div>

      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* COMPLAINTS LIST TABLE / CARD */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">
              <FileText size={20} color="#2563eb" /> My Complaint History
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Track the live progress and department assignment of every grievance you reported
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search complaints..."
                className="form-input"
                style={{ paddingLeft: '32px', padding: '0.45rem 0.75rem 0.45rem 32px', fontSize: '0.85rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="REPORTED">Reported ({reportedCount})</option>
              <option value="IN_PROGRESS">In Progress ({inProgressCount})</option>
              <option value="RESOLVED">Resolved ({resolvedCount})</option>
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.92rem' }}>Retrieving your complaints from municipal database...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          /* EMPTY STATE */
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
            <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 700 }}>
              {searchTerm || statusFilter !== 'ALL' ? 'No matching complaints found' : 'No complaints reported yet'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.35rem', maxWidth: '400px', margin: '0.35rem auto 1.25rem auto' }}>
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search keyword or clearing the status filter.'
                : 'Help improve your neighborhood by reporting issues like potholes, broken streetlights, or garbage overflow.'}
            </p>
            {searchTerm || statusFilter !== 'ALL' ? (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/submit" className="btn btn-primary btn-sm">
                <Send size={14} /> Submit Your First Complaint
              </Link>
            )}
          </div>
        ) : (
          /* DATA TABLE */
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Assigned Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.issueId}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>#{issue.issueId}</strong>
                    </td>
                    <td>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                        {issue.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={issue.description}>
                      {issue.description}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '3px', color: '#64748b' }} />
                      {issue.location}
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                        {issue.departmentName || `Dept #${issue.departmentId}`}
                      </strong>
                    </td>
                    <td>
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td>
                      <StatusBadge status={issue.status} />
                    </td>
                    <td>
                      <Link to={`/issues/${issue.issueId}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
