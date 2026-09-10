import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  ChevronRight,
  Info,
  Calendar,
  AlertTriangle,
  X,
  ArrowRight,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { NewsTickerItem } from '../../types';
import { MOCK_TICKER_ITEMS } from '../../data/mockData';

interface NewsTickerProps {
  onNavigateSegment?: (segmentId: string) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onNavigateSegment }) => {
  const [selectedItem, setSelectedItem] = useState<NewsTickerItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplikat item agar animasi scrolling mulus tanpa jeda (seamless loop)
  const items = [...MOCK_TICKER_ITEMS, ...MOCK_TICKER_ITEMS];

  const handleItemClick = (item: NewsTickerItem) => {
    setSelectedItem(item);
  };

  const getTagClass = (type: NewsTickerItem['type']) => {
    switch (type) {
      case 'urgent': return 'ticker-tag-urgent';
      case 'agenda': return 'ticker-tag-agenda';
      default: return 'ticker-tag-info';
    }
  };

  const getIcon = (type: NewsTickerItem['type']) => {
    switch (type) {
      case 'urgent': return <AlertTriangle size={12} color="#ef4444" />;
      case 'agenda': return <Calendar size={12} color="#cfa23d" />;
      default: return <Info size={12} color="#acdbb0" />;
    }
  };

  return (
    <>
      <div className="news-ticker-container" role="region" aria-label="Informasi Kilat Desa">
        {/* Badge Info Kilat */}
        <div className="news-ticker-badge">
          <span className="pulse-dot" />
          <Volume2 size={13} style={{ marginRight: 2 }} />
          <span>INFO KILAT DESA</span>
        </div>

        {/* Scrolling News Track */}
        <div
          className="news-ticker-scroll"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="news-ticker-track"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="news-ticker-item"
                onClick={() => handleItemClick(item)}
                title="Klik untuk membaca info lengkap"
              >
                {getIcon(item.type)}
                <span className={getTagClass(item.type)}>{item.tag}</span>
                <span style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>{item.title}</span>
                <span style={{ fontSize: '0.72rem', color: '#acdbb0', opacity: 0.8, marginLeft: '4px' }}>
                  ({item.time})
                </span>
                <ChevronRight size={13} style={{ opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal saat Warga mengklik salah satu info kilat */}
      {selectedItem && typeof document !== 'undefined' && createPortal(
        <div className="article-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="article-modal-box"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={getTagClass(selectedItem.type)} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                  {selectedItem.tag}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Dipublikasikan: {selectedItem.time}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.35,
              marginBottom: '12px'
            }}>
              {selectedItem.title}
            </h3>

            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              marginBottom: '24px'
            }}>
              {selectedItem.detailText || selectedItem.title}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>

              {selectedItem.linkAction && onNavigateSegment && (
                <button
                  onClick={() => {
                    const target = selectedItem.linkAction!;
                    setSelectedItem(null);
                    onNavigateSegment(target);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--color-brand-primary)',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span>Buka Layanan</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
