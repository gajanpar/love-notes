// src/components/common/Sidebar.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Search,
  MessageSquare,
  Shield,
  Sun,
  Moon,
  Users,
  Home,
  CheckCircle,
  AlertCircle,
  Delete,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { Role } from '../../types';

interface SidebarProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  adminRole: Role;
  onOpenSearch: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// PIN Easter Egg Modal
const CORRECT_PIN = '1234';
const MAX_CLICKS = 5;
const CLICK_WINDOW_MS = 3000;

const PinModal: React.FC<{ onSuccess: () => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleKey = useCallback((digit: string) => {
    if (status !== 'idle') return;
    if (digit === 'del') {
      setPin(p => p.slice(0, -1));
      return;
    }
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        setStatus('success');
        setTimeout(() => { onSuccess(); onClose(); }, 600);
      } else {
        setStatus('error');
        setShake(true);
        setTimeout(() => { setPin(''); setStatus('idle'); setShake(false); }, 700);
      }
    }
  }, [pin, status, onSuccess, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key);
      if (e.key === 'Backspace') handleKey('del');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey, onClose]);

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
  const dotColor = status === 'success' ? 'var(--color-success-500)' : status === 'error' ? 'var(--color-error-500)' : undefined;

  return (
    <div className="pin-modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="pin-modal-box" onClick={e => e.stopPropagation()} style={{ background: 'var(--color-surface)', padding: '28px', borderRadius: '20px', width: '320px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xl)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '8px', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700 }}>Akses Dasbor Khusus</h3>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '18px' }}>Masukkan 4 Digit PIN Otoritas Desa</p>
        
        {status === 'success' && <div style={{ color: 'var(--color-success-500)', display: 'flex', justifyContent: 'center', margin: '8px 0' }}><CheckCircle size={24} /></div>}
        {status === 'error' && <div style={{ color: 'var(--color-error-500)', display: 'flex', justifyContent: 'center', margin: '8px 0' }}><AlertCircle size={24} /></div>}
        
        <div className={`pin-dots${shake ? ' pin-shake' : ''}`} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--color-border)', background: pin.length > i ? dotColor || 'var(--color-brand-primary)' : 'transparent', transition: 'all 0.2s' }} />
          ))}
        </div>
        
        <div className="pin-keypad" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {keys.map((k, idx) => {
            if (!k) return <div key={idx} />;
            return (
              <button key={idx} onClick={() => handleKey(k)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-surface-raised)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', transition: 'all 0.15s' }}>
                {k === 'del' ? <Delete size={18} style={{ margin: 'auto' }}/> : k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  activeSection,
  onNavigateSection,
  adminRole,
  onOpenSearch,
  isCollapsed,
  onToggleCollapse
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Easter egg
  const [clickCount, setClickCount] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      return;
    }
    // Provide a smooth view transition
    document.startViewTransition(() => {
      setTheme(prev => {
        const nextTheme = prev === 'light' ? 'dark' : 'light';
        // force immediate DOM update for the attribute to help the transition
        document.documentElement.setAttribute('data-theme', nextTheme);
        return nextTheme;
      });
    });
  };

  const handleLogoClick = useCallback(() => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= MAX_CLICKS) {
      setClickCount(0);
      setShowPinModal(true);
    } else {
      clickTimerRef.current = setTimeout(() => setClickCount(0), CLICK_WINDOW_MS);
    }
  }, [clickCount]);

  const navLinks = [
    { id: 'beranda',     label: 'Beranda Utama',  badge: '',  icon: <Home size={19} /> },
    { id: 'layanan',     label: 'E-Persuratan',   badge: '6', icon: <FileText size={19} /> },
    { id: 'profil',      label: 'Profil Desa',    badge: '',  icon: <Users size={19} /> },
    { id: 'lapor',       label: 'Aspirasi Warga', badge: '',  icon: <MessageSquare size={19} /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Lebar 300px, Visual Terbaca Sempurna Tanpa Huruf Terpotong) */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* HEADER: High-End Emblem & Typography Sempurna */}
        <div
          className="sidebar-header"
          style={{
            padding: isCollapsed ? '20px 10px' : '22px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '12px',
            background: 'linear-gradient(180deg, var(--color-surface-raised) 0%, var(--color-surface) 100%)',
            transition: 'padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              flex: 1,
              minWidth: 0
            }}
            onClick={handleLogoClick}
            title="Klik 5x untuk Otoritas Admin"
          >
            {/* Logo Emblem dengan Golden-Emerald Rim */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '13px',
              padding: '2.5px',
              background: 'linear-gradient(135deg, #cfa23d 0%, #1a9020 100%)',
              boxShadow: '0 4px 14px rgba(26, 144, 32, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.25s ease'
            }}>
              <img
                src="/logo-desa.jpg"
                alt="Logo Desa Sukadana"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '11px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Typography Header: Terbaca Jelas Tanpa Terpotong */}
            <div className="sidebar-logo-text" style={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
              <div style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                letterSpacing: '0.07em',
                color: 'var(--color-brand-primary)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.15,
                whiteSpace: 'nowrap'
              }}>
                Pemerintah Desa
              </div>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                margin: '2px 0 1px 0',
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}>
                Sukadana
              </h1>
              <div style={{
                fontSize: '0.74rem',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
              }}>
                Kecamatan Argapura
              </div>
            </div>
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              title="Perkecil Sidebar"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--color-brand-primary)';
                e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* BODY & NAV MENUS (Luas & Nyaman) */}
        <div style={{
          padding: isCollapsed ? '20px 10px' : '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          alignItems: isCollapsed ? 'center' : 'stretch',
          overflowY: 'auto'
        }}>
          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              title="Buka Sidebar Penuh"
              style={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '10px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Menu size={18} />
            </button>
          )}

          {/* Search Button dengan Shortcut Chip */}
          <button
            onClick={onOpenSearch}
            className="nav-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: isCollapsed ? '12px' : '11px 16px',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-raised)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              marginBottom: '14px',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={16} className="nav-item-icon" />
              <span className="sidebar-text" style={{ fontSize: '0.86rem', whiteSpace: 'nowrap' }}>
                Cari layanan / warta...
              </span>
            </div>
            {!isCollapsed && (
              <span className="sidebar-text" style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2px 7px',
                borderRadius: '6px',
                color: 'var(--color-text-muted)',
                fontWeight: 700
              }}>
                Ctrl K
              </span>
            )}
          </button>

          {currentView === 'public' ? (
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div className="sidebar-text" style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                marginBottom: '4px',
                paddingLeft: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                Menu Publik
              </div>

              {navLinks.map(link => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    className="nav-item"
                    onClick={() => onNavigateSection(link.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '12px' : '12px 16px',
                      borderRadius: '14px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(26, 144, 32, 0.12) 0%, rgba(207, 162, 61, 0.08) 100%)'
                        : 'transparent',
                      color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                      border: isActive ? '1px solid rgba(26, 144, 32, 0.28)' : '1px solid transparent',
                      borderLeft: isActive ? '4px solid var(--color-brand-primary)' : '4px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.92rem',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      width: '100%',
                      boxShadow: isActive ? '0 4px 14px rgba(26, 144, 32, 0.08)' : 'none'
                    }}
                    title={isCollapsed ? link.label : undefined}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--color-surface-raised)';
                        if (!isCollapsed) {
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        if (!isCollapsed) {
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span className="nav-item-icon" style={{
                        color: isActive ? 'var(--color-brand-primary)' : 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        {link.icon}
                      </span>
                      <span className="sidebar-text" style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
                        {link.label}
                      </span>
                    </div>

                    {!isCollapsed && link.badge && (
                      <span className="sidebar-text" style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: 'var(--color-brand-primary)',
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div className="nav-item" style={{
                background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.12) 0%, rgba(207, 162, 61, 0.1) 100%)',
                color: 'var(--color-brand-primary)',
                padding: '13px 16px',
                borderRadius: '14px',
                fontSize: '0.875rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(26, 144, 32, 0.3)',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}>
                <Shield size={18} className="nav-item-icon" />
                <span className="sidebar-text" style={{ whiteSpace: 'nowrap' }}>Dasbor Backoffice</span>
              </div>
              <button
                className="nav-item"
                onClick={() => onViewChange('public')}
                style={{
                  padding: isCollapsed ? '12px' : '12px 16px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  width: '100%',
                  transition: 'all 0.2s ease'
                }}
                title={isCollapsed ? "Ke Portal Warga" : undefined}
              >
                <Home size={16} className="nav-item-icon"/>
                <span className="sidebar-text" style={{ whiteSpace: 'nowrap' }}>Ke Portal Publik</span>
              </button>
            </div>
          )}
        </div>

        {/* FOOTER: Highly Animated Dark/Light Mode Pill Switch */}
        <div style={{
          padding: isCollapsed ? '16px 8px' : '16px 16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              padding: isCollapsed ? '10px' : '10px 14px',
              borderRadius: 'var(--radius-full)',
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #182218 0%, #222b22 100%)'
                : 'linear-gradient(135deg, #f7f3e8 0%, #ede7d6 100%)',
              border: `1px solid ${theme === 'dark' ? 'rgba(207, 162, 61, 0.35)' : 'rgba(207, 162, 61, 0.5)'}`,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: theme === 'dark' ? '#28211c' : '#cfa23d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(172, 219, 176, 0.4)' : '0 0 10px rgba(207, 162, 61, 0.5)',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease',
                transform: theme === 'dark' ? 'rotate(360deg)' : 'rotate(0deg)',
                flexShrink: 0
              }}>
                {theme === 'dark' ? <Moon size={15} color="#acdbb0" /> : <Sun size={15} color="#ffffff" />}
              </div>
              <span className="sidebar-text" style={{ fontSize: '0.84rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'visible' }}>
                {theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
              </span>
            </div>

            {!isCollapsed && (
              <span className="sidebar-text" style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--color-brand-primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {theme === 'dark' ? 'AKTIF' : 'TERANG'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="mobile-top-bar" style={{
        padding: '12px 16px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src="/logo-desa.jpg" alt="Logo Desa" style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid rgba(207, 162, 61, 0.4)' }} />
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pemdes</div>
            <h1 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, lineHeight: 1.1, fontFamily: 'var(--font-serif)' }}>Sukadana</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenSearch} style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px', color: 'var(--color-text-primary)' }}><Search size={18}/></button>
          <button onClick={toggleTheme} style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px', color: 'var(--color-text-primary)' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#cfa23d" />}
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {currentView === 'public' && (
        <nav className="mobile-bottom-nav" style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
        }}>
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigateSection(link.id)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
                  background: 'transparent', border: 'none', padding: '8px 0',
                  color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.icon}
                <span style={{ fontSize: '0.625rem', fontWeight: isActive ? 800 : 500 }}>{link.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {showPinModal && <PinModal onSuccess={() => onViewChange('admin')} onClose={() => setShowPinModal(false)} />}
    </>
  );
};
