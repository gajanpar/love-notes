// src/components/admin/RBACMatrix.tsx
import React, { useState, useMemo } from 'react';
import {
  Shield,
  Check,
  Lock,
  Clock,
  History,
  Search,
  Filter,
  User,
  FileText,
  AlertCircle,
  Key,
  Layers,
  Award,
  Sliders,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  FileSignature,
  Download
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { Role, Permission, AuditLog } from '../../types';

interface RoleCardInfo {
  role: Role;
  name: string;
  title: string;
  badge: string;
  color: string;
  bgGradient: string;
  description: string;
  userCount: number;
  clearanceLevel: number;
  icon: React.ReactNode;
}

export const RBACMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit'>('matrix');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<Role | 'all'>('all');
  const [searchLog, setSearchLog] = useState('');
  const [roleHighlight, setRoleHighlight] = useState<Role | null>(null);

  // Role metadata
  const rolesList: RoleCardInfo[] = [
    {
      role: 'superadmin',
      name: 'Superadmin',
      title: 'Administrator Teknis Sistem',
      badge: 'Sistem Root',
      color: '#cfa23d',
      bgGradient: 'linear-gradient(135deg, #28211c 0%, #3d2f25 100%)',
      description: 'Pengelola teknis database, audit keamanan, konfigurasi server, dan pemeliharaan akun.',
      userCount: 2,
      clearanceLevel: 4,
      icon: <Key size={20} color="#cfa23d" />
    },
    {
      role: 'kepala_desa',
      name: 'Kepala Desa (Kuwu)',
      title: 'Pejabat Otorisator Tertinggi',
      badge: 'Pemegang TTE',
      color: '#1a9020',
      bgGradient: 'linear-gradient(135deg, #1a9020 0%, #105c14 100%)',
      description: 'Pemegang sertifikat digital BSrE BSSN. Berhak penuh menerbitkan TTE dan disposisi resmi.',
      userCount: 1,
      clearanceLevel: 3,
      icon: <FileSignature size={20} color="#acdbb0" />
    },
    {
      role: 'sekretaris',
      name: 'Sekretaris Desa',
      title: 'Koordinator Verifikasi & APBDes',
      badge: 'Verifikator Utama',
      color: '#4f9f54',
      bgGradient: 'linear-gradient(135deg, #2f5432 0%, #1e3820 100%)',
      description: 'Memeriksa keabsahan berkas, administrasi kependudukan, penganggaran APBDes, dan data mutasi.',
      userCount: 1,
      clearanceLevel: 2,
      icon: <ShieldCheck size={20} color="#acdbb0" />
    },
    {
      role: 'operator',
      name: 'Operator Loket',
      title: 'Pelayanan Front-Office',
      badge: 'Petugas Loket',
      color: '#6f747a',
      bgGradient: 'linear-gradient(135deg, #373b40 0%, #25282c 100%)',
      description: 'Penerimaan berkas fisik warga, verifikasi NIK awal, dan panduan asistensi permohonan mandiri.',
      userCount: 3,
      clearanceLevel: 1,
      icon: <UserCheck size={20} color="#acdbb0" />
    }
  ];

  // Grouped Permissions Modules
  const permissionModules = [
    {
      module: 'Pelayanan & TTE Digital (BSrE BSSN)',
      description: 'Otorisasi verifikasi berkas permohonan warga dan pembubuhan tanda tangan digital resmi.',
      permissions: [
        {
          id: 'pengajuan:verify' as Permission,
          label: 'Verifikasi Berkas Pengajuan',
          desc: 'Memvalidasi kelengkapan KTP/KK/Surat Pengantar RT pemohon dan meloloskan ke tahap review'
        },
        {
          id: 'pengajuan:reject' as Permission,
          label: 'Tolak Berkas Pengajuan',
          desc: 'Menolak permohonan yang tidak memenuhi syarat disertai catatan resmi revisi ke pemohon'
        },
        {
          id: 'pengajuan:tte' as Permission,
          label: 'Tanda Tangan Elektronik (TTE BSrE)',
          desc: 'Membubuhkan sertifikat digital resmi BSrE BSSN ke dokumen PDF output (Khusus Kuwu Sukadana)',
          exclusiveTo: 'kepala_desa'
        }
      ]
    },
    {
      module: 'Administrasi Kependudukan (SIAK Desa)',
      description: 'Akses terhadap data induk 3.842 penduduk, buku mutasi domisili, dan kartu keluarga.',
      permissions: [
        {
          id: 'penduduk:read' as Permission,
          label: 'Lihat Data Kependudukan (Read-Only)',
          desc: 'Membaca data NIK, KK, dan biodata warga desa untuk keperluan validasi pelayanan'
        },
        {
          id: 'penduduk:write' as Permission,
          label: 'Edit & Mutasi Data Warga',
          desc: 'Mencatat mutasi masuk/keluar, kelahiran, status perkawinan, dan perubahan KK'
        }
      ]
    },
    {
      module: 'Transparansi, CMS & Ekspor Data',
      description: 'Pengelolaan warta kabar desa, publikasi realisasi APBDes, dan ekspor laporan berkala.',
      permissions: [
        {
          id: 'cms:publish' as Permission,
          label: 'Publikasi Berita, Agenda & Perdes',
          desc: 'Menerbitkan kabar resmi desa, warta pembangunan, produk hukum Perdes, dan pengumuman'
        },
        {
          id: 'data:export' as Permission,
          label: 'Ekspor Data Rekapitulasi (CSV/Excel)',
          desc: 'Mengunduh rekapitulasi data demografi, arsip persuratan, dan pembukuan APBDes'
        }
      ]
    },
    {
      module: 'Keamanan Sistem & Tata Kelola Akun',
      description: 'Hak akses tingkat tinggi untuk pengaturan server, hak akses, dan manajemen akun staf.',
      permissions: [
        {
          id: 'user:manage' as Permission,
          label: 'Manajemen Akun Perangkat & Sistem',
          desc: 'Membuat akun staf desa, mereset password, dan mengatur hak otorisasi peran'
        }
      ]
    }
  ];

  // Role Permissions Matrix
  const rolePermissions: Record<Role, Permission[]> = {
    superadmin: [
      'pengajuan:verify',
      'pengajuan:reject',
      'penduduk:write',
      'penduduk:read',
      'cms:publish',
      'user:manage',
      'data:export'
    ],
    kepala_desa: [
      'pengajuan:verify',
      'pengajuan:reject',
      'pengajuan:tte',
      'penduduk:read',
      'cms:publish',
      'data:export'
    ],
    sekretaris: [
      'pengajuan:verify',
      'pengajuan:reject',
      'penduduk:write',
      'penduduk:read',
      'cms:publish',
      'data:export'
    ],
    operator: [
      'pengajuan:verify',
      'penduduk:read'
    ]
  };

  // Filtered Audit Logs
  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter(l => {
      const matchRole =
        selectedRoleFilter === 'all' ||
        l.userRole.toLowerCase().includes(selectedRoleFilter.replace('_', ' '));
      const matchQuery =
        l.userName.toLowerCase().includes(searchLog.toLowerCase()) ||
        l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
        l.target.toLowerCase().includes(searchLog.toLowerCase()) ||
        l.details.toLowerCase().includes(searchLog.toLowerCase());
      return matchRole && matchQuery;
    });
  }, [selectedRoleFilter, searchLog]);

  return (
    <div className="animate-slide-up">
      {/* RBAC Header & Sub-Tab Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-brand-600)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Shield size={14} />
            Keamanan Tingkat Tinggi &bull; Role-Based Access Control
          </div>
          <h2 style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-text-primary)',
            marginTop: '4px'
          }}>
            Tata Kelola Hak Akses &amp; Jejak Audit Sistem
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Setiap tindakan administratif terlindungi secara kriptografis dan dibatasi ketat berdasarkan tupoksi aparatur.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{
          display: 'flex',
          background: 'var(--color-surface-raised)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('matrix')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'matrix' ? 'var(--color-brand-600)' : 'transparent',
              color: activeTab === 'matrix' ? '#ffffff' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'matrix' ? 700 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Layers size={16} />
            <span>Matriks Otorisasi</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'audit' ? 'var(--color-brand-600)' : 'transparent',
              color: activeTab === 'audit' ? '#ffffff' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'audit' ? 700 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <History size={16} />
            <span>Jejak Audit ({MOCK_AUDIT_LOGS.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive Visual Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {rolesList.map(item => {
          const isHighlighted = roleHighlight === item.role;
          const assignedPermCount = rolePermissions[item.role].length;
          return (
            <div
              key={item.role}
              onClick={() => setRoleHighlight(isHighlighted ? null : item.role)}
              style={{
                background: 'var(--color-surface)',
                border: '2px solid',
                borderColor: isHighlighted ? 'var(--color-brand-600)' : 'var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: isHighlighted ? '0 8px 24px rgba(26, 144, 32, 0.2)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                if (!isHighlighted) e.currentTarget.style.borderColor = 'var(--color-brand-300)';
              }}
              onMouseLeave={e => {
                if (!isHighlighted) e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              {/* Top Row: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-lg)',
                  background: item.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-surface-raised)',
                  color: item.color,
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-sans)'
                }}>
                  {item.badge}
                </span>
              </div>

              {/* Title & Role Name */}
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '2px'
              }}>
                {item.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '10px' }}>
                {item.title}
              </div>

              <p style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
                marginBottom: '16px',
                minHeight: '44px'
              }}>
                {item.description}
              </p>

              {/* Card Footer: Clearance Level & Permission Count */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {item.userCount} Pengguna
                </span>
                <span style={{
                  fontWeight: 700,
                  color: 'var(--color-brand-600)',
                  background: 'rgba(26, 144, 32, 0.08)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {assignedPermCount} Hak Akses
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MATRIKS OTORISASI PERAN & MODUL                                    */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {permissionModules.map((mod, modIdx) => (
            <div
              key={modIdx}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {/* Module Header Bar */}
              <div style={{
                padding: '16px 24px',
                background: 'var(--color-surface-raised)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '16px',
                      background: 'var(--color-brand-600)',
                      borderRadius: '3px'
                    }} />
                    {mod.module}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {mod.description}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--color-surface)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)'
                }}>
                  {mod.permissions.length} Izin
                </span>
              </div>

              {/* Module Permissions Table */}
              <div className="table-container" style={{ margin: 0 }}>
                <table className="data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Izin &amp; Rincian Otorisasi</th>
                      <th style={{ textAlign: 'center', width: '15%' }}>Superadmin</th>
                      <th style={{ textAlign: 'center', width: '15%' }}>Kepala Desa</th>
                      <th style={{ textAlign: 'center', width: '15%' }}>Sekretaris</th>
                      <th style={{ textAlign: 'center', width: '15%' }}>Operator Loket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mod.permissions.map(perm => (
                      <tr key={perm.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                            {perm.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {perm.desc}
                          </div>
                          {(perm as any).exclusiveTo && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              background: 'rgba(207, 162, 61, 0.15)',
                              color: 'var(--color-gold-700)',
                              border: '1px solid rgba(207, 162, 61, 0.3)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              marginTop: '4px'
                            }}>
                              <Lock size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                              Sertifikat Kriptografis BSrE (Kuwu Sah)
                            </span>
                          )}
                        </td>

                        {/* Superadmin Cell */}
                        <td style={{ textAlign: 'center' }}>
                          <PermissionToggleBadge
                            granted={rolePermissions.superadmin.includes(perm.id)}
                            role="superadmin"
                            isHighlighted={roleHighlight === 'superadmin'}
                          />
                        </td>

                        {/* Kepala Desa Cell */}
                        <td style={{ textAlign: 'center' }}>
                          <PermissionToggleBadge
                            granted={rolePermissions.kepala_desa.includes(perm.id)}
                            role="kepala_desa"
                            isHighlighted={roleHighlight === 'kepala_desa'}
                          />
                        </td>

                        {/* Sekretaris Cell */}
                        <td style={{ textAlign: 'center' }}>
                          <PermissionToggleBadge
                            granted={rolePermissions.sekretaris.includes(perm.id)}
                            role="sekretaris"
                            isHighlighted={roleHighlight === 'sekretaris'}
                          />
                        </td>

                        {/* Operator Cell */}
                        <td style={{ textAlign: 'center' }}>
                          <PermissionToggleBadge
                            granted={rolePermissions.operator.includes(perm.id)}
                            role="operator"
                            isHighlighted={roleHighlight === 'operator'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUDIT TRAIL LOG (APPEND-ONLY)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Controls: Search + Role Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Role Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['all', 'superadmin', 'kepala_desa', 'sekretaris', 'operator'] as const).map(rf => (
                <button
                  key={rf}
                  onClick={() => setSelectedRoleFilter(rf)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedRoleFilter === rf ? 'var(--color-brand-600)' : 'var(--color-border)',
                    background: selectedRoleFilter === rf ? 'var(--color-brand-600)' : 'var(--color-surface)',
                    color: selectedRoleFilter === rf ? '#ffffff' : 'var(--color-text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: selectedRoleFilter === rf ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {rf === 'all' ? 'Semua Peran' : rf.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Log Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 12px',
              border: '1px solid var(--color-border)',
              minWidth: '260px'
            }}>
              <Search size={15} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Cari nama, aksi, atau tiket..."
                value={searchLog}
                onChange={e => setSearchLog(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.84rem',
                  color: 'var(--color-text-primary)',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Audit Trail Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Waktu &amp; Tanggal</th>
                  <th>Petugas / Pelaksana</th>
                  <th>Jabatan</th>
                  <th>Aksi Terverifikasi</th>
                  <th>Target Dokumen</th>
                  <th>Rincian Log Aktivitas</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                      Tidak ditemukan log aktivitas yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} />
                          {log.timestamp}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        {log.userName}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          color: 'var(--color-brand-700)',
                          background: 'rgba(26, 144, 32, 0.08)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600
                        }}>
                          {log.userRole}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: 'var(--color-surface-raised)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          color: log.action.includes('TTE') ? '#047857' : 'var(--color-text-primary)'
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td className="font-mono" style={{ fontWeight: 700, color: 'var(--color-brand-600)', fontSize: '0.8125rem' }}>
                        {log.target}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Visual Permission Badge with Switch / Status style
const PermissionToggleBadge: React.FC<{
  granted: boolean;
  role: Role;
  isHighlighted: boolean;
}> = ({ granted, role, isHighlighted }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      background: granted
        ? 'rgba(26, 144, 32, 0.12)'
        : 'var(--color-surface-raised)',
      border: '1px solid',
      borderColor: granted
        ? 'rgba(26, 144, 32, 0.3)'
        : 'var(--color-border)',
      transform: isHighlighted ? 'scale(1.05)' : 'none',
      transition: 'all var(--transition-fast)'
    }}>
      {granted ? (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#1a9020',
          fontWeight: 700,
          fontSize: '0.72rem'
        }}>
          <Check size={13} strokeWidth={3} />
          <span>Diberikan</span>
        </span>
      ) : (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--color-text-disabled)',
          fontWeight: 500,
          fontSize: '0.72rem'
        }}>
          <Lock size={11} />
          <span>Dibatasi</span>
        </span>
      )}
    </div>
  );
};
