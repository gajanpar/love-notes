// src/components/public/ProfileSection.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, Target, Award, Phone, Sparkles, Quote,
  MapPin, Calendar, RotateCcw, Mountain, Wheat,
  Landmark, CheckCircle2, ChevronDown, ChevronUp, TreePine
} from 'lucide-react';
import { VILLAGE_OFFICIALS } from '../../data/mockData';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Village Stats ────────────────────────────────────────────────────────────
const VILLAGE_STATS = [
  { icon: <Users size={22} />, value: 4823,  suffix: '',   label: 'Jiwa Penduduk',     sub: 'Per Sensus 2025' },
  { icon: <MapPin size={22} />, value: 1247,  suffix: ' Ha', label: 'Luas Wilayah',    sub: 'Lereng Ciremai' },
  { icon: <Landmark size={22} />, value: 4,   suffix: '',   label: 'Dusun',            sub: 'Cikondang, Sukadana, dll' },
  { icon: <Calendar size={22} />, value: 1979, suffix: '',  label: 'Tahun Berdiri',    sub: 'Desa Definitif' },
];

// ─── Misi Pillars ─────────────────────────────────────────────────────────────
const MISI_PILLARS = [
  {
    icon: <Sparkles size={14} />, tag: 'Pilar 1 — Digitalisasi',
    title: 'Transformasi Digital Layanan Publik',
    desc: 'Platform GaaS ber-TTE resmi BSrE/BSSN untuk semua surat desa, integrasi SIAK Dukcapil, dan satu portal pelayanan warga dari genggaman smartphone.'
  },
  {
    icon: <Mountain size={14} />, tag: 'Pilar 2 — Infrastruktur',
    title: 'Jalan Usaha Tani & Irigasi Ciremai',
    desc: 'Pembangunan jalan hotmix terasering 950m, pipanisasi air gravitasi irigasi pertanian sayuran dan bawang daun lereng Gunung Ciremai.'
  },
  {
    icon: <Wheat size={14} />, tag: 'Pilar 3 — Ekonomi',
    title: 'Agrobisnis & UMKM Desa Mandiri',
    desc: 'Penguatan BUMDes "Sukadana Mandiri", pemberdayaan Gapoktan hortikultura daun bawang, dan pengembangan destinasi agrowisata terasering.'
  },
  {
    icon: <TreePine size={14} />, tag: 'Pilar 4 — SDM & Kesehatan',
    title: 'SDM Unggul & Kesehatan Terpadu',
    desc: 'Program 5 Posyandu aktif, pencegahan stunting, beasiswa anak petani berprestasi, dan peningkatan kualitas layanan PKK Desa Sukadana.'
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; value: number; suffix: string; label: string; sub: string; animate: boolean }> =
({ icon, value, suffix, label, sub, animate }) => {
  const count = useCountUp(value, 1600, animate);
  return (
    <div className="stat-counter-box">
      <div className="stat-counter-icon">{icon}</div>
      <span className="stat-counter-number">
        {count.toLocaleString('id-ID')}{suffix}
      </span>
      <span className="stat-counter-label">{label}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block', fontStyle: 'italic' }}>
        {sub}
      </span>
    </div>
  );
};

// ─── Flip Card ────────────────────────────────────────────────────────────────
const OfficialFlipCard: React.FC<{ official: any }> = ({ official }) => {
  const [flipped, setFlipped] = useState(false);
  const isHead = official.jabatanLevel === 'kepala';
  const isSekdes = official.jabatanLevel === 'sekdes';

  const accentColor = isHead
    ? 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))'
    : isSekdes
    ? 'linear-gradient(135deg, var(--color-gold-300), var(--color-gold-400))'
    : 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))';

  return (
    <div
      className={`flip-card${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      title={flipped ? 'Klik untuk kembali' : 'Klik untuk melihat detail'}
      role="button"
      tabIndex={0}
      aria-label={`Profil ${official.name}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(f => !f); }}
    >
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front">
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            background: accentColor,
            padding: '3px',
            marginBottom: '12px',
            boxShadow: '0 4px 16px rgba(27,143,33,0.25)',
          }}>
            <img
              src={official.avatar}
              alt={official.name}
              style={{
                width: '100%', height: '100%',
                borderRadius: '50%', objectFit: 'cover',
                border: '2px solid #fff',
              }}
            />
          </div>
          <h4 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9375rem', fontWeight: 700,
            marginBottom: '4px',
            color: 'var(--color-text-primary)',
            lineHeight: 1.35
          }}>{official.name}</h4>
          <div style={{
            fontSize: 'var(--text-xs)', fontWeight: 700,
            color: isHead ? 'var(--color-brand-700)' : 'var(--color-text-muted)',
            background: isHead ? 'var(--color-brand-50)' : 'var(--color-surface-raised)',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            border: `1px solid ${isHead ? 'var(--color-brand-200)' : 'var(--color-border)'}`,
            marginBottom: '8px'
          }}>
            {official.role}
          </div>
          <div className="flip-hint">
            <RotateCcw size={11} /> Klik untuk detail
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.65, fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            NIP/NIAPD: {official.nip}
          </div>
          <div style={{
            fontSize: 'var(--text-sm)', fontStyle: 'italic', opacity: 0.9,
            lineHeight: 1.6, position: 'relative', paddingLeft: '14px'
          }}>
            <Quote size={11} style={{ position: 'absolute', left: 0, top: '2px', opacity: 0.6 }} />
            "{official.quote}"
          </div>
          <a
            href={`tel:${official.phone}`}
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-md)', padding: '8px 14px',
              color: '#fff', textDecoration: 'none', fontSize: 'var(--text-xs)',
              fontWeight: 600, transition: 'background var(--transition-fast)',
              marginTop: '4px'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            <Phone size={12} /> {official.phone}
          </a>
          <div className="flip-hint" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <RotateCcw size={11} /> Klik untuk kembali
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ProfileSection: React.FC = () => {
  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: visiRef, visible: visiVisible } = useScrollReveal(0.15);
  const { ref: misiRef, visible: misiVisible } = useScrollReveal(0.1);
  const { ref: officialRef, visible: officialVisible } = useScrollReveal(0.1);
  const [openMisi, setOpenMisi] = useState<number | null>(null);

  return (
    <section id="profil" style={{ padding: '72px 0', background: 'var(--color-bg)' }}>
      <div className="container">

        {/* ── Section Header ─────────────────────────────────── */}
        <div ref={heroRef} className={`reveal${heroVisible ? ' visible' : ''}`}
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
          <span className="badge-animated" style={{ marginBottom: '16px' }}>
            Mengenal Desa Kami
          </span>
          <h2 className="text-title" style={{ marginBottom: '14px', lineHeight: 'var(--leading-snug)' }}>
            Profil Desa Sukadana — Agamis, Mandiri & Berdaya Saing
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-loose)' }}>
            Desa agrowisata unggulan lereng Ciremai, Kecamatan Argapura — mewujudkan tata kelola yang akuntabel, transparan, dan layanan publik digital prima.
          </p>
        </div>

        {/* ── Hero Profile Banner ────────────────────────────── */}
        <div
          className={`profile-hero reveal${heroVisible ? ' visible' : ''}`}
          style={{ marginBottom: '48px', transitionDelay: '100ms' }}
        >
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            gap: '32px', position: 'relative', zIndex: 1
          }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{
                fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wider)', opacity: 0.7, marginBottom: '8px'
              }}>
                Desa Sukadana • Kec. Argapura • Kab. Majalengka
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800, lineHeight: 1.2, marginBottom: '12px',
                color: '#fff'
              }}>
                Portal E-Government<br />Desa Sukadana
              </h3>
              <p style={{ opacity: 0.8, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', maxWidth: '400px' }}>
                Visi 2024–2030: Desa Mandiri berbasis Agrowisata & Hortikultura Unggulan dengan layanan publik digital yang prima.
              </p>
            </div>

            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap', flexShrink: 0
            }}>
              {[
                { label: 'APBDes 2026', value: 'Rp 2,1 M' },
                { label: 'Produk Unggulan', value: 'Bawang Daun' },
                { label: 'Status Desa', value: 'Mandiri' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-lg)', padding: '14px 20px', textAlign: 'center',
                  backdropFilter: 'blur(8px)'
                }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFeatureSettings: '"tnum"' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.65, marginTop: '2px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Animated Stats Grid ────────────────────────────── */}
        <div
          ref={statsRef}
          className={`reveal-stagger${statsVisible ? ' visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '56px'
          }}
        >
          {VILLAGE_STATS.map(s => (
            <StatCard key={s.label} {...s} animate={statsVisible} />
          ))}
        </div>

        {/* ── Visi + Misi Layout ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>

          {/* Visi Card */}
          <div ref={visiRef} className={`reveal-left${visiVisible ? ' visible' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                flexShrink: 0
              }}>
                <Target size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-brand-600)' }}>
                  Visi Desa
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1.2 }}>
                  2024 – 2030
                </h3>
              </div>
            </div>
            <div className="visi-quote-card">
              <p style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 'var(--text-md)', lineHeight: 'var(--leading-loose)',
                color: 'var(--color-text-primary)', position: 'relative', zIndex: 1
              }}>
                "Terwujudnya Desa Sukadana yang Agamis, Mandiri, Sejahtera, Berdaya Saing Tinggi Berbasis Agrowisata & Hortikultura Unggulan Lereng Ciremai serta Layanan Publik Digital yang Prima dan Berkeadilan."
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-brand-100)'
              }}>
                <img
                  src={VILLAGE_OFFICIALS[0].avatar} alt="Kuwu"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{VILLAGE_OFFICIALS[0].name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Kuwu / Kepala Desa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Misi Timeline */}
          <div ref={misiRef} className={`reveal-right${misiVisible ? ' visible' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, var(--color-gold-300), var(--color-gold-400))',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-earth-900)',
                flexShrink: 0
              }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-gold-400)' }}>
                  4 Pilar Misi
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1.2 }}>
                  Program Kerja Utama
                </h3>
              </div>
            </div>

            {/* Accordion Misi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MISI_PILLARS.map((pillar, i) => {
                const isOpen = openMisi === i;
                return (
                  <div key={i} style={{
                    border: `1px solid ${isOpen ? 'var(--color-brand-300)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    transition: 'border-color var(--transition-fast)',
                    boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                  }}>
                    <button
                      onClick={() => setOpenMisi(isOpen ? null : i)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', background: isOpen ? 'var(--color-brand-50)' : 'var(--color-surface)',
                        border: 'none', cursor: 'pointer', gap: '8px',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                        <span style={{
                          width: '26px', height: '26px',
                          background: isOpen ? 'var(--color-brand-600)' : 'var(--color-surface-raised)',
                          color: isOpen ? '#fff' : 'var(--color-brand-600)',
                          border: `1px solid ${isOpen ? 'var(--color-brand-600)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all var(--transition-fast)'
                        }}>{pillar.icon}</span>
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-600)', fontWeight: 700, letterSpacing: 'var(--tracking-wide)' }}>
                            {pillar.tag}
                          </div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {pillar.title}
                          </div>
                        </div>
                      </div>
                      <span style={{ color: 'var(--color-brand-600)', flexShrink: 0 }}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '12px 16px 14px 54px',
                        fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
                        lineHeight: 'var(--leading-loose)',
                        background: 'var(--color-brand-50)',
                        borderTop: '1px solid var(--color-brand-100)',
                        animation: 'slideUpFade 0.25s var(--ease-spring) forwards'
                      }}>
                        {pillar.desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Officials Flip Cards ───────────────────────────── */}
        <div ref={officialRef}>
          <div className={`reveal${officialVisible ? ' visible' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="section-label">Perangkat Desa</span>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)',
              fontWeight: 800, marginTop: '8px', marginBottom: '8px'
            }}>
              Struktur Pemerintahan Desa Sukadana
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
              Klik kartu perangkat desa untuk melihat profil, kutipan, dan kontak langsung
            </p>
          </div>

          <div
            className={`reveal-stagger${officialVisible ? ' visible' : ''}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '16px'
            }}
          >
            {VILLAGE_OFFICIALS.map(official => (
              <OfficialFlipCard key={official.id} official={official} />
            ))}
          </div>

          {/* Bottom note */}
          <div className={`reveal${officialVisible ? ' visible' : ''}`}
            style={{
              marginTop: '28px', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', transitionDelay: '200ms'
            }}>
            <CheckCircle2 size={14} style={{ color: 'var(--color-brand-500)' }} />
            Data perangkat desa per September 2026 — Desa Sukadana, Kec. Argapura, Kab. Majalengka
          </div>
        </div>

      </div>
    </section>
  );
};
