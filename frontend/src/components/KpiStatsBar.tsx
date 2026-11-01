import React, { useEffect, useState } from 'react';
import { FileText, Clock, RefreshCw, CheckCircle2, Flame } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { DashboardStats } from '../types';

export const KpiStatsBar: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    departmentService
      .getDashboardStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="kpi-section">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="kpi-label">Total Complaints</div>
            <div className="kpi-value">{loading ? '—' : stats?.totalIssues ?? 0}</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="kpi-label">Reported (Pending)</div>
            <div className="kpi-value" style={{ color: '#ef4444' }}>
              {loading ? '—' : stats?.reportedCount ?? 0}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <RefreshCw size={22} />
          </div>
          <div>
            <div className="kpi-label">In Progress</div>
            <div className="kpi-value" style={{ color: '#f59e0b' }}>
              {loading ? '—' : stats?.inProgressCount ?? 0}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#f0fdf4', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="kpi-label">Resolved</div>
            <div className="kpi-value" style={{ color: '#10b981' }}>
              {loading ? '—' : stats?.resolvedCount ?? 0}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#b91c1c' }}>
            <Flame size={22} />
          </div>
          <div>
            <div className="kpi-label">High Priority</div>
            <div className="kpi-value" style={{ color: '#b91c1c' }}>
              {loading ? '—' : stats?.highPriorityCount ?? 0}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
