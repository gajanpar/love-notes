@extends('layouts.admin', ['title' => 'Pengajuan Akses & Edit Penilaian'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px;">
    <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Pengajuan Akses &amp; Edit Penilaian</h1>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Verifikasi dan kelola permohonan pembukaan akses form evaluasi dari para Kepala Divisi</p>
</div>

<!-- Status Summary Pills -->
<div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
    <a href="{{ route('admin.requests.index', ['status' => 'all', 'type' => $currentType, 'division_id' => $currentDivision]) }}" 
       style="padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; {{ $currentStatus === 'all' ? 'background: #00223B; color: #ffffff;' : 'background: #ffffff; color: #475569; border: 1px solid #e2e8f0;' }}">
        <span>Semua Pengajuan</span>
        <span style="background: {{ $currentStatus === 'all' ? 'rgba(255,255,255,0.2)' : '#f1f5f9' }}; padding: 2px 7px; border-radius: 999px; font-size: 11px;">
            {{ $counts['all'] }}
        </span>
    </a>

    <a href="{{ route('admin.requests.index', ['status' => 'pending', 'type' => $currentType, 'division_id' => $currentDivision]) }}" 
       style="padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; {{ $currentStatus === 'pending' ? 'background: #ea580c; color: #ffffff;' : 'background: #ffffff; color: #ea580c; border: 1px solid #fed7aa;' }}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>Menunggu Persetujuan</span>
        <span style="background: {{ $currentStatus === 'pending' ? 'rgba(255,255,255,0.3)' : '#ffedd5' }}; color: {{ $currentStatus === 'pending' ? '#ffffff' : '#ea580c' }}; padding: 2px 7px; border-radius: 999px; font-size: 11px;">
            {{ $counts['pending'] }}
        </span>
    </a>

    <a href="{{ route('admin.requests.index', ['status' => 'approved', 'type' => $currentType, 'division_id' => $currentDivision]) }}" 
       style="padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; {{ $currentStatus === 'approved' ? 'background: #16a34a; color: #ffffff;' : 'background: #ffffff; color: #16a34a; border: 1px solid #bbf7d0;' }}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Disetujui</span>
        <span style="background: {{ $currentStatus === 'approved' ? 'rgba(255,255,255,0.3)' : '#dcfce7' }}; color: {{ $currentStatus === 'approved' ? '#ffffff' : '#15803d' }}; padding: 2px 7px; border-radius: 999px; font-size: 11px;">
            {{ $counts['approved'] }}
        </span>
    </a>

    <a href="{{ route('admin.requests.index', ['status' => 'completed', 'type' => $currentType, 'division_id' => $currentDivision]) }}" 
       style="padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; {{ $currentStatus === 'completed' ? 'background: #0284c7; color: #ffffff;' : 'background: #ffffff; color: #0284c7; border: 1px solid #bae6fd;' }}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Selesai Dipakai</span>
        <span style="background: {{ $currentStatus === 'completed' ? 'rgba(255,255,255,0.3)' : '#e0f2fe' }}; color: {{ $currentStatus === 'completed' ? '#ffffff' : '#0369a1' }}; padding: 2px 7px; border-radius: 999px; font-size: 11px;">
            {{ $counts['completed'] }}
        </span>
    </a>

    <a href="{{ route('admin.requests.index', ['status' => 'rejected', 'type' => $currentType, 'division_id' => $currentDivision]) }}" 
       style="padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; {{ $currentStatus === 'rejected' ? 'background: #dc2626; color: #ffffff;' : 'background: #ffffff; color: #dc2626; border: 1px solid #fecaca;' }}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>Ditolak</span>
        <span style="background: {{ $currentStatus === 'rejected' ? 'rgba(255,255,255,0.3)' : '#fee2e2' }}; color: {{ $currentStatus === 'rejected' ? '#ffffff' : '#b91c1c' }}; padding: 2px 7px; border-radius: 999px; font-size: 11px;">
            {{ $counts['rejected'] }}
        </span>
    </a>
</div>

<!-- Secondary Filter Bar -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <form method="GET" action="{{ route('admin.requests.index') }}" style="display: flex; align-items: center; flex-wrap: wrap; gap: 14px;">
        <input type="hidden" name="status" value="{{ $currentStatus }}">

        <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #475569;">Tipe Permohonan:</label>
            <select name="type" onchange="this.form.submit()" class="form-control-custom" style="padding: 6px 12px; font-size: 13px; width: auto; max-width: 100%; min-width: 0;">
                <option value="all" {{ $currentType === 'all' ? 'selected' : '' }}>Semua Tipe</option>
                <option value="division_access" {{ $currentType === 'division_access' ? 'selected' : '' }}>Akses Buka Periode Divisi</option>
                <option value="individual_edit" {{ $currentType === 'individual_edit' ? 'selected' : '' }}>Edit Nilai Karyawan</option>
            </select>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 13px; font-weight: 600; color: #475569;">Divisi:</label>
            <select name="division_id" onchange="this.form.submit()" class="form-control-custom" style="padding: 6px 12px; font-size: 13px; width: auto; max-width: 100%; min-width: 0;">
                <option value="all" {{ $currentDivision === 'all' ? 'selected' : '' }}>Semua Divisi</option>
                @foreach($divisions as $div)
                    <option value="{{ $div->id }}" {{ $currentDivision == $div->id ? 'selected' : '' }}>{{ $div->name }}</option>
                @endforeach
            </select>
        </div>

        @if($currentType !== 'all' || $currentDivision !== 'all' || $currentStatus !== 'all')
            <a href="{{ route('admin.requests.index') }}" style="font-size: 12px; color: #ef4444; font-weight: 600; text-decoration: none; margin-inline-start: auto;">
                Reset Filter
            </a>
        @endif
    </form>
</div>

<!-- Table Daftar Permohonan -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <div style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">
            Daftar Antrian Permohonan
        </h3>
        <span style="font-size: 12px; color: #64748b;">
            Menampilkan {{ $requests->total() }} total pengajuan
        </span>
    </div>

    @if($requests->isEmpty())
        <div style="padding: 48px 20px; text-align: center; color: #64748b; font-size: 14px;">
            <svg style="margin: 0 auto 12px auto; display: block; color: #94a3b8;" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            Tidak ada permohonan yang sesuai dengan filter saat ini.
        </div>
    @else
        <div class="table-responsive">
            <table class="data-table data-table-requests" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 14px 18px; text-align: start; width: 40px;">No</th>
                        <th style="padding: 14px 18px; text-align: start;">Waktu Pengajuan</th>
                        <th style="padding: 14px 18px; text-align: start;">Pemohon &amp; Divisi</th>
                        <th style="padding: 14px 18px; text-align: start;">Tipe Permohonan</th>
                        <th style="padding: 14px 18px; text-align: start;">Target / Periode</th>
                        <th style="padding: 14px 18px; text-align: start;">Alasan Pemohon</th>
                        <th style="padding: 14px 18px; text-align: start;">Status</th>
                        <th style="padding: 14px 18px; text-align: start;">Verifikator &amp; Catatan</th>
                        <th style="padding: 14px 18px; text-align: center; width: 140px; white-space: nowrap;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($requests as $idx => $req)
                        <tr style="border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                            <td style="padding: 14px 18px; color: #64748b; font-weight: 500;">
                                {{ $requests->firstItem() + $idx }}
                            </td>
                            <td style="padding: 14px 18px; color: #64748b; font-size: 12px; white-space: nowrap;">
                                <div style="font-weight: 600; color: #334155;">{{ $req->created_at->setTimezone('Asia/Jakarta')->format('d/m/Y') }}</div>
                                <div style="color: #94a3b8;">{{ $req->created_at->setTimezone('Asia/Jakarta')->format('H:i') }} WIB</div>
                            </td>
                            <td style="padding: 14px 18px;">
                                <div style="font-weight: 700; color: #0f172a;">{{ $req->requester->name ?? '-' }}</div>
                                <div style="font-size: 12px; color: #0284c7; font-weight: 500;">{{ $req->division->name ?? '-' }}</div>
                            </td>
                            <td style="padding: 14px 18px;">
                                @if($req->request_type === 'division_access')
                                    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                                        Buka Periode
                                    </span>
                                @else
                                    <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit Karyawan
                                    </span>
                                @endif
                            </td>
                            <td style="padding: 14px 18px;">
                                @if($req->request_type === 'division_access')
                                    <div style="font-weight: 600; color: #0f172a;">Seluruh Karyawan Divisi</div>
                                @else
                                    <div style="font-weight: 700; color: #0f172a;">{{ $req->employee->name ?? '-' }}</div>
                                    <div style="font-size: 11px; color: #64748b;">NIK: {{ $req->employee->nik ?? '-' }}</div>
                                @endif
                                <div style="font-size: 12px; color: #0072CE; font-weight: 600; margin-top: 2px;">
                                    Periode: {{ $monthNames[$req->period_month] ?? "Bulan $req->period_month" }} {{ $req->period_year }}
                                </div>
                            </td>
                            <td style="padding: 14px 18px; max-width: 200px;">
                                <div style="font-size: 12.5px; color: #334155; line-height: 1.4;">{{ $req->reason }}</div>
                            </td>
                            <td style="padding: 14px 18px; white-space: nowrap;">
                                @if($req->status === 'pending')
                                    <span style="background: #ffedd5; color: #c2410c; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #ea580c;"></span>
                                        Pending
                                    </span>
                                @elseif($req->status === 'approved')
                                    <span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #16a34a;"></span>
                                        Disetujui
                                    </span>
                                @elseif($req->status === 'completed')
                                    <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #0284c7;"></span>
                                        Selesai Digunakan
                                    </span>
                                @elseif($req->status === 'rejected')
                                    <span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #dc2626;"></span>
                                        Ditolak
                                    </span>
                                @endif
                            </td>
                            <td style="padding: 14px 18px; max-width: 180px; font-size: 12px;">
                                @if($req->reviewer)
                                    <div style="font-weight: 600; color: #0f172a;">{{ $req->reviewer->name }}</div>
                                    <div style="color: #64748b; font-size: 11px;">{{ $req->reviewed_at ? $req->reviewed_at->setTimezone('Asia/Jakarta')->format('d/m/Y H:i') . ' WIB' : '-' }}</div>
                                    @if($req->admin_note)
                                        <div style="margin-top: 4px; color: #475569; background: #f8fafc; padding: 4px 6px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 11.5px;">
                                            {{ $req->admin_note }}
                                        </div>
                                    @endif
                                @else
                                    <span style="color: #94a3b8; font-style: italic;">Menunggu telaah</span>
                                @endif
                            </td>
                            <td style="padding: 14px 18px; text-align: center;">
                                @if($req->status === 'pending')
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button type="button" 
                                                onclick="openApproveModal({{ $req->id }}, '{{ addslashes($req->requester->name ?? '') }}', '{{ $req->request_type === 'division_access' ? 'Akses Divisi ' . addslashes($req->division->name ?? '') : 'Edit Nilai ' . addslashes($req->employee->name ?? '') }}')"
                                                title="Setujui permohonan ini" 
                                                style="background: #16a34a; color: #ffffff; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                            Setujui
                                        </button>
                                        
                                        <button type="button" 
                                                onclick="openRejectModal({{ $req->id }}, '{{ addslashes($req->requester->name ?? '') }}')"
                                                title="Tolak permohonan ini" 
                                                style="background: #dc2626; color: #ffffff; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            Tolak
                                        </button>
                                    </div>
                                @else
                                    <span style="font-size: 11.5px; color: #94a3b8; font-weight: 600;">Sudah Ditelaah</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div style="padding: 16px 24px; border-top: 1px solid #e2e8f0;">
            {{ $requests->links('vendor.pagination.corporate') }}
        </div>
    @endif
</div>

<!-- Modal Konfirmasi Setujui -->
<div id="approveModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 460px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
            <svg style="color: #16a34a;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Persetujuan Permohonan Akses
        </h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
            Anda akan menyetujui permohonan <strong id="approveModalTarget" style="color: #0f172a;"></strong> yang diajukan oleh <strong id="approveModalRequester" style="color: #0f172a;"></strong>.
        </p>

        <form id="approveForm" method="POST" action="">
            @csrf
            <div style="margin-bottom: 16px;">
                <label for="approve_admin_note" style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">
                    Catatan Verifikasi Admin (Opsional):
                </label>
                <textarea name="admin_note" id="approve_admin_note" rows="3" class="form-control-custom" style="width: 100%; box-sizing: border-box; font-size: 13px; padding: 8px 12px;" placeholder="Contoh: Disetujui untuk perbaikan nilai AKHLAK"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeApproveModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
                    Batal
                </button>
                <button type="submit" style="background: #16a34a; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Konfirmasi Setujui
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Konfirmasi Tolak -->
<div id="rejectModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 460px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #dc2626; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
            <svg style="color: #dc2626;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Tolak Permohonan Akses
        </h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
            Berikan alasan penolakan permohonan dari <strong id="rejectModalRequester" style="color: #0f172a;"></strong> agar dapat diketahui oleh pihak penilai divisi terkait.
        </p>

        <form id="rejectForm" method="POST" action="">
            @csrf
            <div style="margin-bottom: 16px;">
                <label for="reject_admin_note" style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">
                    Alasan Penolakan:
                </label>
                <textarea name="admin_note" id="reject_admin_note" rows="3" required class="form-control-custom" style="width: 100%; box-sizing: border-box; font-size: 13px; padding: 8px 12px;" placeholder="Contoh: Periode evaluasi kuartal telah final dan ditutup oleh manajemen"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeRejectModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
                    Batal
                </button>
                <button type="submit" style="background: #dc2626; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Konfirmasi Tolak
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function openApproveModal(id, requester, target) {
        document.getElementById('approveModalRequester').innerText = requester;
        document.getElementById('approveModalTarget').innerText = target;
        document.getElementById('approveForm').action = "/admin/requests/" + id + "/approve";
        document.getElementById('approve_admin_note').value = 'Disetujui oleh Administrator SDM/IT.';
        document.getElementById('approveModal').classList.add('active');
    }

    function closeApproveModal() {
        document.getElementById('approveModal').classList.remove('active');
    }

    function openRejectModal(id, requester) {
        document.getElementById('rejectModalRequester').innerText = requester;
        document.getElementById('rejectForm').action = "/admin/requests/" + id + "/reject";
        document.getElementById('reject_admin_note').value = '';
        document.getElementById('rejectModal').classList.add('active');
    }

    function closeRejectModal() {
        document.getElementById('rejectModal').classList.remove('active');
    }

    window.onclick = function(event) {
        var approveModal = document.getElementById('approveModal');
        var rejectModal = document.getElementById('rejectModal');
        if (event.target === approveModal) {
            closeApproveModal();
        }
        if (event.target === rejectModal) {
            closeRejectModal();
        }
    };
</script>
@endsection
