// src/components/public/HeroSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Clock,
  ShieldCheck,
  Users,
  ArrowRight,
  Building2,
  ChevronRight
} from 'lucide-react';
import { SuratType } from '../../types';

interface HeroSectionProps {
  onSelectService: (code?: SuratType) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenSearch?: (q?: string) => void;
}

// Counter animasi angka
function useCountUp(target: number, duration: number = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const FrostedStatCard: React.FC<{
  value: number;
  suffix: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}> = ({ value, suffix, label, sub, icon }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="hero-stat-pill"
      style={{
        flex: 1,
        minWidth: '200px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(207, 162, 61, 0.35)',
        borderRadius: 'var(--radius-xl)',
        padding: '18px 22px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8125rem',
        color: 'rgba(255, 255, 255, 0.85)',
        marginBottom: '6px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600
      }}>
        <span style={{
          color: 'var(--color-gold-300)',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(207, 162, 61, 0.2)',
          padding: '6px',
          borderRadius: 'var(--radius-full)'
        }}>
          {icon}
        </span>
        {label}
      </div>
      <div style={{
        fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
        fontWeight: 800,
        color: '#ffffff',
        fontFamily: 'var(--font-sans)',
        fontFeatureSettings: '"tnum"',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        {count.toLocaleString('id-ID')}
        <span style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'var(--color-gold-300)',
          marginLeft: '4px',
          fontFamily: 'var(--font-sans)'
        }}>
          {suffix}
        </span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: '6px',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)'
      }}>
        {sub}
      </div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectService,
  onNavigateSection,
  onOpenSearch
}) => {
  const [searchInput, setSearchInput] = useState('');

  const quickPills = [
    { code: 'SKU' as SuratType, label: 'Surat Keterangan Usaha' },
    { code: 'SKTM' as SuratType, label: 'Keterangan Tidak Mampu' },
    { code: 'SKCK-PENGANTAR' as SuratType, label: 'Pengantar SKCK Polsek' },
    { code: 'SKPWNI' as SuratType, label: 'Pindah Domisili (SKPWNI)' },
    { code: 'SKN' as SuratType, label: 'Pengantar Nikah (N1-N4)' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) {
      onOpenSearch(searchInput);
    } else {
      onNavigateSection('layanan');
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '64px',
        paddingBottom: '64px',
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* Cinematic Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(40, 33, 28, 0.93) 0%, rgba(26, 144, 32, 0.85) 55%, rgba(20, 30, 20, 0.94) 100%)',
          zIndex: 1
        }}
      />
      {/* Subtle radial light accent */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(207, 162, 61, 0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      {/* Bottom fade into content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, var(--color-bg), transparent)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content Container */}
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Welcoming Diurnal Sundanese Greeting Badge */}
          {(() => {
            const h = new Date().getHours();
            const diurnal = h >= 5 && h < 11
              ? { greeting: 'WILUJENG ENJING', context: 'Hawa Tiis Terasering Sukadana • Loket Buka 08:00 WIB' }
              : h >= 11 && h < 15
              ? { greeting: 'SAMPURASUN', context: 'Pelayanan Kantor & Digital Beroperasi Penuh' }
              : h >= 15 && h < 18
              ? { greeting: 'WILUJENG SONTEN', context: 'Senja di Pasir Ciremai • Layanan Mandiri 24 Jam' }
              : { greeting: 'WILUJENG WENGI', context: 'Sukadana Ayem dina Katentreman • Layanan Digital Aktif' };

            return (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(207, 162, 61, 0.5)',
                  padding: '6px 18px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                title="Kearifan Sunda Sukadana: Silih Asah, Silih Asih, Silih Asuh"
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = 'var(--color-gold-300)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(207, 162, 61, 0.5)'; }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00e676',
                  boxShadow: '0 0 10px #00e676',
                  display: 'inline-block'
                }} />
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: 'var(--color-gold-200)',
                  fontFamily: 'var(--font-sans)'
                }}>
                  {diurnal.greeting} &bull; {diurnal.context}
                </span>
              </div>
            );
          })()}

          {/* Main Humanized Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4.8vw, 3.6rem)',
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
          }}>
            Layanan Desa Mandiri &amp;{' '}
            <span style={{
              background: 'linear-gradient(120deg, #d5b47c 0%, #cfa23d 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block'
            }}>
              Transparan
            </span>
          </h1>

          {/* Warm, welcoming narrative */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '68ch',
            margin: '0 auto 36px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            Website resmi Desa Sukadana, Argapura, Majalengka. Urus surat kependudukan, pantau realisasi APBDes, dan sampaikan keluhan warga langsung dari rumah tanpa antre.
          </p>

          {/* Search Bar with Glassmorphic styling */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '680px',
              margin: '0 auto 24px',
              position: 'relative'
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 8px 6px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(207, 162, 61, 0.4)',
              transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)'
            }}>
              <Search size={22} style={{ color: 'var(--color-brand-700)', flexShrink: 0 }} />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onClick={() => { if (onOpenSearch) onOpenSearch(searchInput); }}
                placeholder="Cari layanan surat, bansos, perdes, atau kabar desa..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-primary)',
                  background: 'transparent'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (onOpenSearch) onOpenSearch();
                  else onNavigateSection('layanan');
                }}
                className="btn btn-primary"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '10px 22px',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 16px rgba(26, 144, 32, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>Cari Cerdas</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Quick Access Pills (Clean & Elegant Tag Row) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '48px'
          }}>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-gold-300)',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em',
              marginRight: '4px'
            }}>
              SERING DIAJUKAN:
            </span>
            {quickPills.map(item => (
              <button
                key={item.code}
                onClick={() => {
                  onSelectService(item.code);
                  onNavigateSection('layanan');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(207, 162, 61, 0.3)';
                  e.currentTarget.style.borderColor = 'var(--color-gold-300)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{item.label}</span>
                <ChevronRight size={13} style={{ opacity: 0.7 }} />
              </button>
            ))}
          </div>

          {/* 4 Frosted Glass Stat Counter Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <FrostedStatCard
              value={3842}
              suffix="Jiwa"
              label="Warga Sukadana"
              sub="5 Dusun Guyub &amp; Rukun"
              icon={<Users size={16} />}
            />
            <FrostedStatCard
              value={1156}
              suffix="KK"
              label="Kepala Keluarga"
              sub="18 Rukun Tetangga (RT)"
              icon={<Building2 size={16} />}
            />
            <FrostedStatCard
              value={98}
              suffix="%"
              label="Ketepatan SLA"
              sub="Rata-rata 1,2 Hari Selesai"
              icon={<Clock size={16} />}
            />
            <FrostedStatCard
              value={480}
              suffix="+"
              label="Ulasan Warga"
              sub="Indeks 99,6% Sangat Puas"
              icon={<ShieldCheck size={16} />}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
