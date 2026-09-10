// src/components/common/SearchModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileText,
  MapPin,
  PieChart,
  Users,
  MessageSquare,
  ArrowRight,
  X,
  Sparkles,
  CloudSun,
  Scale,
  Newspaper,
  CornerDownLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { SURAT_CONFIGS } from '../../data/mockData';
import { SuratType } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  onSelectService: (code: SuratType) => void;
  onNavigateSection: (sectionId: string) => void;
  onViewChange: (view: 'public' | 'admin') => void;
}

interface SearchableItem {
  id: string;
  title: string;
  category: 'surat' | 'transparansi' | 'regulasi' | 'profil' | 'lapor' | 'informasi';
  categoryLabel: string;
  description: string;
  keywords: string[];
  sla?: string;
  code?: SuratType;
  targetSection: string;
  icon: React.ReactNode;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onNavigateSection,
  onViewChange
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Master Search Index with rich colloquial synonyms and semantic keywords
  const searchIndex: SearchableItem[] = useMemo(() => [
    // 1. SKU
    {
      id: 'surat-sku',
      title: 'Surat Keterangan Usaha (SKU)',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Pengantar izin usaha mikro, pengajuan KUR & kredit modal bank, legalitas toko / warung.',
      keywords: [
        'usaha', 'warung', 'toko', 'dagang', 'kredit', 'bank', 'kur', 'modal',
        'pinjaman', 'buka usaha', 'bikin warung', 'izin', 'umkm', 'dagangan', 'jualan',
        'tani', 'kios', 'lapak', 'sku'
      ],
      sla: '1 Hari',
      code: 'SKU',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 2. SKTM
    {
      id: 'surat-sktm',
      title: 'Surat Keterangan Tidak Mampu (SKTM)',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Permohonan beasiswa kuliah / sekolah, keringanan biaya rawat inap RS, pendaftaran KIP & DTKS.',
      keywords: [
        'tidak mampu', 'kurang mampu', 'miskin', 'beasiswa', 'bantuan', 'kip', 'pkh',
        'keringanan', 'rumah sakit', 'rs', 'biaya', 'kuliah', 'sekolah', 'bansos',
        'dtks', 'sktm', 'bantuan sosial', 'bpjs pbi', 'ga punya uang'
      ],
      sla: '2 Hari',
      code: 'SKTM',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 3. SKCK
    {
      id: 'surat-skck',
      title: 'Surat Pengantar SKCK Polsek',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Pengantar permohonan SKCK kepolisian untuk melamar pekerjaan BUMN, swasta, dan CPNS.',
      keywords: [
        'skck', 'polisi', 'polsek', 'kelakuan baik', 'kerja', 'lamar kerja', 'lowongan',
        'cpns', 'bumn', 'pabrik', 'pekerjaan', 'pt', 'lamaran', 'kriminal', 'catatan'
      ],
      sla: '1 Hari',
      code: 'SKCK-PENGANTAR',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 4. SKPWNI
    {
      id: 'surat-skpwni',
      title: 'Surat Keterangan Pindah WNI (SKPWNI)',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Surat jalan pindah domisili antar desa, kecamatan, kabupaten maupun provinsi resmi Disdukcapil.',
      keywords: [
        'pindah', 'domisili', 'skpwni', 'alamat baru', 'merantau', 'luar kota',
        'ganti ktp', 'ganti kk', 'pindah rumah', 'antar daerah', 'antar provinsi', 'pindah alamat'
      ],
      sla: '2 Hari',
      code: 'SKPWNI',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 5. SKN
    {
      id: 'surat-skn',
      title: 'Surat Pengantar Nikah (Model N1 - N4)',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Dokumen pengantar pendaftaran pernikahan ke Kantor Urusan Agama (KUA) / Catatan Sipil.',
      keywords: [
        'nikah', 'kawin', 'kua', 'pengantin', 'pernikahan', 'calon istri', 'calon suami',
        'ijab kabul', 'akad', 'n1', 'n2', 'n4', 'surat nikah', 'pendaftaran nikah'
      ],
      sla: '2 Hari',
      code: 'SKN',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 6. SKTD
    {
      id: 'surat-sktd',
      title: 'Surat Keterangan Tanah Tidak Sengketa (SKTD)',
      category: 'surat',
      categoryLabel: 'Layanan Surat',
      description: 'Keterangan kepemilikan dan status tanah bebas sengketa untuk pengurusan sertifikasi PTSL / BPN.',
      keywords: [
        'tanah', 'sengketa', 'tidak sengketa', 'sktd', 'ptsl', 'bpn', 'sertifikat',
        'jual beli tanah', 'warisan', 'hibah', 'girik', 'ajb', 'lahan', 'kebun', 'sawah'
      ],
      sla: '3 Hari',
      code: 'SKTD',
      targetSection: 'layanan',
      icon: <FileText size={18} />
    },
    // 7. APBDes
    {
      id: 'transparansi-apbdes',
      title: 'Transparansi Realisasi APBDes 2026',
      category: 'transparansi',
      categoryLabel: 'Transparansi',
      description: 'Laporan rinci penerimaan Dana Desa, Pendapatan Asli Desa, serta alokasi belanja infrastruktur Rp 1,84 M.',
      keywords: [
        'apbdes', 'dana desa', 'anggaran', 'uang', 'keuangan', 'pendapatan', 'belanja',
        'silpa', 'transparansi', 'biaya desa', 'laporan keuangan', 'pemberdayaan', 'grafik anggaran'
      ],
      targetSection: 'transparansi',
      icon: <PieChart size={18} />
    },
    // 8. Perdes
    {
      id: 'regulasi-perdes',
      title: 'Katalog Produk Hukum & Peraturan Desa (Perdes)',
      category: 'regulasi',
      categoryLabel: 'Regulasi',
      description: 'Regulasi resmi Desa Sukadana: ketahanan pangan bawang, retribusi, tata kelola lingkungan dan BPD.',
      keywords: [
        'perdes', 'peraturan', 'hukum', 'aturan', 'kebijakan', 'undang undang', 'sk kades',
        'peraturan desa', 'bpd', 'peraturan desa sukadana', 'regulasi'
      ],
      targetSection: 'transparansi',
      icon: <Scale size={18} />
    },
    // 9. Profil Desa & Pamong
    {
      id: 'profil-desa',
      title: 'Profil Wilayah & Struktur Perangkat Desa',
      category: 'profil',
      categoryLabel: 'Pemerintahan',
      description: 'Struktur organisasi Kuwu Sukadana, pamong desa, data demografi 3.842 jiwa, dan peta fasilitas terpadu.',
      keywords: [
        'profil', 'kuwu', 'kepala desa', 'sekdes', 'pamong', 'perangkat desa', 'aparatur',
        'visi misi', 'sejarah', 'asal usul', 'peta', 'geospasial', 'wilayah', 'rt', 'rw', 'dusun'
      ],
      targetSection: 'profil',
      icon: <Users size={18} />
    },
    // 10. Lapor Pengaduan Warga
    {
      id: 'lapor-warga',
      title: 'Saluran Aspirasi & Lapor Pengaduan Warga',
      category: 'lapor',
      categoryLabel: 'Aspirasi',
      description: 'Sampaikan aduan jalan rusak, lampu PJU padam, saluran irigasi mampet, atau bansos langsung ke perangkat.',
      keywords: [
        'lapor', 'aduan', 'pengaduan', 'keluhan', 'jalan rusak', 'jalan bolong', 'lampu mati',
        'pju', 'irigasi', 'sampah', 'masalah', 'saran', 'aspirasi', 'lapor kuwu'
      ],
      targetSection: 'lapor',
      icon: <MessageSquare size={18} />
    },
    // 11. Cuaca & Tani
    {
      id: 'cuaca-pertanian',
      title: 'Pantauan Cuaca Mikro & Kalender Tani Sukadana',
      category: 'informasi',
      categoryLabel: 'Informasi Desa',
      description: 'Data cuaca real-time di kaki Gunung Ciremai: suhu 21°C, kelembapan, dan rekomendasi pemupukan bawang daun.',
      keywords: [
        'cuaca', 'hujan', 'suhu', 'pertanian', 'tani', 'bawang', 'panen', 'musim tanam',
        'kelembaban', 'angin', 'ciremai', 'prediksi cuaca'
      ],
      targetSection: 'beranda',
      icon: <CloudSun size={18} />
    },
    // 12. Warta Berita
    {
      id: 'warta-berita',
      title: 'Kabar & Warta Terkini Desa Sukadana',
      category: 'informasi',
      categoryLabel: 'Informasi Desa',
      description: 'Pemberitaan kegiatan posyandu, panen raya bawang daun, pembangunan jalan lingkungan, dan inovasi digital.',
      keywords: [
        'berita', 'kabar', 'warta', 'artikel', 'posyandu', 'kegiatan', 'gotong royong',
        'festival', 'panen raya', 'bawang daun'
      ],
      targetSection: 'beranda',
      icon: <Newspaper size={18} />
    }
  ], []);

  // Search Engine with Semantic & Proximity Scoring
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return searchIndex;

    const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);

    const scored = searchIndex.map(item => {
      let score = 0;
      let matchedKeyword = '';

      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();

      // 1. Exact query match in title
      if (titleLower.includes(cleanQuery)) {
        score += 120;
      }

      // 2. Exact query match in description
      if (descLower.includes(cleanQuery)) {
        score += 60;
      }

      // 3. Keyword / Synonym token matching
      queryTokens.forEach(token => {
        if (titleLower.includes(token)) score += 35;
        if (descLower.includes(token)) score += 15;

        // Check against semantic synonyms
        item.keywords.forEach(kw => {
          if (kw === token) {
            score += 50;
            if (!matchedKeyword) matchedKeyword = kw;
          } else if (kw.includes(token) || token.includes(kw)) {
            score += 30;
            if (!matchedKeyword) matchedKeyword = kw;
          }
        });
      });

      return {
        item,
        score,
        matchedKeyword
      };
    });

    // Filter items with score > 0 and sort descending
    return scored
      .filter(res => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(res => ({ ...res.item, matchReason: res.matchedKeyword }));
  }, [query, searchIndex]);

  // Filter by category tab
  const filteredResults = useMemo(() => {
    if (activeCategory === 'Semua') return searchResults;
    if (activeCategory === 'Layanan Surat') return searchResults.filter(r => r.category === 'surat');
    if (activeCategory === 'Transparansi & Hukum') return searchResults.filter(r => r.category === 'transparansi' || r.category === 'regulasi');
    if (activeCategory === 'Informasi & Profil') return searchResults.filter(r => r.category === 'profil' || r.category === 'informasi');
    if (activeCategory === 'Aspirasi') return searchResults.filter(r => r.category === 'lapor');
    return searchResults;
  }, [searchResults, activeCategory]);

  if (!isOpen) return null;

  const handleSelectItem = (item: SearchableItem) => {
    if (item.category === 'surat' && item.code) {
      onSelectService(item.code);
      onNavigateSection('layanan');
    } else {
      onNavigateSection(item.targetSection);
    }
    onClose();
  };

  const categories = [
    'Semua',
    'Layanan Surat',
    'Transparansi & Hukum',
    'Informasi & Profil',
    'Aspirasi'
  ];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 9999,
        background: 'rgba(15, 23, 15, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="modal-content animate-slide-up"
        style={{
          maxWidth: '680px',
          padding: '0',
          overflow: 'hidden',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(207, 162, 61, 0.3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-raised)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(26, 144, 32, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-brand-600)',
            flexShrink: 0
          }}>
            <Search size={20} />
          </div>

          <input
            type="text"
            placeholder="Ketik kebutuhan Anda (misal: bikin toko, beasiswa, jalan rusak, uang desa)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              background: 'transparent',
              color: 'var(--color-text-primary)'
            }}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Hapus ketikan"
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--color-text-muted)'
            }}
            title="Tutup (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 20px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          overflowX: 'auto'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--color-brand-600)' : 'var(--color-surface-raised)',
                color: activeCategory === cat ? '#ffffff' : 'var(--color-text-secondary)',
                border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--color-brand-600)' : 'var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Body */}
        <div style={{
          maxHeight: '430px',
          overflowY: 'auto',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {filteredResults.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--color-text-muted)'
            }}>
              <Sparkles size={36} style={{ color: 'var(--color-gold-400)', marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                Pencarian "{query}" tidak ditemukan
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '8px', maxWidth: '420px', margin: '8px auto 16px', color: 'var(--color-text-secondary)' }}>
                Kata kunci tidak cocok dengan layanan desa. Coba gunakan istilah umum, atau langsung hubungi Admin jika Anda butuh panduan khusus.
              </p>
              <button
                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                style={{
                  background: 'var(--color-brand-600)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Hubungi Admin di WhatsApp
              </button>
              <div style={{ fontSize: '0.8125rem', marginBottom: '8px', fontWeight: 600 }}>Atau coba kata kunci umum ini:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {['bikin usaha', 'beasiswa', 'nikah', 'pindah', 'jalan rusak', 'apbdes'].map(hint => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    style={{
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      color: 'var(--color-brand-700)',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    "{hint}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: idx === 0 && query ? 'var(--color-surface-raised)' : 'var(--color-surface)',
                  border: '1px solid',
                  borderColor: idx === 0 && query ? 'var(--color-brand-300)' : 'var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-500)';
                  e.currentTarget.style.background = 'var(--color-surface-raised)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = idx === 0 && query ? 'var(--color-brand-300)' : 'var(--color-border)';
                  e.currentTarget.style.background = idx === 0 && query ? 'var(--color-surface-raised)' : 'var(--color-surface)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: item.category === 'surat' ? 'rgba(26, 144, 32, 0.12)' : 'rgba(207, 162, 61, 0.14)',
                    color: item.category === 'surat' ? 'var(--color-brand-600)' : 'var(--color-gold-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: 'var(--color-text-primary)'
                      }}>
                        {item.title}
                      </span>
                      {item.code && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          background: 'var(--color-brand-50)',
                          color: 'var(--color-brand-700)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-brand-200)'
                        }}>
                          {item.code}
                        </span>
                      )}
                      {item.sla && (
                        <span style={{
                          fontSize: '0.6875rem',
                          color: 'var(--color-success-fg)',
                          background: 'var(--color-success-50)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Clock size={10} /> SLA {item.sla}
                        </span>
                      )}
                    </div>

                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.35,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.description}
                    </div>

                    {/* Proximity / Match reason badge */}
                    {(item as any).matchReason && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.6875rem',
                        color: 'var(--color-brand-600)',
                        marginTop: '4px',
                        fontWeight: 600
                      }}>
                        <Tag size={10} /> Cocok dengan: "{(item as any).matchReason}"
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-brand-600)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  <span style={{ display: 'none' }} className="search-cta-desktop">Buka</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--color-surface-raised)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><kbd style={{ background: 'var(--color-surface)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Enter</kbd> untuk memilih</span>
            <span><kbd style={{ background: 'var(--color-surface)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>ESC</kbd> tutup</span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--color-brand-700)' }}>
            Pencarian Cerdas &bull; Pemdes Sukadana
          </span>
        </div>
      </div>
    </div>
  );
};
