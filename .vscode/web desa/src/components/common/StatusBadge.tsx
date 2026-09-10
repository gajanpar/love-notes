// src/components/common/StatusBadge.tsx
import React from 'react';
import { StatusEnum } from '../../types';
import { Clock, Eye, AlertCircle, CheckCircle, FileCheck, XCircle, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusEnum;
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showPulse = false }) => {
  const getBadgeConfig = (st: StatusEnum) => {
    switch (st) {
      case 'pending':
        return {
          label: 'Menunggu',
          className: 'badge badge-pending',
          icon: <Clock size={12} />
        };
      case 'review':
        return {
          label: 'Sedang Diperiksa',
          className: 'badge badge-review',
          icon: <Eye size={12} />
        };
      case 'revision':
        return {
          label: 'Perlu Revisi',
          className: 'badge badge-revision',
          icon: <AlertCircle size={12} />
        };
      case 'approved':
        return {
          label: 'Disetujui',
          className: 'badge badge-approved',
          icon: <CheckCircle size={12} />
        };
      case 'signed':
        return {
          label: 'Ditandatangani',
          className: 'badge badge-approved',
          icon: <FileCheck size={12} />
        };
      case 'done':
        return {
          label: 'Selesai',
          className: 'badge badge-done',
          icon: <CheckCheck size={12} />
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          className: 'badge badge-rejected',
          icon: <XCircle size={12} />
        };
      default:
        return {
          label: status,
          className: 'badge badge-pending',
          icon: <Clock size={12} />
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`${config.className} ${showPulse ? 'badge-pulse' : ''}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
