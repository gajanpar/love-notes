// src/components/common/Footer.tsx
import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ExternalLink, BookOpen, FileText, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, var(--color-earth-900) 0%, #1a1410 100%)',
      borderTop: '3px solid var(--color-gold-300)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: '80px',
      color: 'rgba(255,255,255,0.75)',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Col 1: Identitas Desa */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo-desa.jpg"
                alt="Logo Desa Sukadana"
                style={{ width: '52px', height: '52px', objectFit: 'contain', filter: 'brightness(1.1)' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2
                }}>
                  Pemerintah Desa Sukadana
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px', fontFamily: 'var(--font-sans)' }}>
                  Kec. Argapura, Kab. Majalengka
                </p>
              </div>
            </div>

            <p style={{ lineHeight: '1.65', marginBottom: '16px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
              Platform E-Government Desa Mandiri berbasis{' '}
              <em>Government as a Service</em>. Memudahkan warga Sukadana mengurus persuratan digital,
              transparansi anggaran, dan pengaduan langsung.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-300)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
              <ShieldCheck size={16} />
              <span>Sertifikasi TTE Resmi BSrE — BSSN RI</span>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(172,219,176,0.8)', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>
              <span style={{ fontStyle: 'italic' }}>"Ngaji Diri Ngaji Rasa"</span>
            </div>
          </div>

          {/* Col 2: Kontak & Lokasi */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Kontak &amp; Loket Desa
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={17} style={{ color: 'var(--color-gold-300)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontFamily: 'var(--font-sans)' }}>Jl. Raya Sukadana - Argapura No. 01, Kec. Argapura, Kab. Majalengka, Jawa Barat 45462</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={17} style={{ color: 'var(--color-gold-300)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)' }}>Hotline / WhatsApp: +62 821-2345-6789</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={17} style={{ color: 'var(--color-gold-300)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)' }}>pelayanan@sukadana-argapura.desa.id</span>
              </li>
            </ul>

            <div style={{
              marginTop: '16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-sans)'
            }}>
              <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '6px', fontSize: '0.8125rem' }}>Jam Operasional Kantor</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8125rem' }}>
                <span>Senin – Kamis:</span><strong style={{ color: '#fff' }}>08.00 – 15.30 WIB</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span>Jumat:</span><strong style={{ color: '#fff' }}>08.00 – 11.30 WIB</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                <span>Sabtu – Minggu:</span><span>Libur (Layanan Online 24 Jam)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Layanan Cepat */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Akses Cepat Warga
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '#layanan', label: 'Pengajuan Surat Keterangan Usaha (SKU)' },
                { href: '#layanan', label: 'Pengajuan SKTM &amp; Beasiswa' },
                { href: '#tracking', label: 'Cek Status Berkas Real-time' },
                { href: '#perdes', label: 'Peraturan Desa (Perdes)' },
                { href: '#lapor', label: 'Lapor Masalah Infrastruktur' },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color var(--transition-fast)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem'
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--color-gold-300)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    dangerouslySetInnerHTML={{ __html: `<span style="color:rgba(172,219,176,0.7);font-size:0.7rem">&#9654;</span> ${item.label}` }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Tautan Penting */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Tautan Pemerintahan
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Kemendagri RI',
                'BSSN — Sertifikasi TTE',
                'Sistem Informasi Desa (SID)',
                'DPMD Kab. Majalengka',
                'BPN Kab. Majalengka',
              ].map((link, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <ExternalLink size={13} style={{ color: 'var(--color-gold-300)', flexShrink: 0 }} />
                  <span>{link}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                Standar Aksesibilitas WCAG 2.1 AA<br />
                Keamanan Data ISO/IEC 27001
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8125rem',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-sans)'
        }}>
          <div>
            &copy; 2026 Pemerintah Desa Sukadana, Kec. Argapura, Kab. Majalengka. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-300)', fontWeight: 600 }}>
            <ShieldCheck size={14} /> Bersertifikat BSSN
          </div>
        </div>
      </div>
    </footer>
  );
};
