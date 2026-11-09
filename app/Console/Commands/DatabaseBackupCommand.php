<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('ptp:backup {--clean : Otomatis bersihkan arsip cadangan lama} {--keep=10 : Jumlah arsip terbaru yang disimpan}')]
#[Description('Membuat snapshot cadangan basis data SPKTAD yang terverifikasi dan aman')]
class DatabaseBackupCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(BackupService $backupService): int
    {
        $this->info('Memulai pembuatan snapshot cadangan basis data SPKTAD PTP Cirebon...');

        try {
            $backup = $backupService->createBackup();

            $this->info('✓ Snapshot cadangan basis data berhasil dibuat!');
            $this->table(
                ['Parameter', 'Nilai'],
                [
                    ['Nama Berkas', $backup['filename']],
                    ['Ukuran', $backup['size_formatted']],
                    ['Lokasi Simpan', $backup['path']],
                    ['Checksum SHA-256', $backup['sha256']],
                    ['Waktu Pembuatan', $backup['created_at']],
                ]
            );

            if ($this->option('clean')) {
                $keep = (int) $this->option('keep');
                $pruned = $backupService->pruneOldBackups($keep);
                if ($pruned > 0) {
                    $this->line("Dibersihkan {$pruned} berkas cadangan lama (menyimpan {$keep} arsip terbaru).");
                }
            }

            return 0;
        } catch (\Throwable $e) {
            $this->error('Gagal membuat cadangan database: '.$e->getMessage());

            return 1;
        }
    }
}
