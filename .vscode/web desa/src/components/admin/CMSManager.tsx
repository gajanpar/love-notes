// src/components/admin/CMSManager.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  Link, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  Pin,
  Calendar,
  AlertCircle,
  Upload
} from 'lucide-react';
import { MOCK_BERITA } from '../../data/mockData';
import { BeritaItem } from '../../types';
import { useToast } from '../common/ToastContext';

export const CMSManager: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'content' | 'media'>('content');
  const [newsList, setNewsList] = useState<BeritaItem[]>(MOCK_BERITA);

  // Editor form
  const [tipe, setTipe] = useState<BeritaItem['tipe']>('Berita');
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Pemerintahan');
  const [ringkasan, setRingkasan] = useState('');
  const [konten, setKonten] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !konten.trim()) {
      toast.warning('Lengkapi Konten', 'Judul dan isi konten publikasi wajib diisi.');
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      const newItem: BeritaItem = {
        id: `news-${Date.now()}`,
        tipe,
        judul,
        slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        kategori,
        ringkasan: ringkasan || judul,
        konten: `<p>${konten}</p>`,
        gambar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
        penulis: 'Sekretariat Desa',
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        isPinned
      };

      setNewsList([newItem, ...newsList]);
      setJudul('');
      setRingkasan('');
      setKonten('');
      toast.success('Publikasi Berhasil!', `Konten "${newItem.judul}" telah terbit di portal publik.`);
    }, 400);
  };

  return (
    <div className="animate-slide-up">
      {/* Top Header & Tab Toggle */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            CMS Publikasi & Pengelolaan Media Desa
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Kelola rilis berita, jadwal agenda musyawarah, dan banner pengumuman darurat warga.
          </p>
        </div>

        <div style={{
          display: 'flex',
          background: 'var(--color-surface-raised)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <button
            onClick={() => setActiveTab('content')}
            style={{
              background: activeTab === 'content' ? 'var(--color-brand-600)' : 'transparent',
              color: activeTab === 'content' ? '#ffffff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'content' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            Editor Publikasi
          </button>
          <button
            onClick={() => setActiveTab('media')}
            style={{
              background: activeTab === 'media' ? 'var(--color-brand-600)' : 'transparent',
              color: activeTab === 'media' ? '#ffffff' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'media' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            Media Library (WebP)
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {/* EDITOR FORM */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '20px' }}>
              Buat Publikasi Baru
            </h4>

            <form onSubmit={handlePublish}>
              {/* Type Switcher */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  <span>Tipe Konten:</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['Berita', 'Pengumuman', 'Agenda'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipe(t)}
                      style={{
                        background: tipe === t ? 'var(--color-brand-50)' : 'var(--color-surface-raised)',
                        border: `1.5px solid ${tipe === t ? 'var(--color-brand-600)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '8px 4px',
                        fontSize: '0.75rem',
                        fontWeight: tipe === t ? 700 : 500,
                        color: tipe === t ? 'var(--color-brand-700)' : 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul */}
              <div className="form-group">
                <label className="form-label" htmlFor="cms-judul">
                  <span>Judul Konten *</span>
                </label>
                <input
                  id="cms-judul"
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Jadwal Penyaluran BLT Dana Desa Tahap 3"
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  required
                />
              </div>

              {/* Kategori */}
              <div className="form-group">
                <label className="form-label" htmlFor="cms-kategori">
                  <span>Kategori</span>
                </label>
                <select
                  id="cms-kategori"
                  className="form-select"
                  value={kategori}
                  onChange={e => setKategori(e.target.value)}
                >
                  <option value="Pemerintahan & Digitalisasi">Pemerintahan & Digitalisasi</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Sosial & Bantuan">Sosial & Bantuan</option>
                  <option value="Pendidikan">Pendidikan</option>
                </select>
              </div>

              {/* TipTap Toolbar Simulator */}
              <div className="form-group">
                <label className="form-label">
                  <span>Isi Konten Publikasi *</span>
                </label>
                <div style={{
                  background: 'var(--color-surface-raised)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  padding: '6px 10px',
                  display: 'flex',
                  gap: '4px',
                  borderBottom: 'none'
                }}>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '4px' }} title="Bold"><Bold size={14} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '4px' }} title="Italic"><Italic size={14} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '4px' }} title="Heading 1"><Heading1 size={14} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '4px' }} title="Heading 2"><Heading2 size={14} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '4px' }} title="Bullet List"><List size={14} /></button>
                </div>
                <textarea
                  rows={4}
                  className="form-textarea"
                  style={{ borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}
                  placeholder="Tuliskan isi berita atau teks pengumuman lengkap..."
                  value={konten}
                  onChange={e => setKonten(e.target.value)}
                  required
                />
              </div>

              {/* Pin to homepage checkbox */}
              <div style={{ marginBottom: '20px' }}>
                <label className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Sematkan (Pin) ke Banner Beranda Utama</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPublishing}
                style={{ width: '100%', fontWeight: 700 }}
              >
                {isPublishing ? 'Menerbitkan...' : 'Terbitkan Konten ke Portal Publik'}
              </button>
            </form>
          </div>

          {/* PUBLISHED CONTENT LIST */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '16px' }}>
              Daftar Publikasi Aktif ({newsList.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {newsList.map(item => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    padding: '18px',
                    background: 'var(--color-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      background: item.tipe === 'Berita' ? 'var(--color-brand-50)' : item.tipe === 'Pengumuman' ? 'var(--color-warning-50)' : 'var(--color-success-50)',
                      color: item.tipe === 'Berita' ? 'var(--color-brand-700)' : item.tipe === 'Pengumuman' ? 'var(--color-warning-fg)' : 'var(--color-success-fg)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {item.tipe} • {item.kategori}
                    </span>

                    {item.isPinned && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Pin size={12} /> Pinned
                      </span>
                    )}
                  </div>

                  <h5 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                    {item.judul}
                  </h5>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Oleh: {item.penulis} • {item.tanggal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* MEDIA GALLERY TAB */
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Media Library & Asset Manager</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Semua gambar dikonversi otomatis ke format WebP terkompresi hemat kuota.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => toast.success('Upload Media', 'File gambar berhasil dikonversi ke WebP.')}
              style={{ gap: '6px' }}
            >
              <Upload size={14} /> Upload Gambar
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { title: 'Peluncuran E-Gov.webp', size: '120 KB', src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&auto=format&fit=crop&q=80' },
              { title: 'Posyandu Melati.webp', size: '85 KB', src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80' },
              { title: 'Musrenbangdes.webp', size: '145 KB', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=80' },
              { title: 'Foto Balai Desa.webp', size: '190 KB', src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80' }
            ].map((media, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--color-surface-raised)'
                }}
              >
                <img
                  src={media.src}
                  alt={media.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{media.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{media.size} • WebP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
