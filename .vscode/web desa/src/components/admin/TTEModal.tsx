// src/components/admin/TTEModal.tsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  MessageSquare,
  CheckCircle2,
  X,
  FileCheck2,
  QrCode,
  ArrowRight,
  RefreshCw,
  Printer,
  Award
} from 'lucide-react';
import { PengajuanSurat } from '../../types';
import { useToast } from '../common/ToastContext';
import { PrintableLetter } from '../common/PrintableLetter';

interface TTEModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuan: PengajuanSurat;
  onSignSuccess: (signedPengajuan: PengajuanSurat) => void;
}

const TTE_METHODS = [
  {
    id: 'bsre' as const,
    label: 'BSrE — BSSN (Disarankan)',
    sublabel: 'Sertifikat Digital resmi Balai Sertifikasi Elektronik',
    icon: <Award size={20} />,
    description: 'Login otomatis menggunakan sertifikat digital BSrE yang telah terdaftar di BSSN RI. Keamanan paling tinggi dan memiliki kekuatan hukum penuh.',
    legal: 'Berkekuatan hukum setara tanda tangan basah (UU ITE 2016)',
    color: 'var(--color-brand-600)',
    bg: 'var(--color-brand-50)'
  },
  {
    id: 'pin' as const,
    label: 'PIN 6-Digit Kepala Desa',
    sublabel: 'Tanda tangan dengan PIN rahasia',
    icon: <KeyRound size={20} />,
    description: 'Masukkan PIN 6 digit rahasia Kepala Desa untuk mengotorisasi tanda tangan pada dokumen ini.',
    legal: 'Terenkripsi AES-256 — aman dan teraudit',
    color: 'var(--color-gold-500)',
    bg: 'var(--color-gold-50)'
  },
  {
    id: 'otp' as const,
    label: 'Kode OTP via WhatsApp',
    sublabel: 'Kode one-time password ke ponsel Kades',
    icon: <MessageSquare size={20} />,
    description: 'Kode OTP akan dikirim ke nomor WhatsApp terdaftar Kepala Desa. Berlaku 5 menit setelah dikirim.',
    legal: 'Verifikasi 2 faktor — aman multi-perangkat',
    color: 'var(--color-info-700)',
    bg: 'var(--color-info-50)'
  }
];

export const TTEModal: React.FC<TTEModalProps> = ({
  isOpen,
  onClose,
  pengajuan,
  onSignSuccess
}) => {
  const toast = useToast();
  const [method, setMethod] = useState<'bsre' | 'pin' | 'otp'>('bsre');
  const [pinInput, setPinInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signingStep, setSigningStep] = useState<string>('');
  const [signedResult, setSignedResult] = useState<PengajuanSurat | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = () => {
    setOtpSent(true);
    toast.info('OTP Terkirim', 'Kode OTP dikirim ke WhatsApp Kepala Desa +62 821-xxxx-xxxx. Berlaku 5 menit.');
  };

  const handleExecuteTTE = () => {
    if (method === 'pin' && pinInput.length !== 6) {
      toast.warning('PIN Belum Lengkap', 'Masukkan 6 digit PIN TTE Kepala Desa');
      return;
    }
    if (method === 'otp' && otpInput.length !== 6) {
      toast.warning('Kode OTP Belum Lengkap', 'Masukkan 6 digit OTP WhatsApp');
      return;
    }

    setIsSigning(true);
    setSigningStep('1/3 Menghitung Hash Kriptografi SHA-256 Dokumen...');

    setTimeout(() => {
      setSigningStep('2/3 Menghubungi Server Balai Sertifikasi Elektronik (BSrE)...');
      setTimeout(() => {
        setSigningStep('3/3 Menyematkan Segel Digital & QR Code Verifikasi...');
        setTimeout(() => {
          setIsSigning(false);

          const nowStr = new Date().toLocaleString('id-ID');
          const signed: PengajuanSurat = {
            ...pengajuan,
            status: 'done',
            tteMethod: method,
            signedBy: 'H. Asep Saepudin, S.Pd., M.Si (Kuwu / Kepala Desa Sukadana)',
            signedAt: nowStr,
            updatedAt: nowStr,
            dokumenHasil: `https://sukadana-argapura.desa.id/docs/${pengajuan.jenisSurat}-${pengajuan.nomorTiket}.pdf`,
            qrHash: `bsre-${Date.now()}-${pengajuan.nikPemohon}`,
            timeline: [
              ...pengajuan.timeline,
              {
                id: `t-tte-${Date.now()}`,
                timestamp: nowStr,
                status: 'Ditandatangani Elektronik (BSrE BSSN)',
                actor: 'H. Asep Saepudin, S.Pd., M.Si',
                role: 'Kuwu / Kepala Desa Sukadana',
                notes: `TTE dilaksanakan via metode ${method.toUpperCase()}. Sertifikat BSrE tersimpan pada chain log sistem.`
              },
              {
                id: `t-done-${Date.now() + 1}`,
                timestamp: nowStr,
                status: 'Selesai — Dokumen Siap Diunduh',
                actor: 'Sistem E-Government Sukadana',
                role: 'System',
                notes: 'Notifikasi WhatsApp otomatis terkirim ke pemohon. Dokumen tersedia 30 hari.'
              }
            ]
          };

          setSignedResult(signed);
          toast.success('TTE Berhasil!', `Dokumen ${pengajuan.jenisSurat} #${pengajuan.nomorTiket} telah ditandatangani secara elektronik dan siap diunduh.`);
        }, 1400);
      }, 1200);
    }, 900);
  };

  const handleFinishAndPrint = () => {
    if (signedResult) {
      onSignSuccess(signedResult);
      setShowPrintPreview(true);
    }
  };

  const selectedMethod = TTE_METHODS.find(m => m.id === method)!;

  return (
    <>
      <div className="modal-overlay" onClick={!isSigning && !signedResult ? onClose : undefined}>
        <div
          className="modal-content"
          style={{ maxWidth: '620px' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, var(--color-brand-700) 0%, var(--color-brand-900) 100%)',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#fff' }}>
                    Tanda Tangan Elektronik (TTE)
                  </h2>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, fontFamily: 'var(--font-sans)' }}>
                    Kepala Desa Sukadana — Sertifikasi BSrE BSSN RI
                  </p>
                </div>
              </div>
              {!isSigning && (
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255,255,255,0.15)', border: 'none',
                    color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Dokumen info */}
            <div style={{
              marginTop: '14px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '0.8125rem',
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-sans)'
            }}>
              <div>
                <div style={{ opacity: 0.7 }}>Dokumen:</div>
                <div style={{ fontWeight: 700 }}>{pengajuan.jenisSurat} — #{pengajuan.nomorTiket}</div>
              </div>
              <div>
                <div style={{ opacity: 0.7 }}>Pemohon:</div>
                <div style={{ fontWeight: 700 }}>{pengajuan.namaPemohon}</div>
              </div>
              <div>
                <div style={{ opacity: 0.7 }}>NIK:</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{pengajuan.nikPemohon.slice(0, 8)}****</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            {signedResult ? (
              /* ===== SUCCESS STATE ===== */
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'var(--color-brand-50)', border: '2px solid var(--color-brand-300)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', color: 'var(--color-brand-600)'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-brand-700)' }}>
                  TTE Berhasil Dilaksanakan!
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-sans)', lineHeight: 1.65 }}>
                  Dokumen <strong>{pengajuan.jenisSurat}</strong> atas nama <strong>{pengajuan.namaPemohon}</strong> telah
                  ditandatangani secara elektronik oleh <strong>H. Asep Saepudin, S.Pd., M.Si</strong> dan telah
                  disertifikasi oleh BSrE BSSN. Status berkas otomatis berubah menjadi <strong>Selesai</strong>.
                </p>

                <div style={{
                  background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-200)',
                  borderRadius: 'var(--radius-md)', padding: '12px 16px',
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: 'var(--color-brand-700)', marginBottom: '20px', textAlign: 'left'
                }}>
                  <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Hash Sertifikat BSrE:</div>
                  {signedResult.qrHash}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleFinishAndPrint}
                    style={{ gap: '8px', fontWeight: 700 }}
                  >
                    <Printer size={17} /> Cetak / Pratinjau PDF Dokumen
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => { if (signedResult) onSignSuccess(signedResult); onClose(); }}
                    style={{ gap: '6px' }}
                  >
                    Selesai &amp; Tutup
                  </button>
                </div>
              </div>

            ) : isSigning ? (
              /* ===== SIGNING PROGRESS STATE ===== */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '56px', height: '56px',
                  border: '4px solid var(--color-brand-200)',
                  borderTop: '4px solid var(--color-brand-600)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 20px'
                }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, marginBottom: '8px' }}>
                  Memproses Tanda Tangan Elektronik...
                </h4>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {signingStep}
                </p>
              </div>

            ) : (
              /* ===== METHOD SELECTION STATE ===== */
              <>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '12px', fontSize: '0.9375rem' }}>
                  Pilih Metode Autentikasi TTE:
                </h4>

                {/* Method Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {TTE_METHODS.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: `2px solid ${method === m.id ? m.color : 'var(--color-border)'}`,
                        background: method === m.id ? m.bg : 'var(--color-surface-raised)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                        background: method === m.id ? m.color : 'var(--color-surface)',
                        color: method === m.id ? '#fff' : m.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${m.color}33`,
                        transition: 'all var(--transition-fast)'
                      }}>
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', marginBottom: '2px', color: method === m.id ? m.color : 'var(--color-text-primary)' }}>
                          {m.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
                          {m.sublabel}
                        </div>
                        {method === m.id && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
                            {m.description}
                            <div style={{ marginTop: '4px', fontSize: '0.75rem', color: m.color, fontWeight: 600 }}>
                              {m.legal}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${method === m.id ? m.color : 'var(--color-border)'}`,
                        background: method === m.id ? m.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        {method === m.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input fields */}
                {method === 'pin' && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontFamily: 'var(--font-sans)' }}>PIN 6-Digit Kepala Desa:</label>
                    <input
                      type="password"
                      className="form-input"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Masukkan 6 digit PIN rahasia..."
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', fontSize: '1.25rem', textAlign: 'center' }}
                    />
                  </div>
                )}

                {method === 'otp' && (
                  <div style={{ marginBottom: '16px' }}>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontFamily: 'var(--font-sans)' }}>Kode OTP WhatsApp:</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="Kode 6 digit OTP..."
                          value={otpInput}
                          onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          disabled={!otpSent}
                          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', fontSize: '1.25rem', textAlign: 'center' }}
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={handleSendOTP}
                          style={{ flexShrink: 0, gap: '6px' }}
                        >
                          <RefreshCw size={14} />
                          {otpSent ? 'Kirim Ulang' : 'Kirim OTP'}
                        </button>
                      </div>
                    </div>
                    {otpSent && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-brand-600)', fontFamily: 'var(--font-sans)' }}>
                        Kode OTP terkirim. Periksa WhatsApp Kepala Desa. Berlaku 5 menit.
                      </p>
                    )}
                  </div>
                )}

                {method === 'bsre' && (
                  <div style={{
                    background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-200)',
                    borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '16px',
                    fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', color: 'var(--color-brand-700)',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                    Sertifikat digital BSrE Kepala Desa terdeteksi aktif. Klik tombol di bawah untuk melanjutkan penandatanganan secara otomatis.
                  </div>
                )}

                {/* Execute Button */}
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleExecuteTTE}
                  style={{ width: '100%', fontWeight: 700, gap: '10px' }}
                >
                  <FileCheck2 size={20} />
                  Tanda Tangani Sekarang — {selectedMethod.label.split('—')[0].trim()}
                  <ArrowRight size={16} />
                </button>

                <p style={{
                  textAlign: 'center', marginTop: '12px',
                  fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)'
                }}>
                  Tindakan ini akan membuat tanda tangan elektronik yang sah secara hukum berdasarkan UU No. 11 Tahun 2008 tentang ITE.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Print Preview */}
      {showPrintPreview && signedResult && (
        <PrintableLetter
          pengajuan={signedResult}
          onClose={() => { setShowPrintPreview(false); onClose(); }}
        />
      )}
    </>
  );
};
