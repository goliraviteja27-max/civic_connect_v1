import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgStyles = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: <CheckCircle2 size={18} /> },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', icon: <AlertTriangle size={18} /> },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', icon: <AlertCircle size={18} /> },
  }[type];

  return (
    <div
      style={{
        background: bgStyles.bg,
        border: `1px solid ${bgStyles.border}`,
        color: bgStyles.text,
        padding: '0.85rem 1.1rem',
        borderRadius: '8px',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {bgStyles.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: bgStyles.text, padding: 0 }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
