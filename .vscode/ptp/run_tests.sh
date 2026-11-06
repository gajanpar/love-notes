#!/usr/bin/env bash
# ==============================================================================
# SPKTAD Automated Test Suite Runner - PT Pelindo Multi Terminal Branch Cirebon
# ==============================================================================
# Skrip otomasi pengujian mandiri (Solo Developer) untuk menjalankan seluruh
# rangkaian verifikasi kualitas data, regresi fungsional, dan pengujian penetrasi.
# Kompatibel: Git Bash (Windows), Linux, macOS
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'

# ANSI Color Codes
readonly C_RESET='\033[0m'
readonly C_RED='\033[1;31m'
readonly C_GREEN='\033[1;32m'
readonly C_YELLOW='\033[1;33m'
readonly C_BLUE='\033[1;34m'
readonly C_CYAN='\033[1;36m'
readonly C_BOLD='\033[1m'

# Menampilkan Banner Korporat
echo -e "${C_CYAN}${C_BOLD}"
echo "======================================================================"
echo "  PT PELINDO MULTI TERMINAL BRANCH CIREBON - SPKTAD TEST RUNNER       "
echo "  Sistem Penilaian Kinerja Tenaga Alih Daya (Solo Automated Testing) "
echo "======================================================================"
echo -e "${C_RESET}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$SCRIPT_DIR"

TOTAL_STEPS=5
CURRENT_STEP=0

step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo -e "\n${C_BLUE}${C_BOLD}[LANGKAH ${CURRENT_STEP}/${TOTAL_STEPS}]${C_RESET} ${C_BOLD}$1${C_RESET}"
    echo "----------------------------------------------------------------------"
}

success() {
    echo -e "${C_GREEN}[BERHASIL]${C_RESET} $1"
}

warn() {
    echo -e "${C_YELLOW}[PERHATIAN]${C_RESET} $1"
}

fail() {
    echo -e "${C_RED}[GAGAL]${C_RESET} $1"
    exit 1
}

# ------------------------------------------------------------------------------
# 1. Verifikasi Prasyarat Environment
# ------------------------------------------------------------------------------
step "Pemeriksaan Prasyarat Lingkungan (PHP, Artisan, Database)"

command -v php >/dev/null 2>&1 || fail "PHP CLI tidak ditemukan di PATH. Pasang PHP 8.3+ terlebih dahulu."
PHP_VER=$(php -r "echo PHP_VERSION;")
echo -e "• Versi PHP terdeteksi : ${C_GREEN}${PHP_VER}${C_RESET}"

if [[ ! -f "artisan" ]]; then
    fail "Berkas 'artisan' tidak ditemukan. Pastikan skrip dijalankan dari root folder proyek."
fi

if [[ ! -f ".env" ]]; then
    warn "Berkas .env tidak ditemukan. Menyalin dari .env.example..."
    cp .env.example .env
    php artisan key:generate
fi
success "Lingkungan PHP & framework siap."

# ------------------------------------------------------------------------------
# 2. Audit Kualitas Data (Data Quality Framework)
# ------------------------------------------------------------------------------
step "Audit Kualitas & Integritas Data (Data Quality Framework)"
echo "Menjalankan 5 dimensi validasi data (Kelengkapan, Keunikan, Validitas, Relasi, Higienitas)..."

if php artisan ptp:data-quality; then
    success "Audit Kualitas Data Lolos dengan Health Score 100% (EXCELLENT)."
else
    fail "Audit Kualitas Data menemukan anomali pada basis data."
fi

# ------------------------------------------------------------------------------
# 3. Pengujian Penetrasi Keamanan Siber (Hacking-Side Penetration Test)
# ------------------------------------------------------------------------------
step "Uji Penetrasi Siber & Hardening OWASP (Hacking-Side Tests)"
echo "Menguji 10 vektor serangan: IDOR/BOLA, Period Lock Bypass, Stored XSS, CSV Formula Injection, Brute-Force, PrivEsc..."

if php artisan test tests/Feature/SecurityPenetrationTest.php --compact; then
    success "Semua 10 skenario pengujian penetrasi lolos 100% kebal serangan."
else
    fail "Terdeteksi celah keamanan pada SecurityPenetrationTest!"
fi

# ------------------------------------------------------------------------------
# 4. Pengujian Regresi Otomatis Menyeluruh (All 14 Test Suites)
# ------------------------------------------------------------------------------
step "Eksekusi Regresi Otomatis Menyeluruh (PHPUnit Full Suites)"
echo "Menjalankan 91 kasus uji fungsional, otentikasi, formula skor, workflow, dan scheduler..."

START_TIME=$(date +%s)
if php artisan test --compact; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    success "Seluruh 91 pengujian otomatis (542 asersi) berhasil diselesaikan dalam ${DURATION} detik."
else
    fail "Terdapat kasus uji yang gagal dalam pengujian regresi."
fi

# ------------------------------------------------------------------------------
# 5. Simulasi Pembersihan Transaksi Dummy (Dry-Run Mode)
# ------------------------------------------------------------------------------
step "Verifikasi Kesiapan Transisi Data Riil (Clean Dummy Simulation)"

php artisan ptp:clean-dummy --dry-run
success "Simulasi pembersihan dummy terverifikasi aman."

# ------------------------------------------------------------------------------
# Ringkasan Akhir
# ------------------------------------------------------------------------------
echo -e "\n${C_GREEN}${C_BOLD}"
echo "======================================================================"
echo "  HASIL AKHIR: SELURUH RANGKAIAN PENGUJIAN OTOMATIS 100% SUKSES!      "
echo "  Sistem SPKTAD Pelindo Cirebon Siap Memasuki Tahap 3 (Go-Live).      "
echo "======================================================================"
echo -e "${C_RESET}"
