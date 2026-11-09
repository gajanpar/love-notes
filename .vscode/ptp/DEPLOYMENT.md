# Panduan Deployment 100% Pure Free (Zero Credit Card)
## SPKTAD PT Pelindo Multi Terminal Branch Cirebon

Panduan resmi ini mendokumentasikan strategi dan langkah implementasi deployment aplikasi **SPKTAD** (Sistem Penilaian Kinerja Tenaga Alih Daya) yang **100% MURNI GRATIS TANPA KARTU KREDIT (Strictly ZERO Credit Card / Zero Billing)**.

Setelah evaluasi komprehensif terhadap kebijakan cloud terbaru:
- **Render.com**: Sekarang mewajibkan verifikasi kartu kredit saat pembuatan Web Service.
- **Hugging Face Spaces**: Docker SDK sekarang berbayar/memerlukan metode pembayaran.

Repositori ini telah dioptimalkan secara universal untuk **3 Platform Pure Free** yang terbukti dapat diakses tanpa biaya dan tanpa kartu kredit sama sekali.

---

## 1. Matriks Perbandingan 3 Platform Pure Free

| Dimensi Evaluasi | Alwaysdata (Pilihan Utama) | Vercel Serverless (Demo Cepat) | InfinityFree (cPanel Tradisional) |
| :--- | :--- | :--- | :--- |
| **Biaya & Kartu Kredit** | **100% Pure Free ($0)** · Tanpa Kartu | **100% Pure Free ($0)** · Tanpa Kartu | **100% Pure Free ($0)** · Tanpa Kartu |
| **Metode Registrasi** | Verifikasi email (30 detik) | GitHub OAuth (1 klik) | Verifikasi email (1 menit) |
| **Ketahanan Data SQLite** | **PERMANEN** (SSD persistent disk) | **EPHEMERAL** (/tmp Lambda container) | **PERMANEN** (Shared persistent disk) |
| **Versi PHP Runtime** | **PHP 8.4** (Natif & Kompatibel Penuh) | **PHP 8.3 / 8.4** (`vercel-php`) | **PHP 8.4** (Server-wide) |
| **Dukungan Document Root** | **Natif**: Arahkan ke `ptp/public` | **Natif**: Otomatis via `vercel.json` | **Virtual**: Otomatis via root `.htaccess` |
| **Akses Terminal / SSH** | **Lengkap**: SSH & Web Console Browser | **Tidak ada** (Serverless execution) | **Tidak ada** (Hanya FTP / File Manager) |
| **Artisan & Composer CLI** | **Bisa**: Eksekusi langsung di server | **Tidak**: Pre-packaged di repositori | **Tidak**: Dijalankan lokal sebelum upload |
| **Kecepatan Deployment** | ~3 Menit via Git Clone | ~60 Detik via 1-Click Import | ~15 Menit via FTP upload |
| **Sertifikat SSL / HTTPS** | **Otomatis**: Let's Encrypt 1-Klik | **Otomatis**: Vercel Global Edge SSL | **Otomatis**: Let's Encrypt via Client Area |
| **Rekomendasi Peran** | **#1 UTAMA: Operasional Penuh & Staging** | **#1 ALTERNATIF: Demo Cepat & Presentasi** | **CADANGAN: Shared Hosting cPanel Klasik** |

---

## 2. Opsi 1 (Sangat Direkomendasikan): Alwaysdata Setup Guide

Alwaysdata adalah solusi terbaik untuk menjalankan SPKTAD Laravel 13 secara penuh dengan database SQLite persisten, akses SSH, CLI Artisan, dan konsumsi penyimpanan yang sangat hemat (~38 MB dari kuota gratis 100 MB).

### Langkah 1: Pendaftaran Akun Gratis (30 Detik)
1. Buka [https://admin.alwaysdata.com/register/](https://admin.alwaysdata.com/register/).
2. Masukkan nama akun (contoh: `spktad-cirebon`), alamat email, dan password.
3. Klik link verifikasi di email Anda. **Tidak ada permintaan kartu kredit atau informasi penagihan apa pun.**

### Langkah 2: Konfigurasi PHP & Web Site
1. Di panel Alwaysdata, buka **Environment > PHP**:
   - Pilih default version: **8.4** (atau 8.3).
   - Di bagian konfigurasi PHP (`php.ini`), pastikan ekstensi SQLite aktif:
     ```ini
     extension = pdo_sqlite.so
     extension = sqlite3.so
     ```
2. Buka menu **Web > Sites**:
   - Edit situs default (`<account>.alwaysdata.net`).
   - **Type**: `PHP`
   - **PHP Version**: `8.4`
   - **Working directory**: `/home/<account>/ptp`
   - **Root directory**: `ptp/public`
   - Centang **Force SSL redirect** (HTTPS).
   - Klik **Submit**.

### Langkah 3: Deployment & Setup Aplikasi via SSH
Buka terminal desktop (`ssh <account>@ssh-<account>.alwaysdata.net`) atau gunakan **Web SSH Console** bawaan Alwaysdata di `https://ssh-<account>.alwaysdata.net`, lalu jalankan baris perintah berikut:

```bash
# 1. Clone repositori SPKTAD dari GitHub (shallow clone menghemat kuota disk)
git clone --depth 1 https://github.com/gajanpar/ptp.git ~/ptp

# 2. Masuk ke direktori proyek
cd ~/ptp

# 3. Install dependency produksi (ringan & cepat, ~32MB)
composer install --no-dev --optimize-autoloader

# 4. Bersihkan cache composer untuk membebaskan ~25MB ruang disk
composer clear-cache

# 5. Salin dan konfigurasikan file environment produksi
cp .env.example .env
sed -i 's|APP_ENV=local|APP_ENV=production|g' .env
sed -i 's|APP_DEBUG=true|APP_DEBUG=false|g' .env
sed -i 's|APP_URL=http://localhost:8000|APP_URL=https://'"$USER"'.alwaysdata.net|g' .env

# 6. Generate application key
php artisan key:generate --force

# 7. Siapkan database SQLite dan hak akses direktori
touch database/database.sqlite
chmod 664 database/database.sqlite
chmod 775 database
chmod -R 775 storage bootstrap/cache

# 8. Jalankan migrasi skema dan seeder master data resmi Pelindo
php artisan migrate --force
php artisan db:seed --class="Database\\Seeders\\ProductionSeeder" --force

# 9. Buat symbolic link storage
php artisan storage:link

# 10. Cache konfigurasi dan route untuk performa produksi maksimal
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Template `.env` Alwaysdata
```ini
APP_NAME="SPKTAD PTP Cirebon"
APP_ENV=production
APP_KEY=base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8=
APP_DEBUG=false
APP_URL=https://<your-account>.alwaysdata.net
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id
APP_FALLBACK_LOCALE=en

LOG_CHANNEL=daily
LOG_LEVEL=error

DB_CONNECTION=sqlite
DB_DATABASE=/home/<your-account>/ptp/database/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync

TRUSTED_PROXIES=*
FORCE_HTTPS=true
```

---

## 3. Opsi 2 (Instan 1-Klik): Vercel Serverless Setup Guide

Vercel sangat cocok untuk keperluan demo cepat, presentasi stakeholder, dan pengujian publik tanpa perlu mengelola server.

### Langkah 1: Import Repositori di Vercel (1 Menit)
1. Kunjungi [https://vercel.com](https://vercel.com) dan login menggunakan akun **GitHub**.
2. Klik tombol **Add New... > Project**.
3. Pilih repositori **`gajanpar/ptp`** dari daftar repositori Anda dan klik **Import**.

### Langkah 2: Konfigurasi Build & Environment
Repositori ini telah dilengkapi dengan file konfigurasi serverless otomatis:
- `vercel.json`: Mengatur runtime `vercel-php@0.7.2`, rute static CDN untuk `/assets/*`, dan rewrite API ke `api/index.php`.
- `api/index.php`: Menginisiasi direktori writable di `/tmp`, menyalin database SQLite pre-seeded, dan menyediakan self-healing auto-migration fallback.
- `package.json`: Build step di-bypass secara otomatis karena seluruh aset CSS/JS telah pre-compiled di `public/assets/`.

Pada halaman konfigurasi Vercel:
1. **Framework Preset**: Pilih `Other`.
2. **Root Directory**: Biarkan `./` (default).
3. **Build Command**: Biarkan kosong / override dimatikan.
4. **Environment Variables**:
   Tambahkan variabel berikut:
   - `APP_KEY`: `base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8=`
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
   - `FORCE_HTTPS`: `true`
5. Klik tombol **Deploy**. Aplikasi akan live dalam ~60 detik di domain `https://<project-name>.vercel.app`.

### Karakteristik Serverless Vercel
- Database SQLite pre-seeded (294 KB) disalin secara otomatis ke `/tmp/database.sqlite` saat container Lambda aktif.
- Jika database belum ada, skrip `api/index.php` akan menjalankan migrasi dan seeder `ProductionSeeder` secara mandiri (*self-healing*).
- Disk `/tmp` bersifat ephemeral (akan reset saat cold boot/inaktivitas ~15 menit). Sangat ideal untuk demo dan review antarmuka.

---

## 4. Opsi 3 (Shared Hosting): InfinityFree Setup Guide

InfinityFree adalah layanan hosting cPanel gratis berbasis Apache PHP yang telah mendukung **PHP 8.4** secara server-wide tanpa kartu kredit.

### Langkah 1: Buat Akun InfinityFree
1. Buka [https://www.infinityfree.com](https://www.infinityfree.com) dan klik **Register Now**.
2. Masukkan email dan verifikasi akun.
3. Di Client Area, buat akun hosting baru dan pilih subdomain gratis (contoh: `spktad-cirebon.infinityfreeapp.com`).
4. Catat kredensial FTP yang diberikan (Host: `ftpupload.net`, Username: `epiz_XXXXX`, Password cPanel).

### Langkah 2: Pilihan Strategi Database
- **Opsi A (SQLite Pre-Seeded - Instan)**: Repositori sudah menyertakan `database/database.sqlite` yang telah berisi data awal. Tidak memerlukan konfigurasi database server tambahan.
- **Opsi B (MySQL Gratis - Rekomendasi cPanel)**:
  1. Buka **Control Panel (cPanel) > MySQL Databases**.
  2. Buat database baru bernama `spktad`.
  3. Buka **phpMyAdmin**, pilih database tersebut, dan klik tab **Import**.
  4. Upload file SQL dump aplikasi (`database/spktad_pelindo_cirebon.sql`) dan klik **Go**.

### Langkah 3: Konfigurasi File `.env`
Sesuaikan file `.env` untuk InfinityFree:
```ini
APP_NAME="SPKTAD PTP Cirebon"
APP_ENV=production
APP_KEY=base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8=
APP_DEBUG=false
APP_URL=https://<subdomain>.infinityfreeapp.com

APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id

LOG_CHANNEL=daily
LOG_LEVEL=error

# Jika menggunakan SQLite:
DB_CONNECTION=sqlite

# Jika menggunakan MySQL:
# DB_CONNECTION=mysql
# DB_HOST=sqlXXX.epizy.com
# DB_PORT=3306
# DB_DATABASE=epiz_XXXXX_spktad
# DB_USERNAME=epiz_XXXXX
# DB_PASSWORD=your_cpanel_password

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync

TRUSTED_PROXIES=*
FORCE_HTTPS=true
```

### Langkah 4: Upload via FTP (FileZilla)
1. Buka FileZilla, hubungkan ke `ftpupload.net` dengan akun InfinityFree Anda.
2. Masuk ke direktori **`htdocs/`**.
3. Upload seluruh file repositori ke dalam `htdocs/`.
4. Pastikan file root `.htaccess` terunggah. File ini bertindak sebagai firewall dan me-route trafik secara transparan ke folder `public/`.
5. Beri izin tulis (*File permissions* `777`) untuk folder:
   - `storage` dan subfolder-nya.
   - `bootstrap/cache`.
   - `database/database.sqlite` (`666`).

### Langkah 5: Keamanan & Akses
Root `.htaccess` aplikasi secara otomatis:
- Menolak akses langsung ke `.env*`, `*.sqlite`, `*.log`, folder `app`, `bootstrap`, `config`, `database`, `storage`, `vendor`.
- Melakukan redirect aman HTTPS dengan memeriksa header `X-Forwarded-Proto` (mencegah loop redirect di InfinityFree).
- Me-rewrite seluruh rute publik ke `public/index.php`.

*Catatan: InfinityFree menggunakan sistem anti-bot `aes.js` yang menyaring bot otomatis. Browser web (Chrome/Edge/Firefox) akan melewatinya secara instan dan memuat halaman login SPKTAD secara transparan.*

---

## 5. Akun Resmi Master Data (Pelindo Cirebon)

Aplikasi telah di-seed dengan struktur organisasi resmi PT Pelindo Multi Terminal Branch Cirebon dan 35 pegawai Tenaga Alih Daya (TAD):

| No | Username | Password Default | Nama Pengguna | Peran / Jabatan | Divisi |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **`admin`** | `password123` | Administrator SPKTAD | **Super Administrator** | Pengelola Sistem |
| 2 | **`rudy`** | `password123` | Rudy Hartono | **Kepala Divisi** | Operasi |
| 3 | **`mansur`** | `password123` | Mansur S. | **Kepala Divisi** | Perencanaan & Pengendalian |
| 4 | **`rindam`** | `password123` | Rindam Nugraha | **Kepala Divisi** | Keuangan & Umum |

---

## 6. Verifikasi Penerimaan Publik (E2E Test Suite)

Gunakan script pengujian automated end-to-end yang telah disediakan di dalam repositori untuk memvalidasi kesehatan deployment publik secara komprehensif:

```powershell
# Verifikasi Alwaysdata
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<account>.alwaysdata.net"

# Verifikasi Vercel
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<project-name>.vercel.app"

# Verifikasi InfinityFree / Custom Domain
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<domain-anda>"
```

### Cakupan 4-Tier Automated Verification:
- **Tier 1: TLS Handshake & DNS Resolution** — Memastikan koneksi HTTPS aktif dan sertifikat SSL valid.
- **Tier 2: HTTP 302 Root Redirect** — Memverifikasi akses root `/` diarahkan secara aman ke `/login`.
- **Tier 3: Login DOM & Corporate Assets** — Memvalidasi respon HTTP 200, keberadaan CSRF token, branding SPKTAD Pelindo Cirebon dari database, CSS stylesheet, dan stream visual SVG captcha.
- **Tier 4: System Health & Zero Database Errors** — Memeriksa endpoint `/up` mengembalikan status OK dan memastikan halaman bebas dari runtime error atau `SQLSTATE` database error.
