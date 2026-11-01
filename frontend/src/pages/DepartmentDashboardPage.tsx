import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  LogOut,
  User,
  Phone,
  Eye,
} from 'lucide-react';
import { authService } from '../services/authService';
import { issueService } from '../services/issueService';
import { departmentService } from '../services/departmentService';
import { Issue, IssueStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Alert } from '../components/Alert';

export const DepartmentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const officer = authService.getCurrentOfficer();
  const departmentId = officer?.departmentId;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Action loading state per ticket
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchDepartmentQueue = async () => {
    if (!departmentId) return;
    setLoading(true);
    setErrorMsg('');
    try {
      // Backend enforces department isolation by departmentId
      const data = await issueService.getDepartmentComplaints(departmentId, statusFilter);
      setIssues(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve department complaint queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentQueue();
  }, [departmentId, statusFilter]);

  const handleUpdateStatus = async (issueId: number, newStatus: IssueStatus) => {
    setUpdatingId(issueId);
    setErrorMsg('');
    setSuccessToast('');

    try {
      await issueService.updateStatus(issueId, newStatus);
      setSuccessToast(`Complaint #${issueId} status successfully updated to ${newStatus}.`);
      await fetchDepartmentQueue();
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to update complaint #${issueId}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    authService.logoutDepartment();
    navigate('/department/login');
  };

  // Metrics
  const totalAssigned = issues.length;
  const reportedCount = issues.filter((i) => (i.status || '').toUpperCase() === 'REPORTED').length;
  const inProgressCount = issues.filter((i) => (i.status || '').toUpperCase().includes('PROGRESS')).length;
  const resolvedCount = issues.filter((i) => (i.status || '').toUpperCase() === 'RESOLVED').length;

  // Filter and search
  const filteredIssues = issues.filter((issue) => {
    const matchesPriority = priorityFilter === 'ALL' || (issue.priority || '').toUpperCase() === priorityFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      issue.description.toLowerCase().includes(term) ||
      issue.location.toLowerCase().includes(term) ||
      issue.category.toLowerCase().includes(term) ||
      (issue.userName && issue.userName.toLowerCase().includes(term)) ||
      String(issue.issueId).includes(term);

    return matchesPriority && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* OFFICER IDENTIFIER CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 15px rgba(4, 120, 87, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{officer?.departmentName}</h1>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
              Authenticated Staff: <strong>{officer?.username}</strong> • Division Location: <strong>{officer?.location}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={fetchDepartmentQueue}
            disabled={loading}
          >
            <RefreshCw size={14} /> Refresh Queue
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            onClick={handleLogout}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* DEPARTMENT WORKLOAD METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Assigned Issues
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>
            {totalAssigned}
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Reported (Action Required)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '0.25rem' }}>
            {reportedCount}
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Under Field Work
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
            {inProgressCount}
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Resolved
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {resolvedCount}
          </div>
        </div>
      </div>

      {successToast && <Alert type="success" message={successToast} onClose={() => setSuccessToast('')} />}
      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* DEPARTMENT WORK QUEUE CARD */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">
              <ShieldCheck size={20} color="#059669" /> Active Department Queue
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Complaints isolated to {officer?.departmentName}. Updates directly sync to the municipal database.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search queue..."
                className="form-input"
                style={{ paddingLeft: '32px', padding: '0.45rem 0.75rem 0.45rem 32px', fontSize: '0.85rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="REPORTED">Reported Only</option>
              <option value="IN PROGRESS">In Progress Only</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>

            {/* Priority Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority Only</option>
              <option value="MEDIUM">Medium Priority Only</option>
              <option value="LOW">Low Priority Only</option>
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
            <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.92rem' }}>Loading department complaint queue from server...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
            <CheckCircle2 size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 700 }}>No Complaints in Queue</h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.35rem' }}>
              {statusFilter || priorityFilter !== 'ALL' || searchTerm
                ? 'No issues match the applied filters.'
                : `There are currently no active complaints assigned to ${officer?.departmentName}.`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Citizen Contact</th>
                  <th>Current Status</th>
                  <th>Authorized Action</th>
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
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={issue.description}>
                      {issue.description}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '3px', color: '#64748b' }} />
                      {issue.location}
                    </td>
                    <td>
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {issue.userName ? (
                        <>
                          <div style={{ fontWeight: 600 }}>{issue.userName}</div>
                          {issue.userPhone && (
                            <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                              <Phone size={10} style={{ verticalAlign: 'middle' }} /> {issue.userPhone}
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#64748b' }}>Citizen #{issue.userId}</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={issue.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {/* Status transition buttons */}
                        {issue.status !== 'IN PROGRESS' && issue.status !== 'RESOLVED' && (
                          <button
                            className="btn btn-warning btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                            disabled={updatingId === issue.issueId}
                            onClick={() => handleUpdateStatus(issue.issueId, 'IN PROGRESS')}
                          >
                            Mark In Progress
                          </button>
                        )}

                        {issue.status !== 'RESOLVED' && (
                          <button
                            className="btn btn-success btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                            disabled={updatingId === issue.issueId}
                            onClick={() => handleUpdateStatus(issue.issueId, 'RESOLVED')}
                          >
                            Mark Resolved
                          </button>
                        )}

                        {issue.status === 'RESOLVED' && (
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}

                        <Link to={`/issues/${issue.issueId}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.5rem' }} title="View details">
                          <Eye size={13} />
                        </Link>
                      </div>
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
