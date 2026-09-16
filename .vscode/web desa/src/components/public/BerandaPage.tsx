// src/components/public/BerandaPage.tsx
import React from 'react';
import { NewsTicker } from './NewsTicker';
import { PrayerTimesTopBar } from './PrayerTimesWidget';
import { WeatherWidget } from './WeatherWidget';
import { ArticlesSection } from './ArticlesSection';
import { SuratType } from '../../types';

interface BerandaPageProps {
  onNavigateSegment: (segmentId: string) => void;
  onSelectService?: (code?: SuratType) => void;
  onOpenSearch?: (q?: string) => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({
  onNavigateSegment
}) => {
  return (
    <div className="segment-view">
      {/* 1. Flash News Ticker Bar */}
      <NewsTicker onNavigateSegment={onNavigateSegment} />

      {/* 2. Top Bar Jadwal Sholat Terpadu Ciremai */}
      <PrayerTimesTopBar />

      {/* 3. Cuaca & Agroklimat Real-time Desa Sukadana */}
      <section style={{
        padding: '36px 0 48px 0',
        background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface-raised) 100%)'
      }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a9020' }} />
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-brand-primary)'
              }}>
                Telemetri Agroklimat Real-time &bull; Elevasi 950 mdpl
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              margin: '0 auto 8px',
              lineHeight: 1.25,
              letterSpacing: '-0.02em'
            }}>
              Cuaca &amp; Agroklimat Desa Sukadana
            </h1>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Stasiun meteorologi mikro dan agroklimat terasering daun bawang lereng Gunung Ciremai berbasis integrasi data BMKG Stasiun Meteorologi Kertajati dan sensor telemetri Open-Meteo.
            </p>
          </div>

          {/* Full-width WeatherWidget */}
          <WeatherWidget />
        </div>
      </section>

      {/* 4. Informasi & Warta Berita Desa */}
      <ArticlesSection />
    </div>
  );
};
