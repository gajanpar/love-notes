@extends('layouts.admin', ['title' => 'Log Aktivitas & Audit Trail'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Log Aktivitas &amp; Audit Trail</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Rekaman jejak audit seluruh aktivitas administratif dan perubahan data penting di SPKTAD</p>
    </div>
</div>

<!-- Kartu Statistik Aktivitas -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="kpi-label" title="Total Jejak Rekam" tabindex="0" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Total Jejak Rekam</div>
        <div style="font-size: 28px; font-weight: 800; color: #00223B; margin-top: 4px;">{{ number_format($counts['total']) }}</div>
        <div style="font-size: 11.5px; color: #0072CE; margin-top: 2px;">Seluruh peristiwa tercatat</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="kpi-label" title="Aktivitas Hari Ini" tabindex="0" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Aktivitas Hari Ini</div>
        <div style="font-size: 28px; font-weight: 800; color: #16a34a; margin-top: 4px;">{{ number_format($counts['today']) }}</div>
        <div style="font-size: 11.5px; color: #15803d; margin-top: 2px;">Tanggal {{ now()->format('d/m/Y') }}</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="kpi-label" title="Perubahan Periode" tabindex="0" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Perubahan Periode</div>
        <div style="font-size: 28px; font-weight: 800; color: #0284c7; margin-top: 4px;">{{ number_format($counts['period']) }}</div>
        <div style="font-size: 11.5px; color: #0369a1; margin-top: 2px;">Buka &amp; tutup akses divisi</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div class="kpi-label" title="Persetujuan / Penolakan" tabindex="0" style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Persetujuan / Penolakan</div>
        <div style="font-size: 28px; font-weight: 800; color: #f59e0b; margin-top: 4px;">{{ number_format($counts['requests']) }}</div>
        <div style="font-size: 11.5px; color: #b45309; margin-top: 2px;">Verifikasi izin edit &amp; periode</div>
    </div>
</div>

<!-- Filter Bar -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <form method="GET" action="{{ route('admin.activity-logs.index') }}" style="display: flex; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="flex: 1; min-width: 240px; position: relative;">
            <input type="text" name="search" value="{{ $search }}" placeholder="Cari nama pelaku, aksi, deskripsi, atau IP..."
                   style="width: 100%; padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none;">
        </div>

        <div>
            <select name="action" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #ffffff;">
                @foreach($actionGroups as $val => $lbl)
                    <option value="{{ $val }}" {{ $actionFilter === $val ? 'selected' : '' }}>{{ $lbl }}</option>
                @endforeach
            </select>
        </div>

        <div>
            <select name="role" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #ffffff;">
                <option value="all">Semua Peran</option>
                <option value="admin" {{ $roleFilter === 'admin' ? 'selected' : '' }}>Administrator</option>
                <option value="kepala_divisi" {{ $roleFilter === 'kepala_divisi' ? 'selected' : '' }}>Kepala Divisi</option>
                <option value="system" {{ $roleFilter === 'system' ? 'selected' : '' }}>Sistem / Scheduler</option>
            </select>
        </div>

        <div>
            <input type="date" name="date" value="{{ $dateFilter }}" style="padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #ffffff;">
        </div>

        <button type="submit" style="background: #00223B; color: #ffffff; border: none; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Filter
        </button>

        @if($search !== '' || $actionFilter !== 'all' || $roleFilter !== 'all' || $dateFilter !== '')
            <a href="{{ route('admin.activity-logs.index') }}" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; font-size: 13px; text-decoration: none; font-weight: 600;">
                Reset
            </a>
        @endif
    </form>
</div>

<!-- Tabel Log Audit -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <div class="table-responsive">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <th style="padding: 12px 16px; text-align: start; width: 155px;">Waktu (WIB)</th>
                    <th style="padding: 12px 16px; text-align: start; width: 170px;">Pelaku (Actor)</th>
                    <th style="padding: 12px 16px; text-align: start; width: 150px;">Aksi</th>
                    <th style="padding: 12px 16px; text-align: start;">Deskripsi Aktivitas</th>
                    <th style="padding: 12px 16px; text-align: center; width: 120px;">IP Address</th>
                    <th style="padding: 12px 16px; text-align: center; width: 85px;">Rincian</th>
                </tr>
            </thead>
            <tbody>
                @forelse($logs as $log)
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 16px; font-family: monospace; font-size: 11.5px; color: #475569;">
                            {{ $log->created_at->setTimezone('Asia/Jakarta')->format('d/m/Y H:i:s') }} WIB
                        </td>
                        <td style="padding: 12px 16px;">
                            <div style="font-weight: 600; color: #0f172a;">{{ $log->user_name }}</div>
                            <div style="margin-top: 2px;">
                                @if($log->user_role === 'admin')
                                    <span style="background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Admin</span>
                                @elseif($log->user_role === 'kepala_divisi')
                                    <span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Penilai</span>
                                @else
                                    <span style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Sistem</span>
                                @endif
                            </div>
                        </td>
                        <td style="padding: 12px 16px;">
                            <span style="font-family: monospace; font-size: 11px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 6px; border-radius: 4px; color: #334155;">
                                {{ $log->action }}
                            </span>
                        </td>
                        <td style="padding: 12px 16px; color: #334155; line-height: 1.45;">
                            {{ $log->description }}
                        </td>
                        <td style="padding: 12px 16px; text-align: center; font-family: monospace; font-size: 11px; color: #64748b;">
                            {{ $log->ip_address ?: '-' }}
                        </td>
                        <td style="padding: 12px 16px; text-align: center;">
                            @if(!empty($log->properties))
                                <button type="button" onclick="showLogDetail({{ json_encode($log) }})"
                                        style="background: #f1f5f9; color: #0072CE; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
                                    Detail
                                </button>
                            @else
                                <span style="color: #cbd5e1; font-size: 11px;">-</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" style="padding: 36px; text-align: center; color: #64748b;">
                            Tidak ada rekaman log audit yang cocok dengan filter yang ditentukan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @if($logs->hasPages())
        <div style="padding: 16px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;">
            {{ $logs->links('vendor.pagination.corporate') }}
        </div>
    @endif
</div>

<!-- Modal Rincian Log Audit -->
<div id="logDetailModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 580px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">Rincian Properti Log Audit</h3>
            <button type="button" onclick="closeLogModal()" style="background: none; border: none; font-size: 20px; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <div style="margin-bottom: 14px;">
            <div style="font-size: 11.5px; color: #64748b; text-transform: uppercase; font-weight: 600;">Deskripsi</div>
            <div id="modalLogDesc" style="font-size: 13px; color: #0f172a; font-weight: 600; margin-top: 2px;"></div>
        </div>

        <div style="margin-bottom: 14px;">
            <div style="font-size: 11.5px; color: #64748b; text-transform: uppercase; font-weight: 600;">Data Tambahan (JSON Payload)</div>
            <pre id="modalLogProps" style="background: #0f172a; color: #38bdf8; padding: 14px; border-radius: 8px; font-size: 11.5px; font-family: monospace; overflow-x: auto; margin-top: 6px; max-height: 240px;"></pre>
        </div>

        <div class="modal-actions-sticky">
            <button type="button" onclick="closeLogModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Tutup</button>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function showLogDetail(log) {
        document.getElementById('modalLogDesc').textContent = log.description;
        document.getElementById('modalLogProps').textContent = JSON.stringify(log.properties, null, 2);
        document.getElementById('logDetailModal').classList.add('active');
    }

    function closeLogModal() {
        document.getElementById('logDetailModal').classList.remove('active');
    }

    window.addEventListener('click', function(e) {
        var modal = document.getElementById('logDetailModal');
        if (e.target === modal) closeLogModal();
    });
</script>
@endpush
@endsection
