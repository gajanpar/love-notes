<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{{ $title ?? 'Admin Panel' }} - SPKTAD PTP Nonpetikemas Cirebon</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/favicon.png') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        /* Admin Pelindo Corporate Layout */
        .brand-logo-sidebar-admin {
            padding: 20px 24px 16px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            background: #001F35;
        }
        .brand-logo-sidebar-admin img {
            max-width: 175px;
            height: auto;
            object-fit: contain;
            margin-bottom: 10px;
        }
        .admin-badge-pill {
            background: rgba(0, 163, 224, 0.15);
            color: #38bdf8;
            border: 1px solid rgba(56, 189, 248, 0.3);
            padding: 3px 12px;
            border-radius: 999px;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.6px;
            text-transform: uppercase;
        }
        .user-topbar-profile {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .admin-avatar-circle {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #005FA8, #0369a1);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 2px 6px rgba(0, 95, 168, 0.3);
        }
        .badge-counter {
            background: #b91c1c;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 999px;
            margin-inline-start: auto;
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
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
    @php
        $pendingBadge = \App\Models\EditRequest::where('status', 'pending')->count();
    @endphp

    <div class="app-layout">
        <!-- Sidebar Admin -->
        <aside class="sidebar" style="background: #00223B;">
            <div class="brand-logo-sidebar-admin" style="position: relative;">
                <button type="button" class="sidebar-close-btn" onclick="toggleSidebar()" aria-label="Tutup Menu">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <img src="{{ asset('assets/img/logosidebar.png') }}" alt="Pelindo Multi Terminal" onerror="this.src='{{ asset('assets/img/logo ptp.png') }}'">
                <span class="admin-badge-pill">Administrator SDM / IT</span>
            </div>

            <div class="sidebar-menu-wrapper" style="padding-top: 15px;">
                <div class="menu-section-label" style="padding: 6px 24px;">
                    Menu Utama
                </div>
                <nav class="sidebar-nav" aria-label="Menu Utama">
                    <a href="{{ route('admin.dashboard') }}" class="nav-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" @if(request()->routeIs('admin.dashboard')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        <span>Dashboard Admin</span>
                    </a>
                    
                    <a href="{{ route('admin.periods.index') }}" class="nav-item {{ request()->routeIs('admin.periods.*') ? 'active' : '' }}" @if(request()->routeIs('admin.periods.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Kelola Periode</span>
                    </a>

                    <a href="{{ route('admin.requests.index') }}" class="nav-item {{ request()->routeIs('admin.requests.*') ? 'active' : '' }}" @if(request()->routeIs('admin.requests.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                        <span>Pengajuan Akses</span>
                        @if($pendingBadge > 0)
                            <span class="badge-counter">{{ $pendingBadge }}</span>
                        @endif
                    </a>
                </nav>

                <div class="menu-section-label" style="padding: 16px 24px 6px 24px;">
                    Master Data
                </div>
                <nav class="sidebar-nav" aria-label="Master Data">
                    <a href="{{ route('admin.employees.index') }}" class="nav-item {{ request()->routeIs('admin.employees.*') ? 'active' : '' }}" @if(request()->routeIs('admin.employees.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span>Master Karyawan TAD</span>
                    </a>

                    <a href="{{ route('admin.users.index') }}" class="nav-item {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" @if(request()->routeIs('admin.users.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Master Penilai / User</span>
                    </a>

                    <a href="{{ route('admin.rubrik.index') }}" class="nav-item {{ request()->routeIs('admin.rubrik.*') ? 'active' : '' }}" @if(request()->routeIs('admin.rubrik.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                        <span>Master Rubrik AKHLAK</span>
                    </a>
                </nav>

                <div class="menu-section-label" style="padding: 16px 24px 6px 24px;">
                    Pelaporan &amp; Audit
                </div>
                <nav class="sidebar-nav" aria-label="Pelaporan dan Audit">
                    <a href="{{ route('admin.reports.index') }}" class="nav-item {{ request()->routeIs('admin.reports.*') ? 'active' : '' }}" @if(request()->routeIs('admin.reports.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        <span>Laporan Eksekutif</span>
                    </a>

                    <a href="{{ route('admin.activity-logs.index') }}" class="nav-item {{ request()->routeIs('admin.activity-logs.*') ? 'active' : '' }}" @if(request()->routeIs('admin.activity-logs.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        <span>Log Aktivitas Cabang</span>
                    </a>

                    <a href="{{ route('admin.backup.index') }}" class="nav-item {{ request()->routeIs('admin.backup.*') ? 'active' : '' }}" @if(request()->routeIs('admin.backup.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>Cadangan &amp; Pemulihan</span>
                    </a>

                    <a href="{{ route('admin.settings.index') }}" class="nav-item {{ request()->routeIs('admin.settings.*') ? 'active' : '' }}" @if(request()->routeIs('admin.settings.*')) aria-current="page" @endif>
                        <svg aria-hidden="true" class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        <span>Pengaturan Cabang</span>
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

        <!-- Main Content Wrapper -->
        <div class="main-content">
            <header class="topbar" style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <button type="button" class="mobile-toggle" onclick="toggleSidebar()" aria-label="Buka Menu Navigasi">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <div class="topbar-left">
                        <h2 title="Portal Administrator SDM / IT" tabindex="0" style="font-size: 16.5px; font-weight: 700; color: #0f172a; margin: 0; overflow-wrap: anywhere;">Portal Administrator SDM / IT</h2>
                        <p title="PTP Terminal Nonpetikemas Branch Cirebon" tabindex="0" style="font-size: 12.5px; color: #64748b; margin: 0; overflow-wrap: anywhere;" class="topbar-subtitle">PTP Terminal Nonpetikemas Branch Cirebon</p>
                    </div>
                </div>
                <div class="topbar-right" style="display: flex; align-items: center; gap: 12px;">
                    <!-- Server Clock 24H WIB (Minute-Cadence, Non-Distracting) -->
                    <div class="topbar-clock-box">
                        <span aria-hidden="true" style="width: 7px; height: 7px; border-radius: 50%; background: #15803d; display: inline-block;"></span>
                        <span class="tabular-nums" style="font-family: monospace; font-weight: 700; color: #00223B;" id="serverClock">{{ now()->setTimezone('Asia/Jakarta')->format('H:i') }} WIB</span>
                        <span class="clock-date-divider" aria-hidden="true" style="color: #cbd5e1;">&bull;</span>
                        <span class="clock-date-text" style="color: #64748b; font-weight: 500;">{{ now()->setTimezone('Asia/Jakarta')->translatedFormat('d M Y') }}</span>
                    </div>

                    <a href="{{ route('profile.index') }}" class="user-topbar-profile" style="text-decoration: none; cursor: pointer;" aria-label="Profil {{ Auth::user()->name }} - Super Administrator">
                        <div style="text-align: end;">
                            <div title="{{ Auth::user()->name }}" tabindex="0" style="font-size: 13.5px; font-weight: 600; color: #0f172a;">{{ Auth::user()->name }}</div>
                            <div title="Super Administrator" tabindex="0" style="font-size: 11.5px; color: #0369a1; font-weight: 600;">Super Administrator</div>
                        </div>
                        <div class="admin-avatar-circle" aria-hidden="true">
                            A
                        </div>
                    </a>
                </div>
            </header>

            <main id="main-content" class="content-body" tabindex="-1">
                @if(session('success'))
                    <div class="alert alert-success" role="status" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span style="flex: 1; font-size: 14px;">{{ session('success') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #065f46;"><span aria-hidden="true">&times;</span></button>
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger" role="alert" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        <span style="flex: 1; font-size: 14px;">{{ session('error') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #991b1b;"><span aria-hidden="true">&times;</span></button>
                    </div>
                @endif

                @if(session('warning'))
                    <div class="alert alert-warning" role="alert" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span style="flex: 1; font-size: 14px;">{{ session('warning') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #92400e;"><span aria-hidden="true">&times;</span></button>
                    </div>
                @endif

                @if(session('info'))
                    <div class="alert alert-info" role="status" style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <span style="flex: 1; font-size: 14px;">{{ session('info') }}</span>
                        <button type="button" class="table-action-btn" onclick="this.parentElement.remove()" aria-label="Tutup peringatan" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #1e40af;"><span aria-hidden="true">&times;</span></button>
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
    <dialog id="logoutModal" class="modal-dialog" aria-labelledby="adminLogoutTitle" style="max-width: 400px; text-align: center;">
        <h3 id="adminLogoutTitle" style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Konfirmasi Keluar Sesi</h3>
        <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0;">Apakah Anda yakin ingin mengakhiri sesi administrator sekarang?</p>
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
            const clockEl = document.getElementById('serverClock');
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
