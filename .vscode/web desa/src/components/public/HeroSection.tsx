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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-110px',
        paddingTop: '160px',
        paddingBottom: '80px',
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* 1. Subtle Cinematic Gradient Overlay (letting the real green mountains & sunrise shine through) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.12) 35%, rgba(0, 0, 0, 0.22) 65%, rgba(14, 22, 14, 0.85) 100%)',
          zIndex: 1
        }}
      />

      {/* 2. Soft Radial Sun Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '8%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(207, 162, 61, 0.22) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Bottom Fade into Ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content Container */}
      <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>

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
                  background: 'rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '6px 20px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                title="Kearifan Sunda Sukadana: Silih Asah, Silih Asih, Silih Asuh"
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.borderColor = 'var(--color-gold-300)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
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
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)'
                }}>
                  {diurnal.greeting} &bull; {diurnal.context}
                </span>
              </div>
            );
          })()}

          {/* MAIN DIGNIFIED TITLE (Ciburial Layout Reference) */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 6.8vw, 5.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 auto 12px',
            color: '#ffffff',
            textShadow: '0 4px 28px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7)'
          }}>
            Desa Sukadana
          </h1>

          {/* SUBTITLE */}
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.15rem, 2.4vw, 1.55rem)',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '28px',
            letterSpacing: '0.015em',
            textShadow: '0 2px 16px rgba(0, 0, 0, 0.9)'
          }}>
            Kec. Argapura Kab. Majalengka Prov. Jawa Barat
          </div>

          {/* Smart Search Bar (Glassmorphic) */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '680px',
              margin: '0 auto 20px',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 8px 6px 20px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s ease'
            }}>
              <Search size={20} color="#cfa23d" style={{ flexShrink: 0, marginRight: '12px' }} />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari permohonan surat, berita desa, atau regulasi..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1a9020 0%, #136918 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(26, 144, 32, 0.4)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>Cari</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Access Letter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '36px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              Layanan Populer:
            </span>
            {quickPills.map(p => (
              <button
                key={p.code}
                onClick={() => onSelectService(p.code)}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '5px 13px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26, 144, 32, 0.85)';
                  e.currentTarget.style.borderColor = '#acdbb0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.35)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 4 Frosted Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            maxWidth: '920px',
            margin: '0 auto'
          }}>
            <FrostedStatCard
              value={4823}
              suffix="Jiwa"
              label="Penduduk Terdaftar"
              sub="1.412 KK dalam SIAK Desa"
              icon={<Users size={18} />}
            />
            <FrostedStatCard
              value={1247}
              suffix="Ha"
              label="Bentang Luas Wilayah"
              sub="67,4% Lahan Terasering"
              icon={<Building2 size={18} />}
            />
            <FrostedStatCard
              value={950}
              suffix="mdpl"
              label="Elevasi Kawasan"
              sub="Rentang 750–1.200 mdpl"
              icon={<Clock size={18} />}
            />
            <FrostedStatCard
              value={5}
              suffix="Blok"
              label="Blok Definitif"
              sub="Desa, Panyekran, Jingkang, dll"
              icon={<ShieldCheck size={18} />}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
