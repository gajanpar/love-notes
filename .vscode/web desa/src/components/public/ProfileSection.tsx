// src/components/public/ProfileSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Target, Award, Phone, Sparkles, Quote,
  MapPin, Calendar, RotateCcw, Mountain, Wheat,
  Landmark, CheckCircle2, ChevronDown, ChevronUp, TreePine,
  Compass, Droplets, SunMedium, Layers, Home, ArrowRight,
  ShieldCheck, Sprout, Shield, Building2, UserCheck,
  FileText, Activity
} from 'lucide-react';
import { VILLAGE_OFFICIALS, BPD_MEMBERS } from '../../data/mockData';
import type { BPDMember } from '../../types';
import { GeoMapSection } from './GeoMapSection';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
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
  { icon: <Landmark size={22} color="#8b5cf6" />, value: 5, suffix: ' Blok', label: 'Blok Wilayah Definitif', sub: 'Desa, Panyekran, Jingkang, dll' },
];

// ─── 5 Blok Administratif & Kewilayahan Data ─────────────────────────────────
const VILLAGE_BLOKS = [
  {
    id: 'blok-desa',
    name: 'Blok Desa',
    badge: 'Pusat Pemerintahan',
    focus: 'Sentra Administrasi & Pelayanan',
    desc: 'Pusat pemerintahan desa, kantor balai desa, pos pelayanan terpadu, fasilitas kesehatan Pustu, dan Masjid Jami.',
    lead: 'Wilayah Pelayanan Publik Terpadu',
    stats: '820 Jiwa • RW 01 (RT 01-04)'
  },
  {
    id: 'blok-panyekran',
    name: 'Blok Panyekran',
    badge: 'Pertanian & Irigasi',
    focus: 'Lumbung Hortikultura',
    desc: 'Kawasan pertanian terasering subur yang ditopang oleh saluran distribusi irigasi gravitasi mata air pegunungan.',
    lead: 'Sentra Terasering & Jaringan Irigasi',
    stats: '1.040 Jiwa • RW 02 (RT 05-08)'
  },
  {
    id: 'blok-jingkang',
    name: 'Blok Jingkang',
    badge: 'Sentra Daun Bawang',
    focus: 'Komoditas Unggulan Ciremai',
    desc: 'Sentra budidaya daun bawang kualitas super lereng Gunung Ciremai, pergudangan hasil bumi, dan basis Gapoktan.',
    lead: 'Pusat Distribusi Komoditas Unggulan',
    stats: '1.215 Jiwa • RW 03 (RT 09-12)'
  },
  {
    id: 'blok-gunung-tengah',
    name: 'Blok Gunung Tengah',
    badge: 'Agrowisata & Ketinggian',
    focus: 'Elevasi & Wisata Alam',
    desc: 'Kawasan perbukitan agrowisata terasering berundak, perkebunan kopi khas Ciremai, serta bentang panorama alam asri.',
    lead: 'Kawasan Wisata Alam & Kebun Kopi',
    stats: '960 Jiwa • RW 04 (RT 13-15)'
  },
  {
    id: 'blok-balandongan',
    name: 'Blok Balandongan',
    badge: 'Pemukiman & UMKM',
    focus: 'Kemandirian Ekonomi Warga',
    desc: 'Kawasan pemukiman warga terpadu, pusat kerajinan lokal, dan sentra industri olahan pangan kemasyarakatan.',
    lead: 'Sentra Kerajinan & Pengolahan Pangan',
    stats: '788 Jiwa • RW 05 (RT 16-18)'
  }
];

// ─── Misi Pillars ─────────────────────────────────────────────────────────────
const MISI_PILLARS = [
  {
    icon: <Sparkles size={14} />, tag: 'Pilar 1 — Digitalisasi',
    title: 'Transformasi Digital Layanan Publik',
    desc: 'Platform GaaS ber-TTE resmi BSrE/BSSN untuk semua surat desa, integrasi data kependudukan, dan portal pelayanan warga 24 jam.'
  },
  {
    icon: <Mountain size={14} />, tag: 'Pilar 2 — Infrastruktur',
    title: 'Jalan Usaha Tani & Irigasi Ciremai',
    desc: 'Pembangunan jalan perkerasan terasering, pipanisasi air gravitasi irigasi pertanian sayuran dan daun bawang lereng Gunung Ciremai.'
  },
  {
    icon: <Wheat size={14} />, tag: 'Pilar 3 — Ekonomi',
    title: 'Agrobisnis & UMKM Desa Mandiri',
    desc: 'Penguatan BUMDes Sukadana Mandiri, pembinaan Gapoktan hortikultura daun bawang, dan pengembangan agrowisata terasering terpadu.'
  },
  {
    icon: <TreePine size={14} />, tag: 'Pilar 4 — SDM & Lingkungan',
    title: 'SDM Unggul & Kelestarian Ekosistem',
    desc: 'Program posyandu aktif, beasiswa anak tani berprestasi, serta pelestarian hutan lindung kawasan resapan lereng Ciremai.'
  }
];

export type ProfileCategoryType = 'potensi' | 'peta' | 'aparatur' | 'visi-misi';
export type AparaturSubType = 'bpd' | 'pemdes';

interface ProfileSectionProps {
  initialCategory?: ProfileCategoryType;
  initialAparaturSub?: AparaturSubType;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  initialCategory = 'potensi',
  initialAparaturSub = 'bpd'
}) => {
  const { ref: heroRef, visible: heroVisible } = useScrollReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: officialRef, visible: officialVisible } = useScrollReveal(0.1);

  // Active Category State (4 categories specified by user)
  const [activeCategory, setActiveCategory] = useState<ProfileCategoryType>(initialCategory);
  // Active Sub-category for Aparatur (BPD vs Pemerintah Desa)
  const [aparaturSub, setAparaturSub] = useState<AparaturSubType>(initialAparaturSub);

  const [openMisi, setOpenMisi] = useState<number | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialAparaturSub) {
      setAparaturSub(initialAparaturSub);
    }
  }, [initialAparaturSub]);

  // Categories config
  const categories = [
    { id: 'potensi' as ProfileCategoryType, label: 'Potensi Desa', icon: <Wheat size={16} /> },
    { id: 'peta' as ProfileCategoryType, label: 'Peta Desa Ciburial', icon: <Compass size={16} /> },
    { id: 'aparatur' as ProfileCategoryType, label: 'Profil Aparatur', icon: <Users size={16} />, badge: 'BPD & Pemdes' },
    { id: 'visi-misi' as ProfileCategoryType, label: 'Visi dan Misi', icon: <Target size={16} /> }
  ];

  return (
    <section id="profil" style={{ padding: '48px 0 80px 0', background: 'var(--color-bg)' }}>
      <div className="container">

        {/* ── 1. Dignified Section Header ── */}
        <div ref={heroRef} className={`reveal${heroVisible ? ' visible' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
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
            fontSize: 'clamp(1.85rem, 3.4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: '0 auto 10px',
            maxWidth: '820px'
          }}>
            Profil &amp; Tata Wilayah Desa Sukadana
          </h2>

          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.65,
            maxWidth: '680px',
            margin: '0 auto 28px'
          }}>
            Pusat informasi resmi potensi agrobisnis terasering, batas wilayah geospasial, struktur BPD &amp; Pemerintah Desa, serta komitmen visi pembangunan.
          </p>

          {/* ── 2. Category Switcher Pills (4 Kategori Utama) ── */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    window.location.hash = `#${cat.id}`;
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, #1a9020 0%, #136918 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 12px rgba(26, 144, 32, 0.3)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-brand-100)',
                      color: isActive ? '#ffffff' : 'var(--color-brand-800)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KATEGORI 1: POTENSI DESA */}
        {/* ========================================================================= */}
        {activeCategory === 'potensi' && (
          <div>
            {/* 4 Strip Indikator Kawasan */}
            <div
              ref={statsRef}
              className={`reveal${statsVisible ? ' visible' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                marginBottom: '36px'
              }}
            >
              {VILLAGE_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 20px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {stat.icon}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      {stat.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)', lineHeight: 1.1 }}>
                    {stat.value.toLocaleString('id-ID')}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-brand-600)', marginLeft: '4px' }}>
                      {stat.suffix}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Matriks 2 Kolom: Batas Geospasial & Potensi Unggulan */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {/* Kolom Kiri: Potensi Komoditas Hortikultura */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.2) 0%, rgba(26, 144, 32, 0.15) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cfa23d'
                  }}>
                    <Wheat size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      Potensi Agrobisnis Terasering
                    </h3>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Komoditas Unggulan Lereng Ciremai
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '20px' }}>
                  Desa Sukadana memiliki iklim mikro sejuk dengan tanah vulkanis andosol yang sangat subur, menjadikannya pemasok harian sayuran berkualitas tinggi bagi pasar induk di wilayah Jawa Barat dan Jabodetabek.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { title: 'Bawang Daun Super Ciremai', tag: 'Primadona', desc: 'Batang tebal, aroma tajam khas, dan tahan simpan dengan luas tanam produktif lebih dari 120 Ha.' },
                    { title: 'Sistem Irigasi Gravitasi Murni', tag: 'Infrastruktur', desc: 'Pipanisasi air dari sumber mata air alami pegunungan yang menjaga kesuburan terasering sepanjang tahun.' },
                    { title: 'Perkebunan Kopi Lereng Ciremai', tag: 'Perkebunan', desc: 'Kopi Arabika dan Robusta varietas Ciremai dengan cita rasa fruity dan aroma rempah khas pegunungan.' },
                    { title: 'BUMDes Sukadana Mandiri', tag: 'Ekonomi Desa', desc: 'Lembaga distribusi pupuk subsidi resmi, fasilitasi logistik pascapanen, dan pembinaan kelompok tani.' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{item.title}</strong>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-brand-700)', background: 'var(--color-brand-100)', padding: '1px 6px', borderRadius: '4px' }}>
                          {item.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: Potensi Agrowisata & Lanskap Terasering */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.18) 0%, rgba(14, 165, 233, 0.15) 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)'
                    }}>
                      <Mountain size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                        Potensi Agrowisata Lembah Ciremai
                      </h3>
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Pesona Alam Terasering Panyaweuyan Argapura
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '18px' }}>
                    Terletak di ketinggian 750 – 1.200 mdpl, kawasan perbukitan berundak Desa Sukadana menawarkan panorama alam spektakuler yang menarik wisatawan domestik maupun mancanegara.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    {[
                      { title: 'Wisata Edukasi Tani', desc: 'Pengalaman petik langsung daun bawang, wortel, dan sayuran segar bersama petani lokal.' },
                      { title: 'Jalur Trekking Pegunungan', desc: 'Rute jalan sehat menyusuri tebing terasering hijau dengan latar puncak Gunung Ciremai.' },
                      { title: 'Homestay Ramah Warga', desc: 'Akomodasi penginapan berkonsep kearifan lokal Sunda dengan hawa sejuk alami tanpa pendingin udara.' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        padding: '10px 14px', borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)'
                      }}>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>{item.title}</strong>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0', lineHeight: 1.45 }}>
                          {item.desc}
                        </p>
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-brand-700)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={13} /> Distribusi Lahan (1.247 Ha):
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Pertanian Terasering Hortikultura:</span>
                    <strong>840 Ha (67,4%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Hutan Lindung &amp; Resapan Air:</span>
                    <strong>290 Ha (23,2%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Pemukiman &amp; Sarana Umum:</span>
                    <strong>117 Ha (9,4%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Blok Kewilayahan */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 24px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brand-primary)' }}>
                  Kewilayahan Administratif
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>
                  5 Blok Wilayah Pemerintahan Desa Sukadana
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Pembagian wilayah teritorial desa untuk koordinasi tata kelola pembangunan, distribusi air irigasi, dan kemasyarakatan.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px'
              }}>
                {VILLAGE_BLOKS.map(blok => (
                  <div
                    key={blok.id}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 800,
                          background: 'var(--color-brand-50)', color: 'var(--color-brand-700)',
                          border: '1px solid var(--color-brand-200)', padding: '2px 8px', borderRadius: 'var(--radius-full)'
                        }}>
                          {blok.badge}
                        </span>
                      </div>

                      <h4 style={{
                        fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-serif)', margin: '0 0 6px 0'
                      }}>
                        {blok.name}
                      </h4>

                      <div style={{ fontSize: '0.72rem', color: '#cfa23d', fontWeight: 700, marginBottom: '6px' }}>
                        {blok.focus}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {blok.desc}
                      </p>
                    </div>

                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      <div style={{ fontWeight: 600 }}>{blok.stats}</div>
                      <div style={{ color: 'var(--color-brand-600)', fontWeight: 700, marginTop: '2px' }}>{blok.lead}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* KATEGORI 2: PETA DESA CIBURIAL (INTEGRASI GEOSPATIAL MAP) */}
        {/* ========================================================================= */}
        {activeCategory === 'peta' && (
          <div>
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.2) 0%, rgba(26, 144, 32, 0.15) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cfa23d'
                  }}>
                    <Compass size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      Peta Digital &amp; Batas Administrasi Kewilayahan
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Peta Geospasial Interaktif Desa Sukadana / Referensi Ciburial dengan Layer Infrastruktur &amp; Fasilitas Publik
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800,
                    background: 'rgba(26, 144, 32, 0.1)', color: 'var(--color-brand-700)',
                    padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(26, 144, 32, 0.25)'
                  }}>
                    Sistem Koordinat: WGS 84 (-6.8985, 108.3150)
                  </span>
                </div>
              </div>

              {/* Batas Administrasi Ringkas 4 Arah Mata Angin */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {[
                  { arah: 'Utara', perbatasan: 'Desa Haurgelis', desc: 'Akses perhubungan antar-desa' },
                  { arah: 'Selatan', perbatasan: 'Taman Nasional G. Ciremai', desc: 'Zona hutan lindung & konservasi air' },
                  { arah: 'Timur', perbatasan: 'Desa Tejamulya', desc: 'Kawasan agrobisnis terasering' },
                  { arah: 'Barat', perbatasan: 'Desa Sukasari Kaler', desc: 'Jalur wisata lembah Panyaweuyan' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand-600)', textTransform: 'uppercase' }}>
                      Batas {item.arah}
                    </div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                      {item.perbatasan}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Embedded GeoMapSection */}
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)'
              }}>
                <GeoMapSection />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* KATEGORI 3: PROFIL APARATUR (2 SUB-KATEGORI: BPD & PEMERINTAH DESA) */}
        {/* ========================================================================= */}
        {activeCategory === 'aparatur' && (
          <div>
            {/* Sub-kategori Switcher Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'inline-flex',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <button
                  onClick={() => {
                    setAparaturSub('bpd');
                    window.location.hash = '#bpd';
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 24px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: aparaturSub === 'bpd'
                      ? 'linear-gradient(135deg, #cfa23d 0%, #6a5724 100%)'
                      : 'transparent',
                    color: aparaturSub === 'bpd' ? '#ffffff' : 'var(--color-text-primary)',
                    fontWeight: aparaturSub === 'bpd' ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: aparaturSub === 'bpd' ? '0 4px 14px rgba(207, 162, 61, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Shield size={16} />
                  <span>BPD (Badan Permusyawaratan Desa)</span>
                </button>

                <button
                  onClick={() => {
                    setAparaturSub('pemdes');
                    window.location.hash = '#pemdes';
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 24px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: aparaturSub === 'pemdes'
                      ? 'linear-gradient(135deg, #1a9020 0%, #136918 100%)'
                      : 'transparent',
                    color: aparaturSub === 'pemdes' ? '#ffffff' : 'var(--color-text-primary)',
                    fontWeight: aparaturSub === 'pemdes' ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: aparaturSub === 'pemdes' ? '0 4px 14px rgba(26, 144, 32, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building2 size={16} />
                  <span>Pemerintah Desa (Pamong Desa)</span>
                </button>
              </div>
            </div>

            {/* ── SUB-KATEGORI A: BPD ── */}
            {aparaturSub === 'bpd' && (
              <div>
                {/* BPD Institutional Brief */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(207, 162, 61, 0.08) 0%, rgba(26, 144, 32, 0.05) 100%)',
                  border: '1px solid rgba(207, 162, 61, 0.3)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px 28px',
                  marginBottom: '28px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}>
                  <div style={{ maxWidth: '680px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9c771e', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                      <Shield size={14} /> Landasan Hukum: Permendagri No. 110 Tahun 2016
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
                      Badan Permusyawaratan Desa (BPD) Sukadana
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      BPD merupakan lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa. BPD berkedudukan sebagai unsur penyelenggara pemerintahan desa yang menampung aspirasi masyarakat, mengawasi kinerja Kuwu, dan membahas rancangan peraturan desa.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      'Membahas & Menyepakati Rancangan Perdes Bersama Kuwu',
                      'Menampung & Menyalurkan Aspirasi Warga 5 Blok',
                      'Melakukan Pengawasan Kinerja Pemerintah Desa'
                    ].map((duty, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                        <CheckCircle2 size={15} color="#cfa23d" style={{ flexShrink: 0 }} />
                        <span>{duty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BPD Members Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {BPD_MEMBERS.map(member => (
                    <div
                      key={member.id}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                          <img
                            src={member.avatar}
                            alt={member.name}
                            style={{
                              width: '64px', height: '64px', borderRadius: '18px',
                              objectFit: 'cover', border: '2px solid rgba(207, 162, 61, 0.4)'
                            }}
                          />
                          <div>
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 800,
                              color: '#9c771e', background: 'rgba(207, 162, 61, 0.12)',
                              padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'inline-block', marginBottom: '4px'
                            }}>
                              {member.role}
                            </span>
                            <h4 style={{
                              fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)',
                              fontFamily: 'var(--font-serif)', margin: 0, lineHeight: 1.2
                            }}>
                              {member.name}
                            </h4>
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              {member.representativeArea}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          background: 'var(--color-surface-raised)',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          marginBottom: '14px'
                        }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand-primary)', textTransform: 'uppercase', marginBottom: '3px' }}>
                            Fokus Pengawasan:
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                            {member.focusArea}
                          </div>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                          "{member.quote}"
                        </p>
                      </div>

                      <div style={{
                        marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-text-muted)'
                      }}>
                        <span>Kontak Aspirasi:</span>
                        <a href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-brand-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {member.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUB-KATEGORI B: PEMERINTAH DESA (PAMONG DESA) ── */}
            {aparaturSub === 'pemdes' && (
              <div>
                {/* Executive Showcase Card Kuwu */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.08) 0%, rgba(207, 162, 61, 0.06) 100%)',
                  border: '1px solid rgba(26, 144, 32, 0.25)',
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'clamp(24px, 4vw, 36px)',
                  marginBottom: '28px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <img
                        src={VILLAGE_OFFICIALS[0].avatar}
                        alt={VILLAGE_OFFICIALS[0].name}
                        style={{
                          width: '96px', height: '96px', borderRadius: '24px',
                          objectFit: 'cover', border: '3px solid var(--color-brand-primary)',
                          boxShadow: '0 8px 24px rgba(26, 144, 32, 0.2)'
                        }}
                      />
                      <div>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 800,
                          color: '#ffffff', background: 'var(--color-brand-600)',
                          padding: '3px 10px', borderRadius: 'var(--radius-full)', display: 'inline-block', marginBottom: '6px'
                        }}>
                          {VILLAGE_OFFICIALS[0].role}
                        </span>
                        <h3 style={{
                          fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800,
                          color: 'var(--color-text-primary)', margin: '0 0 4px 0'
                        }}>
                          {VILLAGE_OFFICIALS[0].name}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          NIP: {VILLAGE_OFFICIALS[0].nip} &bull; Masa Bakti 2024–2030
                        </div>
                      </div>
                    </div>

                    <div style={{ maxWidth: '480px' }}>
                      <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                        "{VILLAGE_OFFICIALS[0].quote}"
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a
                          href={`https://wa.me/${VILLAGE_OFFICIALS[0].phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'var(--color-brand-primary)', color: '#ffffff',
                            padding: '6px 14px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none'
                          }}
                        >
                          <Phone size={13} /> Kontak Kuwu Langsung
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perangkat Desa (Pamong Desa) Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '18px'
                }}>
                  {VILLAGE_OFFICIALS.slice(1).map(official => (
                    <div
                      key={official.id}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <img
                            src={official.avatar}
                            alt={official.name}
                            style={{
                              width: '52px', height: '52px', borderRadius: '14px',
                              objectFit: 'cover', border: '1px solid var(--color-border)'
                            }}
                          />
                          <div>
                            <span style={{
                              fontSize: '0.66rem', fontWeight: 800,
                              color: 'var(--color-brand-700)', background: 'var(--color-brand-50)',
                              padding: '2px 7px', borderRadius: '4px', display: 'inline-block', marginBottom: '2px'
                            }}>
                              {official.role}
                            </span>
                            <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                              {official.name}
                            </h4>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              NIP: {official.nip}
                            </div>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: 0, lineHeight: 1.45 }}>
                          "{official.quote}"
                        </p>
                      </div>

                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Layanan Loket:</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>{official.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* KATEGORI 4: VISI DAN MISI */}
        {/* ========================================================================= */}
        {activeCategory === 'visi-misi' && (
          <div>
            {/* Visi Card */}
            <div style={{
              background: 'linear-gradient(135deg, #142214 0%, #1e2e1e 50%, #182218 100%)',
              border: '2px solid rgba(207, 162, 61, 0.4)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(28px, 4.5vw, 44px)',
              color: '#ffffff',
              marginBottom: '32px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 800,
                color: 'var(--color-gold-300)', background: 'rgba(207, 162, 61, 0.15)',
                padding: '4px 14px', borderRadius: 'var(--radius-full)', letterSpacing: '0.06em', textTransform: 'uppercase',
                display: 'inline-block', marginBottom: '14px'
              }}>
                Visi Pembangunan Jangka Panjang 2024–2030
              </span>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
                fontWeight: 800,
                lineHeight: 1.3,
                maxWidth: '900px',
                margin: '0 auto 16px',
                color: '#ffffff'
              }}>
                "Terwujudnya Desa Sukadana yang Mandiri, Sejahtera, dan Berakhlak Mulia Berbasis Agrowisata Terasering dan Pelayanan Publik Digital yang Prima."
              </h3>

              <p style={{
                fontSize: '0.92rem',
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '720px',
                margin: '0 auto',
                lineHeight: 1.65
              }}>
                Dicanangkan sebagai arah haluan pembangunan partisipatif yang memadukan kekuatan tradisi agraris pegunungan Ciremai dengan kemajuan teknologi pelayanan digital modern.
              </p>
            </div>

            {/* 4 Pilar Misi Pembangunan */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 24px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brand-primary)' }}>
                  Arah Kebijakan Strategis
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: '4px 0 6px 0' }}>
                  4 Pilar Misi Pembangunan Desa Sukadana
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Penjabaran operasional visi ke dalam program kerja nyata dan terukur bagi seluruh masyarakat.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px'
              }}>
                {MISI_PILLARS.map((pillar, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--color-brand-mid)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 800,
                          color: 'var(--color-brand-700)', background: 'var(--color-brand-50)',
                          padding: '3px 8px', borderRadius: '4px'
                        }}>
                          {pillar.tag}
                        </span>
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(26,144,32,0.15) 0%, rgba(207,162,61,0.15) 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-brand-primary)', fontWeight: 800, fontSize: '0.78rem'
                        }}>
                          0{idx + 1}
                        </span>
                      </div>

                      <h5 style={{
                        fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-sans)', margin: '0 0 8px 0', lineHeight: 1.3
                      }}>
                        {pillar.title}
                      </h5>

                      <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
