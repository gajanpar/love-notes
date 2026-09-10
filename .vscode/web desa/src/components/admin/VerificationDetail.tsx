// src/components/admin/VerificationDetail.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Eye,
  Clock,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  Send,
  MessageSquare,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { PengajuanSurat, Role, hasPermission } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentViewer } from '../common/DocumentViewer';
import { TTEModal } from './TTEModal';
import { useToast } from '../common/ToastContext';

interface VerificationDetailProps {
  pengajuan: PengajuanSurat;
  adminRole: Role;
  onBack: () => void;
  onUpdateStatus: (updated: PengajuanSurat) => void;
}

// 6-langkah stepper alur persuratan
const ALUR_STEPS = [
  { id: 1, label: 'Diterima Sistem', shortLabel: 'Terima' },
  { id: 2, label: 'Diperiksa Operator', shortLabel: 'Periksa' },
  { id: 3, label: 'Verifikasi Sekretaris', shortLabel: 'Verifikasi' },
  { id: 4, label: 'Persetujuan Sekdes', shortLabel: 'Setuju' },
  { id: 5, label: 'TTE Kepala Desa', shortLabel: 'TTE Kades' },
  { id: 6, label: 'Selesai / Unduh PDF', shortLabel: 'Selesai' },
];

function getActiveStep(status: string): number {
  switch (status) {
    case 'pending':   return 2;
    case 'review':    return 3;
    case 'revision':  return 2;
    case 'approved':  return 5;
    case 'signed':    return 6;
    case 'done':      return 6;
    case 'rejected':  return 2;
    default:          return 1;
  }
}

// Role info block
function getRoleInfo(role: Role) {
  const info = {
    superadmin: { label: 'Super Administrator', color: 'var(--color-error-600)', desc: 'Akses penuh ke semua fungsi verifikasi dan TTE.' },
    kepala_desa: { label: 'Kuwu / Kepala Desa', color: 'var(--color-brand-700)', desc: 'Hanya dapat mengeksekusi TTE digital pada pengajuan yang sudah disetujui Sekretaris.' },
    sekretaris: { label: 'Sekretaris Desa', color: 'var(--color-gold-500)', desc: 'Dapat memverifikasi, menyetujui, menolak, dan meminta revisi. Tidak bisa melakukan TTE.' },
    operator: { label: 'Operator Loket', color: 'var(--color-stone-400)', desc: 'Hanya dapat memeriksa berkas dan memberikan catatan awal. Tidak dapat mengambil keputusan final.' },
  };
  return info[role];
}

export const VerificationDetail: React.FC<VerificationDetailProps> = ({
  pengajuan,
  adminRole,
  onBack,
  onUpdateStatus
}) => {
  const toast = useToast();
  const [adminNotes, setAdminNotes] = useState<string>(pengajuan.catatanAdmin || '');
  const [viewerDoc, setViewerDoc] = useState<{ title: string; url?: string } | null>(null);
  const [isTTEModalOpen, setIsTTEModalOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('Foto KTP kurang jelas atau buram, mohon upload ulang.');

  // RBAC permissions
  const canVerify  = hasPermission(adminRole, 'pengajuan:verify');
  const canReject  = hasPermission(adminRole, 'pengajuan:reject');
  const canTTE     = hasPermission(adminRole, 'pengajuan:tte');
  const isOperator = adminRole === 'operator';
  const isKades    = adminRole === 'kepala_desa';

  const roleInfo = getRoleInfo(adminRole);
  const activeStep = getActiveStep(pengajuan.status);

  // Approve action
  const handleApprove = () => {
    if (isKades) {
      setIsTTEModalOpen(true);
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const updated: PengajuanSurat = {
      ...pengajuan,
      status: 'approved',
      catatanAdmin: adminNotes || 'Berkas valid dan telah diverifikasi.',
      updatedAt: nowStr,
      timeline: [
        ...pengajuan.timeline,
        {
          id: `t-${Date.now()}`,
          timestamp: nowStr,
          status: 'Disetujui Sekretaris Desa',
          actor: adminRole === 'sekretaris' ? 'Dadan Ramdani, S.AP' : 'Petugas Administrasi',
          role: adminRole === 'sekretaris' ? 'Sekretaris Desa' : 'Operator Loket',
          notes: adminNotes || 'Draft surat siap diteruskan ke meja Kuwu / Kepala Desa untuk TTE digital.'
        }
      ]
    };
    onUpdateStatus(updated);
    toast.success('Pengajuan Disetujui', 'Diteruskan ke antrean TTE Kuwu / Kepala Desa Sukadana.');
  };

  // Request revision action
  const handleRequestRevision = () => {
    if (!revisionNotes.trim()) {
      toast.warning('Isi Catatan Revisi', 'Tuliskan dokumen apa yang perlu diperbaiki oleh warga.');
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const updated: PengajuanSurat = {
      ...pengajuan,
      status: 'revision',
      catatanAdmin: revisionNotes,
      updatedAt: nowStr,
      timeline: [
        ...pengajuan.timeline,
        {
          id: `t-${Date.now()}`,
          timestamp: nowStr,
          status: 'Perlu Revisi Dokumen',
          actor: adminRole === 'sekretaris' ? 'Dadan Ramdani, S.AP' : 'Euis Sumarni',
          role: adminRole === 'sekretaris' ? 'Sekretaris Desa' : 'Operator Loket Desa',
          notes: revisionNotes
        }
      ]
    };
    onUpdateStatus(updated);
    setShowRevisionModal(false);
    toast.info('Permintaan Revisi Terkirim', 'Warga akan menerima notifikasi perbaikan.');
  };

  // Reject action
  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.warning('Alasan Wajib Diisi', 'Tuliskan alasan penolakan permohonan surat.');
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID');
    const updated: PengajuanSurat = {
      ...pengajuan,
      status: 'rejected',
      catatanAdmin: `Ditolak: ${rejectReason}`,
      updatedAt: nowStr,
      timeline: [
        ...pengajuan.timeline,
        {
          id: `t-${Date.now()}`,
          timestamp: nowStr,
          status: 'Pengajuan Ditolak',
          actor: isKades ? 'H. Asep Saepudin, S.Pd., M.Si' : 'Dadan Ramdani, S.AP',
          role: isKades ? 'Kuwu / Kepala Desa' : 'Sekretaris Desa',
          notes: rejectReason
        }
      ]
    };
    onUpdateStatus(updated);
    setShowRejectModal(false);
    toast.error('Pengajuan Ditolak', `Surat #${pengajuan.nomorTiket} telah ditolak.`);
  };

  return (
    <div className="animate-slide-up">
      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Kembali ke Antrean
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Role indicator */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--color-surface-raised)',
            border: `1px solid ${roleInfo.color}22`,
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem', fontWeight: 700,
            color: roleInfo.color, fontFamily: 'var(--font-sans)'
          }}>
            <ShieldCheck size={14} />
            {roleInfo.label}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Status:</span>
          <StatusBadge status={pengajuan.status} showPulse />
        </div>
      </div>

      {/* 6-langkah Progress Stepper */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)' }}>
          <Clock size={15} style={{ color: 'var(--color-brand-600)' }} />
          Alur Proses Persuratan — Langkah {Math.min(activeStep, 6)} dari 6
        </div>

        <div className="stepper-container">
          <div className="stepper-line">
            <div className="stepper-line-progress" style={{ width: `${((activeStep - 1) / 5) * 100}%` }} />
          </div>
          {ALUR_STEPS.map(step => {
            const isCompleted = step.id < activeStep && pengajuan.status !== 'rejected';
            const isActive = step.id === activeStep;
            return (
              <div key={step.id} className={`step-item${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className="step-label">{step.shortLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RBAC Notice for Operator */}
      {isOperator && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          <Lock size={18} style={{ flexShrink: 0, color: '#b45309' }} />
          <div>
            <strong>Mode Hanya-Baca (Read-Only) — Operator Loket</strong><br />
            <span style={{ fontSize: '0.8125rem', opacity: 0.9 }}>
              {roleInfo.desc} Untuk mengambil tindakan pada berkas ini, hubungi Sekretaris Desa.
            </span>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* ===== LEFT: DATA PEMOHON ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Applicant Info */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)' }}>
              <UserCheck size={18} style={{ color: 'var(--color-brand-600)' }} /> Identitas Pemohon
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: '10px', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Nomor Tiket:</span>
              <strong className="font-mono" style={{ color: 'var(--color-brand-700)' }}>#{pengajuan.nomorTiket}</strong>

              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Nama Pemohon:</span>
              <strong style={{ fontFamily: 'var(--font-sans)' }}>{pengajuan.namaPemohon}</strong>

              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>NIK:</span>
              <strong className="font-mono">{pengajuan.nikPemohon}</strong>

              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Jenis Layanan:</span>
              <strong style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                background: 'var(--color-brand-50)', color: 'var(--color-brand-700)',
                padding: '2px 8px', borderRadius: '4px', display: 'inline-block'
              }}>
                {pengajuan.jenisSurat}
              </strong>

              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Waktu Diajukan:</span>
              <span style={{ fontFamily: 'var(--font-sans)' }}>{pengajuan.createdAt}</span>

              <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Batas SLA:</span>
              <span style={{ color: 'var(--color-warning-700)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {pengajuan.deadlineAt}
              </span>
            </div>
          </div>

          {/* Form Data */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)' }}>
              <FileText size={18} style={{ color: 'var(--color-brand-600)' }} /> Data Isian Formulir Warga
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(pengajuan.metadata).map(([key, val]) => (
                <div key={key} style={{
                  background: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize', marginBottom: '2px', fontFamily: 'var(--font-sans)' }}>
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dokumen Prasyarat */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Berkas Lampiran Pemohon ({pengajuan.dokumenPrasyarat.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pengajuan.dokumenPrasyarat.map((doc, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} style={{ color: 'var(--color-brand-600)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontFamily: 'var(--font-sans)' }}>{doc.name}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>{doc.size}</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setViewerDoc({ title: doc.name, url: doc.url })}
                    style={{ gap: '4px' }}
                  >
                    <Eye size={14} /> Periksa Berkas
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: ACTION PANEL ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Panel */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: `2px solid ${isOperator ? 'var(--color-border)' : 'var(--color-brand-300)'}`,
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            opacity: isOperator ? 0.85 : 1
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
              {isOperator ? 'Panel Tindakan (Dibatasi)' : 'Panel Tindakan Verifikasi'}
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
              {roleInfo.desc}
            </p>

            {/* Notes textarea — semua bisa isi, tapi operator tidak bisa submit */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="catatan-admin" style={{ fontFamily: 'var(--font-sans)' }}>
                Catatan Verifikasi Internal / Pemohon:
              </label>
              <textarea
                id="catatan-admin"
                rows={3}
                className="form-textarea"
                placeholder="Tuliskan catatan hasil pemeriksaan berkas atau instruksi untuk pemohon..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                disabled={isOperator}
                style={{ fontFamily: 'var(--font-sans)', opacity: isOperator ? 0.7 : 1 }}
              />
            </div>

            {/* Action Buttons */}
            {isOperator ? (
              /* Operator: tampilkan pesan tidak bisa aksi */
              <div style={{
                background: '#fff7ed', border: '1px solid #fed7aa',
                borderRadius: 'var(--radius-md)', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#9a3412'
              }}>
                <Lock size={18} style={{ flexShrink: 0 }} />
                <span>Akses tindakan tidak diizinkan untuk peran <strong>Operator Loket</strong>. Tindakan verifikasi dilakukan oleh Sekretaris Desa atau Kepala Desa.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Approve / TTE */}
                {isKades && canTTE ? (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setIsTTEModalOpen(true)}
                    disabled={pengajuan.status !== 'approved'}
                    style={{
                      width: '100%', fontWeight: 700, gap: '8px',
                      opacity: pengajuan.status !== 'approved' ? 0.5 : 1
                    }}
                  >
                    <FileCheck2 size={20} />
                    Eksekusi TTE Digital Kepala Desa
                    {pengajuan.status !== 'approved' && (
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Perlu Status: Disetujui)</span>
                    )}
                  </button>
                ) : canVerify ? (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleApprove}
                    style={{ width: '100%', fontWeight: 700, gap: '8px' }}
                  >
                    <CheckCircle2 size={18} />
                    Setujui &amp; Teruskan ke TTE Kades
                  </button>
                ) : null}

                {/* Revision + Reject */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {canVerify && (
                    <button
                      className="btn btn-warning"
                      onClick={() => setShowRevisionModal(true)}
                      style={{ fontWeight: 600, gap: '6px' }}
                    >
                      <MessageSquare size={16} /> Minta Revisi
                    </button>
                  )}

                  {canReject && (
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowRejectModal(true)}
                      style={{ fontWeight: 600, gap: '6px' }}
                    >
                      <XCircle size={16} /> Tolak Berkas
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Catatan Admin yang sudah tersimpan */}
          {pengajuan.catatanAdmin && (
            <div style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)'
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.9375rem', fontFamily: 'var(--font-serif)' }}>
                Catatan Petugas Terakhir:
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{pengajuan.catatanAdmin}"
              </p>
            </div>
          )}

          {/* Timeline History */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-serif)' }}>
              <Clock size={16} style={{ color: 'var(--color-brand-600)' }} /> Riwayat Penanganan Berkas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pengajuan.timeline.map((item, idx) => (
                <div key={item.id} style={{
                  background: idx === pengajuan.timeline.length - 1 ? 'var(--color-brand-50)' : 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  border: `1px solid ${idx === pengajuan.timeline.length - 1 ? 'var(--color-brand-200)' : 'var(--color-border)'}`,
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontFamily: 'var(--font-sans)' }}>{item.status}</strong>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      {item.timestamp}
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                    Oleh: {item.actor} ({item.role})
                  </div>
                  {item.notes && (
                    <div style={{ marginTop: '4px', color: 'var(--color-text-primary)', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
                      "{item.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TTE Modal */}
      {isTTEModalOpen && (
        <TTEModal
          isOpen={isTTEModalOpen}
          onClose={() => setIsTTEModalOpen(false)}
          pengajuan={pengajuan}
          onSignSuccess={updated => {
            onUpdateStatus(updated);
            onBack();
          }}
        />
      )}

      {/* Document Inspector Modal */}
      {viewerDoc && (
        <DocumentViewer
          isOpen={!!viewerDoc}
          onClose={() => setViewerDoc(null)}
          documentTitle={viewerDoc.title}
          documentUrl={viewerDoc.url}
        />
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
              Permintaan Revisi Dokumen Pemohon
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
              Tuliskan instruksi spesifik kepada pemohon <strong>{pengajuan.namaPemohon}</strong>:
            </p>
            <textarea
              rows={3}
              className="form-textarea"
              value={revisionNotes}
              onChange={e => setRevisionNotes(e.target.value)}
              placeholder="Contoh: Foto KTP terpotong bagian NIK, mohon upload foto ulang yang tegak lurus..."
              style={{ fontFamily: 'var(--font-sans)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowRevisionModal(false)}>Batalkan</button>
              <button className="btn btn-warning btn-sm" onClick={handleRequestRevision}>Kirim Permintaan Revisi</button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-error-600)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
              Tolak Pengajuan Surat?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
              Permohonan surat <strong>{pengajuan.jenisSurat}</strong> milik <strong>{pengajuan.namaPemohon}</strong> akan ditolak dan tidak dapat dibatalkan.
            </p>
            <label className="form-label" style={{ marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
              Alasan Penolakan (Wajib):
            </label>
            <textarea
              rows={3}
              className="form-textarea"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Contoh: Pemohon belum tercatat aktif pada data kependudukan RT 03..."
              style={{ fontFamily: 'var(--font-sans)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowRejectModal(false)}>Batalkan</button>
              <button className="btn btn-danger btn-sm" onClick={handleReject}>Ya, Tolak Pengajuan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
