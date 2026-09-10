// src/App.tsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  Search, 
  MapPin, 
  PieChart, 
  Users, 
  MessageSquare, 
  Shield, 
  LayoutDashboard, 
  Inbox, 
  Edit3, 
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ToastProvider, useToast } from './components/common/ToastContext';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';

// Public Components
import { BerandaPage } from './components/public/BerandaPage';
import { HeroSection } from './components/public/HeroSection';
import { ServiceCatalog } from './components/public/ServiceCatalog';
import { TrackingSection } from './components/public/TrackingSection';
import { GeoMapSection } from './components/public/GeoMapSection';
import { APBDesSection } from './components/public/APBDesSection';
import { PerdesSection } from './components/public/PerdesSection';
import { ProfileSection } from './components/public/ProfileSection';
import { LaporSection } from './components/public/LaporSection';

// Admin Components
import { RoleSelector } from './components/admin/RoleSelector';
import { VerificationQueue } from './components/admin/VerificationQueue';
import { VerificationDetail } from './components/admin/VerificationDetail';
import { PendudukManager } from './components/admin/PendudukManager';
import { CMSManager } from './components/admin/CMSManager';
import { RBACMatrix } from './components/admin/RBACMatrix';

// Types & Mock Data
import { PengajuanSurat, Role, SuratType } from './types';
import { INITIAL_PENGAJUAN } from './data/mockData';

export type PublicSegment = 'beranda' | 'layanan' | 'transparansi' | 'profil' | 'lapor';

const MainApp: React.FC = () => {
  const toast = useToast();

  // Navigation State
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [activeSegment, setActiveSegment] = useState<PublicSegment>('beranda');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Sub-tabs inside multi-section segments
  const [layananSubTab, setLayananSubTab] = useState<'katalog' | 'tracking'>('katalog');
  const [transparansiSubTab, setTransparansiSubTab] = useState<'apbdes' | 'perdes'>('apbdes');
  const [profilSubTab, setProfilSubTab] = useState<'profil' | 'peta'>('profil');

  // Data Store
  const [pengajuanList, setPengajuanList] = useState<PengajuanSurat[]>(INITIAL_PENGAJUAN);
  const [selectedServiceCode, setSelectedServiceCode] = useState<SuratType | null>(null);
  const [trackedTicket, setTrackedTicket] = useState<string>('');

  // Admin State
  const [adminRole, setAdminRole] = useState<Role>('kepala_desa');
  const [adminTab, setAdminTab] = useState<'queue' | 'penduduk' | 'cms' | 'rbac'>('queue');
  const [activeVerificationItem, setActiveVerificationItem] = useState<PengajuanSurat | null>(null);

  // Sync with URL Hash on Mount & Hash Changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;

      if (hash === 'beranda' || hash === 'hero') {
        setActiveSegment('beranda');
      } else if (hash === 'layanan' || hash === 'surat') {
        setActiveSegment('layanan');
        setLayananSubTab('katalog');
      } else if (hash === 'tracking' || hash === 'lacak') {
        setActiveSegment('layanan');
        setLayananSubTab('tracking');
      } else if (hash === 'transparansi' || hash === 'apbdes') {
        setActiveSegment('transparansi');
        setTransparansiSubTab('apbdes');
      } else if (hash === 'perdes' || hash === 'regulasi') {
        setActiveSegment('transparansi');
        setTransparansiSubTab('perdes');
      } else if (hash === 'profil') {
        setActiveSegment('profil');
        setProfilSubTab('profil');
      } else if (hash === 'peta') {
        setActiveSegment('profil');
        setProfilSubTab('peta');
      } else if (hash === 'lapor') {
        setActiveSegment('lapor');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Segment navigation handler
  const handleNavigateSegment = (segmentId: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
    }

    // Map legacy ids
    if (segmentId === 'hero' || segmentId === 'beranda') {
      setActiveSegment('beranda');
      window.location.hash = '#beranda';
    } else if (segmentId === 'layanan') {
      setActiveSegment('layanan');
      setLayananSubTab('katalog');
      window.location.hash = '#layanan';
    } else if (segmentId === 'tracking') {
      setActiveSegment('layanan');
      setLayananSubTab('tracking');
      window.location.hash = '#tracking';
    } else if (segmentId === 'transparansi' || segmentId === 'apbdes') {
      setActiveSegment('transparansi');
      setTransparansiSubTab('apbdes');
      window.location.hash = '#transparansi';
    } else if (segmentId === 'perdes') {
      setActiveSegment('transparansi');
      setTransparansiSubTab('perdes');
      window.location.hash = '#perdes';
    } else if (segmentId === 'profil') {
      setActiveSegment('profil');
      setProfilSubTab('profil');
      window.location.hash = '#profil';
    } else if (segmentId === 'peta') {
      setActiveSegment('profil');
      setProfilSubTab('peta');
      window.location.hash = '#peta';
    } else if (segmentId === 'lapor') {
      setActiveSegment('lapor');
      window.location.hash = '#lapor';
    } else {
      setActiveSegment('beranda');
      window.location.hash = '#beranda';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new submission
  const handleNewSubmission = (newPengajuan: PengajuanSurat) => {
    setPengajuanList(prev => [newPengajuan, ...prev]);
  };

  // Update submission status in Admin
  const handleUpdatePengajuan = (updated: PengajuanSurat) => {
    setPengajuanList(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (activeVerificationItem?.id === updated.id) {
      setActiveVerificationItem(updated);
    }
  };

  // Navigate to tracking
  const handleTrackTicket = (ticketNumber: string) => {
    setTrackedTicket(ticketNumber);
    setActiveSegment('layanan');
    setLayananSubTab('tracking');
    window.location.hash = '#tracking';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        currentView={currentView}
        onViewChange={v => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeSection={activeSegment}
        onNavigateSection={handleNavigateSegment}
        adminRole={adminRole}
        onOpenSearch={() => { setSearchQuery(''); setIsSearchModalOpen(true); }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* MAIN VIEW CONTAINER */}
      <main id="main-content" className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {currentView === 'public' ? (
          /* ========================================================================= */
          /* PORTAL WARGA & PUBLIK (ARSITEKTUR SEPARASI SEGMEN)                        */
          /* ========================================================================= */
          <>
            {/* SEGMEN 1: BERANDA & INFORMASI TERKINI */}
            {activeSegment === 'beranda' && (
              <BerandaPage
                onNavigateSegment={handleNavigateSegment}
                onOpenSearch={(q?: string) => { setSearchQuery(q || ''); setIsSearchModalOpen(true); }}
                onSelectService={code => {
                  if (code) setSelectedServiceCode(code);
                  setActiveSegment('layanan');
                  setLayananSubTab('katalog');
                  window.location.hash = '#layanan';
                }}
              />
            )}

            {/* SEGMEN 2: LAYANAN PERSURATAN & DOKUMEN MANDIRI */}
            {activeSegment === 'layanan' && (
              <div className="segment-view" style={{ padding: '32px 0 64px 0' }}>
                <div className="container">
                  {/* Sub-segment Tab Switcher */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="sub-segment-tabs">
                      <button
                        id="subtab-layanan-katalog"
                        className={`sub-segment-btn${layananSubTab === 'katalog' ? ' active' : ''}`}
                        onClick={() => { setLayananSubTab('katalog'); window.location.hash = '#layanan'; }}
                      >
                        <FileText size={16} />
                        <span>Katalog 6 E-Persuratan</span>
                      </button>
                      <button
                        id="subtab-layanan-tracking"
                        className={`sub-segment-btn${layananSubTab === 'tracking' ? ' active' : ''}`}
                        onClick={() => { setLayananSubTab('tracking'); window.location.hash = '#tracking'; }}
                      >
                        <Search size={16} />
                        <span>Lacak Status Berkas (Tracking)</span>
                      </button>
                    </div>
                  </div>

                  {layananSubTab === 'katalog' ? (
                    <ServiceCatalog
                      initialSelectedCode={selectedServiceCode}
                      onSubmissionSuccess={handleNewSubmission}
                      onTrackTicket={handleTrackTicket}
                    />
                  ) : (
                    <TrackingSection
                      pengajuanList={pengajuanList}
                      activeTicketQuery={trackedTicket}
                    />
                  )}
                </div>
              </div>
            )}

            {/* SEGMEN 3: TRANSPARANSI APBDES & REGULASI DESA */}
            {activeSegment === 'transparansi' && (
              <div className="segment-view" style={{ padding: '32px 0 64px 0' }}>
                <div className="container">
                  {/* Sub-segment Tab Switcher */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="sub-segment-tabs">
                      <button
                        id="subtab-transparansi-apbdes"
                        className={`sub-segment-btn${transparansiSubTab === 'apbdes' ? ' active' : ''}`}
                        onClick={() => { setTransparansiSubTab('apbdes'); window.location.hash = '#transparansi'; }}
                      >
                        <PieChart size={16} />
                        <span>Realisasi APBDes 2026</span>
                      </button>
                      <button
                        id="subtab-transparansi-perdes"
                        className={`sub-segment-btn${transparansiSubTab === 'perdes' ? ' active' : ''}`}
                        onClick={() => { setTransparansiSubTab('perdes'); window.location.hash = '#perdes'; }}
                      >
                        <BookOpen size={16} />
                        <span>Katalog Peraturan Desa (Perdes)</span>
                      </button>
                    </div>
                  </div>

                  {transparansiSubTab === 'apbdes' ? (
                    <APBDesSection />
                  ) : (
                    <PerdesSection />
                  )}
                </div>
              </div>
            )}

            {/* SEGMEN 4: PROFIL DESA & PETA GEOSPASIAL WILAYAH */}
            {activeSegment === 'profil' && (
              <div className="segment-view" style={{ padding: '32px 0 64px 0' }}>
                <div className="container">
                  {/* Sub-segment Tab Switcher */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="sub-segment-tabs">
                      <button
                        id="subtab-profil-desa"
                        className={`sub-segment-btn${profilSubTab === 'profil' ? ' active' : ''}`}
                        onClick={() => { setProfilSubTab('profil'); window.location.hash = '#profil'; }}
                      >
                        <Users size={16} />
                        <span>Profil & Perangkat Desa</span>
                      </button>
                      <button
                        id="subtab-profil-peta"
                        className={`sub-segment-btn${profilSubTab === 'peta' ? ' active' : ''}`}
                        onClick={() => { setProfilSubTab('peta'); window.location.hash = '#peta'; }}
                      >
                        <MapPin size={16} />
                        <span>Peta Fasilitas & Proyek</span>
                      </button>
                    </div>
                  </div>

                  {profilSubTab === 'profil' ? (
                    <ProfileSection />
                  ) : (
                    <GeoMapSection />
                  )}
                </div>
              </div>
            )}

            {/* SEGMEN 5: SALURAN ASPIRASI & LAPOR WARGA */}
            {activeSegment === 'lapor' && (
              <div className="segment-view">
                <LaporSection />
              </div>
            )}
          </>
        ) : (
          /* ========================================================================= */
          /* DASBOR BACKOFFICE ADMIN */
          /* ========================================================================= */
          <div style={{ padding: '36px 0', background: 'var(--color-bg)' }}>
            <div className="container">
              {/* Role Switcher banner */}
              <RoleSelector
                currentRole={adminRole}
                onRoleChange={r => {
                  setAdminRole(r);
                  toast.info(`Peran Dialihkan: ${r.toUpperCase()}`, `Izin akses disesuaikan dengan tupoksi.`);
                }}
              />

              {/* Admin Navigation Tabs */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '28px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '12px'
              }}>
                {[
                  { id: 'queue', label: 'Antrean Verifikasi & TTE', icon: <Inbox size={16} />, badge: pengajuanList.filter(p => p.status === 'pending' || p.status === 'approved').length },
                  { id: 'penduduk', label: 'Master Data Penduduk & Mutasi', icon: <Users size={16} /> },
                  { id: 'cms', label: 'CMS Publikasi & Media', icon: <Edit3 size={16} /> },
                  { id: 'rbac', label: 'Matriks RBAC & Audit Log', icon: <Lock size={16} /> }
                ].map(tab => {
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setAdminTab(tab.id as any);
                        setActiveVerificationItem(null);
                      }}
                      style={{
                        background: isActive ? 'var(--color-brand-600)' : 'var(--color-surface)',
                        color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '10px 18px',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 700 : 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span style={{
                          background: isActive ? '#ffffff' : 'var(--color-brand-600)',
                          color: isActive ? 'var(--color-brand-700)' : '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sub-Views */}
              {adminTab === 'queue' && (
                activeVerificationItem ? (
                  <VerificationDetail
                    pengajuan={activeVerificationItem}
                    adminRole={adminRole}
                    onBack={() => setActiveVerificationItem(null)}
                    onUpdateStatus={handleUpdatePengajuan}
                  />
                ) : (
                  <VerificationQueue
                    pengajuanList={pengajuanList}
                    adminRole={adminRole}
                    onSelectPengajuan={p => setActiveVerificationItem(p)}
                  />
                )
              )}

              {adminTab === 'penduduk' && (
                <PendudukManager />
              )}

              {adminTab === 'cms' && (
                <CMSManager />
              )}

              {adminTab === 'rbac' && (
                <RBACMatrix />
              )}
            </div>
          </div>
        )}
        
        {/* Global Footer moved inside main to be at the bottom of the content */}
        <Footer />
      </main>

      {/* Global Command Palette / Search Modal (Ctrl + K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        initialQuery={searchQuery}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectService={code => {
          setSelectedServiceCode(code);
          handleNavigateSegment('layanan');
        }}
        onNavigateSection={handleNavigateSegment}
        onViewChange={v => setCurrentView(v)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
};

export default App;
