@extends('layouts.admin', ['title' => 'Kelola Periode Penilaian'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Manajemen Periode Penilaian</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Kontrol hak akses pembukaan dan penutupan form evaluasi bulanan antar divisi</p>
    </div>

    <!-- Filter Tahun -->
    <form method="GET" action="{{ route('admin.periods.index') }}" style="display: flex; align-items: center; gap: 10px; background: #ffffff; padding: 6px 14px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        <span style="font-size: 13px; font-weight: 600; color: #475569;">Pilih Tahun:</span>
        <select name="year" onchange="this.form.submit()" class="form-control-custom" style="padding: 6px 12px; font-size: 13px; width: auto; font-weight: 600;">
            @foreach($years as $y)
                <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }}>Tahun {{ $y }}</option>
            @endforeach
        </select>
    </form>
</div>

<!-- Informasi SOP Keamanan & Integritas Data -->
<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 14px;">
    <svg style="color: #16a34a; flex-shrink: 0; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    <div style="font-size: 13px; color: #166534; line-height: 1.5;">
        <strong>Ketentuan Periode Penilaian (SRS v1.0):</strong>
        Secara default, hanya <strong>bulan berjalan ({{ $monthNames[$currentMonth] }} {{ $currentYear }})</strong> yang terbuka untuk penginputan nilai. Bulan-bulan lainnya terkunci secara otomatis. Sebagai Administrator SDM/IT, Anda dapat membuka periode tertentu secara selektif per divisi atau serentak sesuai kebutuhan pelaporan cabang.
    </div>
</div>

<!-- Bulk Action Panel -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 14px 0; display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Aksi Serentak Seluruh Divisi (Tahun {{ $year }})
    </h3>
    <form method="POST" action="{{ route('admin.periods.bulk-toggle') }}" style="display: flex; align-items: center; flex-wrap: wrap; gap: 14px;">
        @csrf
        <input type="hidden" name="year" value="{{ $year }}">

        <div style="display: flex; align-items: center; gap: 8px;">
            <label for="bulk_month" style="font-size: 13px; font-weight: 600; color: #334155;">Pilih Bulan:</label>
            <select name="month" id="bulk_month" class="form-control-custom" style="padding: 7px 12px; font-size: 13px; width: 170px;">
                @foreach($monthNames as $m => $mName)
                    <option value="{{ $m }}" {{ $m == $currentMonth ? 'selected' : '' }}>
                        {{ $mName }}
                    </option>
                @endforeach
            </select>
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" name="action" value="open_all" onclick="return confirm('Apakah Anda yakin ingin MEMBUKA akses penilaian untuk SEMUA divisi pada bulan terpilih?')" style="background: #16a34a; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                Buka Semua Divisi
            </button>

            <button type="submit" name="action" value="close_all" onclick="return confirm('Apakah Anda yakin ingin MENUTUP akses penilaian untuk SEMUA divisi pada bulan terpilih?')" style="background: #dc2626; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Tutup Semua Divisi
            </button>
        </div>
    </form>
</div>

<!-- Matriks Periode 12 Bulan x Divisi -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
        <div>
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0;">Matriks Status Periode &mdash; Tahun {{ $year }}</h3>
            <span style="font-size: 12px; color: #64748b;">Klik tombol status untuk mengubah hak akses divisi per bulan</span>
        </div>
        <div style="display: flex; gap: 14px; font-size: 12px; font-weight: 600;">
            <span style="display: flex; align-items: center; gap: 6px; color: #16a34a;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #16a34a; display: inline-block;"></span>
                Terbuka ({{ $totalOpen }})
            </span>
            <span style="display: flex; align-items: center; gap: 6px; color: #64748b;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; display: inline-block;"></span>
                Terkunci ({{ $totalClosed }})
            </span>
        </div>
    </div>

    <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; text-align: center;">
            <thead>
                <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 11.5px; text-transform: uppercase;">
                    <th style="padding: 14px 18px; text-align: left; width: 220px; position: sticky; left: 0; background: #f1f5f9; z-index: 2;">
                        Divisi
                    </th>
                    @for($m = 1; $m <= 12; $m++)
                        @php
                            $isCurrentMonth = ($m === $currentMonth && $year === $currentYear);
                        @endphp
                        <th style="padding: 12px 10px; min-width: 95px; {{ $isCurrentMonth ? 'background: #e0f2fe; color: #0369a1; font-weight: 800;' : '' }}">
                            {{ substr($monthNames[$m], 0, 3) }}
                            @if($isCurrentMonth)
                                <div style="font-size: 9px; text-transform: uppercase; color: #0284c7; font-weight: 700; margin-top: 2px;">Bulan Ini</div>
                            @endif
                        </th>
                    @endfor
                </tr>
            </thead>
            <tbody>
                @foreach($divisions as $div)
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 14px 18px; text-align: left; font-weight: 700; color: #0f172a; position: sticky; left: 0; background: #ffffff; z-index: 1; border-right: 1px solid #e2e8f0;">
                            <div>{{ $div->name }}</div>
                            <span style="font-size: 11px; color: #64748b; font-weight: 400;">PTP Cirebon</span>
                        </td>
                        @for($m = 1; $m <= 12; $m++)
                            @php
                                $cell = $matrix[$div->id][$m];
                                $isOpen = ($cell['status'] === 'open');
                                $isCurrentMonth = ($m === $currentMonth && $year === $currentYear);
                            @endphp
                            <td style="padding: 12px 6px; {{ $isCurrentMonth ? 'background: #f8fafc;' : '' }}">
                                <form method="POST" action="{{ route('admin.periods.toggle') }}">
                                    @csrf
                                    <input type="hidden" name="division_id" value="{{ $div->id }}">
                                    <input type="hidden" name="month" value="{{ $m }}">
                                    <input type="hidden" name="year" value="{{ $year }}">
                                    <input type="hidden" name="status" value="{{ $isOpen ? 'closed' : 'open' }}">

                                    @if($isOpen)
                                        <button type="submit" title="Klik untuk mengunci/menutup periode ini" style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 5px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;" onmouseover="this.style.background='#fecaca'; this.style.color='#b91c1c'; this.style.borderColor='#fca5a5';" onmouseout="this.style.background='#dcfce7'; this.style.color='#15803d'; this.style.borderColor='#bbf7d0';">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                                            Buka
                                        </button>
                                    @else
                                        <button type="submit" title="Klik untuk membuka periode ini" style="background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; padding: 5px 9px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;" onmouseover="this.style.background='#dbeafe'; this.style.color='#1d4ed8'; this.style.borderColor='#bfdbfe';" onmouseout="this.style.background='#f1f5f9'; this.style.color='#64748b'; this.style.borderColor='#e2e8f0';">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            Tutup
                                        </button>
                                    @endif
                                </form>
                            </td>
                        @endfor
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
