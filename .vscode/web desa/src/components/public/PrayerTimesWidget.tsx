// src/components/public/PrayerTimesWidget.tsx
import React, { useState, useEffect } from 'react';

// Animated Monochrome Meteocons SVGs
import sunriseIcon from '@meteocons/svg/monochrome/sunrise.svg';
import clearDayIcon from '@meteocons/svg/monochrome/clear-day.svg';
import timeAfternoonIcon from '@meteocons/svg/monochrome/time-afternoon.svg';
import sunsetIcon from '@meteocons/svg/monochrome/sunset.svg';
import clearNightIcon from '@meteocons/svg/monochrome/clear-night.svg';

export interface PrayerTimeItem {
  id: string;
  name: string;
  time: string;
  iconUrl: string;
}

// Data waktu sholat berdasarkan koordinat astronomis Desa Sukadana, Argapura, Majalengka (-6.836, 108.283)
export function getPrayerTimes(): PrayerTimeItem[] {
  const month = new Date().getMonth(); // 0-11
  const isRainySeason = month >= 9 || month <= 2; // Okt - Mar

  return [
    { id: 'subuh',   name: 'Subuh',   time: isRainySeason ? '04:24' : '04:36', iconUrl: sunriseIcon },
    { id: 'dzuhur',  name: 'Dzuhur',  time: '11:54',                            iconUrl: clearDayIcon },
    { id: 'ashar',   name: 'Ashar',   time: isRainySeason ? '15:10' : '15:06', iconUrl: timeAfternoonIcon },
    { id: 'maghrib', name: 'Maghrib', time: isRainySeason ? '17:49' : '17:42', iconUrl: sunsetIcon },
    { id: 'isya',    name: 'Isya',    time: isRainySeason ? '19:01' : '18:56', iconUrl: clearNightIcon }
  ];
}

export function getNextPrayer(times: PrayerTimeItem[]): { index: number; remainingMs: number } {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  for (let i = 0; i < times.length; i++) {
    const [h, m] = times[i].time.split(':').map(Number);
    const prayerDate = new Date(`${todayStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    const diff = prayerDate.getTime() - now.getTime();
    if (diff > 0) {
      return { index: i, remainingMs: diff };
    }
  }

  // Jika semua waktu sholat hari ini sudah terlewat, menuju Subuh keesokan hari
  const [h, m] = times[0].time.split(':').map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const subuhTomorrow = new Date(`${tomorrowStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  return { index: 0, remainingMs: subuhTomorrow.getTime() - now.getTime() };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Top Bar Jadwal Sholat Terpadu
 * Ditempatkan di bawah News Ticker, di atas Hero Section.
 * Menggunakan animasi icon monochrome resmi dari @meteocons/svg/monochrome.
 * Tanda bulat hijau samping teks "JADWAL SHOLAT" sudah dihapus total sesuai permintaan.
 */
export const PrayerTimesTopBar: React.FC = () => {
  const times = getPrayerTimes();
  const [nextPrayer, setNextPrayer] = useState(getNextPrayer(times));
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const np = getNextPrayer(times);
      setNextPrayer(np);
      setCountdown(formatCountdown(np.remainingMs));
    }, 1000);

    const np = getNextPrayer(times);
    setCountdown(formatCountdown(np.remainingMs));

    return () => clearInterval(interval);
  }, []);

  const currentNext = times[nextPrayer.index];

  return (
    <div
      role="region"
      aria-label="Jadwal Sholat Desa Sukadana"
      style={{
        position: 'relative',
        zIndex: 45,
        background: 'linear-gradient(90deg, rgba(32, 26, 22, 0.98) 0%, rgba(20, 56, 26, 0.94) 30%, rgba(24, 70, 30, 0.92) 70%, rgba(32, 26, 22, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(207, 162, 61, 0.28)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        color: '#ffffff',
        padding: '7px 0'
      }}
    >
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Sisi Kiri: Badge Judul & Wilayah (Tanpa Tanda Bulat Hijau) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.3) 0%, rgba(26, 144, 32, 0.3) 100%)',
              border: '1px solid rgba(207, 162, 61, 0.4)',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              flexShrink: 0
            }}>
              <img
                src={clearNightIcon}
                alt="Waktu Sholat"
                width={16}
                height={16}
                style={{ filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: 'var(--color-gold-300)',
                  fontFamily: 'var(--font-sans)'
                }}>
                  JADWAL SHOLAT
                </span>
                {/* Bulat hijau dihilangkan total sesuai permintaan */}
              </div>
              <div style={{
                fontSize: '0.66rem',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.2
              }}>
                Majalengka &bull; Sukadana
              </div>
            </div>
          </div>

          {/* Sisi Tengah: Strip 5 Waktu Sholat dengan Animasi Monochrome Meteocons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            padding: '2px 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {times.map((prayer, idx) => {
              const isActive = idx === nextPrayer.index;
              return (
                <div
                  key={prayer.id}
                  className={`prayer-time-item ${isActive ? 'prayer-pulse' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: isActive ? '3px 12px' : '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(207, 162, 61, 0.32) 0%, rgba(26, 144, 32, 0.35) 100%)'
                      : 'rgba(255, 255, 255, 0.06)',
                    border: isActive
                      ? '1px solid rgba(207, 162, 61, 0.65)'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: isActive ? '0 2px 10px rgba(207, 162, 61, 0.25)' : 'none',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px'
                  }}>
                    <img
                      src={prayer.iconUrl}
                      alt={prayer.name}
                      width={18}
                      height={18}
                      style={{
                        filter: isActive
                          ? 'brightness(0) invert(0.95) drop-shadow(0 0 4px rgba(207, 162, 61, 0.6))'
                          : 'brightness(0) invert(0.8)',
                        objectFit: 'contain'
                      }}
                    />
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    letterSpacing: '0.02em'
                  }}>
                    {prayer.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: isActive ? 'var(--color-gold-200)' : 'rgba(255, 255, 255, 0.95)',
                    marginLeft: '2px'
                  }}>
                    {prayer.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sisi Kanan: Realtime Countdown Menuju Sholat Berikutnya */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(207, 162, 61, 0.3)',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            flexShrink: 0
          }}>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-gold-300)'
            }}>
              Menuju {currentNext.name}:
            </span>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.06em'
            }}>
              {countdown}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen default untuk kompatibilitas
export const PrayerTimesWidget: React.FC = () => {
  return <PrayerTimesTopBar />;
};
