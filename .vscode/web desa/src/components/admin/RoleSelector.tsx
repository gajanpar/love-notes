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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Lock size={12} color="#cfa23d" /> Sesi Otoritas Kedinasan Definitif:
          </div>
          <span style={{
            fontSize: '0.65rem',
            color: '#cfa23d',
            background: 'rgba(207, 162, 61, 0.15)',
            border: '1px solid rgba(207, 162, 61, 0.3)',
            padding: '2px 7px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700
          }}>
            Implementasi Nyata
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '4px'
        }}>
          {(['superadmin', 'kepala_desa', 'sekretaris', 'operator'] as Role[]).map(r => {
            const isSelected = currentRole === r;
            const roleInfo = MOCK_ROLES[r];
            const roleColor = r === 'superadmin' ? '#cfa23d' : r === 'kepala_desa' ? '#22c55e' : r === 'sekretaris' ? '#38bdf8' : '#94a3b8';
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: isSelected ? '#ffffff' : '#94A3B8',
                  border: isSelected ? `1.5px solid ${roleColor}` : '1.5px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                }}
                title={`Beralih ke sesi ${roleInfo.name}`}
              >
                {r === 'kepala_desa' ? <Crown size={14} color={roleColor} /> :
                 r === 'superadmin' ? <Shield size={14} color={roleColor} /> :
                 r === 'sekretaris' ? <Edit3 size={14} color={roleColor} /> : <UserCheck size={14} color={roleColor} />}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ lineHeight: 1.1, color: isSelected ? '#ffffff' : '#CBD5E1' }}>
                    {r === 'kepala_desa' ? 'Kuwu (Kades)' : r === 'superadmin' ? 'Superadmin' : r === 'sekretaris' ? 'Sekdes' : 'Operator'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '0.68rem', color: '#64748B', textAlign: 'right' }}>
          Terkunci per NIP aparatur &bull; Rotasi peran diaudit ke log forensik
        </div>
      </div>
    </div>
  );
};
