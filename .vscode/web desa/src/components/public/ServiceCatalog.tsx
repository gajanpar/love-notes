// src/components/public/ServiceCatalog.tsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Eye, 
  Copy, 
  Download, 
  ExternalLink, 
  QrCode, 
  Sparkles,
  Info,
  Check,
  ShieldCheck,
  Building,
  HeartHandshake,
  Users,
  Navigation,
  FileCheck2,
  Store,
  HelpCircle,
  ArrowUpDown,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SURAT_CONFIGS, MOCK_PENDUDUK } from '../../data/mockData';
import { SuratType, SuratConfig, PendudukData, PengajuanSurat } from '../../types';
import { useToast } from '../common/ToastContext';
import { QRVerifyModal } from '../common/QRVerifyModal';
import { DocumentViewer } from '../common/DocumentViewer';

interface ServiceCatalogProps {
  initialSelectedCode?: SuratType | null;
  onSubmissionSuccess: (newPengajuan: PengajuanSurat) => void;
  onTrackTicket: (ticketNumber: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  initialSelectedCode,
  onSubmissionSuccess,
  onTrackTicket
}) => {
  const toast = useToast();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'populer' | 'sla' | 'az'>('populer');
  const [selectedSurat, setSelectedSurat] = useState<SuratConfig | null>(null);

  // Identity state (Step 2)
  const [nikInput, setNikInput] = useState<string>('');
  const [nikError, setNikError] = useState<string>('');
  const [isVerifyingNik, setIsVerifyingNik] = useState<boolean>(false);
  const [citizenData, setCitizenData] = useState<PendudukData | null>(null);
  const [isTicketCopied, setIsTicketCopied] = useState<boolean>(false);

  // Dynamic Form state (Step 3)
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Documents state (Step 4)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string; url: string }>>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Legal Confirmation (Step 5)
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

  // Ticket Result (Step 6)
  const [generatedTicket, setGeneratedTicket] = useState<string>('');
  const [submittedPengajuan, setSubmittedPengajuan] = useState<PengajuanSurat | null>(null);

  // Modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{ title: string; url?: string } | null>(null);

  // Handle external selection from Hero
  useEffect(() => {
    if (initialSelectedCode) {
      const cfg = SURAT_CONFIGS.find(s => s.code === initialSelectedCode);
      if (cfg) {
        setSelectedSurat(cfg);
        setCurrentStep(2);
      }
    }
  }, [initialSelectedCode]);

  // Categories list
  const categories = ['Semua', 'Usaha', 'Sosial', 'Kependudukan', 'Pernikahan'];

  const filteredSurat = SURAT_CONFIGS.filter(s => {
    const matchCat = selectedCategory === 'Semua' || s.category === selectedCategory;
    const matchSearch = s.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                        s.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        s.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedSurat = [...filteredSurat].sort((a, b) => {
    if (sortBy === 'sla') return a.slaDays - b.slaDays;
    if (sortBy === 'az') return a.title.localeCompare(b.title, 'id');
    return 0; // default order
  });

  // Calculate estimated SLA completion date
  const getEstimatedDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Step 2: NIK verification logic
  const handleVerifyNik = (nikToTest?: string) => {
    const val = (nikToTest || nikInput).trim();
    if (!val) {
      setNikError('Nomor Induk Kependudukan (NIK) wajib diisi');
      return;
    }
    if (val.length !== 16 || !/^\d+$/.test(val)) {
      setNikError('NIK harus terdiri dari tepat 16 digit angka');
      return;
    }

    setNikError('');
    setIsVerifyingNik(true);

    setTimeout(() => {
      setIsVerifyingNik(false);
      const found = MOCK_PENDUDUK.find(p => p.nik === val);
      if (found) {
        setCitizenData(found);
        setNikInput(found.nik);
        toast.success(`Identitas Terverifikasi!`, `Selamat datang, ${found.nama} (${found.rtRw})`);
        
        // Auto-fill available fields in formData
        setFormData(prev => ({
          ...prev,
          nik: found.nik,
          namaPemohon: found.nama,
          alamat: found.alamat,
          rtRw: found.rtRw,
          pekerjaan: found.pekerjaan,
          agama: found.agama
        }));
      } else {
        setCitizenData(null);
        setNikError('NIK tidak ditemukan dalam database kependudukan desa. Gunakan salah satu NIK demo di bawah.');
        toast.error('NIK Tidak Ditemukan', 'Silakan pilih NIK contoh yang terdaftar.');
      }
    }, 450);
  };

  // Step 3: Form Field Change with Inline Validation
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateStep3 = () => {
    if (!selectedSurat) return false;
    const errors: Record<string, string> = {};
    selectedSurat.fields.forEach(f => {
      if (f.required && (!formData[f.id] || formData[f.id].toString().trim() === '')) {
        errors[f.id] = `${f.label} wajib diisi dengan benar`;
      }
    });

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Formulir Belum Lengkap', 'Silakan periksa field bertanda merah');
      return false;
    }
    return true;
  };

  // Step 4: Simulated File Upload
  const handleSimulatedUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran File Terlalu Besar', 'Maksimal ukuran file adalah 5MB.');
      return;
    }

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadedFiles(curr => [
            ...curr,
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.type || 'image/jpeg',
              url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
            }
          ]);
          setUploadProgress(null);
          toast.success('Dokumen Terunggah', `${file.name} berhasil diunggah.`);
          return null;
        }
        return prev + 30;
      });
    }, 150);
  };

  // Step 5 -> Step 6: Final Submission
  const handleFinalSubmit = () => {
    if (!selectedSurat || !citizenData) return;

    if (!isAgreed) {
      toast.warning('Persetujuan Diperlukan', 'Harap centang pernyataan kebenaran data.');
      return;
    }

    // Generate Ticket: DESA-2026-08-00149
    const ticketSeq = Math.floor(10000 + Math.random() * 90000);
    const ticketNo = `DESA-2026-08-${ticketSeq}`;
    setGeneratedTicket(ticketNo);

    const newPengajuan: PengajuanSurat = {
      id: `req-${Date.now()}`,
      nomorTiket: ticketNo,
      nikPemohon: citizenData.nik,
      namaPemohon: citizenData.nama,
      jenisSurat: selectedSurat.code,
      status: 'pending',
      metadata: { ...formData },
      dokumenPrasyarat: uploadedFiles.length > 0 ? uploadedFiles : [
        { name: 'KTP_Pemohon_Otomatis.jpg', size: '1.2 MB', type: 'image/jpeg', url: citizenData.fotoKtp || '#' }
      ],
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      deadlineAt: getEstimatedDate(selectedSurat.slaDays),
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toLocaleString('id-ID'),
          status: 'Pengajuan Diterima Sistem',
          actor: 'Sistem E-Government',
          role: 'System',
          notes: 'Pengajuan berhasil masuk antrean verifikasi petugas loket'
        }
      ]
    };

    setSubmittedPengajuan(newPengajuan);
    onSubmissionSuccess(newPengajuan);
    setCurrentStep(6);

    // Confetti celebration animation with Sukadana authentic emerald & gold palette!
    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.58 },
      colors: ['#1a9020', '#cfa23d', '#acdbb0', '#4f9f54', '#d5b47c']
    });

    toast.success('Pengajuan Berhasil Dikirim!', `Nomor Tiket Anda: ${ticketNo}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsTicketCopied(true);
    setTimeout(() => setIsTicketCopied(false), 3000);
    toast.success('Tersalin ke Clipboard', `Nomor tiket ${text} siap digunakan.`);
  };

  return (
    <section id="layanan" style={{ padding: '64px 0', background: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span style={{
            background: 'var(--color-brand-50)',
            color: 'var(--color-brand-700)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Modul E-Persuratan Mandiri
          </span>
          <h2 className="text-title" style={{ marginBottom: '12px' }}>
            Buat Permohonan Surat Resmi Desa
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Ikuti 6 langkah mudah berikut untuk menerbitkan dokumen desa ber-Tanda Tangan Digital BSrE.
          </p>
        </div>

        {/* Multi-step Visual Stepper */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 32px)',
         
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
            <div className="stepper-container" style={{ minWidth: '600px' }}>
              <div className="stepper-line">
              <div 
                className="stepper-line-progress" 
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }} 
              />
            </div>

            {[
              { num: 1, label: 'Pilih Layanan' },
              { num: 2, label: 'Identitas NIK' },
              { num: 3, label: 'Isi Formulir' },
              { num: 4, label: 'Upload Berkas' },
              { num: 5, label: 'Konfirmasi' },
              { num: 6, label: 'Nomor Tiket' }
            ].map(s => {
              const isCompleted = currentStep > s.num;
              const isActive = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    if (isCompleted && currentStep !== 6) {
                      setCurrentStep(s.num);
                    }
                  }}
                  disabled={!isCompleted && !isActive}
                >
                  <div className="step-circle">
                    {isCompleted ? <Check size={20} /> : s.num}
                  </div>
                  <span className="step-label">{s.label}</span>
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* WIZARD CONTENT CONTAINER */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: 'clamp(16px, 5vw, 36px)',
          boxShadow: 'var(--shadow-md)',
          minHeight: '480px'
        }}>

          {/* ========================================================================= */}
          {/* STEP 1: PILIH JENIS SURAT */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <div className="responsive-flex-col-mobile" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Langkah 1 - Pilih Jenis Surat yang Anda Butuhkan</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                    Tersedia 6 jenis layanan persuratan standar dengan SLA proses 1-3 hari kerja.
                  </p>
                </div>

                {/* Filter and Sort Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Instant Filter Tabs */}
                  <div style={{
                    display: 'flex',
                    gap: '6px', flexWrap: 'wrap',
                    background: 'var(--color-surface-raised)',
                    padding: '4px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)'
                  }}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          background: selectedCategory === cat ? 'var(--color-surface)' : 'transparent',
                          color: selectedCategory === cat ? 'var(--color-brand-600)' : 'var(--color-text-secondary)',
                          fontWeight: selectedCategory === cat ? 700 : 500,
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '6px 12px',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          boxShadow: selectedCategory === cat ? 'var(--shadow-xs)' : 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px', flexWrap: 'wrap',
                    background: 'var(--color-surface-raised)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <ArrowUpDown size={14} style={{ color: 'var(--color-brand-600)' }} />
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)'
                      }}
                    >
                      <option value="populer">Paling Sering</option>
                      <option value="sla">SLA Tercepat</option>
                      <option value="az">Nama (A - Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid of Surat Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '20px'
              }}>
                {sortedSurat.map(surat => {
                  const isSelected = selectedSurat?.code === surat.code;
                  return (
                    <div
                      key={surat.code}
                      className="glass-card glass-card-hover"
                      style={{
                        padding: '24px',
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--color-brand-600)' : 'var(--color-border)',
                        background: isSelected ? 'var(--color-brand-50)' : 'var(--color-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderWidth: isSelected ? '2px' : '1px'
                      }}
                      onClick={() => setSelectedSurat(surat)}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--color-brand-700)',
                            background: 'var(--color-brand-100)',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {surat.code}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-success-700)',
                            background: 'var(--color-success-50)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Clock size={12} /> SLA: {surat.sla}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                          {surat.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                          {surat.description}
                        </p>

                        {/* Requirements preview */}
                        <div style={{
                          background: 'var(--color-surface-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 12px',
                          fontSize: '0.75rem',
                          border: '1px solid var(--color-border)'
                        }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                            Prasyarat Dokumen:
                          </div>
                          <ul style={{ paddingLeft: '16px', color: 'var(--color-text-secondary)' }}>
                            {surat.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          Kategori: <strong>{surat.category}</strong>
                        </span>
                        <button
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSurat(surat);
                            setCurrentStep(2);
                          }}
                        >
                          Pilih Layanan <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: VERIFIKASI IDENTITAS NIK */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="animate-slide-up" style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-brand-600)',
                  fontWeight: 700
                }}>
                  Layanan Terpilih: {selectedSurat?.title} ({selectedSurat?.code})
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                  Langkah 2 â€” Masukkan NIK (Nomor Induk Kependudukan)
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Sistem akan otomatis mengecek database kependudukan desa untuk mengisi data Anda tanpa perlu ketik ulang.
                </p>
              </div>

              {/* NIK Input Card */}
              <div style={{
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--color-border)',
                marginBottom: '24px'
              }}>
                <label className="form-label" htmlFor="nik-input">
                  <span>Nomor Induk Kependudukan (16 Digit)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sesuai KTP / Kartu Keluarga</span>
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                  <input
                    id="nik-input"
                    type="text"
                    maxLength={16}
                    className={`form-input font-mono ${nikError ? 'is-invalid' : citizenData ? 'is-valid' : ''}`}
                    placeholder="Contoh: 3210091405880001"
                    value={nikInput}
                    onChange={e => {
                      setNikInput(e.target.value.replace(/\D/g, ''));
                      setNikError('');
                    }}
                    style={{ flex: '1 1 200px', fontSize: '1.125rem', letterSpacing: '0.08em', fontWeight: 600 }}
                  />
                  <button
                    onClick={() => handleVerifyNik()}
                    className="btn btn-primary"
                    disabled={isVerifyingNik}
                    style={{ minWidth: '130px' }}
                  >
                    {isVerifyingNik ? 'Mengecek...' : 'Cek NIK'}
                  </button>
                </div>

                {nikError && (
                  <div className="form-error" style={{ marginTop: '8px' }}>
                    <AlertCircle size={14} /> {nikError}
                  </div>
                )}

                {/* Preset Demo NIKs for quick user testing */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}><strong>Coba dengan NIK Terdaftar Demo:</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MOCK_PENDUDUK.slice(0, 3).map(p => (
                      <button
                        key={p.nik}
                        type="button"
                        onClick={() => {
                          setNikInput(p.nik);
                          handleVerifyNik(p.nik);
                        }}
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <strong>{p.nama}</strong> ({p.nik})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Citizen Data Preview */}
              {citizenData && (
                <div style={{
                  background: 'var(--color-autofill-bg)',
                  border: '1.5px solid var(--color-autofill-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  marginBottom: '24px',
                  animation: 'slideUpFade 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-success-600)' }} />
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--color-brand-800)' }}>
                        Data Warga Ditemukan & Siap Digunakan
                      </strong>
                    </div>
                    <span className="autofill-tag">
                      <Sparkles size={12} /> Auto-filled
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                    gap: '12px',
                    fontSize: '0.8125rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Nama Lengkap:</span>
                      <div style={{ fontWeight: 700 }}>{citizenData.nama}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Alamat Domisili:</span>
                      <div style={{ fontWeight: 600 }}>{citizenData.alamat}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>RT / RW:</span>
                      <div style={{ fontWeight: 600 }}>RT {citizenData.rtRw}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Pekerjaan:</span>
                      <div style={{ fontWeight: 600 }}>{citizenData.pekerjaan}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} /> Pilih Layanan Lain
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!citizenData}
                  onClick={() => setCurrentStep(3)}
                >
                  Lanjut Isi Formulir <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ISI FORMULIR DINAMIS */}
          {/* ========================================================================= */}
          {currentStep === 3 && selectedSurat && citizenData && (
            <div className="animate-slide-up" style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <span className="autofill-tag" style={{ marginBottom: '6px' }}>
                  <Sparkles size={12} /> Data Kependudukan Terintegrasi
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Langkah 3 â€” Lengkapi Data Spesifik Permohonan {selectedSurat.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Field dengan tanda bintang (*) wajib diisi. Data dasar telah diisi otomatis.
                </p>
              </div>

              {/* Citizen auto-filled header strip */}
              <div style={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                fontSize: '0.8125rem'
              }}>
                <div>
                  Pemohon: <strong>{citizenData.nama}</strong> ({citizenData.nik})
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  Alamat: {citizenData.alamat}
                </div>
              </div>

              {/* Dynamic form fields chunk */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '20px'
              }}>
                {selectedSurat.fields.map(field => {
                  const error = formErrors[field.id];
                  const value = formData[field.id] || '';

                  return (
                    <div 
                      key={field.id} 
                      className="form-group"
                      style={{ gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto' }}
                    >
                      <label className="form-label" htmlFor={field.id}>
                        <span>{field.label} {field.required && <span style={{ color: 'var(--color-error-500)' }}>*</span>}</span>
                      </label>

                      {field.type === 'select' ? (
                        <select
                          id={field.id}
                          className={`form-select ${error ? 'is-invalid' : value ? 'is-valid' : ''}`}
                          value={value}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                        >
                          <option value="">-- Pilih {field.label} --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          rows={3}
                          className={`form-textarea ${error ? 'is-invalid' : value ? 'is-valid' : ''}`}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                        />
                      ) : (
                        <input
                          id={field.id}
                          type={field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                          className={`form-input ${error ? 'is-invalid' : value ? 'is-valid' : ''}`}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={e => handleFieldChange(field.id, e.target.value)}
                        />
                      )}

                      {error && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (validateStep3()) {
                      setCurrentStep(4);
                    }
                  }}
                >
                  Lanjut Upload Berkas <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: UPLOAD BERKAS PRASYARAT */}
          {/* ========================================================================= */}
          {currentStep === 4 && selectedSurat && (
            <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Langkah 4 â€” Upload Dokumen Prasyarat Digital
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Format yang didukung: <strong>JPG, PNG, PDF</strong>. Maksimal 5MB per berkas.
                </p>
              </div>

              {/* Required checklist notice */}
              <div style={{
                background: 'var(--color-info-50)',
                border: '1px solid var(--color-info-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: '24px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--color-info-fg)', fontSize: '0.875rem', marginBottom: '6px' }}>
                  Dokumen yang Diperlukan untuk {selectedSurat.title}:
                </div>
                <ul style={{ fontSize: '0.8125rem', color: 'var(--color-info-fg)', paddingLeft: '20px' }}>
                  {selectedSurat.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Dropzone Upload */}
              <div
                className={`dropzone ${isDragging ? 'is-dragover' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleSimulatedUpload(e.dataTransfer.files);
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*,.pdf';
                  input.onchange = (ev: any) => handleSimulatedUpload(ev.target.files);
                  input.click();
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--color-brand-50)',
                  color: 'var(--color-brand-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Upload size={28} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                  Seret & Lepas Dokumen ke Sini, atau <span style={{ color: 'var(--color-brand-600)' }}>Pilih File</span>
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Pastikan foto dokumen jelas dan terbaca dengan baik oleh petugas.
                </p>
              </div>

              {/* Upload progress indicator */}
              {uploadProgress !== null && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span>Mengunggah dokumen...</span>
                    <strong>{uploadProgress}%</strong>
                  </div>
                  <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }} role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} aria-live="polite">
                    <div style={{ height: '100%', width: '100%', background: 'var(--color-brand-600)', transform: `scaleX(${uploadProgress / 100})`, transformOrigin: 'left', transition: 'transform 0.2s ease-out' }} />
                  </div>
                </div>
              )}

              {/* Uploaded files list */}
              <div style={{ marginTop: '24px' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '10px' }}>
                  Dokumen Terlampir ({uploadedFiles.length > 0 ? uploadedFiles.length : '1 Default dari KTP'})
                </h5>

                {uploadedFiles.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} style={{ color: 'var(--color-brand-600)' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>Foto_KTP_Terverifikasi.jpg</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>1.2 MB â€¢ Dari Basis Data Kependudukan</div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--color-success-600)', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Terlampir
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {uploadedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'var(--color-surface-raised)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} style={{ color: 'var(--color-brand-600)' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{f.name}</div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{f.size}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setViewerDoc({ title: f.name, url: f.url })}
                            style={{ padding: '6px' }}
                            title="Lihat preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setUploadedFiles(curr => curr.filter((_, i) => i !== idx))}
                            style={{ padding: '6px', color: 'var(--color-error-600)' }}
                            title="Hapus berkas"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={16} /> Kembali ke Form
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(5)}
                >
                  Lanjut ke Konfirmasi <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: KONFIRMASI & PERNYATAAN */}
          {/* ========================================================================= */}
          {currentStep === 5 && selectedSurat && citizenData && (
            <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Langkah 5 â€” Periksa Ringkasan & Pernyataan Kebenaran
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Pastikan seluruh data yang Anda masukkan telah sesuai sebelum dikirim ke antrean loket desa.
                </p>
              </div>

              {/* Summary Card */}
              <div style={{
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--color-border)',
                marginBottom: '24px'
              }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Layanan yang Diajukan:</div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
                    {selectedSurat.title} ({selectedSurat.code})
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Nama Pemohon:</span>
                  <strong>{citizenData.nama}</strong>

                  <span style={{ color: 'var(--color-text-muted)' }}>NIK:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{citizenData.nik}</strong>

                  <span style={{ color: 'var(--color-text-muted)' }}>Alamat:</span>
                  <span>{citizenData.alamat} (RT {citizenData.rtRw})</span>

                  {Object.entries(formData).map(([key, val]) => {
                    const fieldDef = selectedSurat.fields.find(f => f.id === key);
                    if (!fieldDef || !val) return null;
                    return (
                      <React.Fragment key={key}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{fieldDef.label}:</span>
                        <span style={{ fontWeight: 600 }}>{val}</span>
                      </React.Fragment>
                    );
                  })}

                  <span style={{ color: 'var(--color-text-muted)' }}>Estimasi Selesai:</span>
                  <span style={{ color: 'var(--color-success-700)', fontWeight: 700 }}>
                    {getEstimatedDate(selectedSurat.slaDays)} (SLA {selectedSurat.sla})
                  </span>
                </div>
              </div>

              {/* Legal Checkbox */}
              <label 
                className="checkbox-label"
                style={{
                  background: isAgreed ? 'var(--color-brand-50)' : 'var(--color-surface)',
                  border: `1.5px solid ${isAgreed ? 'var(--color-brand-500)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  marginBottom: '24px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={e => setIsAgreed(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  <strong>Pernyataan Kebenaran Data:</strong> Saya menyatakan dengan sebenar-benarnya bahwa seluruh data dan dokumen yang saya berikan adalah sah dan dapat dipertanggungjawabkan secara hukum. Apabila di kemudian hari ditemukan keterangan palsu, saya bersedia menerima konsekuensi hukum yang berlaku.
                </div>
              </label>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft size={16} /> Ubah Berkas
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!isAgreed}
                  onClick={handleFinalSubmit}
                  style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={16} /> Kirim Permohonan Sekarang
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: KONFIRMASI SUKSES & KARTU TANDA TERIMA DIGITAL */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="animate-slide-up" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--color-success-50)',
                color: 'var(--color-success-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid var(--color-success-500)',
                boxShadow: '0 0 24px rgba(26, 144, 32, 0.25)'
              }}>
                <Check size={36} />
              </div>

              <span style={{
                background: 'var(--color-brand-100)',
                color: 'var(--color-brand-800)',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Pengajuan Terdaftar Resmi
              </span>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
                fontWeight: 700,
                marginTop: '10px',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)'
              }}>
                Permohonan Masuk Antrean Loket Desa
              </h3>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9375rem',
                marginBottom: '24px',
                lineHeight: 1.6,
                maxWidth: '58ch',
                margin: '0 auto 24px'
              }}>
                Berkas Anda telah terenkripsi dan diteruskan ke Kasi Pelayanan Balai Desa Sukadana. Simpan tanda terima digital di bawah ini.
              </p>

              {/* Kartu Tanda Terima Berkas Digital */}
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
                marginBottom: '28px',
                position: 'relative',
                textAlign: 'left'
              }}>
                {/* Receipt Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px dashed var(--color-border)',
                  paddingBottom: '16px',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo-desa.jpg" alt="Logo Desa" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand-primary)', textTransform: 'uppercase' }}>Tanda Terima Elektronik</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>Pemerintah Desa Sukadana</div>
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--color-gold-deep)',
                    background: 'var(--color-gold-50)',
                    border: '1px solid var(--color-gold-200)',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    <ShieldCheck size={12} color="var(--color-brand-primary)" />
                    BSrE Verified
                  </div>
                </div>

                {/* Ticket Number Highlight */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(26, 144, 32, 0.06) 0%, rgba(207, 162, 61, 0.08) 100%)',
                  border: '1.5px solid rgba(26, 144, 32, 0.25)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Nomor Tiket Pelacakan
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: 'var(--color-brand-primary)',
                      letterSpacing: '0.04em'
                    }}>
                      {generatedTicket}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-sm"
                      onClick={() => copyToClipboard(generatedTicket)}
                      style={{
                        background: isTicketCopied ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                        color: isTicketCopied ? '#ffffff' : 'var(--color-text-primary)',
                        border: `1px solid ${isTicketCopied ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                        borderRadius: '10px',
                        fontWeight: 700,
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isTicketCopied ? <Check size={14} /> : <Copy size={14} />}
                      {isTicketCopied ? 'Tersalin!' : 'Salin Tiket'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsQRModalOpen(true)}
                      style={{ borderRadius: '10px' }}
                    >
                      <QrCode size={14} /> Cek QR BSrE
                    </button>
                  </div>
                </div>

                {/* 3-Step Progress Roadmap */}
                <div style={{
                  background: 'var(--color-surface-raised)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-primary)', margin: '0 auto 4px' }} />
                    1. Berkas Masuk
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Tercatat Sistem</div>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-gold-300)', margin: '0 auto 4px' }} />
                    2. Verifikasi Data
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Kasi Pelayanan</div>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)', margin: '0 auto 4px' }} />
                    3. Terbit &amp; TTE
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Kuwu Sukadana</div>
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onTrackTicket(generatedTicket)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
                >
                  <Search size={16} /> Lacak Status Pengajuan Sekarang
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentStep(1);
                    setSelectedSurat(null);
                    setCitizenData(null);
                    setFormData({});
                    setUploadedFiles([]);
                    setIsAgreed(false);
                  }}
                  style={{ fontWeight: 600 }}
                >
                  Ajukan Surat Baru Lainnya
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bantuan Section */}
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>
          <p>
            Butuh bantuan pengisian?{' '}
            <a href="#" style={{ color: 'var(--color-brand-600)', fontWeight: 600, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('Mengarahkan ke WhatsApp Admin Desa...'); }}>
              Hubungi Admin Desa
            </a>
          </p>
        </div>
      </div>
      {/* QR Verify Simulation Modal */}
      {isQRModalOpen && (
        <QRVerifyModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          ticketNumber={generatedTicket}
          applicantName={citizenData?.nama || 'Pemohon'}
          documentType={selectedSurat?.title || 'Surat Keterangan'}
        />
      )}

      {/* Document Viewer Modal */}
      {viewerDoc && (
        <DocumentViewer
          isOpen={!!viewerDoc}
          onClose={() => setViewerDoc(null)}
          documentTitle={viewerDoc.title}
          documentUrl={viewerDoc.url}
        />
      )}
    </section>
  );
};






