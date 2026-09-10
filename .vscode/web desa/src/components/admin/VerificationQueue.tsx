// src/components/admin/VerificationQueue.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  ArrowRight, 
  Calendar,
  FileCheck2,
  Inbox
} from 'lucide-react';
import { PengajuanSurat, Role } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface VerificationQueueProps {
  pengajuanList: PengajuanSurat[];
  adminRole: Role;
  onSelectPengajuan: (pengajuan: PengajuanSurat) => void;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  pengajuanList,
  adminRole,
  onSelectPengajuan
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSurat, setFilterSurat] = useState<string>('all');

  const filtered = pengajuanList.filter(item => {
    // Search
    const matchSearch = item.nomorTiket.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.nikPemohon.includes(searchQuery);

    // Surat type
    const matchSurat = filterSurat === 'all' || item.jenisSurat === filterSurat;

    // Filter Type
    if (filterType === 'pending') return matchSearch && matchSurat && (item.status === 'pending' || item.status === 'review');
    if (filterType === 'tte') return matchSearch && matchSurat && (item.status === 'approved');
    if (filterType === 'urgent') return matchSearch && matchSurat && (item.status === 'pending' || item.status === 'review');
    if (filterType === 'done') return matchSearch && matchSurat && item.status === 'done';

    return matchSearch && matchSurat;
  });

  return (
    <div className="animate-slide-up">
      {/* Queue Header & Filters Bar */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Antrean Verifikasi Permohonan ({filtered.length} Berkas)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Daftar pengajuan persuratan warga yang membutuhkan pemeriksaan dan tanda tangan elektronik.
            </p>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            border: '1px solid var(--color-border)',
            minWidth: '280px'
          }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Cari nomor tiket, nama, NIK..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { id: 'all', label: 'Semua Berkas' },
              { id: 'pending', label: 'Menunggu / Diperiksa' },
              { id: 'tte', label: 'Perlu TTE Kades' },
              { id: 'urgent', label: 'Mendekati Deadline' },
              { id: 'done', label: 'Selesai' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                style={{
                  background: filterType === f.id ? 'var(--color-brand-600)' : 'var(--color-surface-raised)',
                  color: filterType === f.id ? '#ffffff' : 'var(--color-text-secondary)',
                  border: filterType === f.id ? '1px solid var(--color-brand-600)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 14px',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: filterType === f.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Jenis Surat:</span>
            <select
              className="form-select"
              value={filterSurat}
              onChange={e => setFilterSurat(e.target.value)}
              style={{ minHeight: '34px', padding: '4px 10px', fontSize: '0.8125rem', width: 'auto' }}
            >
              <option value="all">Semua Jenis</option>
              <option value="SKU">SKU (Usaha)</option>
              <option value="SKTM">SKTM (Tidak Mampu)</option>
              <option value="SKCK-PENGANTAR">SKCK Pengantar</option>
              <option value="SKPWNI">SKPWNI (Pindah)</option>
              <option value="SKN">SKN (Nikah)</option>
              <option value="SKTD">SKTD (Tanah)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Cards List */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '48px',
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}>
          <Inbox size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Tidak Ada Pengajuan dalam Kriteria Ini
          </h4>
          <p style={{ fontSize: '0.875rem' }}>
            Semua permohonan telah selesai diperiksa atau ubah filter pencarian Anda.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(item => {
            const isUrgent = item.status === 'pending' || item.status === 'review';
            return (
              <div
                key={item.id}
                className="glass-card glass-card-hover"
                onClick={() => onSelectPengajuan(item)}
                style={{
                  padding: '18px 24px',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: item.status === 'done' ? 'var(--color-success-50)' : item.status === 'approved' ? 'var(--color-brand-50)' : 'var(--color-warning-50)',
                    color: item.status === 'done' ? 'var(--color-success-600)' : item.status === 'approved' ? 'var(--color-brand-600)' : 'var(--color-warning-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem'
                  }}>
                    {item.jenisSurat.substring(0, 3)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                      <strong className="font-mono" style={{ fontSize: '0.9375rem', color: 'var(--color-brand-700)' }}>
                        #{item.nomorTiket}
                      </strong>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                        {item.jenisSurat} • {item.namaPemohon}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      NIK: {item.nikPemohon} • Diajukan: {item.createdAt}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {isUrgent && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--color-warning-fg)',
                      background: 'var(--color-warning-50)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600
                    }}>
                      <AlertTriangle size={12} /> Target SLA: {item.deadlineAt}
                    </span>
                  )}

                  <button className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                    <span>Periksa Berkas</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
