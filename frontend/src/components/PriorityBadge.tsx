import React from 'react';
import { Flame, AlertTriangle, Info } from 'lucide-react';
import { PriorityLevel } from '../types';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const normalized = (priority || '').toUpperCase().trim();

  if (normalized === 'HIGH') {
    return (
      <span className="badge badge-priority-HIGH">
        <Flame size={13} /> High Priority
      </span>
    );
  }

  if (normalized === 'MEDIUM') {
    return (
      <span className="badge badge-priority-MEDIUM">
        <AlertTriangle size={13} /> Medium Priority
      </span>
    );
  }

  return (
    <span className="badge badge-priority-LOW">
      <Info size={13} /> Low Priority
    </span>
  );
};
