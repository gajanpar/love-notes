@extends('layouts.app', ['title' => 'Laporan Penilaian'])

@section('content')
<div class="page-title-box" style="margin-bottom: 20px;">
    <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Laporan Penilaian</h1>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Laporan karyawan yang sudah dinilai</p>
</div>

<!-- Filter Bar Sesuai Bab 5.2 Gambar 5.1 SRS -->
<div class="card" style="background: #ffffff; padding: 16px 24px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
    <form method="GET" action="{{ route('laporan.index') }}" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <select name="month" class="form-control-custom" style="width: auto; min-width: 140px; padding: 8px 12px;">
            @foreach($monthNames as $m => $name)
                <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }}>{{ $name }}</option>
            @endforeach
        </select>

        <select name="year" class="form-control-custom" style="width: auto; min-width: 100px; padding: 8px 12px;">
            @for($y = 2025; $y <= 2028; $y++)
                <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }}>{{ $y }}</option>
            @endfor
        </select>

        <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
            Filter
        </button>
    </form>
</div>

<!-- Ringkasan Jumlah Penilaian -->
<div style="font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 12px;">
    Hasil ({{ $totalEvaluations }} penilaian)
</div>

<!-- Tabel Laporan Sesuai Bab 5.3 Gambar 5.1 SRS -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                    <th style="padding: 14px 20px; width: 60px;">No</th>
                    <th style="padding: 14px 20px;">Karyawan</th>
                    <th style="padding: 14px 20px;">Jabatan</th>
                    <th style="padding: 14px 20px;">Periode</th>
                    <th style="padding: 14px 20px;">Total Skor</th>
                    <th style="padding: 14px 20px;">Status</th>
                    <th style="padding: 14px 20px; text-align: center; width: 100px;">Detail</th>
                </tr>
            </thead>
            <tbody>
                @forelse($evaluations as $index => $eval)
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 14px 20px; color: #64748b;">{{ $index + 1 }}</td>
                        <td style="padding: 14px 20px; font-weight: 600; color: #0f172a;">{{ $eval->employee->name }}</td>
                        <td style="padding: 14px 20px; color: #475569;">{{ $eval->employee->position ?? '-' }}</td>
                        <td style="padding: 14px 20px; color: #64748b;">{{ $eval->period_label }}</td>
                        <td style="padding: 14px 20px; font-weight: 700; color: #0f172a;">
                            {{ number_format($eval->total_score, 2) }}
                        </td>
                        <td style="padding: 14px 20px;">
                            <span class="badge {{ $eval->badge_class }}" style="padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 11px;">
                                {{ $eval->predicate }}
                            </span>
                        </td>
                        <td style="padding: 14px 20px; text-align: center;">
                            <a href="{{ route('laporan.detail', ['id' => $eval->id]) }}" 
                               style="background: #f1f5f9; color: #0072CE; border: 1px solid #cbd5e1; text-decoration: none; padding: 5px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block;">
                                Lihat
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="padding: 40px; text-align: center; color: #64748b;">
                            Tidak ada data penilaian untuk periode {{ $monthNames[$month] ?? '' }} {{ $year }}.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Panduan Interpretasi Skor Sesuai Bab 5.4 SRS -->
<div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 20px; margin-top: 24px; font-size: 12px; color: #475569;">
    <strong>ℹ Interpretasi Predikat Skor:</strong><br>
    <div style="display: flex; gap: 16px; margin-top: 6px; flex-wrap: wrap;">
        <span style="color: #16a34a; font-weight: 600;">Skor 85 &ndash; 100: Sangat Baik</span>
        <span style="color: #0284c7; font-weight: 600;">Skor 70 &ndash; 84: Baik</span>
        <span style="color: #d97706; font-weight: 600;">Skor 55 &ndash; 69: Cukup Baik</span>
        <span style="color: #dc2626; font-weight: 600;">Skor &lt; 55: Perlu Perhatian</span>
    </div>
</div>
@endsection
