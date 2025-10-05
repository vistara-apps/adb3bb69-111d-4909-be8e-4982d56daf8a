'use client';

import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'cancelled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'status-badge status-pending',
    },
    completed: {
      icon: CheckCircle2,
      label: 'Completed',
      className: 'status-badge status-completed',
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      className: 'status-badge status-cancelled',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span className={className}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
