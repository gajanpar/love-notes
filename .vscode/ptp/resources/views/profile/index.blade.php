@extends($layout)

@section('title', 'Profil Akun & Keamanan Kata Sandi - SPKTAD')

@section('content')
<div class="profile-container">
    <!-- Header Banner -->
    <div class="header-card" style="background: linear-gradient(135deg, #00223B 0%, #003865 100%); border-radius: 12px; padding: 24px 28px; margin-bottom: 24px; color: #ffffff; box-shadow: 0 4px 15px rgba(0,34,59,0.12); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="max-width: 650px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap;">
                <span style="background: rgba(0, 114, 206, 0.3); border: 1px solid rgba(56, 189, 248, 0.5); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 20px;">
                    Manajemen Akun Kedinasan
                </span>
                <span style="color: #e2e8f0; font-size: 13px;">PTP Nonpetikemas Branch Cirebon</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 6px 0; color: #ffffff;">
                Profil Akun &amp; Keamanan Kata Sandi
            </h1>
            <p style="font-size: 13px; color: rgba(255,255,255,0.78); margin: 0; line-height: 1.5;">
                Kelola informasi akun Anda dan perbarui kata sandi secara mandiri untuk menjaga keamanan data penilaian kinerja Tenaga Alih Daya (TAD).
            </p>
        </div>
    </div>

    @if($isDefaultPassword)
        <!-- Peringatan Kata Sandi Bawaan -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 14px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
                <h4 style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0 0 4px 0;">Peringatan Keamanan Kredensial</h4>
                <p style="font-size: 13px; color: #b45309; margin: 0; line-height: 1.5;">
                    Akun Anda terdeteksi masih menggunakan kata sandi bawaan sistem (<code>password123</code>). Demi perlindungan kerahasiaan evaluasi kerja di lingkungan Pelindo, mohon segera ubah kata sandi Anda melalui formulir di bawah ini.
                </p>
            </div>
        </div>
    @endif

    <div class="profile-grid">
        <!-- Kiri: Informasi Identitas Akun -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); min-width: 0;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 20px;">
                <div aria-hidden="true" style="width: 72px; height: 72px; border-radius: 50%; background: #00223B; color: #ffffff; font-size: 26px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; box-shadow: 0 4px 10px rgba(0,34,59,0.2);">
                    {{ strtoupper(substr($user->name, 0, 1)) }}
                </div>
                <h2 style="font-size: 17px; font-weight: 700; color: #00223B; margin: 0 0 4px 0;">{{ $user->name }}</h2>
                <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">{{ $user->position ?? 'Pejabat Penilai' }}</div>
                <div>
                    @if($user->role === 'admin')
                        <span style="background: #e0f2fe; color: #0369a1; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
                            Administrator SDM / IT
                        </span>
                    @else
                        <span style="background: #ecfdf5; color: #065f46; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
                            Penilai Karyawan (Kepala Divisi)
                        </span>
                    @endif
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 13px;">
                    <span style="color: #64748b;">Nama Pengguna (Username)</span>
                    <span style="font-weight: 600; color: #0f172a; font-family: monospace;">{{ $user->username }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 13px;">
                    <span style="color: #64748b;">Unit Kerja / Divisi</span>
                    <span style="font-weight: 600; color: #0f172a;">{{ $user->division ? $user->division->name : 'Seluruh Unit Kerja' }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 13px;">
                    <span style="color: #64748b;">Status Akun</span>
                    <span style="font-weight: 600; color: {{ $user->is_active ? '#047857' : '#b91c1c' }};">
                        {{ $user->is_active ? '● Aktif' : '● Dinonaktifkan' }}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 13px;">
                    <span style="color: #64748b;">Terdaftar Sejak</span>
                    <span class="tabular-nums" style="font-weight: 600; color: #0f172a;">{{ $user->created_at ? $user->created_at->format('d/m/Y') : '-' }}</span>
                </div>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; background: #f8fafc; border-radius: 8px; padding: 12px; font-size: 12px; color: #475569; line-height: 1.5;">
                <div style="font-weight: 600; color: #334155; margin-bottom: 4px;">Informasi Identitas Kedinasan:</div>
                Perubahan data nama lengkap, divisi, atau mutasi jabatan hanya dapat dilakukan melalui Administrator SDM &amp; Umum Pelindo Cirebon.
            </div>
        </div>

        <!-- Kanan: Form Ganti Kata Sandi Mandiri -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); min-width: 0;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: #e0f2fe; color: #0369a1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                    <h3 style="font-size: 16px; font-weight: 700; color: #00223B; margin: 0;">Ubah Kata Sandi Mandiri</h3>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Perbarui kredensial masuk akun Anda secara aman.</p>
                </div>
            </div>

            @if($errors->any())
                <div role="alert" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #991b1b;">
                    <ul style="margin: 0; padding-left: 20px;">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('profile.password.update') }}" method="POST">
                @csrf
                @method('PUT')

                <div style="margin-bottom: 16px;">
                    <label for="current_password" style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                        Kata Sandi Saat Ini <span style="color: #b91c1c;">*</span>
                    </label>
                    <div style="position: relative;">
                        <input type="password" name="current_password" id="current_password" required autocomplete="current-password"
                            class="form-input" style="width: 100%; padding: 10px 44px 10px 14px; font-size: 13.5px; border: 1px solid #64748b; border-radius: 8px; color: #0f172a;"
                            placeholder="Masukkan kata sandi lama Anda">
                        <button type="button" class="table-action-btn" onclick="togglePasswordVisibility('current_password', this)" aria-label="Tampilkan kata sandi saat ini" aria-pressed="false" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #475569; padding: 6px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="new_password" style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                        Kata Sandi Baru <span style="color: #b91c1c;">*</span>
                    </label>
                    <div style="position: relative;">
                        <input type="password" name="password" id="new_password" required minlength="8" autocomplete="new-password"
                            class="form-input" style="width: 100%; padding: 10px 44px 10px 14px; font-size: 13.5px; border: 1px solid #64748b; border-radius: 8px; color: #0f172a;"
                            placeholder="Minimal 8 karakter">
                        <button type="button" class="table-action-btn" onclick="togglePasswordVisibility('new_password', this)" aria-label="Tampilkan kata sandi baru" aria-pressed="false" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #475569; padding: 6px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="password_confirmation" style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                        Konfirmasi Kata Sandi Baru <span style="color: #b91c1c;">*</span>
                    </label>
                    <div style="position: relative;">
                        <input type="password" name="password_confirmation" id="password_confirmation" required minlength="8" autocomplete="new-password"
                            class="form-input" style="width: 100%; padding: 10px 44px 10px 14px; font-size: 13.5px; border: 1px solid #64748b; border-radius: 8px; color: #0f172a;"
                            placeholder="Ulangi kata sandi baru">
                        <button type="button" class="table-action-btn" onclick="togglePasswordVisibility('password_confirmation', this)" aria-label="Tampilkan konfirmasi kata sandi baru" aria-pressed="false" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #475569; padding: 6px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center;">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #475569;">
                    <div style="font-weight: 600; color: #00223B; margin-bottom: 4px;">Ketentuan Keamanan Kata Sandi Pelindo:</div>
                    <ul style="margin: 0; padding-left: 18px; line-height: 1.5;">
                        <li>Minimal terdiri dari <strong>8 karakter</strong>.</li>
                        <li>Harus berbeda dari kata sandi saat ini.</li>
                        <li>Gunakan kombinasi huruf besar, huruf kecil, dan angka.</li>
                    </ul>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button type="submit" class="btn-info" style="display: inline-flex; align-items: center; gap: 8px; background: #005FA8; border: none; color: #ffffff; padding: 11px 22px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 95, 168, 0.3);">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Simpan Kata Sandi Baru</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function togglePasswordVisibility(fieldId, btn) {
        const input = document.getElementById(fieldId);
        const svg = btn ? btn.querySelector('svg') : null;
        if (input.type === 'password') {
            input.type = 'text';
            if (btn) btn.setAttribute('aria-pressed', 'true');
            if (svg) svg.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>';
        } else {
            input.type = 'password';
            if (btn) btn.setAttribute('aria-pressed', 'false');
            if (svg) svg.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
        }
    }
</script>
@endsection
