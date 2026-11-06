@extends('layouts.admin', ['title' => 'Executive Dashboard'])

@section('content')
<!-- Page Header & Filter Context -->
<div class="animate-fade-up dashboard-header-bar" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <h1 style="font-size: var(--font-scale-h1, 24px); font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.4px;">
                Executive Dashboard
            </h1>
            <span class="badge-clean badge-clean-accent">
                Cabang Cirebon
            </span>
        </div>
        <p style="font-size: var(--font-scale-caption, 13px); color: #64748B; margin: 0;">
            Monitoring terintegrasi kinerja Tenaga Alih Daya (TAD) &mdash; <strong>{{ $monthName }} {{ $year }}</strong>
            <span style="color: #CBD5E1; margin: 0 6px;">&bull;</span>
            <span>Batas Waktu Pengisian: <strong style="color: #0F172A;">{{ $slaCutoffDate }}</strong></span>
            @if($isCutoffPassed)
                <span class="badge-clean badge-clean-neutral" style="margin-left: 4px; font-size: 10px;">Cutoff Berakhir</span>
            @else
                <span class="badge-clean badge-clean-warning" style="margin-left: 4px; font-size: 10px;">Sisa {{ $slaDaysRemaining }} Hari</span>
            @endif
        </p>
    </div>

    <!-- Quick Actions & Period Filter -->
    <div class="dashboard-filter-group" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <form id="adminPeriodFilterForm" method="GET" action="{{ route('admin.dashboard') }}" style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border-hairline, #E2E8F0); box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 6px; color: #475569; font-size: 12px; font-weight: 600;">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <label for="adminFilterMonth">Periode:</label>
            </div>
            <select id="adminFilterMonth" name="month" aria-label="Pilih bulan periode" onchange="document.getElementById('adminPeriodFilterForm').submit()" class="form-control-custom" style="padding: 5px 8px; font-size: 12.5px; width: auto; border-radius: 6px; border: 1px solid #64748B; cursor: pointer;">
                @foreach([1=>'Januari', 2=>'Februari', 3=>'Maret', 4=>'April', 5=>'Mei', 6=>'Juni', 7=>'Juli', 8=>'Agustus', 9=>'September', 10=>'Oktober', 11=>'November', 12=>'Desember'] as $m => $name)
                    <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }}>{{ $name }}</option>
                @endforeach
            </select>
            <select id="adminFilterYear" name="year" aria-label="Pilih tahun periode" onchange="document.getElementById('adminPeriodFilterForm').submit()" class="form-control-custom" style="padding: 5px 8px; font-size: 12.5px; width: auto; border-radius: 6px; border: 1px solid #64748B; cursor: pointer;">
                @for($y = 2025; $y <= 2028; $y++)
                    <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }}>{{ $y }}</option>
                @endfor
            </select>
            <noscript>
                <button type="submit" style="background: var(--brand-accent, #005FA8); color: #FFFFFF; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
                    Terapkan
                </button>
            </noscript>
        </form>

        <a href="{{ route('admin.reports.index') }}" class="card-interactive" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; text-decoration: none; color: #0F172A; font-size: 12.5px; font-weight: 600; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Laporan Eksekutif</span>
        </a>
    </div>
</div>

@if(\Illuminate\Support\Facades\Hash::check('password123', Auth::user()->password))
    <div class="animate-fade-up" style="background: var(--semantic-warning-bg, #FFFBEB); border: 1px solid var(--semantic-warning-border, #FDE68A); border-left: 4px solid #D97706; border-radius: 8px; padding: 12px 18px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
                <strong style="color: #92400E; font-size: 13px;">Peringatan Keamanan Administrator:</strong>
                <span style="color: #B45309; font-size: 12.5px;">Akun Super Administrator Anda masih menggunakan kata sandi bawaan sistem. Segera perbarui di menu profil.</span>
            </div>
        </div>
        <a href="{{ route('profile.index') }}" class="badge-clean badge-clean-warning" style="text-decoration: none; padding: 6px 12px; font-size: 11.5px;">
            Ganti Kata Sandi &rarr;
        </a>
    </div>
@endif

<!-- 4 Mathematically Calibrated KPI Cards (Zero-Whitespace System) -->
<div class="dashboard-kpi-grid">
    <!-- 1. Total TAD -->
    <div class="card-interactive animate-fade-up delay-1" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span class="kpi-label" style="font-size: 12.5px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.3px;">Total Tenaga Alih Daya</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #F1F5F9; color: var(--brand-navy, #00223B); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="tabular-nums counter kpi-val" data-target="{{ $totalEmployees }}" style="font-size: var(--font-scale-hero, 34px); font-weight: 800; color: #0F172A; line-height: 1;">{{ $totalEmployees }}</span>
            <span style="font-size: 12.5px; color: #64748B; font-weight: 500;">karyawan</span>
        </div>
        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 8px;">
            <span>Mitra: <strong>PT PDS</strong></span>
            <span class="badge-clean badge-clean-neutral" style="font-size: 10.5px;">{{ $totalDivisions }} Divisi</span>
        </div>
    </div>

    <!-- 2. Progres Evaluasi Cabang -->
    <div class="card-interactive animate-fade-up delay-2" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span class="kpi-label" style="font-size: 12.5px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.3px;">Kelengkapan Evaluasi</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--semantic-success-bg, #ECFDF5); color: var(--semantic-success-text, #059669); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="tabular-nums counter kpi-val" data-target="{{ $branchProgress }}" style="font-size: var(--font-scale-hero, 34px); font-weight: 800; color: #0F172A; line-height: 1;">{{ $branchProgress }}</span>
            <span style="font-size: 18px; font-weight: 700; color: #0F172A;">%</span>
            <span class="badge-clean {{ $branchProgress == 100 ? 'badge-clean-success' : 'badge-clean-accent' }}" style="margin-left: auto;">
                {{ $branchProgress == 100 ? 'Lengkap' : 'Berjalan' }}
            </span>
        </div>
        <div style="margin-top: 10px;">
            <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                <div style="width: {{ $branchProgress }}%; height: 100%; background: var(--brand-accent, #0072CE); border-radius: 999px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #64748B; margin-top: 6px;">
                <span>Dinilai: <strong>{{ $totalEvaluated }}</strong></span>
                <span>Belum: <strong>{{ $totalPending }}</strong></span>
            </div>
        </div>
    </div>

    <!-- 3. Rata-Rata Skor Kinerja Cabang (dengan MoM Trend) -->
    <div class="card-interactive animate-fade-up delay-3" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span class="kpi-label" style="font-size: 12.5px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.3px;">Rata-Rata Skor Kinerja</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--brand-accent-subtle, #EBF5FF); color: var(--brand-accent, #0072CE); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
            <span class="tabular-nums kpi-val" style="font-size: var(--font-scale-hero, 34px); font-weight: 800; color: #0F172A; line-height: 1;">
                {{ $averageScore > 0 ? number_format($averageScore, 1) : '-' }}
            </span>
            <span style="font-size: 13px; color: #64748B; font-weight: 600;">/ 100</span>

            <!-- MoM Trend Badge -->
            @if($momDelta !== null)
                <span class="badge-clean {{ $momDelta >= 0 ? 'badge-clean-success' : 'badge-clean-danger' }}" style="margin-left: auto;" title="Perubahan dibanding bulan {{ $prevMonthName }}">
                    {{ $momDelta >= 0 ? '+' : '' }}{{ $momDelta }} vs {{ $prevMonthName }}
                </span>
            @else
                <span class="badge-clean badge-clean-navy" style="margin-left: auto;">
                    {{ $averagePredicate }}
                </span>
            @endif
        </div>
        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 8px;">
            <span>Predikat: <strong>{{ $averagePredicate }}</strong></span>
            <span>Rentang: <strong>{{ $lowestScore }} &mdash; {{ $highestScore }}</strong></span>
        </div>
    </div>

    <!-- 4. Kepatuhan & Status Penguncian -->
    <div class="card-interactive animate-fade-up delay-4" style="padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span class="kpi-label" style="font-size: 12.5px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.3px;">Kepatuhan Periode</span>
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #F1F5F9; color: #475569; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="tabular-nums kpi-val" style="font-size: var(--font-scale-hero, 34px); font-weight: 800; color: #0F172A; line-height: 1;">{{ $lockedDivisionsCount }}</span>
            <span style="font-size: 15px; color: #64748B; font-weight: 600;">/ {{ $totalDivisions }} Divisi</span>
            @if($pendingRequestsCount > 0)
                <a href="{{ route('admin.requests.index') }}" class="badge-clean badge-clean-warning" style="margin-left: auto; text-decoration: none;" title="Tinjau Permohonan">
                    {{ $pendingRequestsCount }} Pending
                </a>
            @else
                <span class="badge-clean badge-clean-neutral" style="margin-left: auto;">Terkunci</span>
            @endif
        </div>
        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 8px;">
            <span>Batas SLA: <strong>25 {{ $monthName }} {{ $year }}, 23:59 WIB</strong></span>
            <a href="{{ route('admin.periods.index') }}" style="color: var(--brand-accent, #0072CE); text-decoration: none; font-weight: 600;">Kelola &rarr;</a>
        </div>
    </div>
</div>

<!-- SECTION: Diagnostik 6 Nilai Inti AKHLAK & Rekomendasi Kontrak PDS -->
<div class="golden-grid" style="margin-bottom: 28px;">
    <!-- Left Column (62%): Diagnostik 6 Nilai Inti AKHLAK BUMN -->
    <div class="card-interactive animate-fade-up delay-2" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
            <div>
                <h3 style="font-size: var(--font-scale-subhead, 16px); font-weight: 700; color: #0F172A; margin: 0 0 2px 0;">
                    Diagnostik 6 Nilai Inti AKHLAK BUMN
                </h3>
                <p style="font-size: 12.5px; color: #64748B; margin: 0;">Skor rata-rata per pilar kompetensi seluruh Tenaga Alih Daya cabang</p>
            </div>
            @if($weakestPillar)
                <span class="badge-clean badge-clean-warning" title="Pilar terendah memerlukan perhatian program peningkatan mutu">
                    Titik Kritis: {{ $weakestPillar['name'] }} ({{ $weakestPillar['score'] }}%)
                </span>
            @endif
        </div>

        @if($totalEvaluated === 0)
            <div style="padding: 28px; text-align: center; color: #64748B; font-size: 13px;">
                Belum ada data evaluasi yang tersimpan untuk periode {{ $monthName }} {{ $year }}.
            </div>
        @else
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px 24px;">
                @foreach($akhlakStats as $pillar)
                    <div style="padding: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <span style="font-size: 13px; font-weight: 600; color: #334155;">{{ $pillar['name'] }}</span>
                            <div style="display: flex; align-items: baseline; gap: 4px;">
                                <strong class="tabular-nums" style="font-size: 13.5px; color: #0F172A;">{{ $pillar['score_100'] }}%</strong>
                                <span style="font-size: 11px; color: #64748B;">({{ $pillar['raw_avg'] }}/5.88)</span>
                            </div>
                        </div>
                        <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                            <div style="width: {{ $pillar['score_100'] }}%; height: 100%; background: {{ $weakestPillar && $weakestPillar['name'] == $pillar['name'] ? '#D97706' : 'var(--brand-accent, #0072CE)' }}; border-radius: 999px; transition: width 0.6s ease;"></div>
                        </div>
                    </div>
                @endforeach
            </div>

            @if($weakestPillar)
                <div style="margin-top: 16px; padding: 12px 14px; background: #FFFBEB; border-radius: 8px; border: 1px solid #FDE68A; display: flex; align-items: center; gap: 10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <div style="font-size: 12.5px; color: #92400E; line-height: 1.4;">
                        <strong>Rekomendasi Mutu SDM:</strong> Pilar <u>{{ $weakestPillar['name'] }}</u> tercatat paling rendah ({{ $weakestPillar['score'] }}%). Disarankan pelaksanaan <em>refreshment training</em> SOP dan pembinaan berkala di dermaga.
                    </div>
                </div>
            @endif
        @endif
    </div>

    <!-- Right Column (38%): Kesiapan Rekomendasi Kontrak Vendor PDS -->
    <div class="card-interactive animate-fade-up delay-3" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
            <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h3 style="font-size: var(--font-scale-subhead, 16px); font-weight: 700; color: #0F172A; margin: 0 0 2px 0;">
                        Rekomendasi Kontrak PDS
                    </h3>
                    <span class="badge-clean badge-clean-navy" style="font-size: 10px;">Vendor SLA</span>
                </div>
                <p style="font-size: 12.5px; color: #64748B; margin: 0;">Bahan rapat triwulan kemitraan PT Pelindo Daya Sejahtera</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Diperpanjang Penuh -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #ECFDF5; border-radius: 8px; border: 1px solid #A7F3D0;">
                    <div>
                        <div style="font-size: 13px; font-weight: 700; color: #065F46;">Rekomendasi Diperpanjang</div>
                        <div style="font-size: 11px; color: #047857;">Skor Kinerja &ge; 80.0 (Memuaskan)</div>
                    </div>
                    <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #065F46;">
                        {{ $contractRecommendations['perpanjang'] }} <span style="font-size: 12px; font-weight: 500;">TAD</span>
                    </div>
                </div>

                <!-- Perpanjangan Bersyarat -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #FFFBEB; border-radius: 8px; border: 1px solid #FDE68A;">
                    <div>
                        <div style="font-size: 13px; font-weight: 700; color: #92400E;">Perpanjang Bersyarat</div>
                        <div style="font-size: 11px; color: #B45309;">Skor Kinerja 70.0 &mdash; 79.9 (Masa Uji)</div>
                    </div>
                    <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #92400E;">
                        {{ $contractRecommendations['bersyarat'] }} <span style="font-size: 12px; font-weight: 500;">TAD</span>
                    </div>
                </div>

                <!-- Evaluasi Pergantian Personil -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #FEF2F2; border-radius: 8px; border: 1px solid #FECACA;">
                    <div>
                        <div style="font-size: 13px; font-weight: 700; color: #991B1B;">Evaluasi Pergantian Personil</div>
                        <div style="font-size: 11px; color: #B91C1C;">Skor Kinerja &lt; 70.0 (Di Bawah Standar)</div>
                    </div>
                    <div class="tabular-nums" style="font-size: 20px; font-weight: 800; color: #991B1B;">
                        {{ $contractRecommendations['evaluasi'] }} <span style="font-size: 12px; font-weight: 500;">TAD</span>
                    </div>
                </div>
            </div>

            <!-- Enhanced Retention Metric Meter (Zero-Whitespace Symmetry) -->
            @php
                $retentionEligible = $contractRecommendations['perpanjang'] + $contractRecommendations['bersyarat'];
                $retentionRate = $totalEvaluated > 0 ? round(($retentionEligible / $totalEvaluated) * 100, 1) : 0;
            @endphp
            <div style="margin-top: 14px; padding: 12px 14px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; color: #475569;">Kelayakan Retensi Kontrak Cabang</span>
                    <strong style="font-size: 13px; color: #00223B;" class="tabular-nums">{{ $retentionRate }}%</strong>
                </div>
                <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                    <div style="width: {{ $retentionRate }}%; height: 100%; background: #0072CE; border-radius: 999px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-top: 5px;">
                    <span>Layak Lanjut: <strong>{{ $retentionEligible }}</strong> dari {{ $totalEvaluated }} TAD</span>
                    <span>Target Standar SLA: &ge; 85%</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #64748B;">
            <span>Kewenangan verifikasi: <strong>SDM Cabang</strong></span>
            <a href="{{ route('admin.reports.index') }}" style="color: var(--brand-accent, #0072CE); text-decoration: none; font-weight: 600;">Lihat Rekapitulasi &rarr;</a>
        </div>
    </div>
</div>

<!-- SECTION: Top 5 & Bottom 5 Performers Cabang -->
<div class="card-interactive animate-fade-up delay-3" style="padding: 24px; margin-bottom: 28px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
        <div>
            <h3 style="font-size: var(--font-scale-subhead, 16px); font-weight: 700; color: #0F172A; margin: 0 0 2px 0;">
                Matriks Talenta TAD (Top &amp; Bottom Performers Cabang)
            </h3>
            <p style="font-size: 12.5px; color: #64748B; margin: 0;">Identifikasi karyawan berprestasi tinggi untuk reward &amp; karyawan butuh pembinaan</p>
        </div>
        <span class="badge-clean badge-clean-neutral">
            Bulan {{ $monthName }} {{ $year }}
        </span>
    </div>

    @if($totalEvaluated === 0)
        <div style="padding: 32px; text-align: center; color: #64748B; font-size: 13px;">
            Belum ada evaluasi tersimpan pada periode ini.
        </div>
    @else
        <div class="performers-grid">
            <!-- Top 5 Performers -->
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #059669;"></span>
                    <strong style="font-size: 13px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.3px;">5 Kinerja Tertinggi (High Performers)</strong>
                </div>
                <div style="overflow-x: auto;">
                    <table class="table-interactive" style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                        <thead>
                            <tr style="border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 11px; text-transform: uppercase;">
                                <th style="padding: 8px 10px; text-align: left;">Karyawan</th>
                                <th style="padding: 8px 10px; text-align: left;">Divisi</th>
                                <th style="padding: 8px 10px; text-align: right;">Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($topPerformers as $idx => $eval)
                                <tr style="border-bottom: 1px solid #F1F5F9;">
                                    <td style="padding: 10px 10px;">
                                        <div style="font-weight: 700; color: #0F172A;">#{{ $idx + 1 }} {{ $eval->employee->name }}</div>
                                        <div style="font-size: 11px; color: #64748B;">{{ $eval->employee->position }}</div>
                                    </td>
                                    <td style="padding: 10px 10px; color: #475569; font-size: 11.5px;">
                                        {{ $eval->division->name ?? '-' }}
                                    </td>
                                    <td style="padding: 10px 10px; text-align: right;">
                                        <span class="tabular-nums" style="font-weight: 800; color: #0F172A; font-size: 13px;">{{ $eval->total_score }}</span>
                                        <div><span class="badge-clean badge-clean-navy" style="font-size: 9.5px; padding: 2px 6px;">{{ $eval->predicate }}</span></div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Bottom 5 Performers -->
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #DC2626;"></span>
                    <strong style="font-size: 13px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.3px;">5 Kinerja Terendah (Perlu Pembinaan)</strong>
                </div>
                <div style="overflow-x: auto;">
                    <table class="table-interactive" style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                        <thead>
                            <tr style="border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 11px; text-transform: uppercase;">
                                <th style="padding: 8px 10px; text-align: left;">Karyawan</th>
                                <th style="padding: 8px 10px; text-align: left;">Divisi</th>
                                <th style="padding: 8px 10px; text-align: right;">Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($bottomPerformers as $idx => $eval)
                                <tr style="border-bottom: 1px solid #F1F5F9;">
                                    <td style="padding: 10px 10px;">
                                        <div style="font-weight: 700; color: #0F172A;">{{ $eval->employee->name }}</div>
                                        <div style="font-size: 11px; color: #64748B;">{{ $eval->employee->position }}</div>
                                    </td>
                                    <td style="padding: 10px 10px; color: #475569; font-size: 11.5px;">
                                        {{ $eval->division->name ?? '-' }}
                                    </td>
                                    <td style="padding: 10px 10px; text-align: right;">
                                        <span class="tabular-nums" style="font-weight: 800; color: #991B1B; font-size: 13px;">{{ $eval->total_score }}</span>
                                        <div><span class="badge-clean {{ $eval->predicate === 'Perlu Perhatian' ? 'badge-clean-danger' : 'badge-clean-warning' }}" style="font-size: 9.5px; padding: 2px 6px;">{{ $eval->predicate }}</span></div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    @endif
</div>

<!-- SECTION: Ringkasan Progres per Divisi & Distribusi Predikat -->
<div class="golden-grid" style="margin-bottom: 28px;">
    <!-- Left Column (62%): Ringkasan Progres & Kinerja per Divisi -->
    <div class="card-interactive animate-fade-up delay-2" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
            <div>
                <h3 style="font-size: var(--font-scale-subhead, 16px); font-weight: 700; color: #0F172A; margin: 0 0 2px 0;">
                    Progres Penilaian per Divisi
                </h3>
                <p style="font-size: 12.5px; color: #64748B; margin: 0;">Status pengisian evaluasi kinerja oleh masing-masing Kepala Divisi</p>
            </div>
            <a href="{{ route('admin.periods.index') }}" class="badge-clean badge-clean-neutral" style="text-decoration: none;">
                Kelola Periode &rarr;
            </a>
        </div>

        <div class="table-responsive" style="overflow-x: auto;">
            <table class="table-interactive" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.5px;">
                        <th style="padding: 10px 12px; text-align: left;">Divisi Operasional</th>
                        <th style="padding: 10px 12px; text-align: left;">Progres Penyelesaian</th>
                        <th style="padding: 10px 12px; text-align: center;">Rata-Rata</th>
                        <th style="padding: 10px 12px; text-align: center;">Status Periode</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($divisionStats as $stat)
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                            <td style="padding: 14px 12px;">
                                <div style="font-weight: 700; color: #0F172A;">{{ $stat['division']->name }}</div>
                                <div style="font-size: 11.5px; color: #64748B; margin-top: 2px;">
                                    Total: {{ $stat['total_employees'] }} TAD &bull; Penilai: {{ $stat['division']->users->where('role', 'kepala_divisi')->first()->name ?? 'Kepala Divisi' }}
                                </div>
                            </td>
                            <td style="padding: 14px 12px; min-width: 180px;">
                                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                                    <span style="font-weight: 600; color: #0F172A;">{{ $stat['evaluated_count'] }} dari {{ $stat['total_employees'] }} selesai</span>
                                    <span class="tabular-nums" style="font-weight: 700; color: var(--brand-accent, #0072CE);">{{ $stat['progress'] }}%</span>
                                </div>
                                <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                                    <div style="width: {{ $stat['progress'] }}%; height: 100%; background: {{ $stat['progress'] == 100 ? 'var(--semantic-success-text, #059669)' : 'var(--brand-accent, #0072CE)' }}; border-radius: 999px;"></div>
                                </div>
                            </td>
                            <td style="padding: 14px 12px; text-align: center;">
                                <span class="tabular-nums" style="font-weight: 700; color: #0F172A; font-size: 13.5px;">
                                    {{ $stat['average_score'] > 0 ? number_format($stat['average_score'], 1) : '-' }}
                                </span>
                            </td>
                            <td style="padding: 14px 12px; text-align: center;">
                                @if($stat['status'] === 'closed')
                                    <span class="badge-clean badge-clean-neutral" title="Divisi ini telah dikunci permanen untuk periode terpilih">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        Terkunci
                                    </span>
                                @elseif($stat['status'] === 'edit_approved')
                                    <span class="badge-clean badge-clean-warning" title="Akses edit dibuka sementara oleh admin">
                                        Akses Edit
                                    </span>
                                @else
                                    <span class="badge-clean badge-clean-accent" title="Periode pengisian terbuka">
                                        Terbuka
                                    </span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Operational Progress Highlights (Zero-Whitespace Symmetry) -->
        @php
            $bestDivision = collect($divisionStats)->sortByDesc('progress')->first();
        @endphp
        <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid #F1F5F9; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="padding: 12px 14px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase;">Divisi Terdepan</div>
                <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-top: 2px;">{{ $bestDivision['division']->name ?? '-' }}</div>
                <div style="font-size: 11.5px; color: #047857; font-weight: 600; margin-top: 2px;">
                    Progres: {{ $bestDivision['progress'] ?? 0 }}% ({{ $bestDivision['evaluated_count'] ?? 0 }}/{{ $bestDivision['total_employees'] ?? 0 }} TAD)
                </div>
            </div>

            <div style="padding: 12px 14px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
                <div style="font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase;">Kepatuhan Cutoff SLA</div>
                <div style="font-size: 14px; font-weight: 700; color: #00223B; margin-top: 2px;">{{ $lockedDivisionsCount }} dari {{ $totalDivisions }} Divisi Terkunci</div>
                <div style="font-size: 11.5px; color: {{ $lockedDivisionsCount == $totalDivisions ? '#047857' : '#92400E' }}; font-weight: 600; margin-top: 2px;">
                    Status: {{ $lockedDivisionsCount == $totalDivisions ? '100% Kepatuhan Lengkap' : 'Menunggu Batas Cutoff 25 WIB' }}
                </div>
            </div>
        </div>
    </div>

    <!-- Right Column (38%): Interactive SVG Donut Chart (Distribusi Predikat) -->
    <div class="card-interactive animate-fade-up delay-3" style="padding: 24px;">
        <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;">
            <h3 style="font-size: var(--font-scale-subhead, 16px); font-weight: 700; color: #0F172A; margin: 0 0 2px 0;">
                Distribusi Mutu Kinerja
            </h3>
            <p style="font-size: 12.5px; color: #64748B; margin: 0;">Proporsi 4 klasifikasi predikat evaluasi TAD</p>
        </div>

        @php
            $donutR = 56;
            $donutCircumference = 2 * pi() * $donutR; // ~351.858
            $currentOffset = 0;
            $colors = [
                'Sangat Baik' => '#00223B',      // Pelindo Deep Navy
                'Baik' => '#005FA8',             // Pelindo Marine Blue
                'Cukup Baik' => '#64748B',       // Slate Neutral
                'Perlu Perhatian' => '#B91C1C',  // Crimson Alert
            ];
        @endphp

        <!-- Donut Visual Container -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px 0 18px 0;">
            <div style="position: relative; width: 170px; height: 170px;">
                <svg role="img" aria-label="Grafik donat distribusi mutu kinerja cabang" width="170" height="170" viewBox="0 0 160 160" style="transform: rotate(-90deg); overflow: visible;">
                    <!-- Background Ring -->
                    <circle cx="80" cy="80" r="{{ $donutR }}" fill="none" stroke="#F1F5F9" stroke-width="18" />

                    @if($totalEvaluated > 0)
                        @foreach($predicateCounts as $predKey => $predCount)
                            @php
                                $fraction = $totalEvaluated > 0 ? ($predCount / $totalEvaluated) : 0;
                                $dashLength = $fraction * $donutCircumference;
                                $dashSpace = $donutCircumference - $dashLength;
                                $strokeOffset = -$currentOffset;
                                $currentOffset += $dashLength;
                                $color = $colors[$predKey] ?? '#CBD5E1';
                            @endphp
                            @if($predCount > 0)
                                <circle class="donut-slice"
                                        cx="80" cy="80" r="{{ $donutR }}"
                                        fill="none"
                                        stroke="{{ $color }}"
                                        stroke-width="18"
                                        stroke-dasharray="{{ $dashLength }} {{ $dashSpace }}"
                                        stroke-dashoffset="{{ $strokeOffset }}"
                                        data-name="{{ $predKey }}"
                                        data-count="{{ $predCount }}"
                                        data-pct="{{ round($fraction * 100, 1) }}%"
                                        onmouseover="highlightDonutSlice(this)"
                                        onmouseout="resetDonutSlice()" />
                            @endif
                        @endforeach
                    @endif
                </svg>

                <!-- Center Readout -->
                <div id="donutCenterInfo" aria-live="polite" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
                    <span id="donutCenterVal" class="tabular-nums" style="font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1;">{{ $totalEvaluated }}</span>
                    <span id="donutCenterLabel" style="font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; margin-top: 3px;">Tersimpan</span>
                </div>
            </div>
        </div>

        <!-- Keyboard & Pointer Accessible Interactive Legend -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
            @foreach($predicateCounts as $predKey => $predCount)
                @php
                    $pct = $totalEvaluated > 0 ? round(($predCount / $totalEvaluated) * 100, 1) : 0;
                    $color = $colors[$predKey] ?? '#64748B';
                @endphp
                <button type="button"
                        class="legend-row"
                        aria-label="Sorot predikat {{ $predKey }}: {{ $predCount }} karyawan ({{ $pct }}%)"
                        style="width: 100%; background: transparent; border: 1px solid transparent; font-family: inherit; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background-color 0.15s ease;"
                        onmouseover="highlightByLegend('{{ $predKey }}', '{{ $predCount }}', '{{ $pct }}%')"
                        onmouseout="resetDonutSlice()"
                        onfocus="highlightByLegend('{{ $predKey }}', '{{ $predCount }}', '{{ $pct }}%')"
                        onblur="resetDonutSlice()">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span aria-hidden="true" style="display: inline-block; width: 10px; height: 10px; border-radius: 3px; background: {{ $color }};"></span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #334155;">{{ $predKey }}</span>
                    </span>
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span class="tabular-nums" style="font-size: 12px; color: #64748B;">{{ $pct }}%</span>
                        <span class="tabular-nums" style="font-size: 13px; font-weight: 700; color: #0F172A; min-width: 24px; text-align: right;">{{ $predCount }}</span>
                    </span>
                </button>
            @endforeach
        </div>
    </div>
</div>

<!-- Antrian Permohonan Akses & Edit (Recent Requests) -->
<div class="card-interactive animate-fade-up delay-4" style="overflow: hidden; margin-bottom: 24px;">
    <div style="padding: 16px 20px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <h3 style="font-size: var(--font-scale-subhead, 15px); font-weight: 700; color: #0F172A; margin: 0;">
                Permohonan Akses &amp; Edit Menunggu Persetujuan
            </h3>
        </div>
        <a href="{{ route('admin.requests.index') }}" style="font-size: 12.5px; color: var(--brand-accent, #0072CE); font-weight: 600; text-decoration: none;">
            Lihat Semua ({{ $pendingRequestsCount }}) &rarr;
        </a>
    </div>

    @if($recentRequests->isEmpty())
        <div style="padding: 32px 20px; text-align: center; color: #64748B; font-size: 13px;">
            <svg style="margin: 0 auto 8px auto; display: block; color: #94A3B8;" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Seluruh periode penilaian cabang terkendali. Tidak ada permohonan akses berstatus pending.
        </div>
    @else
        <div style="overflow-x: auto;">
            <table class="table-interactive" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                    <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; color: #64748B; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 10px 16px; text-align: left;">Tanggal</th>
                        <th style="padding: 10px 16px; text-align: left;">Pemohon (Penilai)</th>
                        <th style="padding: 10px 16px; text-align: left;">Divisi</th>
                        <th style="padding: 10px 16px; text-align: left;">Tipe Permohonan</th>
                        <th style="padding: 10px 16px; text-align: left;">Subjek / Periode</th>
                        <th style="padding: 10px 16px; text-align: left;">Alasan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($recentRequests as $req)
                        <tr style="border-bottom: 1px solid #F1F5F9;">
                            <td style="padding: 12px 16px; color: #64748B; font-size: 12px;" class="tabular-nums">
                                {{ $req->created_at->setTimezone('Asia/Jakarta')->format('d/m/Y H:i') }} WIB
                            </td>
                            <td style="padding: 12px 16px; font-weight: 600; color: #0F172A;">
                                {{ $req->requester->name ?? '-' }}
                            </td>
                            <td style="padding: 12px 16px; color: #475569;">
                                {{ $req->division->name ?? '-' }}
                            </td>
                            <td style="padding: 12px 16px;">
                                @if($req->request_type === 'division_access')
                                    <span class="badge-clean badge-clean-accent">Akses Divisi</span>
                                @else
                                    <span class="badge-clean badge-clean-warning">Edit Karyawan</span>
                                @endif
                            </td>
                            <td style="padding: 12px 16px; color: #334155; font-weight: 500;">
                                {{ $req->employee->name ?? 'Semua Karyawan Divisi' }} &mdash; Bulan {{ $req->period_month }}/{{ $req->period_year }}
                            </td>
                            <td style="padding: 12px 16px; color: #64748B; font-size: 12px;">
                                {{ $req->reason }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>

<script>
    // Lightweight Number Counter Animation (Respects prefers-reduced-motion)
    document.addEventListener('DOMContentLoaded', function() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const counters = document.querySelectorAll('.counter');
        const duration = 500;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || 0;
            if (target === 0) return;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                counter.innerText = Math.floor(easeProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    });

    // Pure Lightweight Interactive SVG Donut Center Feedback
    const defaultTotal = '{{ $totalEvaluated }}';
    const defaultLabel = 'Tersimpan';

    function highlightDonutSlice(el) {
        const count = el.getAttribute('data-count');
        const name = el.getAttribute('data-name');
        const pct = el.getAttribute('data-pct');

        document.getElementById('donutCenterVal').innerText = count;
        document.getElementById('donutCenterLabel').innerText = name + ' (' + pct + ')';
    }

    function highlightByLegend(name, count, pct) {
        document.getElementById('donutCenterVal').innerText = count;
        document.getElementById('donutCenterLabel').innerText = name + ' (' + pct + ')';

        const slices = document.querySelectorAll('.donut-slice');
        slices.forEach(s => {
            if (s.getAttribute('data-name') === name) {
                s.style.strokeWidth = '24';
            } else {
                s.style.opacity = '0.4';
            }
        });
    }

    function resetDonutSlice() {
        document.getElementById('donutCenterVal').innerText = defaultTotal;
        document.getElementById('donutCenterLabel').innerText = defaultLabel;

        const slices = document.querySelectorAll('.donut-slice');
        slices.forEach(s => {
            s.style.strokeWidth = '18';
            s.style.opacity = '1';
        });
    }
</script>
@endsection
