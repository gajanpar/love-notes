// src/components/common/PrintableLetter.tsx
// Komponen PDF print profesional dengan kop surat resmi Desa Sukadana
// Bisa dikustomisasi oleh Sekretaris & Operator
import React, { useState, useRef } from 'react';
import { X, Printer, Download, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { PengajuanSurat } from '../../types';

interface PrintableLetterProps {
  pengajuan: PengajuanSurat;
  onClose: () => void;
}

interface LetterConfig {
  showWatermark: boolean;
  showQRCode: boolean;
  paperSize: 'A4' | 'F4';
  showKopSurat: boolean;
  customKepalaDesaName: string;
  customJabatan: string;
  showTtd: boolean;
  perihalTambahan: string;
}

// Format Rupiah
function formatRp(val: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

// Format tanggal
function formatTanggal(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  try {
    const d = new Date(dateStr.replace(/\//g, '-'));
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Label metadata yang lebih readable
function formatMetaKey(key: string): string {
  const labels: Record<string, string> = {
    namaUsaha: 'Nama Usaha',
    jenisUsaha: 'Jenis Usaha',
    alamatUsaha: 'Alamat Usaha',
    tahunBerdiri: 'Tahun Berdiri',
    omsetBulanan: 'Omset Per Bulan',
    keperluanSurat: 'Keperluan Surat',
    namaSiswa: 'Nama Siswa/Pemohon',
    sekolahTujuan: 'Sekolah / Institusi Tujuan',
    pekerjaanKepalaKeluarga: 'Pekerjaan Kepala Keluarga',
    penghasilanKeluarga: 'Penghasilan Keluarga',
    jumlahTanggungan: 'Jumlah Tanggungan',
    keperluanSpesifik: 'Keperluan Spesifik',
    keperluanSKCK: 'Keperluan SKCK',
    instansiTujuan: 'Instansi Tujuan',
    polsekTujuan: 'Polsek Tujuan',
    alamatTujuan: 'Alamat Tujuan Pindah',
    alasanPindah: 'Alasan Pindah',
    jenisKepindahan: 'Jenis Kepindahan',
    jumlahAnggotaPindah: 'Jumlah Anggota Pindah',
    nomorLetterC: 'Nomor Sertifikat / Letter C',
    luasTanah: 'Luas Tanah (m²)',
    lokasiTanah: 'Letak Tanah',
    batasUtara: 'Batas Utara', batasSelatan: 'Batas Selatan',
    batasTimur: 'Batas Timur', batasBarat: 'Batas Barat',
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function formatMetaValue(key: string, val: any): string {
  if (key === 'omsetBulanan' || key === 'penghasilanKeluarga') return formatRp(Number(val));
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

// Generate nomor surat otomatis
function generateNomor(pengajuan: PengajuanSurat): string {
  const kode: Record<string, string> = {
    SKU: '470', SKTM: '400', 'SKCK-PENGANTAR': '472', SKPWNI: '474', SKN: '471', SKTD: '592'
  };
  const bulan = new Date().getMonth() + 1;
  const tahun = new Date().getFullYear();
  return `${kode[pengajuan.jenisSurat] || '470'} / ${pengajuan.nomorTiket.replace('DESA-', '')} / ${pengajuan.jenisSurat} / ${bulan.toString().padStart(2, '0')} / ${tahun}`;
}

// Judul surat berdasarkan jenis
function getLetterTitle(jenisSurat: string): string {
  const titles: Record<string, string> = {
    SKU: 'SURAT KETERANGAN USAHA',
    SKTM: 'SURAT KETERANGAN TIDAK MAMPU',
    'SKCK-PENGANTAR': 'SURAT PENGANTAR KETERANGAN CATATAN KEPOLISIAN',
    SKPWNI: 'SURAT KETERANGAN PINDAH WARGA NEGARA INDONESIA',
    SKN: 'SURAT PENGANTAR NIKAH',
    SKTD: 'SURAT KETERANGAN TIDAK SENGKETA',
  };
  return titles[jenisSurat] || `SURAT KETERANGAN — ${jenisSurat}`;
}

export const PrintableLetter: React.FC<PrintableLetterProps> = ({ pengajuan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<LetterConfig>({
    showWatermark: true,
    showQRCode: true,
    paperSize: 'A4',
    showKopSurat: true,
    customKepalaDesaName: 'H. Asep Saepudin, S.Pd., M.Si',
    customJabatan: 'Kuwu / Kepala Desa Sukadana',
    showTtd: true,
    perihalTambahan: ''
  });

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const nomorSurat = generateNomor(pengajuan);
  const judulSurat = getLetterTitle(pengajuan.jenisSurat);

  const handlePrint = () => {
    window.print();
  };

  const updateConfig = (key: keyof LetterConfig, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', padding: '16px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Toolbar no-print */}
        <div className="no-print" style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.0625rem' }}>
              Pratinjau Dokumen Cetak
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
              {judulSurat} — {pengajuan.namaPemohon}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowConfig(!showConfig)}
              style={{ gap: '6px' }}
            >
              <Settings size={15} />
              Kustomisasi
              {showConfig ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <button
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ gap: '8px', fontWeight: 700 }}
            >
              <Printer size={17} /> Cetak Dokumen
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ padding: '8px', borderRadius: '50%' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div className="no-print" style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>
                Tampilan Dokumen
              </h4>
              {[
                { key: 'showKopSurat', label: 'Tampilkan Kop Surat' },
                { key: 'showWatermark', label: 'Tampilkan Watermark Resmi' },
                { key: 'showQRCode', label: 'Tampilkan QR Code Verifikasi' },
                { key: 'showTtd', label: 'Tampilkan Blok Tanda Tangan' },
              ].map(item => (
                <label key={item.key} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-sans)', fontSize: '0.875rem', cursor: 'pointer',
                  marginBottom: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={config[item.key as keyof LetterConfig] as boolean}
                    onChange={e => updateConfig(item.key as keyof LetterConfig, e.target.checked)}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>
                Data Penandatangan
              </h4>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nama Kepala Desa:</label>
                <input
                  className="form-input"
                  value={config.customKepalaDesaName}
                  onChange={e => updateConfig('customKepalaDesaName', e.target.value)}
                  style={{ fontFamily: 'var(--font-sans)', minHeight: '36px', padding: '6px 10px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Jabatan:</label>
                <input
                  className="form-input"
                  value={config.customJabatan}
                  onChange={e => updateConfig('customJabatan', e.target.value)}
                  style={{ fontFamily: 'var(--font-sans)', minHeight: '36px', padding: '6px 10px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Catatan Tambahan:</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={config.perihalTambahan}
                  onChange={e => updateConfig('perihalTambahan', e.target.value)}
                  placeholder="Keterangan tambahan (opsional)..."
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Print Document */}
        <div ref={printRef} className="print-page" style={{
          width: config.paperSize === 'A4' ? '210mm' : '215mm',
          minHeight: '297mm',
          padding: '20mm 22mm',
          background: '#ffffff',
          color: '#000000',
          fontFamily: "'Times New Roman', serif",
          fontSize: '12pt',
          lineHeight: '1.5',
          margin: '0 auto',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Watermark */}
          {config.showWatermark && pengajuan.signedAt && (
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-35deg)',
              fontSize: '28pt',
              fontWeight: 900,
              color: 'rgba(27, 143, 33, 0.06)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
              letterSpacing: '0.05em'
            }}>
              DOKUMEN RESMI — PEMDES SUKADANA
            </div>
          )}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Kop Surat */}
            {config.showKopSurat && (
              <div style={{ borderBottom: '3px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Logo kiri */}
                  <img
                    src="/logo-desa.jpg"
                    alt="Logo Pemdes Sukadana"
                    style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '11pt', marginBottom: '2px' }}>PEMERINTAH KABUPATEN MAJALENGKA</div>
                    <div style={{ fontSize: '12pt', marginBottom: '2px' }}>KECAMATAN ARGAPURA</div>
                    <div style={{ fontSize: '16pt', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '2px' }}>
                      PEMERINTAH DESA SUKADANA
                    </div>
                    <div style={{ fontSize: '9pt', color: '#444' }}>
                      Jl. Raya Sukadana – Argapura No. 01, Kec. Argapura, Kab. Majalengka, Jawa Barat 45462
                    </div>
                    <div style={{ fontSize: '9pt', color: '#444' }}>
                      Telp. +62 821-2345-6789 &nbsp;|&nbsp; Email: pelayanan@sukadana-argapura.desa.id
                    </div>
                  </div>
                  {/* Logo kanan (logo Kabupaten Majalengka bisa ditaruh di sini, gunakan placeholder) */}
                  <div style={{ width: '72px', height: '72px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7pt', textAlign: 'center', color: '#888', borderRadius: '4px' }}>
                    Logo<br />Kab.<br />Majalengka
                  </div>
                </div>
              </div>
            )}

            {/* Judul Surat */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '14pt', fontWeight: 900, textDecoration: 'underline', letterSpacing: '0.04em', marginBottom: '4px' }}>
                {judulSurat}
              </div>
              <div style={{ fontSize: '11pt' }}>
                Nomor: {nomorSurat}
              </div>
            </div>

            {/* Isi Surat */}
            <div style={{ textIndent: '40px', marginBottom: '12px', textAlign: 'justify' }}>
              Yang bertanda tangan di bawah ini, {config.customKepalaDesaName}, selaku {config.customJabatan} Sukadana,
              Kecamatan Argapura, Kabupaten Majalengka, dengan ini menerangkan dengan sebenarnya bahwa:
            </div>

            {/* Data Pemohon */}
            <table style={{ width: '100%', marginBottom: '14px', fontSize: '11.5pt', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Nama Lengkap', pengajuan.namaPemohon],
                  ['NIK', pengajuan.nikPemohon],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ width: '170px', paddingBottom: '4px', verticalAlign: 'top' }}>{label}</td>
                    <td style={{ width: '14px' }}>:</td>
                    <td style={{ paddingBottom: '4px' }}>{value}</td>
                  </tr>
                ))}
                {Object.entries(pengajuan.metadata).map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ width: '170px', paddingBottom: '4px', verticalAlign: 'top' }}>{formatMetaKey(key)}</td>
                    <td style={{ width: '14px' }}>:</td>
                    <td style={{ paddingBottom: '4px' }}>{formatMetaValue(key, val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paragraf keterangan */}
            <div style={{ textIndent: '40px', marginBottom: '10px', textAlign: 'justify' }}>
              adalah benar-benar penduduk yang tercatat aktif dan sah dalam database kependudukan Desa Sukadana,
              Kecamatan Argapura, Kabupaten Majalengka, Jawa Barat.
            </div>

            <div style={{ textIndent: '40px', marginBottom: '10px', textAlign: 'justify' }}>
              Surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya
              sesuai dengan keperluannya.
            </div>

            {config.perihalTambahan && (
              <div style={{ textIndent: '40px', marginBottom: '10px', textAlign: 'justify', fontStyle: 'italic' }}>
                Catatan: {config.perihalTambahan}
              </div>
            )}

            {/* Tanggal & TTE */}
            {config.showTtd && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '28px' }}>
                {/* QR Code */}
                {config.showQRCode && (
                  <div style={{ textAlign: 'center', fontSize: '8pt' }}>
                    <div style={{
                      width: '70px', height: '70px',
                      border: '1px solid #888',
                      borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#f9f9f9',
                      marginBottom: '4px',
                      fontSize: '7pt',
                      color: '#666',
                      textAlign: 'center',
                      lineHeight: 1.3
                    }}>
                      QR Code<br />BSrE<br />Verifikasi
                    </div>
                    <div>Scan verifikasi</div>
                    <div style={{ fontSize: '7pt', color: '#888' }}>bsre.bssn.go.id</div>
                  </div>
                )}

                {/* Tandatangan */}
                <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                  <div>Sukadana, {today}</div>
                  <div>{config.customJabatan},</div>

                  {pengajuan.signedAt ? (
                    <div style={{
                      margin: '8px 0',
                      padding: '6px 12px',
                      border: '1px solid #1b8f21',
                      borderRadius: '4px',
                      background: '#f0faf0',
                      fontSize: '9pt',
                      color: '#166b1a',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      [Ditandatangani Secara Elektronik]<br />
                      BSrE BSSN RI — {pengajuan.signedAt}
                    </div>
                  ) : (
                    <div style={{ height: '56px' }} />
                  )}

                  <div style={{ fontWeight: 700, textDecoration: 'underline' }}>{config.customKepalaDesaName}</div>
                  <div>{config.customJabatan}</div>
                </div>
              </div>
            )}

            {/* Footer legal */}
            <div style={{
              marginTop: '28px',
              borderTop: '1px solid #ccc',
              paddingTop: '8px',
              fontSize: '8pt',
              color: '#666',
              textAlign: 'center'
            }}>
              Dokumen ini diterbitkan secara elektronik oleh Sistem E-Government Desa Sukadana.
              Tanda tangan elektronik tersertifikasi oleh Balai Sertifikasi Elektronik (BSrE), BSSN RI.
              Dokumen sah secara hukum berdasarkan UU No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik.
              {pengajuan.qrHash && (
                <> | Kode Verifikasi: <span style={{ fontFamily: 'monospace' }}>{pengajuan.qrHash.slice(0, 24)}...</span></>
              )}
            </div>
          </div>
        </div>

        {/* Bottom spacer for print */}
        <div className="no-print" style={{ height: '32px' }} />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .modal-overlay {
            position: static !important;
            background: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          body * { visibility: hidden; }
          .print-page, .print-page * { visibility: visible; }
          .print-page {
            position: fixed;
            left: 0; top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
