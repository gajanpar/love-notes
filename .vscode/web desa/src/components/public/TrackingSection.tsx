// src/components/public/TrackingSection.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  QrCode, 
  MessageSquare, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { PengajuanSurat } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QRVerifyModal } from '../common/QRVerifyModal';
import { DocumentViewer } from '../common/DocumentViewer';
import { useToast } from '../common/ToastContext';

interface TrackingSectionProps {
  pengajuanList: PengajuanSurat[];
  activeTicketQuery?: string;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  pengajuanList,
  activeTicketQuery
}) => {
  const toast = useToast();
  const [searchTicket, setSearchTicket] = useState<string>(activeTicketQuery || 'DESA-2026-08-00142');
  const [searchedItem, setSearchedItem] = useState<PengajuanSurat | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLiveSSEActive, setIsLiveSSEActive] = useState<boolean>(true);
  const [isWhatsAppActive, setIsWhatsAppActive] = useState<boolean>(false);

  // Modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);

  useEffect(() => {
    if (activeTicketQuery) {
      setSearchTicket(activeTicketQuery);
      handleSearch(activeTicketQuery);
    } else {
      handleSearch('DESA-2026-08-00142');
    }
  }, [activeTicketQuery, pengajuanList]);

  const handleSearch = (query?: string) => {
    const q = (query || searchTicket).trim().toUpperCase();
    if (!q) {
      toast.warning('Masukkan Nomor Tiket', 'Contoh format: DESA-2026-08-00142');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const found = pengajuanList.find(p => p.nomorTiket.toUpperCase() === q);
      if (found) {
        setSearchedItem(found);
        toast.info('Data Ditemukan', `Status: ${found.status.toUpperCase()} (${found.nomorTiket})`);
      } else {
        setSearchedItem(null);
        toast.error('Tiket Tidak Ditemukan', `Tidak ada permohonan dengan nomor ${q}`);
      }
    }, 300);
  };

  const getStepStatus = (item: PengajuanSurat) => {
    // 4 stages: Diterima (1), Diperiksa (2), Ditandatangani (3), Selesai (4)
    switch (item.status) {
      case 'pending':
        return { current: 1, label: 'Pengajuan Diterima Loket' };
      case 'review':
      case 'revision':
        return { current: 2, label: item.status === 'revision' ? 'Menunggu Perbaikan Berkas' : 'Sedang Diperiksa Petugas' };
      case 'approved':
      case 'signed':
        return { current: 3, label: 'Menunggu TTE Kepala Desa' };
      case 'done':
        return { current: 4, label: 'Selesai & Siap Diunduh' };
      case 'rejected':
        return { current: 2, label: 'Ditolak Petugas', isError: true };
      default:
        return { current: 1, label: 'Diproses' };
    }
  };

  return (
    <section id="tracking" style={{ padding: '64px 0', background: 'var(--color-surface-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span style={{
            background: 'var(--color-info-50)',
            color: 'var(--color-info-700)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Modul Pelacakan Terbuka
          </span>
          <h2 className="text-title" style={{ marginBottom: '12px' }}>
            Lacak Status Permohonan Surat Real-Time
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Tanpa perlu login. Cukup masukkan nomor tiket pengajuan Anda untuk melihat progres penanganan secara transparan.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          maxWidth: '620px',
          margin: '0 auto 28px',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-brand-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '6px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{ paddingLeft: '12px', display: 'flex', alignItems: 'center', color: 'var(--color-brand-600)' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            className="font-mono"
            placeholder="Masukkan Nomor Tiket (DESA-2026-08-00142)..."
            value={searchTicket}
            onChange={e => setSearchTicket(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1, minWidth: 0,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'transparent',
              color: 'var(--color-text-primary)'
            }}
          />
          <button 
            className="btn btn-primary"
            onClick={() => handleSearch()}
            disabled={isSearching}
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {isSearching ? <RefreshCw size={16} className="animate-spin" /> : 'Lacak Status'}
          </button>
        </div>

        {/* Demo Quick Chips */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginRight: '8px' }}>
            ðŸ’¡ Coba lacak tiket contoh:
          </span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {pengajuanList.slice(0, 4).map(p => (
              <button
                key={p.nomorTiket}
                onClick={() => {
                  setSearchTicket(p.nomorTiket);
                  handleSearch(p.nomorTiket);
                }}
                style={{
                  background: searchedItem?.nomorTiket === p.nomorTiket ? 'var(--color-brand-600)' : 'var(--color-surface)',
                  color: searchedItem?.nomorTiket === p.nomorTiket ? '#ffffff' : 'var(--color-brand-700)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)'
                }}
              >
                #{p.nomorTiket} ({p.jenisSurat})
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Result Card */}
        {searchedItem && (
          <div className="animate-slide-up" style={{
            maxWidth: '860px',
            margin: '0 auto',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: 'clamp(16px, 5vw, 36px)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Header info */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '20px',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800 }}>
                    #{searchedItem.nomorTiket}
                  </h3>
                  <StatusBadge status={searchedItem.status} showPulse />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <strong>{searchedItem.jenisSurat}</strong> â€¢ Pemohon: <strong>{searchedItem.namaPemohon}</strong> â€¢ Diajukan: {searchedItem.createdAt}
                </div>
              </div>

              {/* Real-time SSE Live badge & WhatsApp Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-surface-raised)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isLiveSSEActive ? '#22c55e' : '#94a3b8',
                    animation: isLiveSSEActive ? 'pulseDot 1.5s infinite' : 'none'
                  }} />
                  <span>Live Stream (SSE)</span>
                </div>
              </div>
            </div>

            {/* 4-Stage Visual Progress Stepper */}
            {(() => {
              const { current } = getStepStatus(searchedItem);
              const stages = [
                { num: 1, title: 'Diterima', desc: 'Berkas masuk loket' },
                { num: 2, title: 'Diperiksa', desc: 'Verifikasi berkas & DTKS' },
                { num: 3, title: 'Ditandatangani', desc: 'TTE Digital Kades' },
                { num: 4, title: 'Selesai', desc: 'Dokumen siap unduh' },
              ];

              return (
                <div style={{ marginBottom: '36px' }}>
                  <div className="stepper-track-scroll" style={{ width: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))',
                    gap: '12px',
                    position: 'relative',
                    minWidth: '100%'
                  }}>
                    {stages.map((st) => {
                      const isPast = current > st.num;
                      const isNow = current === st.num;
                      return (
                        <div
                          key={st.num}
                          style={{
                            background: isNow ? 'var(--color-brand-50)' : isPast ? 'var(--color-success-50)' : 'var(--color-surface-raised)',
                            border: `1.5px solid ${isNow ? 'var(--color-brand-500)' : isPast ? 'var(--color-success-500)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px',
                            textAlign: 'center',
                            transition: 'all var(--transition-normal)'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isPast ? 'var(--color-success-500)' : isNow ? 'var(--color-brand-600)' : 'var(--color-surface)',
                            color: isPast || isNow ? '#ffffff' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {isPast ? <CheckCircle2 size={18} /> : st.num}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isNow ? 'var(--color-brand-700)' : 'var(--color-text-primary)' }}>
                            {st.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {st.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              );
            })()}

            {/* Current status highlight box */}
            <div style={{
              background: searchedItem.status === 'done' ? 'var(--color-success-50)' : 'var(--color-surface-raised)',
              border: `1px solid ${searchedItem.status === 'done' ? 'var(--color-success-500)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '28px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status Terkini:
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, marginTop: '2px', color: searchedItem.status === 'done' ? 'var(--color-success-700)' : 'var(--color-text-primary)' }}>
                  {searchedItem.status === 'done' ? 'Dokumen Resmi Selesai & Ditandatangani' :
                   searchedItem.status === 'approved' ? 'Sedang Menunggu TTE Digital Kepala Desa' :
                   searchedItem.status === 'review' ? 'Berkas Sedang Diverifikasi Operator' :
                   searchedItem.status === 'revision' ? 'Perlu Perbaikan: Silakan Cek Catatan Petugas' :
                   'Pengajuan Baru Masuk Antrean Loket'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Estimasi Selesai: <strong>{searchedItem.deadlineAt}</strong>
                </div>
              </div>

              {/* Action buttons (Download or Verify QR) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsQRModalOpen(true)}
                >
                  <QrCode size={15} /> Cek Keaslian QR
                </button>
                {searchedItem.status === 'done' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setIsDocViewerOpen(true)}
                  >
                    <Download size={15} /> Unduh Surat Resmi (PDF)
                  </button>
                )}
              </div>
            </div>

            {/* Chronological Activity Timeline */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} style={{ color: 'var(--color-brand-600)' }} /> Riwayat Aktivitas & Catatan Petugas
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px' }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  bottom: '10px',
                  left: '6px',
                  width: '2px',
                  background: 'var(--color-border)'
                }} />

                {searchedItem.timeline.map((act) => (
                  <div key={act.id} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'var(--color-brand-600)',
                      border: '3px solid var(--color-surface)',
                      boxShadow: '0 0 0 1px var(--color-border)'
                    }} />

                    <div style={{
                      background: 'var(--color-surface-raised)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.875rem' }}>{act.status}</strong>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                          {act.timestamp}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        Oleh: <strong>{act.actor}</strong> ({act.role})
                      </div>
                      {act.notes && (
                        <div style={{
                          marginTop: '8px',
                          background: 'var(--color-surface)',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8125rem',
                          borderLeft: '3px solid var(--color-warning-500)',
                          color: 'var(--color-text-primary)'
                        }}>
                          "{act.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp notification switch simulator */}
            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: '#25D366' }} />
                <span>Kirim notifikasi otomatis ke WhatsApp pemohon saat status berubah</span>
              </div>
              <button
                className={`btn btn-sm ${isWhatsAppActive ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => {
                  setIsWhatsAppActive(!isWhatsAppActive);
                  toast.success(
                    !isWhatsAppActive ? 'Notifikasi WhatsApp Aktif' : 'Notifikasi Dinonaktifkan',
                    !isWhatsAppActive ? 'Pemberitahuan real-time akan dikirim ke HP pemohon' : ''
                  );
                }}
              >
                {isWhatsAppActive ? 'WhatsApp Aktif' : 'Aktifkan WhatsApp'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* QR Verify Modal */}
      {searchedItem && (
        <QRVerifyModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          ticketNumber={searchedItem.nomorTiket}
          applicantName={searchedItem.namaPemohon}
          documentType={searchedItem.jenisSurat}
          qrHash={searchedItem.qrHash}
          signedBy={searchedItem.signedBy}
          signedAt={searchedItem.signedAt}
        />
      )}

      {/* Document PDF Viewer */}
      {searchedItem && (
        <DocumentViewer
          isOpen={isDocViewerOpen}
          onClose={() => setIsDocViewerOpen(false)}
          documentTitle={`Surat Resmi ${searchedItem.jenisSurat} - ${searchedItem.nomorTiket}.pdf`}
          documentType="Dokumen Sah TTE BSrE"
          documentSize="1.8 MB"
        />
      )}
    </section>
  );
};



