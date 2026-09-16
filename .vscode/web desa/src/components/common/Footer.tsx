// src/components/common/Footer.tsx
import React from 'react';
import {
  Phone, Mail, MapPin, ShieldCheck, ExternalLink,
  BookOpen, FileText, ChevronRight, Wheat, Compass,
  Shield, Building2, Target, Heart, ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, var(--color-earth-900) 0%, #15110d 100%)',
      borderTop: '3px solid var(--color-gold-300)',
      paddingTop: '48px',
      paddingBottom: '32px',
      marginTop: '64px',
      color: 'rgba(255,255,255,0.75)',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        {/* Top Highlight Civic Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(207, 162, 61, 0.12) 0%, rgba(26, 144, 32, 0.1) 100%)',
          border: '1px solid rgba(207, 162, 61, 0.25)',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#00e676', boxShadow: '0 0 10px #00e676'
            }} />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em' }}>
              Pemerintah Desa Sukadana &bull; Kecamatan Argapura &bull; Kabupaten Majalengka &bull; Menuju Desa Mandiri Digital Berkelanjutan
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1a9020',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(26, 144, 32, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              <Phone size={13} />
              <span>Loket Digital WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '44px'
        }}>
          {/* Col 1: Identitas & Visi Digital Desa */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #1a9020 0%, #cfa23d 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', fontWeight: 800, fontSize: '1.2rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)', flexShrink: 0
              }}>
                DS
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  margin: 0
                }}>
                  Pemerintah Desa Sukadana
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#cfa23d', marginTop: '2px', fontWeight: 600 }}>
                  Kec. Argapura, Kab. Majalengka
                </p>
              </div>
            </div>

            <p style={{ lineHeight: 1.65, marginBottom: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.84rem' }}>
              Portal E-Government Desa Mandiri berbasis <em>Government as a Service</em>. Memadukan kekuatan agribisnis hortikultura terasering lereng Gunung Ciremai dengan pelayanan administrasi kependudukan digital 24 jam.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-gold-300)',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: 'rgba(207, 162, 61, 0.1)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(207, 162, 61, 0.25)',
              marginBottom: '10px'
            }}>
              <ShieldCheck size={15} />
              <span>Sertifikasi TTE Resmi BSrE &bull; BSSN RI</span>
            </div>

            <div style={{ color: '#acdbb0', fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 600 }}>
              "Ngaji Diri Ngaji Rasa &bull; Rempeg Gawe Sauyunan"
            </div>
          </div>

          {/* Col 2: Profil & Wilayah Desa Sukadana */}
          <div>
            <h4 style={{
              fontSize: '0.85rem', fontWeight: 800, color: '#ffffff',
              marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(207, 162, 61, 0.3)', paddingBottom: '6px'
            }}>
              Profil &amp; Wilayah Desa
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { href: '#potensi', label: 'Potensi Desa & Hortikultura', icon: <Wheat size={14} color="#1a9020" /> },
                { href: '#peta', label: 'Peta Desa Ciburial (Geospasial)', icon: <Compass size={14} color="#cfa23d" /> },
                { href: '#bpd', label: 'BPD (Badan Permusyawaratan)', icon: <Shield size={14} color="#cfa23d" /> },
                { href: '#pemdes', label: 'Pemerintah Desa (Pamong Desa)', icon: <Building2 size={14} color="#1a9020" /> },
                { href: '#visi-misi', label: 'Visi &amp; Misi 2024–2030', icon: <Target size={14} color="#8b5cf6" /> },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.74rem', color: 'rgba(255,255,255,0.55)' }}>
              <strong style={{ color: '#cfa23d' }}>5 Blok Definitif:</strong> Blok Desa &bull; Blok Panyekran &bull; Blok Jingkang &bull; Blok Gunung Tengah &bull; Blok Balandongan.
            </div>
          </div>

          {/* Col 3: Layanan Warga & Loket Kantor */}
          <div>
            <h4 style={{
              fontSize: '0.85rem', fontWeight: 800, color: '#ffffff',
              marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(207, 162, 61, 0.3)', paddingBottom: '6px'
            }}>
              Layanan Digital &amp; Loket
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '#layanan', label: 'Katalog 6 E-Persuratan Mandiri' },
                { href: '#tracking', label: 'Lacak Status Berkas Real-time' },
                { href: '#lapor', label: 'Saluran Aspirasi &amp; Aduan Warga' },
                { href: '#perdes', label: 'Peraturan Desa (Perdes Resmi)' }
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.84rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#cfa23d')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  >
                    <ChevronRight size={13} color="#1a9020" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Jam Operasional Box */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '10px 12px',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.78rem'
            }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Jam Kerja Balai Desa:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                <span>Senin – Kamis:</span><strong style={{ color: '#fff' }}>08.00 – 15.30 WIB</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)' }}>
                <span>Jumat:</span><strong style={{ color: '#fff' }}>08.00 – 11.30 WIB</strong>
              </div>
              <div style={{ color: '#00e676', fontWeight: 600, fontSize: '0.72rem', marginTop: '4px' }}>
                Layanan Persuratan Mandiri Online Aktif 24 Jam
              </div>
            </div>
          </div>

          {/* Col 4: Lembaga Mitra & Kontak Resmi */}
          <div>
            <h4 style={{
              fontSize: '0.85rem', fontWeight: 800, color: '#ffffff',
              marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(207, 162, 61, 0.3)', paddingBottom: '6px'
            }}>
              Kontak &amp; Lembaga Mitra
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem' }}>
                <MapPin size={15} style={{ color: '#cfa23d', flexShrink: 0, marginTop: '2px' }} />
                <span>Jl. Raya Sukadana - Argapura No. 01, Kec. Argapura, Kab. Majalengka 45462</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <Phone size={15} style={{ color: '#00e676', flexShrink: 0 }} />
                <span>WhatsApp: +62 821-2345-6789</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <Mail size={15} style={{ color: '#cfa23d', flexShrink: 0 }} />
                <span>pelayanan@sukadana-argapura.desa.id</span>
              </li>
            </ul>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Lembaga Terkait:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.72rem' }}>
                {[
                  'Pemkab Majalengka',
                  'TN Gunung Ciremai',
                  'BMKG Kertajati',
                  'BSSN BSrE',
                  'BUMDes Sukadana'
                ].map((name, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div>
            &copy; 2026 Pemerintah Desa Sukadana, Kec. Argapura, Kab. Majalengka. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Aksesibilitas WCAG 2.1 AA</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>&bull;</span>
            <span style={{ color: 'var(--color-gold-300)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Keamanan Siber Terenkripsi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
