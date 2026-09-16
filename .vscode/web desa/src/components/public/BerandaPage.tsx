// src/components/public/BerandaPage.tsx
import React from 'react';
import {
  FileText,
  MessageSquare,
  Users,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { NewsTicker } from './NewsTicker';
import { PrayerTimesTopBar } from './PrayerTimesWidget';
import { HeroSection } from './HeroSection';
import { WeatherWidget } from './WeatherWidget';
import { ArticlesSection } from './ArticlesSection';
import { SuratType } from '../../types';

interface BerandaPageProps {
  onNavigateSegment: (segmentId: string) => void;
  onSelectService: (code?: SuratType) => void;
  onOpenSearch?: (q?: string) => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({
  onNavigateSegment,
  onSelectService,
  onOpenSearch
}) => {
  // 3 Pilar Utama Layanan Desa (Pilar ke-4 Lapor dihilangkan karena terpusat di bawah/Loket)
  const quickNavCards = [
    {
      id: 'layanan',
      title: 'E-Persuratan & Dokumen',
      desc: 'Pengajuan SKU, SKTM, Pengantar SKCK & Surat Pindah mandiri 24 jam legal BSrE.',
      icon: <FileText size={22} color="#ffffff" />,
      tag: 'Layanan Kilat',
      bgGradient: 'linear-gradient(135deg, #1a9020 0%, #136918 100%)',
      accentColor: '#acdbb0'
    },
    {
      id: 'profil',
      title: 'Profil Desa & Peta Wilayah',
      desc: 'Kenali susunan perangkat desa, demografi 3.420 jiwa, dan peta fasilitas interaktif.',
      icon: <Users size={22} color="#ffffff" />,
      tag: 'Informasi Wilayah',
      bgGradient: 'linear-gradient(135deg, #cfa23d 0%, #6a5724 100%)',
      accentColor: '#f7eed8'
    },
    {
      id: 'lapor',
      title: 'Aspirasi & Lapor Warga',
      desc: 'Sampaikan aduan infrastruktur, usulan pembangunan, atau keluhan layanan publik langsung.',
      icon: <MessageSquare size={22} color="#ffffff" />,
      tag: 'Layanan Terbuka',
      bgGradient: 'linear-gradient(135deg, #28211c 0%, #382f28 100%)',
      accentColor: '#d5b47c'
    }
  ];

  return (
    <div className="segment-view">
      {/* 1. Hero Section (Sitting at the top behind transparent header) */}
      <HeroSection
        onSelectService={code => {
          if (code) onSelectService(code);
          onNavigateSegment('layanan');
        }}
        onOpenSearch={(q) => onOpenSearch && onOpenSearch(q)}
        onNavigateSection={sectionId => {
          if (sectionId === 'layanan' || sectionId === 'tracking') {
            onNavigateSegment('layanan');
          } else if (sectionId === 'perdes') {
            onNavigateSegment('perdes');
          } else if (sectionId === 'profil' || sectionId === 'potensi') {
            onNavigateSegment('potensi');
          } else if (sectionId === 'peta') {
            onNavigateSegment('peta');
          } else if (sectionId === 'lapor') {
            onNavigateSegment('lapor');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* 2. Flash News Ticker Bar */}
      <NewsTicker onNavigateSegment={onNavigateSegment} />

      {/* 3. Top Bar Jadwal Sholat Terpadu */}
      <PrayerTimesTopBar />

      {/* 4. Combined Section: Cuaca Realtime Lereng Ciremai & 3 Pilar Utama */}
      <section style={{
        padding: '36px 0 54px 0',
        background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface-raised) 100%)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
            gap: '28px',
            alignItems: 'stretch'
          }}>
            {/* Left: Weather Widget (Real-time Open-Meteo & Animated Meteocons SVGs) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <WeatherWidget />
            </div>

            {/* Right: Quick Access Segments (3 Pilar Utama Layanan Desa) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ marginBottom: '2px' }}>
                <div className="section-label" style={{ marginBottom: '6px' }}>
                  Pusat Layanan Warga
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 2.8vw, 1.95rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.25
                }}>
                  Akses Segmen Publik
                </h3>
              </div>

              {/* 3 Pillar Cards */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                flex: 1
              }}>
                {quickNavCards.map(card => (
                  <div
                    key={card.id}
                    onClick={() => onNavigateSegment(card.id)}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '22px 24px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      flex: 1
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '14px'
                      }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-lg)',
                          background: card.bgGradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)'
                        }}>
                          {card.icon}
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--color-brand-800)',
                          background: 'var(--color-brand-100)',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase'
                        }}>
                          {card.tag}
                        </span>
                      </div>

                      <h4 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.35,
                        letterSpacing: '-0.01em'
                      }}>
                        {card.title}
                      </h4>

                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: 500
                      }}>
                        {card.desc}
                      </p>
                    </div>

                    {/* Background faint icon for bolder aesthetic */}
                    <div style={{
                      position: 'absolute',
                      right: '-8%',
                      bottom: '-8%',
                      opacity: 0.04,
                      transform: 'scale(3)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}>
                      {card.icon}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-primary)',
                      marginTop: '16px'
                    }}>
                      <span>Buka Halaman</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Articles & Kabar Desa */}
      <ArticlesSection />

      {/* 6. Village Help Desk Banner (Floating Rounded Card) */}
      <section style={{
        padding: '32px 0 72px 0',
        background: 'transparent'
      }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1a9020 0%, #136918 55%, #0b4510 100%)',
            borderRadius: '32px',
            padding: 'clamp(32px, 4.5vw, 48px) clamp(24px, 4.5vw, 44px)',
            color: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: '0 20px 48px rgba(26, 144, 32, 0.25)',
            border: '1px solid rgba(172, 219, 176, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '620px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-block',
                marginBottom: '12px',
                letterSpacing: '0.04em',
                backdropFilter: 'blur(8px)'
              }}>
                LOKET PELAYANAN
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.015em',
                margin: 0
              }}>
                Perlu urus surat kependudukan?
              </h3>
              <p style={{
                fontSize: '0.9375rem',
                color: '#acdbb0',
                marginTop: '10px',
                lineHeight: 1.6,
                margin: '10px 0 0 0'
              }}>
                Datang ke loket Balai Desa Sukadana (Senin&#8211;Jumat, 08:00&#8211;15:30 WIB) atau gunakan layanan online 24 jam di bawah ini.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => onNavigateSegment('layanan')}
                style={{
                  background: '#ffffff',
                  color: '#1a9020',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>Ajukan Surat Mandiri</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <PhoneCall size={16} />
                <span>Hubungi via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
