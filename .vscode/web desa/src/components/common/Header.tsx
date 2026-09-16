// src/components/common/Header.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home,
  Users,
  FileText,
  MapPin,
  BookOpen,
  MessageSquare,
  Search,
  Moon,
  Sun,
  Shield,
  Menu,
  X,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Delete,
  Clock,
  ExternalLink,
  Phone,
  Newspaper
} from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onOpenSearch: () => void;
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

// ─── PIN Easter Egg Modal ───────────────────────────────────────────────────
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

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  const dotColor = status === 'success' ? 'var(--color-success-500)' : status === 'error' ? 'var(--color-error-500)' : undefined;

  return (
    <div
      className="pin-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="pin-modal-box"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          padding: '30px',
          borderRadius: '24px',
          width: '320px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(207,162,61,0.2) 0%, rgba(26,144,32,0.15) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-brand-primary)'
          }}>
            <Shield size={24} />
          </div>
        </div>
        <h3 style={{ textAlign: 'center', margin: '0 0 6px 0', fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 800 }}>
          Otoritas Dasbor Desa
        </h3>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 20px 0' }}>
          Masukkan 4 Digit PIN Otoritas Desa
        </p>

        {status === 'success' && (
          <div style={{ color: 'var(--color-success-500)', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <CheckCircle size={26} />
          </div>
        )}
        {status === 'error' && (
          <div style={{ color: 'var(--color-error-500)', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <AlertCircle size={26} />
          </div>
        )}

        <div className={`pin-dots${shake ? ' pin-shake' : ''}`} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '22px' }}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid var(--color-border)',
                background: pin.length > i ? dotColor || 'var(--color-brand-primary)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        <div className="pin-keypad" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {keys.map((k, idx) => {
            if (!k) return <div key={idx} />;
            return (
              <button
                key={idx}
                onClick={() => handleKey(k)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-raised)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {k === 'del' ? <Delete size={18} style={{ margin: 'auto' }} /> : k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigateSection,
  onOpenSearch,
  currentView,
  onViewChange,
  theme,
  onToggleTheme
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilDropdownOpen, setProfilDropdownOpen] = useState(false);
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);

  // Easter egg
  const [clickCount, setClickCount] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection for glassy navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Current formatted date in Indonesian
  const [currentDateStr, setCurrentDateStr] = useState('');
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    setCurrentDateStr(now.toLocaleDateString('id-ID', options));
  }, []);

  // Utility quick links (Left side of top bar)
  const utilityLinks = [
    { label: 'Tentang Desa', target: 'profil' },
    { label: 'Berita Desa', target: 'berita' },
    { label: 'Layanan Mandiri', target: 'layanan' },
    { label: 'Regulasi / Perdes', target: 'perdes' },
    { label: 'Peta Geospasial', target: 'peta' },
    { label: 'Aspirasi Warga', target: 'lapor' }
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease'
        }}
      >
        {/* ── 1. TOP UTILITY BAR (Ciburial Style: Utility Links + Social Media Icons) ── */}
        <div
          style={{
            background: 'linear-gradient(90deg, #142214 0%, #1e2e1e 50%, #182218 100%)',
            borderBottom: '1px solid rgba(207, 162, 61, 0.25)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.75rem',
            padding: '6px 0',
            transition: 'all 0.3s ease'
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            {/* Left: Quick Utility Links */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap'
              }}
              aria-label="Navigasi Utilitas Cepat"
            >
              {utilityLinks.map((item, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => onNavigateSection(item.target)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      transition: 'color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                  >
                    {item.label}
                  </button>
                  {idx < utilityLinks.length - 1 && (
                    <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.65rem' }}>|</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Right: Social Media Icons + Date string */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginLeft: 'auto'
              }}
            >
              {/* Date Indicator */}
              <div
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-sans)'
                }}
                className="desktop-date-chip"
              >
                <Clock size={12} color="#cfa23d" />
                <span>{currentDateStr}</span>
              </div>

              {/* Social Media Icons (SVG Crisp) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter / X Desa Sukadana"
                  style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Desa Sukadana"
                  style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Desa Sukadana"
                  style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube Desa Sukadana"
                  style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Loket Pelayanan Desa Sukadana"
                  style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#00e676')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN STICKY NAVBAR (Brand Logo + Horizontal Menus + Dropdowns) ── */}
        <div
          style={{
            background: isScrolled
              ? theme === 'dark'
                ? 'rgba(20, 30, 20, 0.94)'
                : 'rgba(255, 255, 255, 0.95)'
              : theme === 'dark'
              ? 'rgba(18, 25, 18, 0.88)'
              : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${isScrolled ? 'var(--color-border)' : 'rgba(207, 162, 61, 0.2)'}`,
            boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: isScrolled ? '10px 0' : '14px 0'
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            {/* Logo & Village Identity (Left) */}
            <div
              onClick={handleLogoClick}
              title="Klik 5x untuk Otoritas Admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: isScrolled ? '42px' : '48px',
                  height: isScrolled ? '42px' : '48px',
                  borderRadius: '14px',
                  padding: '2.5px',
                  background: 'linear-gradient(135deg, #cfa23d 0%, #1a9020 60%, #0d4a12 100%)',
                  boxShadow: '0 4px 14px rgba(26, 144, 32, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <img
                  src="/logo-desa.jpg"
                  alt="Logo Desa Sukadana"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '11px',
                    objectFit: 'cover'
                  }}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: isScrolled ? '1.18rem' : '1.35rem',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.15,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    transition: 'font-size 0.3s ease'
                  }}
                >
                  Desa Sukadana
                </h1>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    margin: '2px 0 0 0',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.01em'
                  }}
                >
                  Kec. Argapura, Kab. Majalengka
                </p>
              </div>
            </div>

            {/* Desktop Navigation Menu (Center) */}
            <nav
              className="desktop-nav-menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              aria-label="Navigasi Utama"
            >
              {/* 1. HOME / BERANDA */}
              <button
                onClick={() => onNavigateSection('beranda')}
                className={`nav-header-btn${activeSection === 'beranda' ? ' active' : ''}`}
                style={{
                  background: activeSection === 'beranda' ? 'rgba(26, 144, 32, 0.1)' : 'transparent',
                  color: activeSection === 'beranda' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Home size={15} />
                <span>BERANDA</span>
              </button>

              {/* 2. PROFIL DESA ▾ (Dropdown) */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setProfilDropdownOpen(true)}
                onMouseLeave={() => setProfilDropdownOpen(false)}
              >
                <button
                  onClick={() => onNavigateSection('profil')}
                  className={`nav-header-btn${activeSection === 'profil' ? ' active' : ''}`}
                  style={{
                    background: activeSection === 'profil' ? 'rgba(26, 144, 32, 0.1)' : 'transparent',
                    color: activeSection === 'profil' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={15} />
                  <span>PROFIL DESA</span>
                  <ChevronDown size={13} style={{ opacity: 0.7, transform: profilDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {profilDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '230px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '14px',
                      padding: '8px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
                      zIndex: 110,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <button
                      onClick={() => { onNavigateSection('profil'); setProfilDropdownOpen(false); }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Users size={14} color="var(--color-brand-primary)" />
                      <span>Monografi &amp; 5 Blok Wilayah</span>
                    </button>
                    <button
                      onClick={() => { onNavigateSection('peta'); setProfilDropdownOpen(false); }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <MapPin size={14} color="#cfa23d" />
                      <span>Peta Fasilitas &amp; Proyek</span>
                    </button>
                    <button
                      onClick={() => { onNavigateSection('perdes'); setProfilDropdownOpen(false); }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <BookOpen size={14} color="#0ea5e9" />
                      <span>Katalog Peraturan Desa (Perdes)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. LAYANAN WARGA ▾ (Dropdown) */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setLayananDropdownOpen(true)}
                onMouseLeave={() => setLayananDropdownOpen(false)}
              >
                <button
                  onClick={() => onNavigateSection('layanan')}
                  className={`nav-header-btn${activeSection === 'layanan' ? ' active' : ''}`}
                  style={{
                    background: activeSection === 'layanan' ? 'rgba(26, 144, 32, 0.1)' : 'transparent',
                    color: activeSection === 'layanan' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={15} />
                  <span>LAYANAN WARGA</span>
                  <ChevronDown size={13} style={{ opacity: 0.7, transform: layananDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {layananDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '230px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '14px',
                      padding: '8px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
                      zIndex: 110,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <button
                      onClick={() => { onNavigateSection('layanan'); setLayananDropdownOpen(false); }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <FileText size={14} color="var(--color-brand-primary)" />
                      <span>Katalog 6 E-Persuratan</span>
                    </button>
                    <button
                      onClick={() => { onNavigateSection('tracking'); setLayananDropdownOpen(false); }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Search size={14} color="#cfa23d" />
                      <span>Lacak Status Berkas (Tracking)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. INFORMASI & BERITA */}
              <button
                onClick={() => onNavigateSection('berita')}
                className="nav-header-btn"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Newspaper size={15} />
                <span>INFORMASI &amp; BERITA</span>
              </button>

              {/* 5. ASPIRASI & LAPOR */}
              <button
                onClick={() => onNavigateSection('lapor')}
                className={`nav-header-btn${activeSection === 'lapor' ? ' active' : ''}`}
                style={{
                  background: activeSection === 'lapor' ? 'rgba(26, 144, 32, 0.1)' : 'transparent',
                  color: activeSection === 'lapor' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={15} />
                <span>ASPIRASI &amp; LAPOR</span>
              </button>
            </nav>

            {/* Action Buttons (Right: Search, Theme Toggle, Admin Lock, Mobile Menu) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                title="Cari Layanan / Berita (Ctrl+K)"
                style={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-brand-mid)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <Search size={16} color="var(--color-brand-primary)" />
                <span className="desktop-search-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Cari...
                </span>
                <span
                  className="desktop-search-chip"
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Ctrl K
                </span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={onToggleTheme}
                title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-raised)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-brand-mid)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                {theme === 'light' ? <Moon size={17} color="#6a5724" /> : <Sun size={17} color="#cfa23d" />}
              </button>

              {/* Admin Portal Entry Button */}
              <button
                onClick={() => setShowPinModal(true)}
                title="Akses Dasbor Aparatur Desa (Otoritas Khusus)"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid rgba(207, 162, 61, 0.4)',
                  background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.15) 0%, rgba(26, 144, 32, 0.1) 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#cfa23d',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#cfa23d';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(207, 162, 61, 0.4)';
                }}
              >
                <Shield size={17} />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-hamburger-btn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-raised)',
                  cursor: 'pointer',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-primary)'
                }}
                aria-label="Buka Menu Navigasi"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── 3. MOBILE MENU SLIDEDOWN DRAWER ── */}
          {mobileMenuOpen && (
            <div
              className="mobile-menu-drawer"
              style={{
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              }}
            >
              <button
                onClick={() => { onNavigateSection('beranda'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeSection === 'beranda' ? 'rgba(26,144,32,0.1)' : 'transparent',
                  color: activeSection === 'beranda' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Home size={17} />
                <span>Beranda Utama</span>
              </button>

              <button
                onClick={() => { onNavigateSection('profil'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeSection === 'profil' ? 'rgba(26,144,32,0.1)' : 'transparent',
                  color: activeSection === 'profil' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Users size={17} />
                <span>Profil &amp; 5 Blok Wilayah</span>
              </button>

              <button
                onClick={() => { onNavigateSection('layanan'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeSection === 'layanan' ? 'rgba(26,144,32,0.1)' : 'transparent',
                  color: activeSection === 'layanan' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <FileText size={17} />
                <span>Katalog 6 E-Persuratan</span>
              </button>

              <button
                onClick={() => { onNavigateSection('berita'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Newspaper size={17} />
                <span>Informasi &amp; Berita Desa</span>
              </button>

              <button
                onClick={() => { onNavigateSection('peta'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <MapPin size={17} />
                <span>Peta Geospasial Fasilitas</span>
              </button>

              <button
                onClick={() => { onNavigateSection('perdes'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <BookOpen size={17} />
                <span>Peraturan Desa (Perdes)</span>
              </button>

              <button
                onClick={() => { onNavigateSection('lapor'); setMobileMenuOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeSection === 'lapor' ? 'rgba(26,144,32,0.1)' : 'transparent',
                  color: activeSection === 'lapor' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                  fontWeight: 700,
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <MessageSquare size={17} />
                <span>Aspirasi &amp; Lapor Warga</span>
              </button>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }}>
                <button
                  onClick={() => { setShowPinModal(true); setMobileMenuOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(207, 162, 61, 0.4)',
                    background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.15) 0%, rgba(26, 144, 32, 0.1) 100%)',
                    color: '#cfa23d',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Shield size={16} />
                  <span>Akses Dasbor Aparatur Desa</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Admin PIN Dialog */}
      {showPinModal && (
        <PinModal onSuccess={() => onViewChange('admin')} onClose={() => setShowPinModal(false)} />
      )}
    </>
  );
};
