import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { IssueStatus } from '../types';

interface StatusBadgeProps {
  status: IssueStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = (status || '').toUpperCase().trim();

  if (normalized === 'RESOLVED') {
    return (
      <span className="badge badge-status-RESOLVED">
        <CheckCircle2 size={13} /> Resolved
      </span>
    );
  }

  if (normalized.includes('PROGRESS')) {
    return (
      <span className="badge badge-status-IN_PROGRESS">
        <Clock size={13} /> In Progress
      </span>
    );
  }

  return (
    <span className="badge badge-status-REPORTED">
      <AlertCircle size={13} /> Reported
    </span>
  );
};
