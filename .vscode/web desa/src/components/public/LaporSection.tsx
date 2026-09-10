// src/components/public/LaporSection.tsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Send, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Trash2, 
  ShieldAlert, 
  HeartHandshake, 
  Landmark, 
  FileText,
  Sparkles,
  Navigation,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_LAPORAN } from '../../data/mockData';
import { LaporanWarga } from '../../types';
import { useToast } from '../common/ToastContext';

export const LaporSection: React.FC = () => {
  const toast = useToast();
  const [laporanList, setLaporanList] = useState<LaporanWarga[]>(MOCK_LAPORAN);

  // Form State
  const [kategori, setKategori] = useState<LaporanWarga['kategori']>('Infrastruktur');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasiDeskripsi, setLokasiDeskripsi] = useState('Blok Cikondang, RT 02 / RW 03');
  const [pelapor, setPelapor] = useState('Asep Supriatna');
  const [isAnonim, setIsAnonim] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'Infrastruktur', icon: <AlertTriangle size={18} />, desc: 'Jalan rusak, jembatan, saluran mampet, lampu padam' },
    { name: 'Kebersihan', icon: <Trash2 size={18} />, desc: 'Sampah liar, got tersumbat, limbah lingkungan' },
    { name: 'Keamanan', icon: <ShieldAlert size={18} />, desc: 'Pencurian, gangguan kamtibmas, pos ronda' },
    { name: 'Sosial', icon: <HeartHandshake size={18} />, desc: 'Warga kurang mampu butuh bantuan, musibah' },
    { name: 'Pelayanan', icon: <Landmark size={18} />, desc: 'Komplain pelayanan kantor desa / loket' },
    { name: 'Lainnya', icon: <FileText size={18} />, desc: 'Masalah lingkungan lainnya' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim()) {
      toast.warning('Form Belum Lengkap', 'Judul dan deskripsi aduan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketNo = `LAPOR-2026-08-00${Math.floor(50 + Math.random() * 50)}`;

      const newReport: LaporanWarga = {
        id: `lap-${Date.now()}`,
        nomorTiket: ticketNo,
        kategori,
        judul,
        deskripsi,
        lokasi: {
          lat: -6.8985,
          lng: 108.3150,
          alamatDeskriptif: lokasiDeskripsi
        },
        fotoUrl: fotoPreview || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
        pelapor: isAnonim ? 'Warga Anonim' : pelapor,
        isAnonim,
        status: 'Menunggu',
        createdAt: 'Baru saja',
        slaDeadline: '2x24 Jam dari sekarang'
      };

      setLaporanList([newReport, ...laporanList]);
      setJudul('');
      setDeskripsi('');
      setFotoPreview(null);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      toast.success('Laporan Diterima!', `Nomor Tiket Aduan Anda: ${ticketNo}`);
    }, 400);
  };

  return (
    <section id="lapor" style={{ padding: '64px 0', background: 'var(--color-surface-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span style={{
            background: 'var(--color-warning-50)',
            color: 'var(--color-warning-fg)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Kanal Pengaduan & Aspirasi Warga
          </span>
          <h2 className="text-title" style={{ marginBottom: '12px' }}>
            Lapor Masalah Desa (SLA Respons 2×24 Jam)
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Laporkan jalan rusak, lampu mati, tumpukan sampah, atau keluhan pelayanan secara cepat dengan bukti foto dan lokasi GPS.
          </p>
        </div>

        {/* 2-Column Split: Left Form, Right Public Feed */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '32px'
        }}>
          {/* LEFT: COMPLAINT FORM (Rounded Box) */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '26px',
            border: '1px solid var(--color-border)',
            padding: '32px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }}>
              Formulir Pengaduan Warga
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Semua laporan ditangani langsung oleh perangkat desa terkait.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Category Picker */}
              <div className="form-group">
                <label className="form-label">
                  <span>Pilih Kategori Masalah *</span>
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '4px'
                }}>
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setKategori(cat.name as any)}
                      style={{
                        background: kategori === cat.name ? 'var(--color-brand-50)' : 'var(--color-surface-raised)',
                        border: `1.5px solid ${kategori === cat.name ? 'var(--color-brand-600)' : 'var(--color-border)'}`,
                        borderRadius: '16px',
                        padding: '12px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: kategori === cat.name ? 700 : 500,
                        color: kategori === cat.name ? 'var(--color-brand-700)' : 'var(--color-text-primary)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ color: kategori === cat.name ? 'var(--color-brand-primary)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                        {cat.icon}
                      </span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="lapor-judul">
                  <span>Judul Laporan *</span>
                </label>
                <input
                  id="lapor-judul"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Lampu Jalan Padam di Pertigaan RW 05"
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="lapor-deskripsi">
                  <span>Deskripsi Masalah Lengkap *</span>
                </label>
                <textarea
                  id="lapor-deskripsi"
                  rows={3}
                  className="form-textarea"
                  placeholder="Ceritakan detail permasalahan, patokan lokasi, atau dampaknya terhadap warga..."
                  value={deskripsi}
                  onChange={e => setDeskripsi(e.target.value)}
                  required
                />
              </div>

              {/* Location Input & Geotag simulator */}
              <div className="form-group">
                <label className="form-label" htmlFor="lapor-lokasi">
                  <span>Lokasi Masalah *</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="lapor-lokasi"
                    type="text"
                    className="form-input"
                    value={lokasiDeskripsi}
                    onChange={e => setLokasiDeskripsi(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      toast.info('GPS Aktif', 'Koordinat GPS perangkat Anda berhasil disematkan (-6.8985, 108.3150)');
                    }}
                    style={{ whiteSpace: 'nowrap', gap: '4px' }}
                  >
                    <Navigation size={14} /> Deteksi GPS
                  </button>
                </div>
              </div>

              {/* Photo Upload Simulator */}
              <div className="form-group">
                <label className="form-label">
                  <span>Foto Bukti Lapangan (Maks. 10MB)</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setFotoPreview('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80');
                      toast.success('Foto Terunggah', 'Foto bukti berhasil dikompresi (450 KB)');
                    }}
                    style={{ gap: '6px' }}
                  >
                    <Camera size={15} /> Ambil / Upload Foto
                  </button>
                  {fotoPreview && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Foto Terlampir (450 KB)
                    </span>
                  )}
                </div>
              </div>

              {/* Anonymous checkbox */}
              <div style={{ marginBottom: '24px' }}>
                <label className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={isAnonim}
                    onChange={e => setIsAnonim(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>
                    <strong>Laporkan Secara Anonim:</strong> Nama Anda tidak akan ditampilkan kepada publik di feed aduan.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  fontWeight: 800,
                  gap: '8px',
                  borderRadius: 'var(--radius-full)',
                  padding: '14px 28px',
                  boxShadow: '0 4px 16px rgba(26, 144, 32, 0.25)'
                }}
              >
                <Send size={18} /> {isSubmitting ? 'Mengirim Aduan...' : 'Kirim Laporan Pengaduan'}
              </button>
            </form>
          </div>

          {/* RIGHT: PUBLIC COMPLAINTS FEED */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }}>
                Feed Pengaduan Warga Publik
              </h3>
              <span style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {laporanList.length} Laporan Terpantau
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {laporanList.map(item => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '22px',
                    background: 'var(--color-surface)',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    borderLeft: `5px solid ${
                      item.status === 'Selesai' ? 'var(--color-success-500)' :
                      item.status === 'Diproses' ? 'var(--color-warning-500)' : 'var(--color-brand-500)'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-600)'
                    }}>
                      #{item.nomorTiket}
                    </span>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: item.status === 'Selesai' ? 'var(--color-success-50)' : 'var(--color-warning-50)',
                      color: item.status === 'Selesai' ? 'var(--color-success-fg)' : 'var(--color-warning-fg)'
                    }}>
                      {item.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '6px' }}>
                    {item.judul}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {item.deskripsi}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '10px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {item.lokasi.alamatDeskriptif}
                    </span>
                    <span>Pelapor: {item.pelapor}</span>
                  </div>

                  {item.tanggapan && (
                    <div style={{
                      marginTop: '10px',
                      background: 'var(--color-surface-raised)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-primary)',
                      borderLeft: '3px solid var(--color-brand-500)'
                    }}>
                      <strong>Tanggapan Petugas:</strong> {item.tanggapan}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
