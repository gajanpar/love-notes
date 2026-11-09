<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekapitulasi Penilaian Kinerja TAD - {{ $monthName }} {{ $year }}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            font-size: 11px;
            line-height: 1.4;
        }
        .header-kop {
            display: flex;
            align-items: center;
            border-bottom: 3px double #00223B;
            padding-bottom: 12px;
            margin-bottom: 16px;
        }
        .kop-logo {
            width: 140px;
            margin-right: 18px;
        }
        .kop-text {
            flex: 1;
            text-align: center;
        }
        .kop-text h2 {
            margin: 0;
            font-size: 15px;
            color: #00223B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 800;
        }
        .kop-text h3 {
            margin: 2px 0;
            font-size: 12px;
            color: #0072CE;
            font-weight: 700;
        }
        .kop-text p {
            margin: 2px 0;
            font-size: 10px;
            color: #475569;
        }
        .doc-title {
            text-align: center;
            margin-bottom: 16px;
        }
        .doc-title h1 {
            font-size: 13.5px;
            text-transform: uppercase;
            text-decoration: underline;
            margin: 0 0 4px 0;
            color: #00223B;
        }
        .doc-title p {
            margin: 0;
            font-size: 11px;
            color: #475569;
        }
        .summary-banner {
            display: flex;
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 10px 14px;
            margin-bottom: 16px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-label {
            font-size: 9.5px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
        .summary-val {
            font-size: 13px;
            font-weight: bold;
            color: #00223B;
        }
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .report-table th, .report-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
            font-size: 10px;
        }
        .report-table th {
            background: #f1f5f9;
            text-align: center;
            font-weight: bold;
            color: #0f172a;
        }
        .badge {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
        }
        .badge-sangat-baik { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .badge-baik { background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc; }
        .badge-cukup { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
        .badge-kurang { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

        .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 230px;
            text-align: center;
            font-size: 11px;
        }
        .signature-space {
            height: 60px;
        }
        .no-print {
            position: fixed;
            top: 18px;
            right: 18px;
            background: #0072CE;
            color: #ffffff;
            border: none;
            padding: 9px 18px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            font-size: 12px;
            z-index: 999;
        }
        .no-print:hover {
            background: #005bb5;
        }
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
            @page {
                size: A4 portrait;
                margin: 1cm;
            }
        }
    </style>
</head>
<body>
    <button class="no-print" onclick="window.print()">Cetak / Simpan PDF</button>

    <!-- Kop Surat Pelindo -->
    <div class="header-kop">
        <img class="kop-logo" src="{{ asset('assets/img/logo ptp.png') }}" alt="Pelindo Multi Terminal">
        <div class="kop-text">
            <h2>{{ strtoupper($branchSettings['company_name'] ?? 'PT PELABUHAN INDONESIA (PERSERO)') }}</h2>
            <h3>{{ strtoupper($branchSettings['subholding_name'] ?? 'PT PELINDO MULTI TERMINAL') }} &mdash; {{ strtoupper($branchSettings['branch_name'] ?? 'BRANCH CIREBON') }}</h3>
            <p>{{ $branchSettings['branch_address'] ?? 'Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111' }}</p>
            <p>Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) &bull; Core Values AKHLAK BUMN</p>
        </div>
    </div>

    <!-- Judul Dokumen -->
    <div class="doc-title">
        <h1>REKAPITULASI PENILAIAN KINERJA TENAGA ALIH DAYA (TAD)</h1>
        <p>Periode: <strong>{{ $monthName }} {{ $year }}</strong> &bull; Cakupan: <strong>{{ $division ? $division->name : 'Seluruh Divisi' }}</strong></p>
    </div>

    <!-- Executive Summary Banner -->
    <div class="summary-banner">
        <div class="summary-item">
            <div class="summary-label">Realisasi Evaluasi</div>
            <div class="summary-val">{{ $metrics['total_evaluated'] }} / {{ $metrics['target_employees'] }} TAD ({{ $metrics['completion_rate'] }}%)</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Rata-Rata Skor</div>
            <div class="summary-val" style="color: #0072CE;">{{ number_format($metrics['average_score'], 2) }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Predikat Cabang</div>
            <div class="summary-val">{{ $metrics['branch_predicate'] }}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Distribusi Predikat</div>
            <div style="font-size: 10px; font-weight: bold; margin-top: 2px;">
                <span style="color: #166534;">SB: {{ $metrics['predicates']['Sangat Baik'] }}</span> | 
                <span style="color: #075985;">B: {{ $metrics['predicates']['Baik'] }}</span> | 
                <span style="color: #854d0e;">CB: {{ $metrics['predicates']['Cukup Baik'] }}</span> | 
                <span style="color: #991b1b;">PP: {{ $metrics['predicates']['Perlu Perhatian'] }}</span>
            </div>
        </div>
    </div>

    <!-- Tabel Rekapitulasi -->
    <table class="report-table">
        <thead>
            <tr>
                <th style="width: 24px;">No</th>
                <th style="width: 70px;">NIK</th>
                <th>Nama Karyawan TAD</th>
                <th style="width: 105px;">Divisi Penempatan</th>
                <th style="width: 85px;">Jabatan</th>
                <th style="width: 75px;">Vendor</th>
                <th style="width: 50px;">Total Skor</th>
                <th style="width: 75px;">Predikat</th>
                <th style="width: 95px;">Penilai</th>
            </tr>
        </thead>
        <tbody>
            @forelse($evaluations as $index => $eval)
                <tr>
                    <td style="text-align: center; font-weight: bold;">{{ $index + 1 }}</td>
                    <td style="font-family: monospace; font-size: 9.5px;">{{ $eval->employee->nik ?? '-' }}</td>
                    <td style="font-weight: 600;">{{ $eval->employee->name }}</td>
                    <td>{{ $eval->employee->division->name ?? '-' }}</td>
                    <td>{{ $eval->employee->position ?? '-' }}</td>
                    <td style="font-size: 9.5px; color: #475569;">{{ $eval->employee->vendor_name ?: '-' }}</td>
                    <td style="text-align: center; font-weight: bold; color: #00223B;">{{ number_format($eval->total_score, 2) }}</td>
                    <td style="text-align: center;">
                        @if($eval->predicate === 'Sangat Baik')
                            <span class="badge badge-sangat-baik">Sangat Baik</span>
                        @elseif($eval->predicate === 'Baik')
                            <span class="badge badge-baik">Baik</span>
                        @elseif($eval->predicate === 'Cukup Baik')
                            <span class="badge badge-cukup">Cukup Baik</span>
                        @else
                            <span class="badge badge-kurang">Perlu Perhatian</span>
                        @endif
                    </td>
                    <td style="font-size: 9.5px;">{{ $eval->evaluator->name ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" style="text-align: center; padding: 18px; color: #64748b;">
                        Tidak ada data penilaian yang ditemukan untuk kriteria filter periode ini.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Tanda Tangan Formal -->
    <div class="signature-section">
        <div class="signature-box">
            <div>Mengetahui,</div>
            <div style="font-weight: bold;">{{ $branchSettings['sdm_manager_title'] ?? 'Manager SDM & Umum' }}</div>
            <div class="signature-space"></div>
            <div style="font-weight: bold; border-bottom: 1px solid #0f172a; padding-bottom: 2px;">{{ $branchSettings['sdm_manager_name'] ?? '( .................................................... )' }}</div>
            <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">
                @if(!empty($branchSettings['sdm_manager_nipp']))
                    NIPP. {{ $branchSettings['sdm_manager_nipp'] }}
                @else
                    {{ $branchSettings['branch_name'] ?? 'Branch Cirebon' }}
                @endif
            </div>
        </div>

        <div class="signature-box">
            <div>{{ $branchSettings['city'] ?? 'Cirebon' }}, {{ now()->translatedFormat('d F Y') }}</div>
            <div style="font-weight: bold;">{{ $division ? 'Kepala ' . $division->name : 'Tim Evaluasi Kinerja TAD' }}</div>
            <div class="signature-space"></div>
            <div style="border-bottom: 1px solid #0f172a; padding-bottom: 2px;">( .................................................... )</div>
            <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">{{ $branchSettings['branch_name'] ?? 'Branch Cirebon' }}</div>
        </div>
    </div>

    @if(!empty($branchSettings['document_footer_note']))
        <div style="margin-top: 20px; font-size: 8.5px; color: #64748b; font-style: italic; border-top: 1px dashed #cbd5e1; padding-top: 6px; text-align: center;">
            {{ $branchSettings['document_footer_note'] }}
        </div>
    @endif
</body>
</html>
