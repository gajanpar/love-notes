// src/components/public/ProfileSection.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, Target, Award, Phone, Sparkles, Quote,
  MapPin, Calendar, RotateCcw, Mountain, Wheat,
  Landmark, CheckCircle2, ChevronDown, ChevronUp, TreePine,
  Compass, Droplets, SunMedium, Layers, Home, ArrowRight,
  ShieldCheck, Sprout
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

// ─── 4 Indikator Utama Wilayah ────────────────────────────────────────────────
const VILLAGE_STATS = [
  { icon: <Users size={22} color="var(--color-brand-600)" />, value: 4823, suffix: ' Jiwa', label: 'Penduduk Terdaftar', sub: '1.412 KK dalam Data SIAK Desa' },
  { icon: <MapPin size={22} color="#cfa23d" />, value: 1247, suffix: ' Ha', label: 'Bentang Luas Wilayah', sub: '67,4% Lahan Terasering Produktif' },
  { icon: <Mountain size={22} color="#0ea5e9" />, value: 950, suffix: ' mdpl', label: 'Elevasi Kawasan', sub: 'Rentang 750 – 1.200 mdpl Ciremai' },
  { icon: <Landmark size={22} color="#8b5cf6" />, value: 4, suffix: ' Dusun', label: 'Dusun Administratif', sub: '16 RT & 8 RW Definitif' },
];

// ─── 4 Dusun Administratif Data ───────────────────────────────────────────────
const VILLAGE_DUSUNS = [
  {
    id: 'cikondang',
    name: 'Dusun Cikondang',
    badge: 'Sentra Hortikultura',
    rw: 'RW 01',
    rtCount: '4 RT (RT 01–04)',
    desc: 'Pusat hamparan terasering tanaman daun bawang, kubis, dan sayuran unggulan lereng Ciremai.',
    lead: 'Ketua Dusun: Bpk. Maman Sulaeman'
  },
  {
    id: 'sukadana',
    name: 'Dusun Sukadana',
    badge: 'Pusat Pemerintahan',
    rw: 'RW 02',
    rtCount: '4 RT (RT 05–08)',
    desc: 'Sentra administrasi balai desa, layanan kependudukan terpadu, Pustu, dan Masjid Jami Al-Barokah.',
    lead: 'Ketua Dusun: Bpk. Nana Suryana'
  },
  {
    id: 'mekarsari',
    name: 'Dusun Mekarsari',
    badge: 'Agrowisata & Kopi',
    rw: 'RW 03',
    rtCount: '4 RT (RT 09–12)',
    desc: 'Lembah wisata terasering hijau, hulu jaringan irigasi air pegunungan, dan perkebunan kopi Ciremai.',
    lead: 'Ketua Dusun: Bpk. Koswara'
  },
  {
    id: 'babakan',
    name: 'Dusun Babakan',
    badge: 'Sentra UMKM & Warga',
    rw: 'RW 04',
    rtCount: '4 RT (RT 13–16)',
    desc: 'Kawasan pemukiman terpadu, sentra kerajinan tangan, dan industri olahan pangan BUMDes.',
    lead: 'Ketua Dusun: Bpk. Juhana'
  }
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

        {/* ── 1. Official Village Emblem & Dignified Header ── */}
        <div ref={heroRef} className={`reveal${heroVisible ? ' visible' : ''}`} style={{ textAlign: 'center', marginBottom: '44px' }}>
          {/* Emblem Container Khusus */}
          <div style={{
            width: '124px',
            height: '124px',
            margin: '0 auto 20px',
            borderRadius: '28px',
            padding: '4px',
            background: 'linear-gradient(135deg, #cfa23d 0%, #1a9020 50%, #0d4a12 100%)',
            boxShadow: '0 12px 36px rgba(26, 144, 32, 0.22), 0 0 0 8px rgba(207, 162, 61, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '10px'
            }}>
              <img
                src="/logo-desa-sukadana.png"
                alt="Lambang Resmi Pemerintah Desa Sukadana"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-brand-600)"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>';
                  }
                }}
              />
            </div>
          </div>

          {/* Institutional Hierarchy Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '14px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cfa23d' }} />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-brand-700)'
            }}>
              Pemerintah Kabupaten Majalengka &bull; Kecamatan Argapura
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: '0 auto 12px',
            maxWidth: '820px'
          }}>
            Monografi &amp; Profil Kewilayahan Desa Sukadana
          </h2>

          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            Kawasan agropolitan terasering di lereng timur Gunung Ciremai. Menghubungkan tradisi agraris hortikultura yang subur, kesigapan aparatur, dan pelayanan publik desa yang terintegrasi.
          </p>
        </div>

        {/* ── 2. 4 Indikator Utama Wilayah (Unified Vital Strip) ── */}
        <div
          ref={statsRef}
          className={`reveal-stagger${statsVisible ? ' visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '48px'
          }}
        >
          {VILLAGE_STATS.map(s => (
            <StatCard key={s.label} {...s} animate={statsVisible} />
          ))}
        </div>

        {/* ── 3. Matriks Monografi: Batas Wilayah & Potensi Kawasan ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Card 1: Geografis & Batas Administrasi */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.15) 0%, rgba(207, 162, 61, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-600)'
                  }}>
                    <Compass size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      Batas Wilayah &amp; Geografis
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Topografi Kaki Gunung Ciremai
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'var(--color-brand-50)',
                  color: 'var(--color-brand-700)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-brand-200)'
                }}>
                  Geospasial Definitif
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>
                Secara fisiografis, Desa Sukadana bertopografi perbukitan terasering dengan tanah vulkanik andosol subur berhawa sejuk di ketinggian 750 hingga 1.200 meter di atas permukaan laut.
              </p>

              {/* 4 Batas Wilayah Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                marginBottom: '20px'
              }}>
                {[
                  { label: 'Batas Utara', val: 'Desa Haurgelis', desc: 'Akses perhubungan antar-desa' },
                  { label: 'Batas Selatan', val: 'TNGC (Hutan Lindung)', desc: 'Kawasan konservasi Ciremai' },
                  { label: 'Batas Timur', val: 'Desa Tejamulya', desc: 'Kawasan agrobisnis sayuran' },
                  { label: 'Batas Barat', val: 'Desa Sukasari Kaler', desc: 'Jalur wisata lembah Panyaweuyan' }
                ].map((b, idx) => (
                  <div key={idx} style={{
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px'
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-brand-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      {b.val}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {b.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pemanfaatan Tata Guna Lahan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(26,144,32,0.06) 0%, rgba(207,162,61,0.06) 100%)',
              border: '1px solid rgba(26,144,32,0.18)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-brand-700)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={13} /> Distribusi Pemanfaatan Lahan (1.247 Ha):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pertanian Terasering Hortikultura:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>840 Ha (67,4%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Hutan Lindung &amp; Resapan Air:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>290 Ha (23,2%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pemukiman &amp; Sarana Fasilitas:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>117 Ha (9,4%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Potensi Ekonomi & Komoditas Unggulan */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.18) 0%, rgba(26, 144, 32, 0.12) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cfa23d'
                  }}>
                    <Wheat size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      Potensi Komoditas &amp; Ekonomi
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Kemandirian Agrobisnis &amp; Agrowisata
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'rgba(207, 162, 61, 0.12)',
                  color: '#9c771e',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(207, 162, 61, 0.3)'
                }}>
                  Sektor Prioritas
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>
                Perekonomian Desa Sukadana ditopang oleh ekosistem hortikultura sayuran terpadu yang didukung oleh sistem irigasi gravitasi dan badan usaha milik desa.
              </p>

              {/* 4 Komoditas / Sektor List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                {[
                  {
                    title: 'Bawang Daun Super Ciremai',
                    tag: 'Komoditas Utama',
                    desc: 'Aroma tajam, batang tebal, dan tahan simpan. Menjadi pemasok harian pasar induk Jawa Barat.'
                  },
                  {
                    title: 'Sistem Irigasi Gravitasi Alami',
                    tag: 'Infrastruktur Tani',
                    desc: 'Pipanisasi air dari sumber mata air hulu Ciremai mengalirkan air jernih ke seluruh petak terasering.'
                  },
                  {
                    title: 'Agrowisata Lembah Terasering',
                    tag: 'Pariwisata Desa',
                    desc: 'Lanskap terasering berundak, petik sayur langsung petani, dan rute trekking pegunungan asri.'
                  },
                  {
                    title: 'BUMDes Sukadana Mandiri',
                    tag: 'Penggerak Ekonomi',
                    desc: 'Penyalur pupuk subsidi resmi, fasilitasi logistik pascapanen, dan pembinaan kelompok tani.'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--color-brand-primary)',
                      marginTop: '6px',
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--color-brand-600)', background: 'var(--color-brand-50)', padding: '1px 6px', borderRadius: '4px' }}>
                          {item.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0', lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Sumber: Profil Pembangunan Desa Sukadana</span>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-600)' }}>Pembaruan 2026</span>
            </div>
          </div>
        </div>

        {/* ── 4. Pembagian Wilayah 4 Dusun Administratif ── */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-brand-primary)'
            }}>
              Kewilayahan Administratif
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              margin: '6px 0 8px 0'
            }}>
              4 Dusun Pemerintahan Desa Sukadana
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Setiap dusun dipimpin oleh Kepala Dusun (Kadus) yang mengkoordinasikan rukun warga (RW) dan rukun tetangga (RT).
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {VILLAGE_DUSUNS.map(dusun => (
              <div
                key={dusun.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: 'var(--color-brand-50)',
                      color: 'var(--color-brand-700)',
                      border: '1px solid var(--color-brand-200)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {dusun.rw} &bull; {dusun.rtCount}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      {dusun.badge}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-serif)',
                    margin: '0 0 8px 0'
                  }}>
                    {dusun.name}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {dusun.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)'
                }}>
                  {dusun.lead}
                </div>
              </div>
            ))}
          </div>
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

          {/* ── Executive Showcase Card: Kuwu Sukadana ── */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-raised) 100%)',
            border: '2px solid var(--color-brand-500)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
            marginBottom: '36px',
            boxShadow: '0 8px 30px rgba(26, 144, 32, 0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '28px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Emerald-Gold Top Rim */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #cfa23d 0%, #1a9020 50%, #cfa23d 100%)'
            }} />

            {/* Kuwu Avatar with Royal Rim */}
            <div style={{
              width: '104px',
              height: '104px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #cfa23d 0%, #1a9020 100%)',
              boxShadow: '0 6px 20px rgba(26, 144, 32, 0.25)',
              flexShrink: 0
            }}>
              <img
                src={VILLAGE_OFFICIALS[0].avatar}
                alt={VILLAGE_OFFICIALS[0].name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ffffff'
                }}
              />
            </div>

            {/* Info and Quote */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))',
                  color: '#ffffff',
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Pimpinan Pemerintahan Desa
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  NIP: {VILLAGE_OFFICIALS[0].nip}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: '0 0 3px 0',
                letterSpacing: '-0.01em'
              }}>
                {VILLAGE_OFFICIALS[0].name}
              </h3>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-brand-700)', marginBottom: '12px' }}>
                Kuwu / Kepala Desa Sukadana &bull; Masa Bakti 2024–2030
              </div>

              <p style={{
                fontSize: '0.92rem',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                lineHeight: 1.7,
                margin: 0,
                position: 'relative',
                paddingLeft: '18px'
              }}>
                <Quote size={13} style={{ position: 'absolute', left: 0, top: '4px', opacity: 0.6, color: 'var(--color-brand-600)' }} />
                "{VILLAGE_OFFICIALS[0].quote}"
              </p>
            </div>

            {/* Direct Contact Button */}
            <div style={{ flexShrink: 0 }}>
              <a
                href={`tel:${VILLAGE_OFFICIALS[0].phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-brand-600)',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(26, 144, 32, 0.25)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Phone size={14} /> Hubungi Kuwu
              </a>
            </div>
          </div>

          {/* Subheader: Sekretariat, Kasi & Kadus */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                Aparatur Sekretariat, Kepala Seksi & Kepala Dusun
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                Pamong pelaksana teknis pelayanan administrasi kependudukan dan kewilayahan.
              </p>
            </div>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600
            }}>
              {VILLAGE_OFFICIALS.length - 1} Aparatur Desa
            </span>
          </div>

          <div
            className={`reveal-stagger${officialVisible ? ' visible' : ''}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '16px'
            }}
          >
            {VILLAGE_OFFICIALS.slice(1).map(official => (
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
