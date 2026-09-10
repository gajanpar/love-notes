// src/components/public/PerdesSection.tsx
import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { PERDES_LIST } from '../../data/mockData';
import { PerdesItem } from '../../types';

const StatusBadge: React.FC<{ status: PerdesItem['status'] }> = ({ status }) => {
  const cfg = {
    Berlaku:  { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', icon: <CheckCircle2 size={12} /> },
    Diubah:   { bg: '#fffbeb', color: '#b45309', border: '#fde68a', icon: <AlertCircle size={12} /> },
    Dicabut:  { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', icon: <XCircle size={12} /> },
  }[status];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase'
    }}>
      {cfg.icon} {status}
    </span>
  );
};

const KategoriBadge: React.FC<{ kategori: PerdesItem['kategori'] }> = ({ kategori }) => {
  const colors: Record<string, string> = {
    Keuangan: '#1b8f21', Pembangunan: '#695725',
    Kemasyarakatan: '#00a010', Pemerintahan: '#2b2520',
    'Tata Ruang': '#54a459', Lainnya: '#71767d',
  };
  return (
    <span style={{
      background: colors[kategori] || '#71767d',
      color: '#fff', fontFamily: 'var(--font-sans)',
      fontSize: '0.625rem', fontWeight: 700,
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      letterSpacing: '0.04em', textTransform: 'uppercase'
    }}>
      {kategori}
    </span>
  );
};

export const PerdesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahun, setFilterTahun] = useState<number | 'all'>('all');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'tahun_desc' | 'tahun_asc' | 'az' | 'za' | 'kategori'>('tahun_desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tahunList = useMemo(() => {
    const years = [...new Set(PERDES_LIST.map(p => p.tahun))].sort((a, b) => b - a);
    return years;
  }, []);

  const filteredPerdes = useMemo(() => {
    return PERDES_LIST.filter(p => {
      const matchSearch = p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tentang.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTahun = filterTahun === 'all' || p.tahun === filterTahun;
      const matchKat = filterKategori === 'all' || p.kategori === filterKategori;
      return matchSearch && matchTahun && matchKat;
    });
  }, [searchQuery, filterTahun, filterKategori]);

  const sortedPerdes = useMemo(() => {
    return [...filteredPerdes].sort((a, b) => {
      if (sortBy === 'tahun_desc') return b.tahun - a.tahun;
      if (sortBy === 'tahun_asc') return a.tahun - b.tahun;
      if (sortBy === 'az') return a.judul.localeCompare(b.judul, 'id');
      if (sortBy === 'za') return b.judul.localeCompare(a.judul, 'id');
      if (sortBy === 'kategori') return a.kategori.localeCompare(b.kategori, 'id');
      return 0;
    });
  }, [filteredPerdes, sortBy]);

  return (
    <section id="perdes" style={{ padding: '72px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span className="section-label">Regulasi &amp; Hukum Desa</span>
          <h2 className="text-title" style={{ marginBottom: '12px' }}>
            Peraturan Desa Sukadana (Perdes)
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontFamily: 'var(--font-sans)', lineHeight: 1.65 }}>
            Daftar seluruh peraturan desa yang telah ditetapkan oleh Kuwu bersama Badan Permusyawaratan Desa (BPD) Sukadana
            berdasarkan Undang-Undang No. 6 Tahun 2014 tentang Desa.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Search */}
          <div style={{
            flex: 1, minWidth: '220px',
            display: 'flex', alignItems: 'center',
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            border: '1px solid var(--color-border)'
          }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Cari nomor atau judul perdes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontSize: '0.875rem', fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-primary)', width: '100%'
              }}
            />
          </div>

          {/* Filter Tahun */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />Tahun:
            </span>
            <select
              className="form-select"
              value={filterTahun}
              onChange={e => setFilterTahun(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              style={{ minHeight: '36px', padding: '4px 10px', fontSize: '0.875rem', width: 'auto', fontFamily: 'var(--font-sans)' }}
            >
              <option value="all">Semua Tahun</option>
              {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Filter Kategori */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              <Filter size={14} style={{ display: 'inline', marginRight: '4px' }} />Kategori:
            </span>
            <select
              className="form-select"
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
              style={{ minHeight: '36px', padding: '4px 10px', fontSize: '0.875rem', width: 'auto', fontFamily: 'var(--font-sans)' }}
            >
              <option value="all">Semua Kategori</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Pembangunan">Pembangunan</option>
              <option value="Kemasyarakatan">Kemasyarakatan</option>
              <option value="Pemerintahan">Pemerintahan</option>
              <option value="Tata Ruang">Tata Ruang</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              <ArrowUpDown size={14} style={{ display: 'inline', marginRight: '4px' }} />Urutkan:
            </span>
            <select
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ minHeight: '36px', padding: '4px 10px', fontSize: '0.875rem', width: 'auto', fontFamily: 'var(--font-sans)' }}
            >
              <option value="tahun_desc">Tahun (Terbaru)</option>
              <option value="tahun_asc">Tahun (Terlama)</option>
              <option value="az">Judul (A - Z)</option>
              <option value="za">Judul (Z - A)</option>
              <option value="kategori">Kategori</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            {sortedPerdes.length} dari {PERDES_LIST.length} peraturan
          </div>
        </div>

        {/* Perdes Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '170px' }}>Nomor Perdes</th>
                <th>Judul Peraturan Desa</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Tahun</th>
                <th style={{ width: '120px' }}>Kategori</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '110px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedPerdes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
                    <BookOpen size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                    Tidak ada peraturan desa dalam kriteria pencarian ini.
                  </td>
                </tr>
              ) : sortedPerdes.map(perdes => (
                <React.Fragment key={perdes.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedId(expandedId === perdes.id ? null : perdes.id)}
                  >
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-700)',
                        background: 'var(--color-brand-50)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {perdes.nomor}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, marginBottom: '2px', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                        {perdes.judul}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
                        Ditetapkan: {perdes.tanggalPenetapan}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>
                        {perdes.tahun}
                      </span>
                    </td>
                    <td><KategoriBadge kategori={perdes.kategori} /></td>
                    <td style={{ textAlign: 'center' }}><StatusBadge status={perdes.status} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={e => { e.stopPropagation(); setExpandedId(expandedId === perdes.id ? null : perdes.id); }}
                          style={{ padding: '4px 8px', gap: '4px' }}
                        >
                          {expandedId === perdes.id
                            ? <><ChevronUp size={13} /> Tutup</>
                            : <><ChevronDown size={13} /> Detail</>}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expandedId === perdes.id && (
                    <tr style={{ background: 'var(--color-surface-subtle)' }}>
                      <td colSpan={6}>
                        <div style={{
                          padding: '16px 20px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '20px',
                          alignItems: 'flex-start',
                          animation: 'slideUpFade 0.2s ease-out'
                        }}>
                          <div style={{ flex: 1, minWidth: '260px' }}>
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                              Perihal / Tentang:
                            </div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                              {perdes.tentang}
                            </p>
                            {perdes.keterangan && (
                              <div style={{
                                marginTop: '8px',
                                background: 'var(--color-brand-50)',
                                border: '1px solid var(--color-brand-200)',
                                borderRadius: 'var(--radius-md)',
                                padding: '8px 12px',
                                fontSize: '0.8125rem',
                                fontFamily: 'var(--font-sans)',
                                color: 'var(--color-brand-700)'
                              }}>
                                Catatan: {perdes.keterangan}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => alert(`Mengunduh: ${perdes.nomor} — ${perdes.judul}`)}
                              style={{ gap: '6px' }}
                            >
                              <Download size={13} /> Unduh PDF
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => alert(`Membuka: ${perdes.nomor}`)}
                              style={{ gap: '6px' }}
                            >
                              <FileText size={13} /> Lihat Dokumen
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legal Note */}
        <div style={{
          marginTop: '24px',
          padding: '14px 20px',
          background: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <BookOpen size={16} style={{ color: 'var(--color-brand-600)', flexShrink: 0, marginTop: '1px' }} />
          <span>
            Peraturan Desa (Perdes) ditetapkan bersama oleh Kuwu / Kepala Desa dan Badan Permusyawaratan Desa (BPD)
            sesuai amanat <strong>Undang-Undang No. 6 Tahun 2014 tentang Desa</strong> dan
            Permendagri No. 111 Tahun 2014. Untuk memperoleh salinan resmi,
            silakan hubungi Kantor Sekretariat Desa Sukadana.
          </span>
        </div>
      </div>
    </section>
  );
};
