// src/components/public/APBDesSection.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Building2, GraduationCap, Activity, Landmark,
  Download, Eye, X, TrendingUp, Calculator, Coins,
  CheckCircle2, Sprout, ArrowRight
} from 'lucide-react';
import { MOCK_APBDES_2026 } from '../../data/mockData';
import { APBDesCategory } from '../../types';
import { useToast } from '../common/ToastContext';

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
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

// ─── Chart Color Map ──────────────────────────────────────────────────────────
const CHART_COLORS: Record<string, { solid: string; light: string; icon: React.ReactNode }> = {
  infra:         { solid: '#1b8f21', light: 'rgba(27,143,33,0.12)',   icon: <Building2 size={18} /> },
  pendidikan:    { solid: '#0ea5e9', light: 'rgba(14,165,233,0.12)',  icon: <Sprout size={18} /> },
  kesehatan:     { solid: '#f59e0b', light: 'rgba(245,158,11,0.12)', icon: <Activity size={18} /> },
  pemerintahan:  { solid: '#8b5cf6', light: 'rgba(139,92,246,0.12)', icon: <Landmark size={18} /> },
  operasional:   { solid: '#8b5cf6', light: 'rgba(139,92,246,0.12)', icon: <Landmark size={18} /> },
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart: React.FC<{
  data: { id: string; title: string; anggaran: number; pct: number }[];
  total: number;
  totalPct: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}> = ({ data, total, totalPct, hoveredId, onHover }) => {
  const SIZE = 160;
  const RADIUS = 60;
  const STROKE = 12;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let offset = 0;
  const segments = data.map(d => {
    const dashLen = (d.pct / 100) * CIRCUMFERENCE;
    const gap = 4;
    const seg = { ...d, dashLen: dashLen - gap, dashOffset: -(offset + gap / 2) };
    offset += dashLen;
    return seg;
  });

  const formatIDRShort = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    if (val >= 1_000_000)     return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <svg
      className="donut-svg"
      width={SIZE} height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-label="Grafik Donut APBDes"
    >
      {/* Background ring */}
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
        fill="none"
        stroke="var(--color-surface-raised)"
        strokeWidth={STROKE}
      />
      {/* Segments */}
      {segments.map(seg => {
        const color = CHART_COLORS[seg.id]?.solid ?? '#888';
        const isHovered = hoveredId === seg.id;
        return (
          <circle
            key={seg.id}
            className="donut-segment"
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={isHovered ? 16 : STROKE}
            strokeDasharray={`${seg.dashLen} ${CIRCUMFERENCE}`}
            strokeDashoffset={seg.dashOffset - CIRCUMFERENCE / 4}
            opacity={hoveredId && !isHovered ? 0.45 : 1}
            style={{ transition: 'all 0.25s ease', cursor: 'pointer' }}
            onMouseEnter={() => onHover(seg.id)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
      {/* Center text */}
      <text x={SIZE / 2} y={SIZE / 2 - 10} className="donut-center-text" fill="var(--color-text-primary)"
        style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-sans)', fontFeatureSettings: '"tnum"' }}>
        {hoveredId
          ? `${data.find(d => d.id === hoveredId)?.pct.toFixed(0)}%`
          : `${totalPct}%`
        }
      </text>
      <text x={SIZE / 2} y={SIZE / 2 + 10} className="donut-center-text" fill="var(--color-text-muted)"
        style={{ fontSize: '8px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
        {hoveredId
          ? (data.find(d => d.id === hoveredId)?.title ?? '')
          : 'Terserap'
        }
      </text>
      <text x={SIZE / 2} y={SIZE / 2 + 24} className="donut-center-text" fill="var(--color-text-muted)"
        style={{ fontSize: '7px', fontFamily: 'var(--font-mono)' }}>
        {hoveredId
          ? formatIDRShort(data.find(d => d.id === hoveredId)?.anggaran ?? 0)
          : formatIDRShort(total)
        }
      </text>
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const APBDesSection: React.FC = () => {
  const toast = useToast();
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<APBDesCategory | null>(null);
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(100000);
  const { ref: sectionRef, visible: sectionVisible } = useScrollReveal(0.1);
  const { ref: chartRef, visible: chartVisible } = useScrollReveal(0.15);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const formatIDRShort = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} M`;
    if (val >= 1_000_000)     return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
    return formatIDR(val);
  };

  const totalAnggaran = MOCK_APBDES_2026.reduce((acc, c) => acc + c.anggaran, 0);
  const totalTerserap = MOCK_APBDES_2026.reduce((acc, c) => acc + c.terserap, 0);
  const persentaseTotal = ((totalTerserap / totalAnggaran) * 100).toFixed(1);

  const chartData = MOCK_APBDES_2026.map(c => ({
    id: c.id,
    title: c.title,
    anggaran: c.anggaran,
    pct: (c.anggaran / totalAnggaran) * 100,
  }));

  return (
    <section id="apbdes" style={{ padding: '72px 0', background: 'var(--color-surface-subtle)' }}>
      <div className="container">

        {/* ── Section Header ─────────────────────────────────── */}
        <div ref={sectionRef} className={`reveal${sectionVisible ? ' visible' : ''}`}
          style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span style={{
            background: 'var(--color-success-50)', color: 'var(--color-success-fg)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
            display: 'inline-block', marginBottom: '14px'
          }}>
            Keterbukaan Informasi Publik
          </span>
          <h2 className="text-title" style={{ marginBottom: '12px', lineHeight: 'var(--leading-snug)' }}>
            Transparansi APBDes & Realisasi Anggaran {selectedYear}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-loose)' }}>
            Setiap rupiah dana desa dapat diakses dan diawasi oleh seluruh warga secara terbuka dan akuntabel.
          </p>
        </div>

        {/* ── Main Budget Card ───────────────────────────────── */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '36px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '32px'
        }}>
          {/* Top Info Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '24px', marginBottom: '32px'
          }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '6px' }}>
                Total Anggaran Pendapatan & Belanja Desa (APBDes)
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 800, color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                  fontFeatureSettings: '"tnum"'
                }}>
                  {formatIDR(totalAnggaran)}
                </span>
                <span style={{
                  background: 'var(--color-success-50)', color: 'var(--color-success-fg)',
                  padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  fontWeight: 700, fontSize: 'var(--text-sm)',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <TrendingUp size={13} /> {persentaseTotal}% Terserap
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Realisasi Terserap: <strong>{formatIDR(totalTerserap)}</strong>
                <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>(Posisi s.d 28 Agustus 2026)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Year Selector */}
              <div style={{
                display: 'flex', background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-md)', padding: '3px',
                border: '1px solid var(--color-border)'
              }}>
                {['2026', '2025', '2024'].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    style={{
                      background: selectedYear === yr ? 'var(--color-surface)' : 'transparent',
                      color: selectedYear === yr ? 'var(--color-brand-600)' : 'var(--color-text-secondary)',
                      fontWeight: selectedYear === yr ? 700 : 500,
                      border: 'none', borderRadius: 'var(--radius-sm)',
                      padding: '6px 12px', fontSize: 'var(--text-sm)', cursor: 'pointer',
                      boxShadow: selectedYear === yr ? 'var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    T.A {yr}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => toast.success('Mengunduh Laporan', 'Laporan Realisasi APBDes 2026 (PDF) sedang diunduh.')}
              >
                <Download size={14} /> Unduh PDF
              </button>
            </div>
          </div>

          {/* Master Progress Bar — upgraded */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Progres Penyerapan Anggaran Keseluruhan
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 700,
                  fontSize: 'var(--text-lg)', color: 'var(--color-brand-600)'
                }}>
                  {persentaseTotal}%
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  dari target
                </span>
              </div>
            </div>
            <div style={{
              height: '18px', background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-full)', overflow: 'hidden',
              border: '1px solid var(--color-border)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                height: '100%', width: `${persentaseTotal}%`,
                background: 'linear-gradient(90deg, var(--color-brand-500) 0%, var(--color-brand-400) 50%, #10B981 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 1.5s var(--ease-spring)',
                boxShadow: '0 2px 8px rgba(27,143,33,0.4)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                  animation: 'shimmerSlide 2s ease-in-out infinite'
                }} />
              </div>
            </div>
          </div>

          {/* ── Chart + Category Grid ─────────────────────────── */}
          <div ref={chartRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* LEFT: Donut + Legend */}
            <div className={`reveal-left${chartVisible ? ' visible' : ''}`}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--color-brand-600)', display: 'inline-block'
                }} />
                Proporsi Anggaran per Bidang
              </h4>
              <div className="chart-wrapper">
                <DonutChart
                  data={chartData}
                  total={totalAnggaran}
                  totalPct={persentaseTotal}
                  hoveredId={hoveredChart}
                  onHover={setHoveredChart}
                />
                <div className="chart-legend">
                  {MOCK_APBDES_2026.map(cat => {
                    const color = CHART_COLORS[cat.id]?.solid ?? '#888';
                    const pct = ((cat.anggaran / totalAnggaran) * 100).toFixed(1);
                    return (
                      <div
                        key={cat.id}
                        className="chart-legend-item"
                        onMouseEnter={() => setHoveredChart(cat.id)}
                        onMouseLeave={() => setHoveredChart(null)}
                        style={{ opacity: hoveredChart && hoveredChart !== cat.id ? 0.45 : 1, transition: 'opacity 0.2s' }}
                      >
                        <div className="chart-legend-dot" style={{ background: color }} />
                        <div style={{ flex: 1 }}>
                          <div className="chart-legend-label">{cat.title}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {formatIDRShort(cat.anggaran)}
                          </div>
                        </div>
                        <span className="chart-legend-value">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Bar Chart — Anggaran vs Realisasi */}
            <div className={`reveal-right${chartVisible ? ' visible' : ''}`}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#10B981', display: 'inline-block'
                }} />
                Anggaran vs Realisasi per Bidang
              </h4>
              <div className="bar-chart">
                {MOCK_APBDES_2026.map(cat => {
                  const pctRealisasi = ((cat.terserap / cat.anggaran) * 100).toFixed(0);
                  const color = CHART_COLORS[cat.id]?.solid ?? '#888';
                  const icon = CHART_COLORS[cat.id]?.icon;
                  return (
                    <div key={cat.id} className="bar-row">
                      <div className="bar-row-label">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color }}>{icon}</span>
                          <span>{cat.title}</span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', color, fontWeight: 700 }}>
                          {pctRealisasi}%
                        </span>
                      </div>
                      {/* Anggaran bar (background) */}
                      <div style={{ position: 'relative' }}>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: chartVisible ? '100%' : '0%',
                              background: CHART_COLORS[cat.id]?.light ?? '#eee',
                              transition: 'width 0.8s var(--ease-spring)'
                            }}
                          />
                        </div>
                        {/* Realisasi overlay */}
                        <div className="bar-track" style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'transparent', border: 'none' }}>
                          <div
                            className="bar-fill"
                            style={{
                              width: chartVisible ? `${pctRealisasi}%` : '0%',
                              background: color,
                              transition: `width 1.2s var(--ease-spring) ${200}ms`
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <span>Pagu: {formatIDRShort(cat.anggaran)}</span>
                        <span style={{ color }}>Serap: {formatIDRShort(cat.terserap)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── DELIGHT MOMENT 3: Citizen APBDes Allocation Simulator ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-raised) 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative background watermark */}
          <div style={{
            position: 'absolute',
            right: '-15px',
            bottom: '-15px',
            opacity: 0.04,
            pointerEvents: 'none'
          }}>
            <Coins size={220} />
          </div>

          <div style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                background: 'rgba(207, 162, 61, 0.12)',
                color: '#9a7522',
                border: '1px solid rgba(207, 162, 61, 0.25)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Calculator size={13} />
                Kalkulator Transparansi Warga
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              Simulasi Alokasi: Jika Anda Berkontribusi {formatIDR(simulatedAmount)}, Ke Mana Larinya?
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '22px',
              maxWidth: '68ch'
            }}>
              Pemerintah Desa Sukadana mengelola anggaran secara proporsional dan akuntabel. Pilih nominal simulasi untuk melihat pembagian manfaat langsungnya bagi infrastruktur, pertanian terasering, posyandu, dan pelayanan balai desa:
            </p>

            {/* Quick preset chips */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '4px' }}>
                Pilih Nominal:
              </span>
              {[25000, 50000, 100000, 250000, 500000, 1000000].map(amount => {
                const isActive = simulatedAmount === amount;
                return (
                  <button
                    key={amount}
                    onClick={() => setSimulatedAmount(amount)}
                    style={{
                      background: isActive ? 'var(--color-brand-600)' : 'var(--color-surface)',
                      color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                      border: isActive ? '1px solid var(--color-brand-600)' : '1px solid var(--color-border)',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 8px rgba(26, 144, 32, 0.25)' : 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)',
                      fontFamily: 'var(--font-mono)',
                      fontFeatureSettings: '"tnum"'
                    }}
                  >
                    {formatIDR(amount)}
                  </button>
                );
              })}
            </div>

            {/* Multi-segment Split Visual Bar */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{
                height: '14px',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                display: 'flex',
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
              }}>
                {MOCK_APBDES_2026.map(cat => {
                  const pct = (cat.anggaran / totalAnggaran) * 100;
                  const color = CHART_COLORS[cat.id]?.solid ?? '#888';
                  return (
                    <div
                      key={cat.id}
                      title={`${cat.title}: ${pct.toFixed(1)}%`}
                      style={{
                        width: `${pct}%`,
                        background: color,
                        height: '100%',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Proportional Result Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '14px'
            }}>
              {MOCK_APBDES_2026.map(cat => {
                const pct = (cat.anggaran / totalAnggaran) * 100;
                const shareAmount = Math.round(simulatedAmount * (cat.anggaran / totalAnggaran));
                const color = CHART_COLORS[cat.id]?.solid ?? 'var(--color-brand-600)';
                const lightBg = CHART_COLORS[cat.id]?.light ?? 'rgba(27,143,33,0.12)';
                const icon = CHART_COLORS[cat.id]?.icon;

                // Humanized tangible impact narrative
                const narratives: Record<string, string> = {
                  infra: 'Rabat beton jalan usaha tani, pipanisasi air bersih lereng Ciremai, & penahan longsor tebing.',
                  pendidikan: 'Bibit bawang daun unggul, subsidi pupuk organik Gapoktan, & penguatan BUMDes Sukadana.',
                  kesehatan: 'Pemberian makanan tambahan balita Posyandu Melati, pencegahan stunting, & insentif kader.',
                  operasional: 'Layanan administrasi online 24 jam bertanda tangan elektronik BSrE, balai desa, & RT/RW.',
                };
                const impactDesc = narratives[cat.id] || 'Alokasi terarah untuk peningkatan taraf hidup dan fasilitas warga Sukadana.';

                return (
                  <div
                    key={cat.id}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: `4px solid ${color}`,
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-md)',
                            background: lightBg,
                            color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {icon}
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {cat.title}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color,
                          background: lightBg,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {pct.toFixed(1)}%
                        </span>
                      </div>

                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color,
                        letterSpacing: '-0.02em',
                        fontFeatureSettings: '"tnum"',
                        margin: '6px 0 8px 0'
                      }}>
                        {formatIDR(shareAmount)}
                      </div>

                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                        margin: 0
                      }}>
                        {impactDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Reassurance Footer Note */}
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(26, 144, 32, 0.06)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(26, 144, 32, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)'
            }}>
              <CheckCircle2 size={16} color="var(--color-brand-600)" style={{ flexShrink: 0 }} />
              <span>
                <strong>Prinsip Keterbukaan Publik:</strong> Simulasi dihitung otomatis berdasarkan persentase pagu APBDes Desa Sukadana T.A {selectedYear}. Diawasi langsung oleh Badan Permusyawaratan Desa (BPD) &amp; Inspektorat Daerah.
              </span>
            </div>
          </div>
        </div>

        {/* ── Category Cards ─────────────────────────────────── */}
        <div
          className={`reveal-stagger${sectionVisible ? ' visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {MOCK_APBDES_2026.map(cat => {
            const pct = ((cat.terserap / cat.anggaran) * 100).toFixed(0);
            const color = CHART_COLORS[cat.id]?.solid ?? 'var(--color-brand-600)';
            const lightBg = CHART_COLORS[cat.id]?.light ?? 'var(--color-brand-50)';
            const icon = CHART_COLORS[cat.id]?.icon;
            return (
              <div
                key={cat.id}
                className="glass-card-premium"
                style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                    background: lightBg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${color}30`
                  }}>
                    {icon}
                  </span>
                  <span style={{
                    fontSize: 'var(--text-xs)', fontWeight: 800, color,
                    background: lightBg, padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${color}30`
                  }}>
                    {pct}% Terserap
                  </span>
                </div>

                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
                  {cat.title}
                </h4>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 800,
                  color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', marginBottom: '2px'
                }}>
                  {formatIDRShort(cat.anggaran)}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Realisasi: <strong style={{ color }}>{formatIDRShort(cat.terserap)}</strong>
                </div>

                {/* Progress line */}
                <div className="bar-track" style={{ marginBottom: '16px', height: '8px' }}>
                  <div
                    className="bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCategoryModal(cat)}
                  style={{ width: '100%', justifyContent: 'center', gap: '6px', borderColor: `${color}40`, color }}
                >
                  <Eye size={14} /> Lihat Detail ({cat.kegiatan.length} Kegiatan)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Activity Details Modal ──────────────────────────── */}
      {selectedCategoryModal && (
        <div className="modal-overlay" onClick={() => setSelectedCategoryModal(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '750px', padding: '28px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{
                  fontSize: 'var(--text-xs)', color: CHART_COLORS[selectedCategoryModal.id]?.solid ?? 'var(--color-brand-600)',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)'
                }}>
                  Rincian Kegiatan Bidang
                </span>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>
                  {selectedCategoryModal.title}
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCategoryModal(null)} style={{ padding: '8px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Summary strip */}
            <div style={{
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: 'var(--text-sm)'
            }}>
              <div>
                Total Pagu: <strong style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatIDR(selectedCategoryModal.anggaran)}
                </strong>
              </div>
              <div>
                Total Terserap: <strong style={{ fontFamily: 'var(--font-mono)', color: CHART_COLORS[selectedCategoryModal.id]?.solid }}>
                  {formatIDR(selectedCategoryModal.terserap)}
                </strong>
              </div>
            </div>

            {/* Activities Table */}
            <div className="table-container" style={{ marginBottom: '20px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama Kegiatan Pembangunan</th>
                    <th>Pagu Anggaran</th>
                    <th>Realisasi Fisik</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategoryModal.kegiatan.map((kg, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{kg.nama}</td>
                      <td className="font-mono">{formatIDR(kg.anggaran)}</td>
                      <td className="font-mono">{formatIDR(kg.realisasi)}</td>
                      <td>
                        <span style={{
                          padding: '3px 8px', borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)', fontWeight: 700,
                          background: kg.status === 'Selesai' ? 'var(--color-success-50)' : kg.status === 'Berjalan' ? 'var(--color-warning-50)' : 'var(--color-surface-raised)',
                          color: kg.status === 'Selesai' ? 'var(--color-success-fg)' : kg.status === 'Berjalan' ? 'var(--color-warning-fg)' : 'var(--color-text-muted)'
                        }}>
                          {kg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedCategoryModal(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
