# ==============================================================================
# SPKTAD Automated Test Suite Runner (PowerShell Edition)
# PT Pelindo Multi Terminal Branch Cirebon
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  PT PELINDO MULTI TERMINAL BRANCH CIREBON - SPKTAD TEST RUNNER       " -ForegroundColor Cyan
Write-Host "  Sistem Penilaian Kinerja Tenaga Alih Daya (PowerShell Automation)  " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

function Run-Step($number, $title, [scriptblock]$action) {
    Write-Host "[LANGKAH $number/5] $title" -ForegroundColor Blue
    Write-Host "----------------------------------------------------------------------"
    $start = Get-Date
    try {
        & $action
        $elapsed = [math]::Round(((Get-Date) - $start).TotalSeconds, 2)
        Write-Host "[BERHASIL] Selesai dalam $elapsed detik.`n" -ForegroundColor Green
    }
    catch {
        Write-Host "[GAGAL] Error: $_" -ForegroundColor Red
        exit 1
    }
}

# 1. Prasyarat Lingkungan
Run-Step 1 "Pemeriksaan Prasyarat Lingkungan (PHP & Proyek)" {
    $phpVersion = php -r "echo PHP_VERSION;"
    Write-Host "• Versi PHP Terdeteksi : $phpVersion" -ForegroundColor Yellow
    if (-not (Test-Path "artisan")) {
        throw "Berkas 'artisan' tidak ditemukan di direktori saat ini."
    }
}

# 2. Audit Kualitas Data
Run-Step 2 "Audit Kualitas & Integritas Data (Data Quality Framework)" {
    php artisan ptp:data-quality
    if ($LASTEXITCODE -ne 0) { throw "Audit kualitas data menemukan anomali." }
}

# 3. Pengujian Penetrasi Keamanan Siber
Run-Step 3 "Uji Penetrasi Siber & Hardening OWASP (Hacking-Side Tests)" {
    php artisan test tests/Feature/SecurityPenetrationTest.php --compact
    if ($LASTEXITCODE -ne 0) { throw "Pengujian keamanan siber gagal." }
}

# 4. Pengujian Regresi Otomatis Menyeluruh
Run-Step 4 "Eksekusi Regresi Otomatis Menyeluruh (PHPUnit Full Suites)" {
    php artisan test --compact
    if ($LASTEXITCODE -ne 0) { throw "Terdapat pengujian regresi yang gagal." }
}

# 5. Simulasi Pembersihan Data Dummy
Run-Step 5 "Simulasi Kesiapan Transisi Data Riil (Clean Dummy Dry-Run)" {
    php artisan ptp:clean-dummy --dry-run
    if ($LASTEXITCODE -ne 0) { throw "Gagal menjalankan simulasi pembersihan dummy." }
}

Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  HASIL AKHIR: SELURUH RANGKAIAN PENGUJIAN OTOMATIS 100% SUKSES!      " -ForegroundColor Green
Write-Host "  Sistem SPKTAD Siap untuk Implementasi Produksi (Tahap 3).           " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
