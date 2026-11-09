<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{{ $title ?? 'SPKTAD' }} - PTP Terminal Nonpetikemas Branch Cirebon</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/favicon.png') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        /* Pelindo Anti-Giant Icon & Pagination Guard */
        nav[role="navigation"] svg,
        nav svg,
        .pagination svg,
        .w-5.h-5,
        svg.w-5,
        svg.h-5,
        svg[viewBox="0 0 20 20"] {
            width: 16px !important;
            height: 16px !important;
            min-width: 16px !important;
            min-height: 16px !important;
            max-width: 16px !important;
            max-height: 16px !important;
            display: inline-block !important;
            vertical-align: middle !important;
        }

        /* Additional Pelindo Theme Polishes */
        .brand-logo-sidebar {
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: #001F35;
        }
        .brand-logo-sidebar img {
            max-width: 190px;
            height: auto;
            object-fit: contain;
        }
        .user-topbar-profile {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .user-avatar-circle {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00223B, #005FA8);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 2px 6px rgba(0, 95, 168, 0.3);
        }
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            inset: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 22, 40, 0.65);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 9999;
            align-items: safe center;
            justify-content: center;
            padding: 16px;
            overflow-y: auto;
            box-sizing: border-box;
        }
        .modal-overlay.active {
            display: flex;
        }
        .modal-box {
            background: #ffffff;
            border-radius: 12px;
            width: 100%;
            max-width: 540px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            max-height: min(90dvh, calc(100dvh - 32px));
            animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            text-align: start;
            padding: 24px;
            margin: auto;
            box-sizing: border-box;
        }
        .modal-box input,
        .modal-box select,
        .modal-box textarea {
            scroll-margin-bottom: 72px;
        }
        .modal-actions-sticky {
            position: sticky;
            bottom: 0 !important;
            background: #ffffff;
            padding-top: 14px;
            padding-bottom: 8px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            z-index: 10;
            margin-top: 16px;
            flex-wrap: wrap;
        }
        @media (max-width: 480px) {
            .modal-box {
                padding: 16px !important;
            }
            .modal-actions-sticky {
                bottom: 0 !important;
                flex-direction: column-reverse;
                gap: 8px;
                width: 100%;
            }
            .modal-actions-sticky > *,
            .modal-actions-sticky form,
            .modal-actions-sticky button,
            .modal-actions-sticky a {
                width: 100% !important;
                box-sizing: border-box;
                justify-content: center;
                text-align: center;
            }
        }
        @media (max-height: 520px) {
            .modal-overlay {
                padding: 8px;
            }
            .modal-box {
                padding: 12px 16px !important;
                margin: 8px auto;
                max-height: calc(100dvh - 16px) !important;
            }
            .modal-actions-sticky {
                margin-top: 10px;
                padding-top: 8px;
                padding-bottom: 6px;
            }
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        /* Pelindo Pagination Styling & Anti-Giant Icon Guard */
        nav[role="navigation"] svg,
        .w-5.h-5,
        svg.w-5,
        svg.h-5 {
            width: 16px !important;
            height: 16px !important;
            max-width: 16px !important;
            max-height: 16px !important;
            display: inline-block !important;
            vertical-align: middle !important;
        }
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
    <div class="app-layout">
        <!-- Sidebar Kiri -->
        <aside class="sidebar">
            <div class="brand-logo-sidebar" style="position: relative;">
                <button type="button" class="sidebar-close-btn" onclick="toggleSidebar()" aria-label="Tutup Menu">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <img src="{{ asset('assets/img/logosidebar.png') }}" alt="Pelindo Multi Terminal" onerror="this.src='{{ asset('assets/img/logo ptp.png') }}'">
            </div>

            <div class="sidebar-menu-wrapper" style="padding-top: 15px;">
                <div class="menu-section-label" style="padding: 8px 24px;">
                    Menu Utama
                </div>
                <nav class="sidebar-nav" aria-label="Menu Utama">
                    <a href="{{ route('dashboard') }}" class="nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}" @if(request()->routeIs('dashboard')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        <span>Dashboard</span>
                    </a>
                    <a href="{{ route('penilaian.index') }}" class="nav-item {{ request()->routeIs('penilaian.*') ? 'active' : '' }}" @if(request()->routeIs('penilaian.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
                        <span>Penilaian</span>
                    </a>
                    <a href="{{ route('laporan.index') }}" class="nav-item {{ request()->routeIs('laporan.*') ? 'active' : '' }}" @if(request()->routeIs('laporan.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span>Laporan</span>
                    </a>
                    <a href="{{ route('profile.index') }}" class="nav-item {{ request()->routeIs('profile.*') ? 'active' : '' }}" @if(request()->routeIs('profile.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Profil Saya</span>
                    </a>
                </nav>
            </div>

            <div class="sidebar-footer" style="margin-top: auto; padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.08);">
                <button type="button" class="nav-item logout-btn" onclick="openLogoutModal()" style="width: 100%; border: none; background: transparent; cursor: pointer; text-align: start; display: flex; align-items: center; gap: 12px; color: #fca5a5; font-size: 14px; font-weight: 600;">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span>Keluar Sesi</span>
                </button>
            </div>
        </aside>

        <!-- Sidebar Overlay Mobile -->
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()" aria-hidden="true"></div>

        <!-- Konten Utama Wrapper -->
        <div class="main-content">
            <!-- Header Atas -->
            <header class="topbar">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <button type="button" class="mobile-toggle" onclick="toggleSidebar()" aria-label="Buka Menu Navigasi">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <div class="topbar-left">
                        <h2 title="Portal Evaluasi Kinerja TAD" tabindex="0" style="font-size: 16.5px; font-weight: 700; color: #0f172a; margin: 0; overflow-wrap: anywhere;">Portal Evaluasi Kinerja TAD</h2>
                        <p title="PTP Terminal Nonpetikemas Branch Cirebon &bull; {{ Auth::user()->division->name ?? 'Divisi Operasional' }}" tabindex="0" style="font-size: 12.5px; color: #64748b; margin: 0; overflow-wrap: anywhere;" class="topbar-subtitle">PTP Terminal Nonpetikemas Branch Cirebon &bull; {{ Auth::user()->division->name ?? 'Divisi Operasional' }}</p>
                    </div>
                </div>
                <div class="topbar-right" style="display: flex; align-items: center; gap: 12px;">
                    <!-- Server Clock 24H WIB (Minute-Cadence, Non-Distracting) -->
                    <div class="topbar-clock-box">
                        <span aria-hidden="true" style="width: 7px; height: 7px; border-radius: 50%; background: #15803d; display: inline-block;"></span>
                        <span class="tabular-nums" style="font-family: monospace; font-weight: 700; color: #00223B;" id="serverClockApp">{{ now()->setTimezone('Asia/Jakarta')->format('H:i') }} WIB</span>
                        <span class="clock-date-divider" aria-hidden="true" style="color: #cbd5e1;">&bull;</span>
                        <span class="clock-date-text" style="color: #64748b; font-weight: 500;">{{ now()->setTimezone('Asia/Jakarta')->translatedFormat('d M Y') }}</span>
                    </div>

                    <a href="{{ route('profile.index') }}" class="user-topbar-profile" style="text-decoration: none; cursor: pointer;" aria-label="Profil {{ Auth::user()->name }} - {{ Auth::user()->position ?? 'Penilai Karyawan' }}">
                        <div style="text-align: end;">
                            <div title="{{ Auth::user()->name }}" tabindex="0" style="font-size: 13.5px; font-weight: 600; color: #0f172a;">{{ Auth::user()->name }}</div>
                            <div title="{{ Auth::user()->position ?? 'Penilai Karyawan' }}" tabindex="0" style="font-size: 11.5px; color: #0369a1; font-weight: 600;">{{ Auth::user()->position ?? 'Penilai Karyawan' }}</div>
                        </div>
                        <div class="user-avatar-circle" aria-hidden="true">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                    </a>
                </div>
            </header>

            <!-- Container Konten Halaman -->
            <main id="main-content" class="content-body" tabindex="-1">
                @if(session('success'))
                    <div class="alert alert-success" role="status" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46;">
                        <span aria-hidden="true" style="font-size: 18px; font-weight: bold;">✓</span>
                        <span style="flex: 1; font-size: 14px;">{{ session('success') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #065f46;"><span aria-hidden="true">×</span></button>
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger" role="alert" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;">
                        <span aria-hidden="true" style="font-size: 18px; font-weight: bold;">✕</span>
                        <span style="flex: 1; font-size: 14px;">{{ session('error') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #991b1b;"><span aria-hidden="true">×</span></button>
                    </div>
                @endif

                @if(session('warning'))
                    <div class="alert alert-warning" role="alert" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e;">
                        <span aria-hidden="true" style="font-size: 18px; font-weight: bold;">!</span>
                        <span style="flex: 1; font-size: 14px;">{{ session('warning') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #92400e;"><span aria-hidden="true">×</span></button>
                    </div>
                @endif

                @if(session('info'))
                    <div class="alert alert-info" role="status" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #f0f9ff; border: 1px solid #bae6fd; color: #075985;">
                        <span aria-hidden="true" style="font-size: 18px; font-weight: bold;">ℹ</span>
                        <span style="flex: 1; font-size: 14px;">{{ session('info') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #075985;"><span aria-hidden="true">×</span></button>
                    </div>
                @endif

                @if($errors->any())
                    <div class="alert alert-danger" role="alert" style="margin-bottom: 20px; padding: 14px 20px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;">
                        <div style="font-weight: 700; font-size: 13.5px; margin-bottom: 6px;">Mohon periksa kembali isian formulir:</div>
                        <ul style="margin: 0; padding-inline-start: 20px; font-size: 13px;">
                            @foreach($errors->all() as $err)
                                <li>{{ $err }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @yield('content')
            </main>
        </div>
    </div>

    <!-- Modal Konfirmasi Keluar Sesi (Native Dialog) -->
    <dialog id="logoutModal" class="modal-dialog" aria-labelledby="appLogoutTitle" style="max-width: 400px; text-align: center;">
        <h3 id="appLogoutTitle" style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Konfirmasi Keluar Sesi</h3>
        <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0;">Apakah Anda yakin ingin mengakhiri sesi evaluasi sekarang?</p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" onclick="closeLogoutModal()" style="background: #f1f5f9; color: #334155; border: 1px solid #64748b; padding: 9px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Batal</button>
            <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                @csrf
                <button type="submit" class="btn btn-danger" style="background: #b91c1c; color: #ffffff; padding: 9px 22px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer;">Keluar Sesi</button>
            </form>
        </div>
    </dialog>

    <script>
        function toggleSidebar() {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-locked');
        }

        function openLogoutModal() {
            const modal = document.getElementById('logoutModal');
            if (modal && typeof modal.showModal === 'function') {
                modal.showModal();
            } else if (modal) {
                modal.setAttribute('open', '');
            }
        }
        function closeLogoutModal() {
            const modal = document.getElementById('logoutModal');
            if (modal && typeof modal.close === 'function' && modal.open) {
                modal.close();
            } else if (modal) {
                modal.removeAttribute('open');
            }
        }
        document.getElementById('logoutModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                const r = this.getBoundingClientRect();
                if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
                    closeLogoutModal();
                }
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    toggleSidebar();
                }
            }
        });

        // 24-Hour WIB Minute-Cadence Clock (No 1Hz ticking distraction)
        (function() {
            const clockEl = document.getElementById('serverClockApp');
            if (!clockEl) return;
            const parts = clockEl.innerText.replace(' WIB', '').split(':').map(Number);
            if (parts.length < 2 || parts.some(isNaN)) return;
            let [hours, minutes] = parts;
            setInterval(() => {
                minutes++;
                if (minutes >= 60) { minutes = 0; hours++; }
                if (hours >= 24) { hours = 0; }
                clockEl.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} WIB`;
            }, 60000);
        })();
    </script>
    @stack('scripts')
</body>
</html>
