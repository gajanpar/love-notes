// src/components/common/DocumentViewer.tsx
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, X, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentUrl?: string;
  documentType?: string;
  documentSize?: string;
  isVerified?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentUrl,
  documentType = 'image/jpeg',
  documentSize = '1.2 MB',
  isVerified = true
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '880px', height: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-brand-50)',
              color: 'var(--color-brand-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{documentTitle}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>{documentType}</span>
                <span>•</span>
                <span>{documentSize}</span>
                {isVerified && (
                  <>
                    <span>•</span>
                    <span style={{ color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Terverifikasi Sistem
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              border: '1px solid var(--color-border)'
            }}>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleZoomOut}
                title="Perkecil (-)"
                style={{ padding: '6px' }}
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '0.75rem', padding: '0 6px', fontWeight: 600, minWidth: '42px', textAlign: 'center' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleZoomIn}
                title="Perbesar (+)"
                style={{ padding: '6px' }}
              >
                <ZoomIn size={16} />
              </button>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleRotate}
                title="Putar 90°"
                style={{ padding: '6px' }}
              >
                <RotateCw size={16} />
              </button>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => alert(`Mengunduh file: ${documentTitle}`)}
              style={{ gap: '4px' }}
            >
              <Download size={14} /> Unduh
            </button>

            <button 
              className="btn btn-ghost btn-sm" 
              onClick={onClose}
              style={{ padding: '8px', borderRadius: '50%' }}
              aria-label="Tutup preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--color-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative'
        }}>
          <div 
            style={{
              transition: 'transform 0.2s ease-out',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {documentUrl && documentUrl.startsWith('http') ? (
              <img 
                src={documentUrl} 
                alt={documentTitle} 
                style={{
                  maxWidth: '550px',
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)'
                }}
              />
            ) : (
              <div style={{
                width: '420px',
                minHeight: '520px',
                background: '#ffffff',
                color: '#0f172a',
                padding: '36px 30px',
                boxShadow: 'var(--shadow-xl)',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontFamily: 'var(--font-serif)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pemerintah Kabupaten Majalengka</h4>
                    <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>Kecamatan Argapura</h4>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Pemerintah Desa Sukadana</h3>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: '#475569' }}>Jl. Raya Sukadana - Argapura No. 01, Kode Pos 45462</p>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, textDecoration: 'underline' }}>{documentTitle.toUpperCase()}</h4>
                    <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>Nomor: 470 / 148 / SK / VIII / 2026</p>
                  </div>

                  <p style={{ fontSize: '0.8125rem', lineHeight: '1.6', marginBottom: '12px' }}>
                    Yang bertanda tangan di bawah ini Kuwu / Kepala Desa Sukadana menerangkan dengan sebenarnya bahwa pemohon adalah benar warga penduduk kami yang tercatat sah pada basis data kependudukan desa.
                  </p>

                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: '4px' }}>
                      <span style={{ color: '#64748b' }}>NIK:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>3210091405880001</strong>
                      <span style={{ color: '#64748b' }}>Status Dokumen:</span>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>VALID & TERSERTIFIKASI DIGITAL (BSrE)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: '1px solid #94a3b8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', background: '#f1f5f9' }}>
                      QR Code BSrE
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                    <p>Sukadana, 28 Agustus 2026</p>
                    <p style={{ fontWeight: 600 }}>Kuwu / Kepala Desa Sukadana</p>
                    <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#2563eb', fontWeight: 700, fontSize: '0.7rem' }}>
                      [ Ditandatangani Elektronik BSrE ]
                    </div>
                    <p style={{ fontWeight: 700 }}>H. Asep Saepudin, S.Pd., M.Si</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)'
        }}>
          <span>Keamanan: Enkripsi RSA-2048 SHA-256 Balai Sertifikasi Elektronik (BSrE)</span>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
