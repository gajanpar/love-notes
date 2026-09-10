// src/components/admin/RoleSelector.tsx
import React from 'react';
import { Shield, Crown, UserCheck, Edit3, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { Role } from '../../types';
import { MOCK_ROLES } from '../../data/mockData';

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  onRoleChange
}) => {
  const activeUser = MOCK_ROLES[currentRole];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      color: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Current Active User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid #3B82F6'
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#22C55E',
            border: '2px solid #0F172A'
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#ffffff' }}>
              {activeUser.name}
            </h3>
            <span style={{
              background: currentRole === 'kepala_desa' ? '#9333EA' : currentRole === 'superadmin' ? '#DC2626' : '#2563EB',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {currentRole.replace('_', ' ')}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            {activeUser.title} • {activeUser.permissions.length} Izin Akses Aktif
          </p>
        </div>
      </div>

      {/* Interactive Role Switcher Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <KeyRound size={12} /> Simulasi Role-Based Access Control (RBAC):
        </div>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {(['superadmin', 'kepala_desa', 'sekretaris', 'operator'] as Role[]).map(r => {
            const isSelected = currentRole === r;
            const roleInfo = MOCK_ROLES[r];
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                style={{
                  background: isSelected ? '#3B82F6' : 'transparent',
                  color: isSelected ? '#ffffff' : '#CBD5E1',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {r === 'kepala_desa' ? <Crown size={13} /> :
                 r === 'superadmin' ? <Shield size={13} /> :
                 r === 'sekretaris' ? <Edit3 size={13} /> : <UserCheck size={13} />}
                <span>{roleInfo.title.split(' ')[0]} {roleInfo.title.split(' ')[1] || ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
