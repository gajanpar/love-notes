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
  Download,
  AlertTriangle,
  Crown,
  CheckCircle2
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
  personnel: { name: string; nip?: string; note?: string }[];
  clearanceLevel: number;
  clearanceLabel: string;
  authorityScope: string[];
  restrictionNote: string;
  legalBasis: string;
  icon: React.ReactNode;
}

export const RBACMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit'>('matrix');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<Role | 'all'>('all');
  const [searchLog, setSearchLog] = useState('');
  const [roleHighlight, setRoleHighlight] = useState<Role | null>(null);

  // Role metadata - Implementasi Nyata (Struktur Otoritas Kedinasan Resmi)
  const rolesList: RoleCardInfo[] = [
    {
      role: 'superadmin',
      name: 'Superadmin',
      title: 'Administrator Teknis & Keamanan Sistem',
      badge: 'Level IV • Akses Root IT',
      color: '#cfa23d',
      bgGradient: 'linear-gradient(135deg, #28211c 0%, #3d2f25 100%)',
      description: 'Pengelola teknis database, audit forensik keamanan, konfigurasi server cloud, dan tata kelola akun aparatur desa.',
      personnel: [
        { name: 'Tim Pranata Komputer', note: 'Diskominfo Kab. Majalengka' },
        { name: 'Admin Teknis IT', note: 'Pemerintah Desa Sukadana' }
      ],
      clearanceLevel: 4,
      clearanceLabel: 'Level IV (Akses Root & Audit)',
      authorityScope: [
        'Konfigurasi server, database, dan arsitektur backup berkala',
        'Audit jejak forensik seluruh aktivitas administratif aparatur',
        'Manajemen hak akses, reset kredensial, dan otentikasi 2FA aparatur'
      ],
      restrictionNote: 'Terkunci dari penerbitan surat/TTE kedinasan ke warga. Wajib menjaga integritas log forensik.',
      legalBasis: 'Permendagri No. 47/2016 & Standar Keamanan Informasi BSSN',
      icon: <Key size={20} color="#cfa23d" />
    },
    {
      role: 'kepala_desa',
      name: 'Kepala Desa (Kuwu)',
      title: 'Pejabat Penandatangan Elektronik (TTE) Tunggal',
      badge: 'Level III • Otorisator TTE',
      color: '#1a9020',
      bgGradient: 'linear-gradient(135deg, #1a9020 0%, #105c14 100%)',
      description: 'Pemegang sertifikat digital resmi BSrE BSSN. Memiliki hak prerogatif tertinggi untuk menerbitkan TTE dan disposisi kebijakan.',
      personnel: [
        { name: 'H. Asep Saepudin, S.Pd., M.Si.', nip: '19750814 200212 1 002', note: 'Kuwu Desa Sukadana' }
      ],
      clearanceLevel: 3,
      clearanceLabel: 'Level III (Otoritas TTE Tertinggi)',
      authorityScope: [
        'Pembubuhan Tanda Tangan Elektronik (TTE) tersertifikasi BSrE BSSN',
        'Persetujuan final penerbitan seluruh surat keterangan resmi',
        'Penetapan Peraturan Desa (Perdes) dan disposisi kebijakan pembangunan'
      ],
      restrictionNote: 'Hak TTE mutlak melekat pada Kuwu dan tidak dapat dipindahtangankan tanpa SK penunjukan Plt resmi.',
      legalBasis: 'UU Desa No. 6/2014 & Peraturan BSSN No. 10/2019 tentang TTE Instansi',
      icon: <FileSignature size={20} color="#acdbb0" />
    },
    {
      role: 'sekretaris',
      name: 'Sekretaris Desa (Sekdes)',
      title: 'Koordinator Verifikasi & Administrasi Kependudukan',
      badge: 'Level II • Verifikator Utama',
      color: '#4f9f54',
      bgGradient: 'linear-gradient(135deg, #2f5432 0%, #1e3820 100%)',
      description: 'Koordinator utama alur administrasi kependudukan (SIAK Desa), validasi persyaratan berkas, dan verifikasi draf persuratan.',
      personnel: [
        { name: 'Dadan Ramdani, S.AP', nip: '19840321 200903 1 004', note: 'Sekretaris Desa Sukadana' }
      ],
      clearanceLevel: 2,
      clearanceLabel: 'Level II (Verifikasi Berkas & SIAK)',
      authorityScope: [
        'Verifikasi keabsahan berkas permohonan warga sebelum naik ke Kuwu',
        'Pencatatan mutasi kependudukan (pindah, datang, lahir, wafat) di SIAK',
        'Penolakan berkas tidak lengkap disertai catatan revisi resmi'
      ],
      restrictionNote: 'Tidak memiliki kewenangan membubuhkan TTE akhir pada lembar output dokumen publik.',
      legalBasis: 'Permendagri No. 84/2015 tentang Tata Kelola Pemerintah Desa',
      icon: <ShieldCheck size={20} color="#acdbb0" />
    },
    {
      role: 'operator',
      name: 'Operator Loket Pelayanan',
      title: 'Petugas Front-Office & Registrasi Berkas',
      badge: 'Level I • Front-Office Loket',
      color: '#6f747a',
      bgGradient: 'linear-gradient(135deg, #373b40 0%, #25282c 100%)',
      description: 'Garda depan pelayanan warga di Balai Desa Sukadana untuk penerimaan berkas fisik, verifikasi identitas NIK, dan asistensi mandiri.',
      personnel: [
        { name: 'Siti Aminah, S.Kom', note: 'Loket 1 — SKU & Keterangan Umum' },
        { name: 'Ahmad Fauzi', note: 'Loket 2 — Kependudukan & Pindah Datang' },
        { name: 'Rina Marlina', note: 'Loket 3 — Asistensi Permohonan Mandiri' }
      ],
      clearanceLevel: 1,
      clearanceLabel: 'Level I (Penerimaan & Registrasi)',
      authorityScope: [
        'Penerimaan berkas fisik dan pencocokan KTP/KK pemohon di loket',
        'Pendaftaran nomor tiket antrean dan asistensi warga lansia/disabilitas',
        'Pencetakan fisik surat yang telah disahkan dan ber-barcode resmi'
      ],
      restrictionNote: 'Dilarang mengubah data induk kependudukan tanpa persetujuan Sekdes. Tidak berhak memvalidasi akhir.',
      legalBasis: 'SOP Pelayanan Terpadu Satu Pintu (PTSP) Desa Sukadana 2026',
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
      description: 'Pengelolaan warta kabar desa, publikasi informasi publik, dan ekspor laporan berkala.',
      permissions: [
        {
          id: 'cms:publish' as Permission,
          label: 'Publikasi Berita, Agenda & Perdes',
          desc: 'Menerbitkan kabar resmi desa, warta pembangunan, produk hukum Perdes, dan pengumuman'
        },
        {
          id: 'data:export' as Permission,
          label: 'Ekspor Data Rekapitulasi (CSV/Excel)',
          desc: 'Mengunduh rekapitulasi data demografi, arsip persuratan, dan laporan pelayanan'
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

      {/* PRODUCTION STATUS NOTICE */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.08) 0%, rgba(207, 162, 61, 0.08) 100%)',
        border: '1px solid rgba(207, 162, 61, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #cfa23d 0%, #1a9020 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0,
          marginTop: '2px'
        }}>
          <Lock size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              Struktur Otoritas Kedinasan Permanen &bull; Implementasi Nyata (Non-Civilian Verified)
            </h4>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-brand-primary)',
              color: '#ffffff',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Produksi Definitif
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Setiap peran aparatur terikat secara mutlak pada <strong>Surat Keputusan (SK) Pengangkatan Kuwu Sukadana</strong> dan <strong>Sertifikasi Kriptografi BSrE BSSN</strong>. Pemindahan peran dibatasi secara ketat dan diaudit permanen demi validitas hukum berkas warga dan integritas kependudukan SIAK.
          </p>
        </div>
      </div>

      {/* 2x2 Zone Grid: 4 Special Administrative Roles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
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
                borderColor: isHighlighted ? item.color : 'var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                boxShadow: isHighlighted ? `0 10px 30px ${item.color}25` : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Row: Role Icon, Badge & Permanent Lock */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: item.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-serif)',
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '2px' }}>
                        {item.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-surface-raised)',
                      color: item.color,
                      border: '1px solid var(--color-border)'
                    }}>
                      {item.badge}
                    </span>
                    <span title="Role Terkunci Permanen" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '3px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(207, 162, 61, 0.12)',
                      color: '#cfa23d',
                      border: '1px solid rgba(207, 162, 61, 0.25)'
                    }}>
                      <Lock size={10} /> Terkunci
                    </span>
                  </div>
                </div>

                {/* Deskripsi Tupoksi */}
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px'
                }}>
                  {item.description}
                </p>

                {/* Pejabat / Personil Definitif */}
                <div style={{
                  background: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 14px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '14px'
                }}>
                  <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-muted)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <UserCheck size={13} color="var(--color-brand-primary)" /> Personil Pemegang Akun Resmi:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.personnel.map((p, pIdx) => (
                      <div key={pIdx} style={{ fontSize: '0.78rem', color: 'var(--color-text-primary)' }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>{p.name}</strong>
                        {p.nip && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}>(NIP: {p.nip})</span>}
                        {p.note && <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-primary)', marginLeft: '6px', fontWeight: 600 }}>&bull; {p.note}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kewenangan Utama (Bullet points) */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    Kewenangan Kedinasan Utama:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {item.authorityScope.map((scope, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '3px' }}>{scope}</li>
                    ))}
                  </ul>
                </div>

                {/* Batasan Kewenangan (Notice Box) */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.74rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span><strong>Batasan:</strong> {item.restrictionNote}</span>
                </div>
              </div>

              {/* Card Footer: Dasar Hukum, Personil Count, Hak Akses */}
              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.72rem'
              }}>
                <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  {item.legalBasis}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontWeight: 800,
                    color: item.color,
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {assignedPermCount} Hak Akses
                  </span>
                </div>
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
