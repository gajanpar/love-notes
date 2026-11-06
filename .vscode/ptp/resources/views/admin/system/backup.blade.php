@extends('layouts.admin', ['title' => 'Cadangan & Pemulihan Basis Data'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Cadangan &amp; Pemulihan Basis Data</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Pusat kendali snapshot data, integritas arsip, dan prosedur pemulihan bencana (Disaster Recovery)</p>
    </div>

    <!-- Tombol Buat Cadangan Instan -->
    <form action="{{ route('admin.backup.store') }}" method="POST" class="js-confirm-backup-form" data-backup-action="create">
        @csrf
        <button type="submit" style="background: #15803d; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(21, 128, 61, 0.25);">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>Buat Cadangan Baru</span>
        </button>
    </form>
</div>

<!-- Kartu Metrik Backup & Penyimpanan -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Total Arsip Cadangan</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800; color: #00223B; margin-top: 4px;">{{ $totalCount }} Berkas</div>
        <div style="font-size: 11.5px; color: #005FA8; margin-top: 2px;">Maksimal 10 snapshot terbaru</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Ukuran Total Cadangan</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800; color: #0369a1; margin-top: 4px;">{{ $totalSizeFormatted }}</div>
        <div style="font-size: 11.5px; color: #0369a1; margin-top: 2px;">Penyimpanan terkompresi</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Ruang Disk Bebas</div>
        <div class="tabular-nums" style="font-size: 28px; font-weight: 800; color: #15803d; margin-top: 4px;">{{ $freeDiskFormatted }}</div>
        <div style="font-size: 11.5px; color: #15803d; margin-top: 2px;">Kapasitas aman server lokal</div>
    </div>

    <div class="card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Cadangan Terakhir</div>
        <div class="tabular-nums" style="font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 8px;">
            {{ $latestBackup ? $latestBackup['created_at'] : 'Belum Ada' }}
        </div>
        <div style="font-size: 11.5px; color: #64748b; margin-top: 4px;">WIB (Waktu Indonesia Barat)</div>
    </div>
</div>

<!-- Tabel Daftar Cadangan Basis Data -->
<div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; background: #fafafa;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">
            Daftar Berkas Cadangan Tersedia
        </h3>
        <span style="font-size: 12px; color: #475569;">Lokasi Direktori: <code>storage/app/backups/</code></span>
    </div>

    <span id="shaCopyStatus" class="sr-only" role="status" aria-live="polite"></span>

    <div class="table-responsive" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <th style="padding: 10px 12px; text-align: center; width: 40px;">No</th>
                    <th style="padding: 10px 12px; text-align: left;">Nama Berkas Snapshot</th>
                    <th style="padding: 10px 12px; text-align: center; width: 135px;">Waktu Pembuatan</th>
                    <th style="padding: 10px 12px; text-align: center; width: 85px;">Ukuran</th>
                    <th style="padding: 10px 12px; text-align: left; width: 220px;">Integritas (SHA-256)</th>
                    <th style="padding: 10px 12px; text-align: center; width: 130px;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($backups as $index => $bk)
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="tabular-nums" style="padding: 10px 12px; text-align: center; font-weight: 600; color: #64748b;">
                            {{ $index + 1 }}
                        </td>
                        <td style="padding: 10px 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <svg aria-hidden="true" style="flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005FA8" stroke-width="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
                                <span style="font-family: monospace; font-size: 12.5px; font-weight: 700; color: #00223B; overflow-wrap: anywhere;">
                                    {{ $bk['filename'] }}
                                </span>
                            </div>
                        </td>
                        <td class="tabular-nums" style="padding: 10px 12px; text-align: center; font-size: 12px; color: #334155;">
                            {{ $bk['created_at'] }} WIB
                        </td>
                        <td class="tabular-nums" style="padding: 10px 12px; text-align: center; font-weight: 600; color: #0369a1; font-size: 12.5px; white-space: nowrap;">
                            {{ $bk['size_formatted'] }}
                        </td>
                        <td style="padding: 10px 12px;">
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <code class="tabular-nums" style="font-family: monospace; font-size: 11px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 3px 6px; border-radius: 4px; color: #334155;">
                                    {{ substr($bk['sha256'], 0, 10) }}&hellip;{{ substr($bk['sha256'], -6) }}
                                </code>
                                <button type="button"
                                        class="table-action-btn js-copy-sha"
                                        data-sha="{{ $bk['sha256'] }}"
                                        aria-label="Salin kode SHA-256 lengkap untuk {{ $bk['filename'] }}"
                                        style="background: #f1f5f9; color: #334155; border: 1px solid #64748b; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                                    Salin
                                </button>
                            </div>
                            <details style="margin-top: 4px;">
                                <summary style="font-size: 11px; color: #005FA8; font-weight: 600; cursor: pointer;">Lihat 64 digit SHA-256</summary>
                                <code style="display: block; margin-top: 4px; font-family: monospace; font-size: 10.5px; color: #1e293b; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px; word-break: break-all; line-height: 1.4;">{{ $bk['sha256'] }}</code>
                            </details>
                        </td>
                        <td style="padding: 10px 12px; text-align: center;">
                            <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
                                <a href="{{ route('admin.backup.download', $bk['filename']) }}"
                                   class="table-action-btn"
                                   title="Unduh file cadangan ke komputer"
                                   style="background: #eff6ff; color: #0369a1; border: 1px solid #bae6fd; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    <span>Unduh</span>
                                </a>

                                <form action="{{ route('admin.backup.destroy', $bk['filename']) }}" method="POST" class="js-confirm-backup-form" data-backup-action="delete" data-filename="{{ $bk['filename'] }}" style="margin: 0;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                            class="table-action-btn"
                                            aria-label="Hapus berkas cadangan {{ $bk['filename'] }}"
                                            title="Hapus berkas cadangan {{ $bk['filename'] }}"
                                            style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 5px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" style="padding: 36px; text-align: center; color: #64748b;">
                            Belum ada berkas cadangan basis data yang dibuat. Klik tombol <strong>"Buat Cadangan Baru"</strong> di atas.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Panduan Pemulihan Bencana (Disaster Recovery Guidelines) -->
<div class="card" style="background: #f8fafc; border-radius: 12px; border: 1px solid #cbd5e1; padding: 20px 24px;">
    <h4 style="font-size: 14px; font-weight: 700; color: #00223B; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005FA8" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Prosedur Pemulihan Bencana (Disaster Recovery Protocol) - Tim IT Pelindo</span>
    </h4>
    <ol style="font-size: 12.5px; color: #334155; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li><strong>Unduh Arsip:</strong> Unduh snapshot terbaru dari daftar di atas ke media penyimpanan aman terpisah (flashdisk dinas / server backup pelabuhan).</li>
        <li><strong>Hentikan Sesi Aktif:</strong> Hentikan server aplikasi sementara untuk mencegah penulisan data baru saat proses pemulihan.</li>
        <li><strong>Timpa Berkas Database:</strong> Ganti file <code>database/database.sqlite</code> dengan berkas snapshot cadangan yang telah diunduh.</li>
        <li><strong>Bersihkan Cache Framework:</strong> Jalankan perintah <code>php artisan optimize:clear</code> di terminal server.</li>
        <li><strong>Verifikasi Integritas:</strong> Jalankan <code>php artisan ptp:reconcile-scores</code> untuk memastikan tidak ada formula nilai yang terganggu.</li>
    </ol>
</div>

<!-- Modal Konfirmasi Kontekstual Backup & Hapus Snapshot -->
<dialog id="confirmBackupActionModal" class="modal-dialog" aria-labelledby="confirmBackupTitle" style="text-align: left; max-width: 440px;">
    <h3 id="confirmBackupTitle" style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Konfirmasi Tindakan Cadangan</h3>
    <p id="confirmBackupDesc" style="font-size: 13.5px; color: #475569; line-height: 1.55; margin: 0 0 20px 0;"></p>
    <div style="display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap;">
        <button type="button" onclick="closeBackupModal()" style="background: #f1f5f9; color: #334155; border: 1px solid #64748b; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
        <button type="button" id="confirmBackupSubmitBtn" style="background: #15803d; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Konfirmasi</button>
    </div>
</dialog>

@push('scripts')
<script>
    var pendingBackupForm = null;
    var backupModal = document.getElementById('confirmBackupActionModal');

    function closeBackupModal() {
        if (backupModal && typeof backupModal.close === 'function' && backupModal.open) backupModal.close();
        else if (backupModal) backupModal.removeAttribute('open');
    }

    document.querySelectorAll('.js-confirm-backup-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            if (form.dataset.confirmed === '1') return;
            e.preventDefault();
            pendingBackupForm = form;
            var action = form.dataset.backupAction;
            var titleEl = document.getElementById('confirmBackupTitle');
            var descEl = document.getElementById('confirmBackupDesc');
            var submitBtn = document.getElementById('confirmBackupSubmitBtn');

            if (action === 'delete') {
                var filename = form.dataset.filename || 'berkas ini';
                titleEl.textContent = 'Hapus Berkas Cadangan';
                descEl.textContent = 'Arsip snapshot "' + filename + '" akan dihapus permanen dari penyimpanan server lokal. Pastikan Anda telah menyimpan salinan eksternal bila diperlukan.';
                submitBtn.textContent = 'Hapus Berkas Cadangan';
                submitBtn.style.background = '#b91c1c';
            } else {
                titleEl.textContent = 'Buat Snapshot Cadangan Baru';
                descEl.textContent = 'Sistem akan membekukan salinan utuh basis data beserta sidik integritas SHA-256 ke direktori penyimpanan cadangan.';
                submitBtn.textContent = 'Buat Cadangan Sekarang';
                submitBtn.style.background = '#15803d';
            }

            if (backupModal && typeof backupModal.showModal === 'function') backupModal.showModal();
            else if (backupModal) backupModal.setAttribute('open', '');
        });
    });

    document.getElementById('confirmBackupSubmitBtn')?.addEventListener('click', function() {
        if (pendingBackupForm) {
            pendingBackupForm.dataset.confirmed = '1';
            closeBackupModal();
            pendingBackupForm.submit();
        }
    });

    backupModal?.addEventListener('click', function(e) {
        if (e.target === backupModal) {
            var r = backupModal.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
                closeBackupModal();
            }
        }
    });

    document.querySelectorAll('.js-copy-sha').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var sha = btn.dataset.sha || '';
            if (!sha) return;
            var announce = function() {
                var orig = btn.textContent;
                btn.textContent = 'Tersalin';
                var live = document.getElementById('shaCopyStatus');
                if (live) live.textContent = 'Kode SHA-256 lengkap berhasil disalin ke papan klip.';
                setTimeout(function() { btn.textContent = orig; }, 1800);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(sha).then(announce);
            } else {
                var temp = document.createElement('textarea');
                temp.value = sha;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                announce();
            }
        });
    });
</script>
@endpush
@endsection
