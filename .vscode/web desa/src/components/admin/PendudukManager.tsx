// src/components/admin/PendudukManager.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  UserPlus, 
  FileSpreadsheet, 
  CheckSquare, 
  Square, 
  MoreVertical, 
  Baby, 
  Heart, 
  UserMinus, 
  Building2, 
  X, 
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles
} from 'lucide-react';
import { MOCK_PENDUDUK, MOCK_MUTASI } from '../../data/mockData';
import { PendudukData, MutasiRecord } from '../../types';
import { useToast } from '../common/ToastContext';

interface PendudukManagerProps {
  onMutasiCreated?: (mutasi: MutasiRecord, updatedPenduduk: PendudukData) => void;
}

export const PendudukManager: React.FC<PendudukManagerProps> = ({ onMutasiCreated }) => {
  const toast = useToast();
  const [pendudukList, setPendudukList] = useState<PendudukData[]>(MOCK_PENDUDUK);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterRtRw, setFilterRtRw] = useState('Semua');
  const [selectedNiks, setSelectedNiks] = useState<string[]>([]);

  // Mutasi Modal State
  const [showMutasiModal, setShowMutasiModal] = useState(false);
  const [mutasiType, setMutasiType] = useState<MutasiRecord['jenis']>('Lahir');
  const [mutasiNama, setMutasiNama] = useState('');
  const [mutasiNik, setMutasiNik] = useState('');
  const [mutasiKet, setMutasiKet] = useState('');

  // Import CSV Modal State
  const [showImportModal, setShowImportModal] = useState(false);

  // Filtered List
  const filtered = pendudukList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.nik.includes(searchQuery) ||
                        p.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
    const matchRtRw = filterRtRw === 'Semua' || p.rtRw === filterRtRw;
    return matchSearch && matchStatus && matchRtRw;
  });

  // Toggle selection
  const handleToggleSelect = (nik: string) => {
    setSelectedNiks(prev => 
      prev.includes(nik) ? prev.filter(n => n !== nik) : [...prev, nik]
    );
  };

  const handleSelectAll = () => {
    if (selectedNiks.length === filtered.length) {
      setSelectedNiks([]);
    } else {
      setSelectedNiks(filtered.map(p => p.nik));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const dataToExport = selectedNiks.length > 0 
      ? pendudukList.filter(p => selectedNiks.includes(p.nik))
      : filtered;

    const headers = 'NIK,No KK,Nama Lengkap,RT/RW,Pekerjaan,Status Pernikahan,Status\n';
    const rows = dataToExport.map(p => `"${p.nik}","${p.noKk}","${p.nama}","${p.rtRw}","${p.pekerjaan}","${p.statusPernikahan}","${p.status}"`).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DATA_PENDUDUK_DESA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Ekspor Data Berhasil', `${dataToExport.length} data kependudukan telah diunduh.`);
  };

  // Submit Mutasi
  const handleSaveMutasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutasiNama.trim() || !mutasiNik.trim()) {
      toast.warning('Lengkapi Data', 'Nama dan NIK mutasi wajib diisi.');
      return;
    }

    const newRecord: MutasiRecord = {
      id: `mut-${Date.now()}`,
      jenis: mutasiType,
      nik: mutasiNik,
      nama: mutasiNama,
      tanggal: new Date().toISOString().slice(0, 10),
      petugas: 'Siti Aminah, S.IP',
      keterangan: mutasiKet || `Pencatatan mutasi ${mutasiType} warga desa.`
    };

    let updatedPenduduk: PendudukData;

    if (mutasiType === 'Lahir' || mutasiType === 'Pindah Masuk') {
      updatedPenduduk = {
        nik: mutasiNik,
        noKk: '3210091208050009',
        nama: mutasiNama,
        tempatLahir: 'Majalengka',
        tanggalLahir: new Date().toISOString().slice(0, 10),
        jenisKelamin: 'L',
        alamat: 'Blok Sukadana Girang RT 01/RW 05',
        rtRw: '01/05',
        pekerjaan: mutasiType === 'Lahir' ? 'Belum Bekerja' : 'Wiraswasta / Petani',
        agama: 'Islam',
        statusPernikahan: 'Belum Kawin',
        status: 'Aktif'
      };
      setPendudukList([updatedPenduduk, ...pendudukList]);
    } else {
      // Pindah keluar / Meninggal -> Update status
      setPendudukList(prev => prev.map(p => {
        if (p.nik === mutasiNik) {
          return { ...p, status: mutasiType === 'Meninggal' ? 'Meninggal' : 'Pindah' };
        }
        return p;
      }));
      updatedPenduduk = {
        nik: mutasiNik,
        noKk: '',
        nama: mutasiNama,
        tempatLahir: '',
        tanggalLahir: '',
        jenisKelamin: 'L',
        alamat: '',
        rtRw: '',
        pekerjaan: '',
        agama: '',
        statusPernikahan: 'Kawin',
        status: mutasiType === 'Meninggal' ? 'Meninggal' : 'Pindah'
      };
    }

    if (onMutasiCreated) {
      onMutasiCreated(newRecord, updatedPenduduk);
    }

    toast.success(`Mutasi ${mutasiType} Dicatat!`, `Data ${mutasiNama} berhasil diperbarui.`);
    setShowMutasiModal(false);
    setMutasiNama('');
    setMutasiNik('');
    setMutasiKet('');
  };

  return (
    <div className="animate-slide-up">
      {/* Master Top Actions */}
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
              Master Data Kependudukan Desa
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Database warga terverifikasi terhubung dengan pencatatan mutasi kependudukan harian.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowMutasiModal(true)}
              style={{ gap: '6px' }}
            >
              <UserPlus size={15} /> Catat Mutasi Warga
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowImportModal(true)}
              style={{ gap: '6px' }}
            >
              <Upload size={15} /> Impor CSV
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportCSV}
              style={{ gap: '6px' }}
            >
              <Download size={15} /> Ekspor Data ({selectedNiks.length > 0 ? selectedNiks.length : 'Semua'})
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Search input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            border: '1px solid var(--color-border)'
          }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Cari NIK, Nama, Alamat..."
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

          {/* Status filter */}
          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ minHeight: '38px', padding: '6px 12px', fontSize: '0.875rem' }}
          >
            <option value="Semua">Semua Status Warga</option>
            <option value="Aktif">Status: Aktif</option>
            <option value="Pindah">Status: Pindah Domisili</option>
            <option value="Meninggal">Status: Meninggal Dunia</option>
          </select>

          {/* RT/RW filter */}
          <select
            className="form-select"
            value={filterRtRw}
            onChange={e => setFilterRtRw(e.target.value)}
            style={{ minHeight: '38px', padding: '6px 12px', fontSize: '0.875rem' }}
          >
            <option value="Semua">Semua RT / RW (5 Blok)</option>
            <option value="03/05">RT 03 / RW 05 (Sukadana Girang)</option>
            <option value="01/05">RT 01 / RW 05 (Sukadana Girang)</option>
            <option value="02/01">RT 02 / RW 01 (Sukadana Hilir)</option>
            <option value="01/03">RT 01 / RW 03 (Blok Cikondang)</option>
            <option value="04/02">RT 04 / RW 02 (Blok Pasir Kaler)</option>
            <option value="03/01">RT 03 / RW 01 (Blok Mekarjaya)</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedNiks.length === filtered.length && filtered.length > 0}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </th>
              <th>NIK (16 Digit)</th>
              <th>Nama Lengkap</th>
              <th>RT / RW</th>
              <th>Pekerjaan</th>
              <th>Status Pernikahan</th>
              <th>Status Kependudukan</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const isSelected = selectedNiks.includes(p.nik);
              return (
                <tr key={p.nik} style={{ background: isSelected ? 'var(--color-brand-50)' : 'transparent' }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(p.nik)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: 'var(--color-brand-700)' }}>
                    {p.nik}
                  </td>
                  <td style={{ fontWeight: 700 }}>{p.nama}</td>
                  <td>RT {p.rtRw}</td>
                  <td>{p.pekerjaan}</td>
                  <td>{p.statusPernikahan}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: p.status === 'Aktif' ? 'var(--color-success-50)' : p.status === 'Pindah' ? 'var(--color-warning-50)' : 'var(--color-error-50)',
                      color: p.status === 'Aktif' ? 'var(--color-success-fg)' : p.status === 'Pindah' ? 'var(--color-warning-fg)' : 'var(--color-error-fg)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toast.info('Detail Warga', `${p.nama} - Alamat: ${p.alamat}`)}
                      style={{ padding: '6px' }}
                      title="Lihat profil detail"
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)'
      }}>
        <span>Menampilkan <strong>1 – {filtered.length}</strong> dari <strong>{pendudukList.length}</strong> data warga</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-secondary btn-sm" disabled>Sebelumnya</button>
          <button className="btn btn-primary btn-sm">1</button>
          <button className="btn btn-secondary btn-sm" disabled>Berikutnya</button>
        </div>
      </div>

      {/* MUTASI WIZARD MODAL */}
      {showMutasiModal && (
        <div className="modal-overlay" onClick={() => setShowMutasiModal(false)}>
          <div className="modal-content" style={{ maxWidth: '540px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Administrasi Kependudukan
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pencatatan Mutasi Warga</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowMutasiModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMutasi}>
              {/* Type Selection */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  <span>Jenis Mutasi:</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['Lahir', 'Menikah', 'Pindah Masuk', 'Pindah Keluar', 'Meninggal'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMutasiType(t)}
                      style={{
                        background: mutasiType === t ? 'var(--color-brand-50)' : 'var(--color-surface-raised)',
                        border: `1.5px solid ${mutasiType === t ? 'var(--color-brand-600)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '8px 4px',
                        fontSize: '0.75rem',
                        fontWeight: mutasiType === t ? 700 : 500,
                        color: mutasiType === t ? 'var(--color-brand-700)' : 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input NIK */}
              <div className="form-group">
                <label className="form-label" htmlFor="mutasi-nik">
                  <span>NIK Warga (16 Digit) *</span>
                </label>
                <input
                  id="mutasi-nik"
                  type="text"
                  maxLength={16}
                  className="form-input font-mono"
                  placeholder="321009..."
                  value={mutasiNik}
                  onChange={e => setMutasiNik(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              {/* Input Nama */}
              <div className="form-group">
                <label className="form-label" htmlFor="mutasi-nama">
                  <span>Nama Lengkap Warga *</span>
                </label>
                <input
                  id="mutasi-nama"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Arka Rafandra"
                  value={mutasiNama}
                  onChange={e => setMutasiNama(e.target.value)}
                  required
                />
              </div>

              {/* Keterangan */}
              <div className="form-group">
                <label className="form-label" htmlFor="mutasi-ket">
                  <span>Keterangan Tambahan</span>
                </label>
                <textarea
                  id="mutasi-ket"
                  rows={2}
                  className="form-textarea"
                  placeholder="Contoh: Kelahiran anak pertama pasangan Budi & Sri..."
                  value={mutasiKet}
                  onChange={e => setMutasiKet(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMutasiModal(false)}>
                  Batalkan
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Simpan & Update Demografi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Impor Massal Data Warga</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowImportModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Unggah file CSV dengan format standar kependudukan desa (NIK, No KK, Nama, RT/RW).
            </p>

            <div className="dropzone" onClick={() => {
              toast.success('File CSV Divalidasi', '14 data warga baru berhasil diimpor ke database.');
              setShowImportModal(false);
            }}>
              <Upload size={32} style={{ color: 'var(--color-brand-600)', margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Klik untuk Pilih File CSV</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Maksimal 500 baris per file CSV
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
