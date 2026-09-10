// src/components/public/ArticlesSection.tsx
import React, { useState, useRef } from 'react';
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Pin,
  User,
  ArrowLeft,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { BeritaItem } from '../../types';
import { MOCK_BERITA } from '../../data/mockData';
import { useToast } from '../common/ToastContext';

interface ArticlesSectionProps {
  articles?: BeritaItem[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles = MOCK_BERITA
}) => {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'populer' | 'az' | 'za'>('terbaru');
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large'>('normal');

  const readerRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    'Semua',
    'Pertanian & Agrowisata',
    'Pemerintahan & Digital',
    'Pembangunan',
    'Infrastruktur',
    'Kesehatan Warga',
    'Kepemudaan & Wisata'
  ];

  const filteredArticles = articles.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'terbaru') {
      return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
    }
    if (sortBy === 'terlama') {
      return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
    }
    if (sortBy === 'populer') {
      return (b.views || 0) - (a.views || 0);
    }
    if (sortBy === 'az') {
      return a.judul.localeCompare(b.judul, 'id');
    }
    if (sortBy === 'za') {
      return b.judul.localeCompare(a.judul, 'id');
    }
    return 0;
  });

  const handleOpenArticle = (article: BeritaItem) => {
    setActiveArticle(article);
    setTimeout(() => {
      if (readerRef.current) {
        readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
  };

  const handleShare = (article: BeritaItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan Tersalin!', `Link artikel "${article.judul}" berhasil disalin.`);
    } else {
      toast.info('Bagikan Warta', article.judul);
    }
  };

  const featuredArticle = articles[0];

  return (
    <section id="artikel-section" style={{ padding: '48px 0 64px 0' }} ref={readerRef}>
      <div className="container">
        {/* ========================================================================= */}
        {/* MODE BACA SEAMLESS (DEDICATED READING SEGMENT) */}
        {/* ========================================================================= */}
        {activeArticle ? (
          <div
            className="seamless-article-reader"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '28px',
              padding: 'clamp(24px, 4vw, 44px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
              maxWidth: '960px',
              margin: '0 auto',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Reader Top Action Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '28px'
            }}>
              <button
                onClick={handleCloseArticle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <ArrowLeft size={16} />
                <span>Kembali ke Direktori Warta</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Font Size Adjuster Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 4px'
                }}>
                  <button
                    onClick={() => setFontSizeMode('normal')}
                    style={{
                      border: 'none',
                      background: fontSizeMode === 'normal' ? 'var(--color-surface)' : 'transparent',
                      color: fontSizeMode === 'normal' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                    title="Ukuran Huruf Normal"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeMode('large')}
                    style={{
                      border: 'none',
                      background: fontSizeMode === 'large' ? 'var(--color-surface)' : 'transparent',
                      color: fontSizeMode === 'large' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 800
                    }}
                    title="Ukuran Huruf Lebih Besar (Nyaman Dibaca)"
                  >
                    A+
                  </button>
                </div>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-brand-100)',
                  color: 'var(--color-brand-800)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  <Tag size={12} />
                  {activeArticle.kategori}
                </span>

                <button
                  onClick={() => handleShare(activeArticle)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-raised)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={14} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Article Headline Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                flexWrap: 'wrap'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} color="var(--color-brand-primary)" />
                  {activeArticle.tanggal}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} color="var(--color-brand-primary)" />
                  3 Menit Membaca
                </span>
                {activeArticle.views && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Eye size={14} />
                    {activeArticle.views.toLocaleString('id-ID')} Pembaca Terdaftar
                  </span>
                )}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.25,
                margin: '0 0 16px 0',
                letterSpacing: '-0.02em'
              }}>
                {activeArticle.judul}
              </h1>

              {/* Author & Verification Shield */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '16px',
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a9020 0%, #cfa23d 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {activeArticle.penulis.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      {activeArticle.penulis}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-primary)',
                      background: 'rgba(26, 144, 32, 0.1)',
                      padding: '1px 7px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      <ShieldCheck size={12} /> Redaksi Resmi Sukadana
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Pemerintah Desa Sukadana, Kecamatan Argapura
                  </div>
                </div>
              </div>
            </div>

            {/* Large Cover Image with Rounded Box */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '28px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
            }}>
              <img
                src={activeArticle.gambar}
                alt={activeArticle.judul}
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            {/* Structured Editorial Body */}
            <div style={{
              fontSize: fontSizeMode === 'large' ? '1.18rem' : '1.03rem',
              lineHeight: 1.85,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
              maxWidth: '820px',
              margin: '0 auto'
            }}>
              {/* Lead Paragraph */}
              <p style={{
                fontSize: fontSizeMode === 'large' ? '1.25rem' : '1.125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1.75,
                marginBottom: '20px',
                borderLeft: '4px solid var(--color-brand-primary)',
                paddingLeft: '16px'
              }}>
                {activeArticle.ringkasan}
              </p>

              <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
                Desa Sukadana terus mengukuhkan langkah sebagai lumbung pangan hortikultura dan agrowisata unggulan di Kabupaten Majalengka. Melalui koordinasi terstruktur antara Badan Permusyawaratan Desa (BPD), kelompok tani gabungan, serta dukungan kelembagaan dinas terkait, seluruh program dipastikan terintegrasi dengan rencana kerja pembangunan desa tahun anggaran berjalan.
              </p>

              {/* Editorial Callout Quote Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.08) 0%, rgba(207, 162, 61, 0.08) 100%)',
                border: '1px solid rgba(26, 144, 32, 0.25)',
                borderLeft: '5px solid var(--color-brand-primary)',
                borderRadius: '16px',
                padding: '20px 24px',
                margin: '28px 0',
                fontStyle: 'italic'
              }}>
                <div style={{ fontSize: '1.08rem', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.6, marginBottom: '8px' }}>
                  "Kesejahteraan warga dimulai dari keterbukaan informasi, kepastian sarana pertanian terpadu, dan pelayanan publik yang tidak membebani masyarakat."
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-brand-primary)', fontStyle: 'normal', fontWeight: 800 }}>
                  &mdash; Pernyataan Resmi Kepala Desa Sukadana
                </div>
              </div>

              <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
                {activeArticle.konten || 'Pemerintah desa terus mendorong sinergi aktif seluruh elemen masyarakat dalam menjaga transparansi tata kelola dana desa, pemeliharaan infrastruktur umum secara berkala, dan partisipasi gotong royong lintas RT/RW.'}
              </p>

              {/* Verification Stamp */}
              <div style={{
                marginTop: '36px',
                padding: '16px 20px',
                background: 'var(--color-surface-raised)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldCheck size={24} color="var(--color-brand-primary)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <strong>Dokumen Publikasi Resmi:</strong> Artikel ini telah melalui kurasi data dan verifikasi oleh Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pemerintah Desa Sukadana.
                </div>
              </div>
            </div>

            {/* Seamless Next Read Recommendations */}
            <div style={{
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '1px solid var(--color-border)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                letterSpacing: '-0.01em'
              }}>
                Warta Pilihan Lainnya
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '16px'
              }}>
                {articles.filter(a => a.id !== activeArticle.id).slice(0, 2).map(nextArt => (
                  <div
                    key={nextArt.id}
                    onClick={() => handleOpenArticle(nextArt)}
                    style={{
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '18px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img
                      src={nextArt.gambar}
                      alt={nextArt.judul}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                        {nextArt.kategori}
                      </span>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        margin: '4px 0',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.3
                      }}>
                        {nextArt.judul}
                      </h4>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Lanjut Membaca <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE DIREKTORI WARTA (PUBLIC DIRECTORY VIEW) */
          /* ========================================================================= */
          <>
            {/* Header Section dengan Subtitle yang Lebih Menyeluruh */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{ maxWidth: '780px' }}>
                <div className="section-label" style={{ marginBottom: '8px' }}>
                  Warta &amp; Informasi Warga
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em'
                }}>
                  Kabar Terkini Desa Sukadana
                </h2>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                  lineHeight: 1.68,
                  fontWeight: 500,
                  maxWidth: '68ch'
                }}>
                  Kanal publikasi resmi Pemerintah Desa Sukadana menghadirkan warta terverifikasi seputar ketahanan pangan agrowisata bawang daun lereng Ciremai, transparansi progres pembangunan infrastruktur fisik perdesaan, agenda kemasyarakatan, serta inovasi tata kelola layanan birokrasi digital terpadu.
                </p>
              </div>

              {/* Controls: Search + Sort Dropdown */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {/* Search Box */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  minWidth: '220px',
                  maxWidth: '280px'
                }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cari warta atau topik..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  />
                </div>

                {/* Sort Dropdown (Semua Emoticon Dihilangkan Total) */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <option value="terbaru">Tanggal Terbaru</option>
                  <option value="terlama">Tanggal Terlama</option>
                  <option value="populer">Paling Populer (Views)</option>
                  <option value="az">Judul (A - Z)</option>
                  <option value="za">Judul (Z - A)</option>
                </select>
              </div>
            </div>

            {/* Warta Sorotan Utama (Headline Article Card) */}
            {selectedCategory === 'Semua' && !searchQuery && featuredArticle && (
              <div
                onClick={() => handleOpenArticle(featuredArticle)}
                style={{
                  background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-raised) 100%)',
                  borderRadius: '26px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                  gap: '24px',
                  overflow: 'hidden',
                  marginBottom: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ position: 'relative', minHeight: '260px' }}>
                  <img
                    src={featuredArticle.gambar}
                    alt={featuredArticle.judul}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--color-brand-primary)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    WARTA SOROTAN UTAMA
                  </div>
                </div>

                <div style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>
                        {featuredArticle.kategori}
                      </span>
                      <span>&bull;</span>
                      <span>{featuredArticle.tanggal}</span>
                      <span>&bull;</span>
                      <span>3 Menit Baca</span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.25rem, 2.2vw, 1.7rem)',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.3,
                      marginBottom: '10px'
                    }}>
                      {featuredArticle.judul}
                    </h3>

                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {featuredArticle.ringkasan}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Oleh: <strong>{featuredArticle.penulis}</strong>
                    </span>

                    <button
                      style={{
                        background: 'var(--color-brand-primary)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>Mulai Membaca</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Tabs */}
            <div className="articles-category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: selectedCategory === cat ? 800 : 500
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {sortedArticles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--color-surface)',
                borderRadius: '24px',
                border: '1px dashed var(--color-border)'
              }}>
                <BookOpen size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Tidak Ada Warta yang Cocok
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '6px' }}>
                  Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: '24px'
              }}>
                {sortedArticles.map(item => (
                  <article
                    key={item.id}
                    className="article-card"
                    onClick={() => handleOpenArticle(item)}
                    style={{
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(30, 24, 20, 0.82)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--color-gold-200)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(207, 162, 61, 0.4)'
                      }}>
                        {item.kategori}
                      </span>
                    </div>

                    <div style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1
                    }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '8px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} color="var(--color-brand-primary)" />
                            {item.tanggal}
                          </span>
                          <span>&bull;</span>
                          <span>3 Menit Baca</span>
                        </div>

                        <h3 style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)',
                          marginBottom: '8px',
                          lineHeight: 1.3
                        }}>
                          {item.judul}
                        </h3>

                        <p style={{
                          fontSize: '0.84rem',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.6,
                          margin: 0
                        }}>
                          {item.ringkasan}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--color-border)',
                        fontSize: '0.78rem'
                      }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {item.penulis}
                        </span>

                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--color-brand-primary)',
                          fontWeight: 800
                        }}>
                          Baca Warta
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
