@extends('layouts.admin', ['title' => 'Master Penilai & Pengguna'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Master Penilai &amp; Pengguna Sistem</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Kelola hak akses Kepala Divisi (Penilai), akun Administrator SDM/IT, serta layanan reset kredensial</p>
    </div>

    <button type="button" onclick="openCreateUserModal()" style="background: #0072CE; color: #ffffff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(0, 114, 206, 0.25);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Tambah Akun Pengguna
    </button>
</div>

<!-- Metric Summary Cards -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="kpi-label" title="Total Akun Terdaftar" tabindex="0" style="font-size: 12.5px; font-weight: 600; color: #64748b;">Total Akun Terdaftar</span>
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
        </div>
        <div style="font-size: 26px; font-weight: 800; color: #0f172a;">{{ $counts['total'] }}</div>
        <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">Pengguna sistem SPKTAD</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="kpi-label" title="Penilai Aktif (Kepala Divisi)" tabindex="0" style="font-size: 12.5px; font-weight: 600; color: #16a34a;">Penilai Aktif (Kepala Divisi)</span>
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
            </div>
        </div>
        <div style="font-size: 26px; font-weight: 800; color: #15803d;">{{ $counts['evaluators'] }}</div>
        <div style="font-size: 11.5px; color: #16a34a; margin-top: 2px;">Pejabat penilai unit divisi</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="kpi-label" title="Administrator SDM / IT" tabindex="0" style="font-size: 12.5px; font-weight: 600; color: #0369a1;">Administrator SDM / IT</span>
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #f0f9ff; color: #0369a1; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
        </div>
        <div style="font-size: 26px; font-weight: 800; color: #0f172a;">{{ $counts['admins'] }}</div>
        <div style="font-size: 11.5px; color: #0284c7; margin-top: 2px;">Otoritas cabang penuh</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="kpi-label" title="Akun Nonaktif" tabindex="0" style="font-size: 12.5px; font-weight: 600; color: #64748b;">Akun Nonaktif</span>
            <div style="width: 34px; height: 34px; border-radius: 8px; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
        </div>
        <div style="font-size: 26px; font-weight: 800; color: #475569;">{{ $counts['inactive'] }}</div>
        <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">Sesi login otomatis dicabut</div>
    </div>
</div>

<!-- Filter & Search Bar -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <form method="GET" action="{{ route('admin.users.index') }}" style="display: flex; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="flex: 1; min-width: 220px;">
            <input type="text" name="search" value="{{ $search }}" placeholder="Cari nama lengkap, username, jabatan..." class="form-control-custom" style="width: 100%; padding: 8px 14px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px;">
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #475569;">Role:</label>
            <select name="role" onchange="this.form.submit()" class="form-control-custom" style="padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; width: auto;">
                <option value="all" {{ $currentRole === 'all' ? 'selected' : '' }}>Semua Role</option>
                <option value="kepala_divisi" {{ $currentRole === 'kepala_divisi' ? 'selected' : '' }}>Kepala Divisi (Penilai)</option>
                <option value="admin" {{ $currentRole === 'admin' ? 'selected' : '' }}>Administrator SDM/IT</option>
            </select>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #475569;">Divisi:</label>
            <select name="division_id" onchange="this.form.submit()" class="form-control-custom" style="padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; width: auto;">
                <option value="all" {{ $currentDivision === 'all' ? 'selected' : '' }}>Semua Divisi</option>
                @foreach($divisions as $div)
                    <option value="{{ $div->id }}" {{ (string) $currentDivision === (string) $div->id ? 'selected' : '' }}>{{ $div->name }}</option>
                @endforeach
            </select>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #475569;">Status:</label>
            <select name="status" onchange="this.form.submit()" class="form-control-custom" style="padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; width: auto;">
                <option value="all" {{ $currentStatus === 'all' ? 'selected' : '' }}>Semua</option>
                <option value="active" {{ $currentStatus === 'active' ? 'selected' : '' }}>Aktif</option>
                <option value="inactive" {{ $currentStatus === 'inactive' ? 'selected' : '' }}>Nonaktif</option>
            </select>
        </div>

        <button type="submit" style="background: #00223B; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Filter
        </button>

        @if($search !== '' || $currentRole !== 'all' || $currentDivision !== 'all' || $currentStatus !== 'all')
            <a href="{{ route('admin.users.index') }}" style="font-size: 12.5px; color: #dc2626; font-weight: 600; text-decoration: none; padding: 8px 12px; display: inline-flex; align-items: center;">
                Reset
            </a>
        @endif
    </form>
</div>

<!-- Users Table -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">Daftar Akun Pengguna Sistem</h3>
        <span style="font-size: 12px; color: #64748b;">Menampilkan {{ $users->total() }} akun</span>
    </div>

    @if($users->isEmpty())
        <div style="padding: 48px 20px; text-align: center; color: #64748b; font-size: 14px;">
            Tidak ada akun pengguna yang sesuai dengan filter.
        </div>
    @else
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 13px 18px; text-align: start; width: 45px;">No</th>
                        <th style="padding: 13px 18px; text-align: start;">Nama &amp; Jabatan</th>
                        <th style="padding: 13px 18px; text-align: start;">Username &amp; Email</th>
                        <th style="padding: 13px 18px; text-align: start;">Peran Sistem</th>
                        <th style="padding: 13px 18px; text-align: start;">Divisi Wewenang</th>
                        <th style="padding: 13px 18px; text-align: center;">Rekam Evaluasi</th>
                        <th style="padding: 13px 18px; text-align: center;">Status</th>
                        <th style="padding: 13px 18px; text-align: center; width: 255px;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $idx => $u)
                        @php
                            $isSelf = $u->id === Auth::id();
                        @endphp
                        <tr style="border-bottom: 1px solid #f1f5f9; {{ !$u->is_active ? 'background: #fafafa; opacity: 0.82;' : '' }}">
                            <td style="padding: 13px 18px; color: #64748b;">
                                {{ $users->firstItem() + $idx }}
                            </td>
                            <td style="padding: 13px 18px;">
                                <div style="font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                                    {{ $u->name }}
                                    @if($isSelf)
                                        <span style="background: #00223B; color: #38bdf8; padding: 1px 7px; border-radius: 999px; font-size: 10px; font-weight: 700;">Sesi Anda</span>
                                    @endif
                                </div>
                                <div style="font-size: 12px; color: #64748b;">{{ $u->position ?: '-' }}</div>
                            </td>
                            <td style="padding: 13px 18px;">
                                <div style="font-family: monospace; font-weight: 700; color: #0369a1; font-size: 12.5px;">&#64;{{ $u->username }}</div>
                                @if($u->email)
                                    <div style="font-size: 11.5px; color: #64748b;">{{ $u->email }}</div>
                                @endif
                            </td>
                            <td style="padding: 13px 18px;">
                                @if($u->role === 'admin')
                                    <span style="background: #00223B; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                        Admin SDM / IT
                                    </span>
                                @else
                                    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
                                        Kepala Divisi
                                    </span>
                                @endif
                            </td>
                            <td style="padding: 13px 18px; color: #334155; font-weight: 600;">
                                {{ $u->division->name ?? 'Seluruh Cabang' }}
                            </td>
                            <td style="padding: 13px 18px; text-align: center;">
                                <span style="background: #f1f5f9; color: #334155; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600;">
                                    {{ $u->evaluations_count }} nilai
                                </span>
                            </td>
                            <td style="padding: 13px 18px; text-align: center;">
                                @if($u->is_active)
                                    <span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;">Aktif</span>
                                @else
                                    <span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;">Nonaktif</span>
                                @endif
                            </td>
                            <td style="padding: 13px 18px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap;">
                                    <button type="button"
                                            class="js-edit-user"
                                            data-id="{{ $u->id }}"
                                            data-name="{{ $u->name }}"
                                            data-username="{{ $u->username }}"
                                            data-email="{{ $u->email }}"
                                            data-role="{{ $u->role }}"
                                            data-division-id="{{ $u->division_id }}"
                                            data-position="{{ $u->position }}"
                                            data-active="{{ $u->is_active ? '1' : '0' }}"
                                            data-self="{{ $isSelf ? '1' : '0' }}"
                                            title="Edit profil pengguna"
                                            style="background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; padding: 5px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit
                                    </button>

                                    <button type="button"
                                            class="js-reset-password"
                                            data-id="{{ $u->id }}"
                                            data-name="{{ $u->name }}"
                                            data-username="{{ $u->username }}"
                                            title="Reset password pengguna"
                                            style="background: #fefce8; color: #a16207; border: 1px solid #fde68a; padding: 5px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                        Reset Sandi
                                    </button>

                                    @if(!$isSelf)
                                        <form method="POST" action="{{ route('admin.users.toggle-status', $u->id) }}" style="margin: 0;">
                                            @csrf
                                            <button type="submit"
                                                    style="background: {{ $u->is_active ? '#fff7ed' : '#f0fdf4' }}; color: {{ $u->is_active ? '#c2410c' : '#15803d' }}; border: 1px solid {{ $u->is_active ? '#fed7aa' : '#bbf7d0' }}; padding: 5px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer;">
                                                {{ $u->is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                                            </button>
                                        </form>

                                        @if($u->evaluations_count === 0 && $u->edit_requests_count === 0)
                                            <form method="POST" action="{{ route('admin.users.destroy', $u->id) }}" style="margin: 0;" onsubmit="return confirm('Hapus permanen akun baru ini?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" title="Hapus akun tanpa riwayat" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 5px 8px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                </button>
                                            </form>
                                        @endif
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div style="padding: 16px 24px; border-top: 1px solid #e2e8f0;">
            {{ $users->links('vendor.pagination.corporate') }}
        </div>
    @endif
</div>

<!-- Modal Tambah Pengguna -->
<div id="createUserModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 540px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Buat Akun Pengguna Baru</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">Tambahkan akun Kepala Divisi (Penilai) atau Administrator SDM/IT.</p>

        <form method="POST" action="{{ route('admin.users.store') }}">
            @csrf
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nama Lengkap <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="name" required placeholder="Contoh: Budi Santoso" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Username Login <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="username" required placeholder="Contoh: budi_ops" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Peran (Role) <span style="color: #dc2626;">*</span></label>
                    <select name="role" id="create_user_role" onchange="syncDivisionVisibility('create')" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        <option value="kepala_divisi">Kepala Divisi (Penilai)</option>
                        <option value="admin">Administrator SDM / IT</option>
                    </select>
                </div>
                <div id="create_division_wrap">
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Divisi Wewenang <span style="color: #dc2626;">*</span></label>
                    <select name="division_id" id="create_user_division" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        <option value="">-- Pilih Divisi --</option>
                        @foreach($activeDivisions as $div)
                            <option value="{{ $div->id }}">{{ $div->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Jabatan Struktural</label>
                    <input type="text" name="position" placeholder="Contoh: Kepala Divisi Operasi" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Email Dinas <span style="color: #94a3b8; font-weight: 400;">(Opsional)</span></label>
                    <input type="email" name="email" placeholder="nama@pelindo.co.id" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div class="modal-grid-2" style="margin-bottom: 18px;">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Password Awal <span style="color: #dc2626;">*</span></label>
                    <input type="password" name="password" required minlength="8" placeholder="Minimal 8 karakter" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Konfirmasi Password <span style="color: #dc2626;">*</span></label>
                    <input type="password" name="password_confirmation" required minlength="8" placeholder="Ulangi password" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeCreateUserModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Buat Akun</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Edit Pengguna -->
<div id="editUserModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 540px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Edit Profil Akun Pengguna</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">Perbarui informasi profil, peran, atau divisi wewenang penilai.</p>

        <form id="editUserForm" method="POST" action="">
            @csrf
            @method('PUT')
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nama Lengkap <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="name" id="edit_user_name" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Username Login <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="username" id="edit_user_username" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Peran (Role) <span style="color: #dc2626;">*</span></label>
                    <select name="role" id="edit_user_role" onchange="syncDivisionVisibility('edit')" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        <option value="kepala_divisi">Kepala Divisi (Penilai)</option>
                        <option value="admin">Administrator SDM / IT</option>
                    </select>
                </div>
                <div id="edit_division_wrap">
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Divisi Wewenang <span style="color: #dc2626;">*</span></label>
                    <select name="division_id" id="edit_user_division" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        <option value="">-- Pilih Divisi --</option>
                        @foreach($divisions as $div)
                            <option value="{{ $div->id }}">{{ $div->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="modal-grid-3">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Jabatan Struktural</label>
                    <input type="text" name="position" id="edit_user_position" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Email Dinas</label>
                    <input type="email" name="email" id="edit_user_email" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Status</label>
                    <select name="is_active" id="edit_user_active" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                    </select>
                </div>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeEditUserModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Reset Password oleh Admin -->
<div id="resetPasswordModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 450px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
            <svg style="color: #d97706;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            Reset Kata Sandi Pengguna
        </h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">
            Tetapkan password baru untuk <strong id="resetTargetName" style="color: #0f172a;"></strong> (<span id="resetTargetUsername" style="font-family: monospace; color: #0369a1;"></span>). Sesi login lama pada perangkat lain akan otomatis diakhiri.
        </p>

        <form id="resetPasswordForm" method="POST" action="">
            @csrf
            <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Password Baru <span style="color: #dc2626;">*</span></label>
                <input type="password" name="new_password" id="reset_new_password" required minlength="8" placeholder="Minimal 8 karakter" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            </div>

            <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Konfirmasi Password Baru <span style="color: #dc2626;">*</span></label>
                <input type="password" name="new_password_confirmation" id="reset_new_password_confirmation" required minlength="8" placeholder="Ketik ulang password baru" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeResetPasswordModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #d97706; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Konfirmasi Reset Sandi</button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    function syncDivisionVisibility(mode) {
        var roleEl = document.getElementById(mode + '_user_role');
        var wrapEl = document.getElementById(mode + '_division_wrap');
        var selectEl = document.getElementById(mode + '_user_division');
        if (roleEl.value === 'admin') {
            wrapEl.style.opacity = '0.45';
            selectEl.required = false;
            selectEl.value = '';
            selectEl.disabled = true;
        } else {
            wrapEl.style.opacity = '1';
            selectEl.disabled = false;
            selectEl.required = true;
        }
    }

    function openCreateUserModal() {
        syncDivisionVisibility('create');
        document.getElementById('createUserModal').classList.add('active');
    }
    function closeCreateUserModal() {
        document.getElementById('createUserModal').classList.remove('active');
    }
    function closeEditUserModal() {
        document.getElementById('editUserModal').classList.remove('active');
    }
    function closeResetPasswordModal() {
        document.getElementById('resetPasswordModal').classList.remove('active');
    }

    document.querySelectorAll('.js-edit-user').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            document.getElementById('editUserForm').action = "{{ url('/admin/users') }}/" + encodeURIComponent(id);
            document.getElementById('edit_user_name').value = this.dataset.name || '';
            document.getElementById('edit_user_username').value = this.dataset.username || '';
            document.getElementById('edit_user_email').value = this.dataset.email || '';
            document.getElementById('edit_user_role').value = this.dataset.role || 'kepala_divisi';
            document.getElementById('edit_user_division').value = this.dataset.divisionId || '';
            document.getElementById('edit_user_position').value = this.dataset.position || '';
            document.getElementById('edit_user_active').value = this.dataset.active || '1';
            syncDivisionVisibility('edit');
            if (this.dataset.role === 'kepala_divisi') {
                document.getElementById('edit_user_division').value = this.dataset.divisionId || '';
            }
            document.getElementById('editUserModal').classList.add('active');
        });
    });

    document.querySelectorAll('.js-reset-password').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            document.getElementById('resetPasswordForm').action = "{{ url('/admin/users') }}/" + encodeURIComponent(id) + "/reset-password";
            document.getElementById('resetTargetName').textContent = this.dataset.name || '';
            document.getElementById('resetTargetUsername').textContent = '@' + (this.dataset.username || '');
            document.getElementById('reset_new_password').value = '';
            document.getElementById('reset_new_password_confirmation').value = '';
            document.getElementById('resetPasswordModal').classList.add('active');
        });
    });

    window.addEventListener('click', function(e) {
        ['createUserModal', 'editUserModal', 'resetPasswordModal'].forEach(function(modalId) {
            var el = document.getElementById(modalId);
            if (e.target === el) el.classList.remove('active');
        });
    });
</script>
@endpush
@endsection
