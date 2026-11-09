@extends('layouts.admin')

@section('title', 'Konfigurasi Cabang & Pejabat Penandatangan - SPKTAD')

@section('content')
<div class="settings-container">
    <!-- Header Banner -->
    <div class="header-card" style="background: linear-gradient(135deg, #00223B 0%, #003865 100%); border-radius: 12px; padding: 24px 28px; margin-bottom: 24px; color: #ffffff; box-shadow: 0 4px 15px rgba(0,34,59,0.12); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="max-width: 650px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span style="background: rgba(0, 114, 206, 0.3); border: 1px solid rgba(0, 114, 206, 0.5); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 20px;">
                    Tata Kelola &amp; Administrasi
                </span>
                <span style="color: rgba(255,255,255,0.6); font-size: 13px;">Branch Cirebon</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 6px 0; color: #ffffff;">
                Konfigurasi Cabang &amp; Pejabat Penandatangan
            </h1>
            <p style="font-size: 13px; color: rgba(255,255,255,0.78); margin: 0; line-height: 1.5;">
                Personalisasi identitas legalitas pelabuhan, kop surat dinas, dan data pejabat pengesah berkas evaluasi kinerja tenaga alih daya (TAD) tanpa mengubah baris kode program.
            </p>
        </div>
        <div style="display: flex; gap: 10px;">
            <button type="button" onclick="openResetModal()" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: #ffffff; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                <span>Reset Standar Cirebon</span>
            </button>
        </div>
    </div>

    <!-- Main Form & Live Preview Grid -->
    <div class="settings-grid">
        <!-- Left: Configuration Form -->
        <div>
            <form action="{{ route('admin.settings.update') }}" method="POST" id="settingsForm">
                @csrf

                <!-- Seksi 1: Identitas & Legalitas Pelabuhan -->
                <div class="settings-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-3"/></svg>
                        </div>
                        <div>
                            <h3 style="font-size: 16px; font-weight: 700; color: #00223B; margin: 0;">1. Identitas Entitas Pelabuhan</h3>
                            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Informasi resmi kop surat lembar evaluasi dan laporan rekapitulasi.</p>
                        </div>
                    </div>

                    <div class="settings-form-row-2">
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Nama BUMN Induk <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" name="company_name" id="input_company_name" required maxlength="150"
                                value="{{ old('company_name', $settings['company_name']->value ?? 'PT Pelabuhan Indonesia (Persero)') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="PT Pelabuhan Indonesia (Persero)">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Nama Subholding / Entitas <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" name="subholding_name" id="input_subholding_name" required maxlength="150"
                                value="{{ old('subholding_name', $settings['subholding_name']->value ?? 'PT Pelindo Multi Terminal') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="PT Pelindo Multi Terminal">
                        </div>
                    </div>

                    <div class="settings-form-row-2">
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Nama Cabang / Unit Operasi <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" name="branch_name" id="input_branch_name" required maxlength="150"
                                value="{{ old('branch_name', $settings['branch_name']->value ?? 'Branch Cirebon') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="Branch Cirebon">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Kota Kedudukan <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" name="city" id="input_city" required maxlength="100"
                                value="{{ old('city', $settings['city']->value ?? 'Cirebon') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="Cirebon">
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                            Alamat Lengkap Kantor Cabang <span style="color: #ef4444;">*</span>
                        </label>
                        <textarea name="branch_address" id="input_branch_address" required rows="2" maxlength="300"
                            class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a; resize: vertical;"
                            placeholder="Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111">{{ old('branch_address', $settings['branch_address']->value ?? 'Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111') }}</textarea>
                    </div>

                    <div class="settings-form-row-3">
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Kode Pos
                            </label>
                            <input type="text" name="postal_code" id="input_postal_code" maxlength="20"
                                value="{{ old('postal_code', $settings['postal_code']->value ?? '45111') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="45111">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Telepon Kantor
                            </label>
                            <input type="text" name="phone" id="input_phone" maxlength="50"
                                value="{{ old('phone', $settings['phone']->value ?? '(0231) 202441') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="(0231) 202441">
                        </div>
                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
                                Email Resmi
                            </label>
                            <input type="email" name="email" id="input_email" maxlength="100"
                                value="{{ old('email', $settings['email']->value ?? 'cirebon@pelindo.co.id') }}"
                                class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a;"
                                placeholder="cirebon@pelindo.co.id">
                        </div>
                    </div>
                </div>

                <!-- Seksi 2: Pejabat Penandatangan Resmi (Executive Signatories) -->
                <div class="settings-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m19 8 2 2-6 6-2-2z"/></svg>
                        </div>
                        <div>
                            <h3 style="font-size: 16px; font-weight: 700; color: #00223B; margin: 0;">2. Pejabat Penandatangan Resmi Cabang</h3>
                            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Otorisator berkas dinas, lembar penilaian TAD, dan rekapitulasi cabang.</p>
                        </div>
                    </div>

                    <!-- Subcard A: Branch Manager / General Manager -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                            <span style="font-size: 13.5px; font-weight: 700; color: #00223B; display: flex; align-items: center; gap: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0072CE" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Pimpinan Tertinggi Cabang (Branch Manager / GM)
                            </span>
                            <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Otorisator Eksekutif</span>
                        </div>
                        <div class="settings-form-row-3">
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    Nama Lengkap &amp; Gelar <span style="color: #ef4444;">*</span>
                                </label>
                                <input type="text" name="branch_manager_name" id="input_bm_name" required maxlength="150"
                                    value="{{ old('branch_manager_name', $settings['branch_manager_name']->value ?? 'Bambang Wijanarko, S.T., M.M.') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Contoh: Bambang Wijanarko, S.T., M.M.">
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    NIPP / NIK Pegawai
                                </label>
                                <input type="text" name="branch_manager_nipp" id="input_bm_nipp" maxlength="50"
                                    value="{{ old('branch_manager_nipp', $settings['branch_manager_nipp']->value ?? '27608912') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Contoh: 27608912">
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    Jabatan Resmi <span style="color: #ef4444;">*</span>
                                </label>
                                <input type="text" name="branch_manager_title" id="input_bm_title" required maxlength="150"
                                    value="{{ old('branch_manager_title', $settings['branch_manager_title']->value ?? 'Branch Manager') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Branch Manager">
                            </div>
                        </div>
                    </div>

                    <!-- Subcard B: Manager SDM & Umum -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                            <span style="font-size: 13.5px; font-weight: 700; color: #00223B; display: flex; align-items: center; gap: 6px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                                Penanggung Jawab Ketenagakerjaan (Manager SDM &amp; Umum)
                            </span>
                            <span style="font-size: 11px; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Verifikator Human Capital</span>
                        </div>
                        <div class="settings-form-row-3">
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    Nama Lengkap &amp; Gelar <span style="color: #ef4444;">*</span>
                                </label>
                                <input type="text" name="sdm_manager_name" id="input_sdm_name" required maxlength="150"
                                    value="{{ old('sdm_manager_name', $settings['sdm_manager_name']->value ?? 'Dedi Heryadi, S.E.') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Contoh: Dedi Heryadi, S.E.">
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    NIPP / NIK Pegawai
                                </label>
                                <input type="text" name="sdm_manager_nipp" id="input_sdm_nipp" maxlength="50"
                                    value="{{ old('sdm_manager_nipp', $settings['sdm_manager_nipp']->value ?? '28214055') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Contoh: 28214055">
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 5px;">
                                    Jabatan Resmi <span style="color: #ef4444;">*</span>
                                </label>
                                <input type="text" name="sdm_manager_title" id="input_sdm_title" required maxlength="150"
                                    value="{{ old('sdm_manager_title', $settings['sdm_manager_title']->value ?? 'Manager SDM & Umum') }}"
                                    class="form-input" style="width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a;"
                                    placeholder="Manager SDM & Umum">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Seksi 3: Disclaimer Legal Dokumen -->
                <div class="settings-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <div>
                            <h3 style="font-size: 16px; font-weight: 700; color: #00223B; margin: 0;">3. Catatan Kaki &amp; Legal Disclaimer</h3>
                            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Teks legalitas otomatis pada bagian footer dokumen cetak dinas.</p>
                        </div>
                    </div>

                    <div>
                        <textarea name="document_footer_note" id="input_footer_note" rows="3" maxlength="500"
                            class="form-input" style="width: 100%; padding: 10px 14px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; color: #0f172a; resize: vertical;"
                            placeholder="Teks catatan kaki legalitas...">{{ old('document_footer_note', $settings['document_footer_note']->value ?? 'Dokumen ini diterbitkan secara elektronik oleh Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) PT Pelindo Multi Terminal Branch Cirebon dan memiliki kekuatan hukum kedinasan yang sah.') }}</textarea>
                        <div style="font-size: 11.5px; color: #64748b; margin-top: 4px; display: flex; justify-content: space-between;">
                            <span>Maksimal 500 karakter. Ditampilkan pada catatan kaki cetak berkas dinas.</span>
                            <span id="charCounter">0 / 500</span>
                        </div>
                    </div>
                </div>

                <!-- Form Submit Action Bar -->
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <div style="font-size: 12.5px; color: #64748b;">
                        Perubahan akan langsung tercermin pada seluruh berkas cetak dinas &amp; laporan cabang.
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button type="submit" style="display: inline-flex; align-items: center; gap: 8px; background: #0072CE; border: none; color: #ffffff; padding: 11px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 114, 206, 0.35); transition: background 0.2s;" onmouseover="this.style.background='#005ba6'" onmouseout="this.style.background='#0072CE'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Simpan Perubahan Pengaturan</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Right: Interactive Live Preview (Visual Validator / UI-UX Delight) -->
        <div class="settings-preview-container" style="position: sticky; top: calc(var(--topbar-height) + 20px);">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
                <div style="background: #00223B; color: #ffffff; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></span>
                        <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">Live Preview Lembar Cetak Dinas</span>
                    </div>
                    <span style="font-size: 11px; color: #94a3b8; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">Kertas A4</span>
                </div>

                <div style="padding: 20px; background: #fafafa; border-bottom: 1px solid #e2e8f0;">
                    <!-- Simulasi Kop Surat -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 10px; border-bottom: 2px solid #00223B;">
                            <img src="{{ asset('assets/img/logo ptp.png') }}" alt="Logo" style="height: 34px; object-fit: contain;">
                            <div>
                                <div id="prev_company" style="font-size: 11px; font-weight: 800; color: #00223B; text-transform: uppercase; line-height: 1.2;">
                                    PT PELABUHAN INDONESIA (PERSERO)
                                </div>
                                <div id="prev_subholding_branch" style="font-size: 10px; font-weight: 700; color: #0072CE; text-transform: uppercase;">
                                    PT PELINDO MULTI TERMINAL - BRANCH CIREBON
                                </div>
                                <div id="prev_address" style="font-size: 8px; color: #64748b; margin-top: 2px; line-height: 1.3;">
                                    Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Simulasi Pratinjau Tanda Tangan -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
                        <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px;">
                            Pratinjau Blok Pengesahan &amp; Tanda Tangan
                        </div>
                        <div class="settings-form-row-2" style="gap: 12px;">
                            <!-- Kolom SDM -->
                            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; background: #fdfdfd;">
                                <div style="font-size: 9.5px; color: #475569;">Mengetahui,</div>
                                <div id="prev_sdm_title" style="font-size: 10px; font-weight: 700; color: #00223B; margin-bottom: 26px;">
                                    Manager SDM &amp; Umum
                                </div>
                                <div id="prev_sdm_name" style="font-size: 10px; font-weight: 700; color: #00223B; text-decoration: underline;">
                                    Dedi Heryadi, S.E.
                                </div>
                                <div id="prev_sdm_nipp" style="font-size: 8.5px; color: #64748b; margin-top: 1px;">
                                    NIPP. 28214055
                                </div>
                            </div>

                            <!-- Kolom Branch Manager -->
                            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; background: #fdfdfd;">
                                <div style="font-size: 9.5px; color: #475569;">
                                    <span id="prev_city">Cirebon</span>, {{ now()->translatedFormat('d F Y') }}
                                </div>
                                <div id="prev_bm_title" style="font-size: 10px; font-weight: 700; color: #00223B; margin-bottom: 26px;">
                                    Branch Manager
                                </div>
                                <div id="prev_bm_name" style="font-size: 10px; font-weight: 700; color: #00223B; text-decoration: underline;">
                                    Bambang Wijanarko, S.T., M.M.
                                </div>
                                <div id="prev_bm_nipp" style="font-size: 8.5px; color: #64748b; margin-top: 1px;">
                                    NIPP. 27608912
                                </div>
                            </div>
                        </div>

                        <!-- Simulasi Footer Note -->
                        <div style="margin-top: 14px; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                            <div style="font-size: 8px; color: #64748b; font-style: italic; line-height: 1.3;" id="prev_footer">
                                Dokumen ini diterbitkan secara elektronik oleh Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) PT Pelindo Multi Terminal Branch Cirebon...
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Business Analyst Insight Box -->
                <div style="padding: 16px 20px; background: #f0fdf4; border-top: 1px solid #bbf7d0;">
                    <div style="display: flex; gap: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        <div>
                            <div style="font-size: 12px; font-weight: 700; color: #166534; margin-bottom: 3px;">
                                Validasi Kepatuhan Bisnis (SLA &amp; GCG)
                            </div>
                            <div style="font-size: 11px; color: #14532d; line-height: 1.45;">
                                Sesuai prosedur operasional standar Pelindo, lembar evaluasi berkepemilikan tanda tangan sah adalah prasyarat audit SPI untuk pencairan termin pembayaran vendor penyedia jasa tenaga alih daya (TAD).
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal Konfirmasi Reset Standar -->
<div id="resetModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 440px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Konfirmasi Reset Standar</h3>
                <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Kembalikan seluruh parameter ke default resmi Cirebon.</p>
            </div>
        </div>
        <p style="font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 20px;">
            Apakah Anda yakin ingin mengembalikan seluruh identitas cabang dan nama pejabat penandatangan ke parameter standar awal Pelindo Cirebon?
        </p>
        <div class="modal-actions-sticky">
            <button type="button" onclick="closeResetModal()" style="padding: 9px 16px; font-size: 13px; font-weight: 600; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
                Batal
            </button>
            <form action="{{ route('admin.settings.reset') }}" method="POST" style="margin: 0;">
                @csrf
                <button type="submit" style="padding: 9px 18px; font-size: 13px; font-weight: 600; color: #ffffff; background: #dc2626; border: none; border-radius: 6px; cursor: pointer;">
                    Ya, Reset ke Standar
                </button>
            </form>
        </div>
    </div>
</div>

<script>
    // Live Preview Synchronization Script
    document.addEventListener('DOMContentLoaded', function() {
        const companyInput = document.getElementById('input_company_name');
        const subholdingInput = document.getElementById('input_subholding_name');
        const branchInput = document.getElementById('input_branch_name');
        const addressInput = document.getElementById('input_branch_address');
        const cityInput = document.getElementById('input_city');

        const bmNameInput = document.getElementById('input_bm_name');
        const bmNippInput = document.getElementById('input_bm_nipp');
        const bmTitleInput = document.getElementById('input_bm_title');

        const sdmNameInput = document.getElementById('input_sdm_name');
        const sdmNippInput = document.getElementById('input_sdm_nipp');
        const sdmTitleInput = document.getElementById('input_sdm_title');

        const footerInput = document.getElementById('input_footer_note');
        const charCounter = document.getElementById('charCounter');

        function updatePreview() {
            // Kop
            document.getElementById('prev_company').textContent = (companyInput.value || 'PT PELABUHAN INDONESIA (PERSERO)').toUpperCase();
            document.getElementById('prev_subholding_branch').textContent = ((subholdingInput.value || 'PT PELINDO MULTI TERMINAL') + ' - ' + (branchInput.value || 'BRANCH CIREBON')).toUpperCase();
            document.getElementById('prev_address').textContent = addressInput.value || '-';

            // Signatories
            document.getElementById('prev_sdm_title').textContent = sdmTitleInput.value || 'Manager SDM & Umum';
            document.getElementById('prev_sdm_name').textContent = sdmNameInput.value || '...........................................';
            document.getElementById('prev_sdm_nipp').textContent = sdmNippInput.value ? ('NIPP. ' + sdmNippInput.value) : '';

            document.getElementById('prev_city').textContent = cityInput.value || 'Cirebon';
            document.getElementById('prev_bm_title').textContent = bmTitleInput.value || 'Branch Manager';
            document.getElementById('prev_bm_name').textContent = bmNameInput.value || '...........................................';
            document.getElementById('prev_bm_nipp').textContent = bmNippInput.value ? ('NIPP. ' + bmNippInput.value) : '';

            // Footer
            document.getElementById('prev_footer').textContent = footerInput.value || '';
            charCounter.textContent = footerInput.value.length + ' / 500';
        }

        const inputs = [
            companyInput, subholdingInput, branchInput, addressInput, cityInput,
            bmNameInput, bmNippInput, bmTitleInput, sdmNameInput, sdmNippInput, sdmTitleInput,
            footerInput
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', updatePreview);
            }
        });

        updatePreview();
    });

    function openResetModal() {
        document.getElementById('resetModal').classList.add('active');
    }

    function closeResetModal() {
        document.getElementById('resetModal').classList.remove('active');
    }
</script>
@endsection
