// src/components/common/QRVerifyModal.tsx
import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, ExternalLink, X, QrCode } from 'lucide-react';

interface QRVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
  applicantName: string;
  documentType: string;
  qrHash?: string;
  signedBy?: string;
  signedAt?: string;
}

export const QRVerifyModal: React.FC<QRVerifyModalProps> = ({
  isOpen,
  onClose,
  ticketNumber,
  applicantName,
  documentType,
  qrHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  signedBy = 'H. Asep Saepudin, S.Pd., M.Si (Kuwu / Kepala Desa Sukadana)',
  signedAt = '28 Agustus 2026 14:10 WIB'
}) => {
  if (!isOpen) return null;

  // Mask name: Budi Santoso -> B**i S*****o
  const maskName = (name: string) => {
    return name.split(' ').map(part => {
      if (part.length <= 2) return part;
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    }).join(' ');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '580px', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Banner verification */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          color: '#ffffff',
          padding: '28px 24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Tutup verifikasi"
          >
            <X size={18} />
          </button>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            border: '2px solid rgba(255, 255, 255, 0.6)'
          }}>
            <ShieldCheck size={36} />
          </div>

          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Layanan Verifikasi Dokumen Publik
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
            DOKUMEN ASLI & SAH TERVERIFIKASI
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '4px' }}>
            Diterbitkan secara resmi oleh Pemerintah Desa Sukadana, Kec. Argapura
          </p>
        </div>

        {/* Verification Body */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            border: '1px solid var(--color-border)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: '12px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Nomor Tiket/Surat:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-brand-600)' }}>{ticketNumber}</strong>

              <span style={{ color: 'var(--color-text-muted)' }}>Jenis Dokumen:</span>
              <strong>{documentType}</strong>

              <span style={{ color: 'var(--color-text-muted)' }}>Nama Pemohon:</span>
              <strong>{maskName(applicantName)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(Disamarkan demi privasi)</span></strong>

              <span style={{ color: 'var(--color-text-muted)' }}>Penandatangan:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success-700)', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> {signedBy}
              </span>

              <span style={{ color: 'var(--color-text-muted)' }}>Waktu TTE:</span>
              <span>{signedAt}</span>

              <span style={{ color: 'var(--color-text-muted)' }}>Status Validitas:</span>
              <span style={{ color: 'var(--color-success-600)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> AKTIF &amp; BERLAKU HUKUM RESMI
              </span>
            </div>
          </div>

          {/* Cryptographic hash info */}
          <div style={{
            background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            border: '1px solid var(--color-border)',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              <Lock size={14} /> SHA-256 Signature Fingerprint:
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-all',
              color: 'var(--color-brand-700)',
              background: 'var(--color-surface)',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid var(--color-border)'
            }}>
              {qrHash}
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Dokumen ini ditandatangani secara elektronik menggunakan sertifikat digital yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), Badan Siber dan Sandi Negara (BSSN).
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Selesai Memeriksa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
