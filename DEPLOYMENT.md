# Production Deployment Guide: SPKTAD Pelindo Cirebon on Render

This guide outlines the deployment process for the **SPKTAD** (Sistem Penilaian Kinerja Tenaga Alih Daya) web application of **PT Pelindo Multi Terminal Branch Cirebon** to **Render Free Web Service** using Docker containerization.

---

## 1. Quick Start: 1-Click Deployment

Deploy directly using Render's Infrastructure-as-Code Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/gajanpar/ptp)

**1-Click Deploy URL:**  
`https://render.com/deploy?repo=https://github.com/gajanpar/ptp`

---

## 2. Architecture Overview

- **Application Framework**: Laravel 13 running on PHP 8.4 Alpine Linux.
- **Web Server**: FrankenPHP / PHP multi-worker web server with dynamic `$PORT` binding.
- **Database Engine**: In-container SQLite (`/var/www/html/database/database.sqlite`) with self-healing automatic migration and idempotent `ProductionSeeder` initialization on container boot.
- **Static Assets**: Pre-compiled custom CSS and branding assets in `public/assets/` (zero Node.js or Vite compile requirement at runtime).
- **Target Platform**: Render.com Free Web Service (512 MB RAM, 0.1 vCPU, Singapore region, automatic HTTPS `*.onrender.com`).
- **Memory Footprint**: ~60–80 MB RAM (well below the 512 MB free tier quota).

---

## 3. Manual Deployment Setup via Render Dashboard

If configuring the service manually instead of using the 1-click button:

1. **Log in to Render**:  
   Visit [https://dashboard.render.com](https://dashboard.render.com) and sign in using your GitHub account (no credit card required).

2. **Create New Web Service**:  
   Click **New +** → **Web Service** → **Build and deploy from a Git repository**.

3. **Select Repository**:  
   - Connect or paste public repository URL: `https://github.com/gajanpar/ptp.git`
   - Branch: `main` (or `prepare_real_data_transition`)

4. **Configure Service Settings**:
   - **Name**: `spktad-ptp-cirebon` (or your preferred name)
   - **Region**: `Singapore` (optimal latency for Indonesia)
   - **Root Directory**: `.vscode/ptp`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Instance Type**: `Free` ($0/month, 512 MB RAM, 0.1 vCPU)

5. **Configure Environment Variables**:  
   Under **Environment Variables**, add the variables detailed in Section 4 below.

6. **Deploy**:  
   Click **Create Web Service**. Render will automatically pull the repository, build the Docker container in the cloud, execute container healthchecks on `/up`, and assign a public HTTPS domain:  
   `https://spktad-ptp-cirebon.onrender.com`

---

## 4. Environment Variables Reference

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `"SPKTAD PTP Cirebon"` | Application title displayed in headers and pages |
| `APP_ENV` | `production` | Enforces production optimizations and security rules |
| `APP_DEBUG` | `false` | Disables debug stack traces for public visitors |
| `APP_KEY` | *(Render auto-generated or base64 32-byte key)* | Application encryption key |
| `APP_TIMEZONE` | `Asia/Jakarta` | Enforces Western Indonesia Time (WIB) for evaluations |
| `APP_LOCALE` | `id` | Indonesian locale formatting for dates and labels |
| `DB_CONNECTION` | `sqlite` | Database driver (`sqlite` or `pgsql`) |
| `DB_DATABASE` | `/var/www/html/database/database.sqlite` | Absolute path to container SQLite database |
| `SESSION_DRIVER` | `file` | Stores active user sessions in file storage |
| `CACHE_STORE` | `file` | Application cache store |
| `QUEUE_CONNECTION` | `sync` | Synchronous queue processing (zero external workers) |
| `LOG_CHANNEL` | `stderr` | Aggregates application logs directly to Render log viewer |
| `TRUSTED_PROXIES` | `*` | Trusts Render's edge reverse proxy for HTTPS headers |
| `FORCE_HTTPS` | `true` | Enforces HTTPS scheme across all redirects, URLs, and asset helpers |

---

## 5. Free Tier Runtime Characteristics & Self-Healing Database

### 5.1 Cold-Start Behavior
- **Inactivity Sleep**: Render free tier instances spin down after 15 minutes of zero incoming traffic.
- **Wake-up Duration**: The first HTTP request after idle initiates container startup, which takes approximately **30 to 50 seconds**. Subsequent requests respond in **<100 ms**.
- **Probes & Timeouts**: Automated health checks should allow a 60-second connection timeout for cold starts.

### 5.2 Ephemeral Storage & Master Data Self-Healing
- Render free tier instances use ephemeral filesystems that reset upon container restart.
- **Automatic Self-Healing**: On every container boot, `docker-entrypoint.sh`:
  1. Creates `/var/www/html/database/database.sqlite` if absent with `664` permissions (`775` on parent dir).
  2. Runs `php artisan migrate --force --no-interaction`.
  3. Runs `php artisan db:seed --class=ProductionSeeder --force --no-interaction` using idempotent `updateOrCreate`.
  4. Restores all 3 divisions, 4 administrative users, 12 AKHLAK categories, 17 rubrics, and 35 TAD employee records.
- **Permanent Persistence Option (PostgreSQL)**: If multi-day evaluation records must persist indefinitely across instance sleeps, connect a free PostgreSQL database (e.g. Neon.tech, Supabase, or Render PostgreSQL free tier) by configuring `DB_CONNECTION=pgsql` and `DB_URL` in the Render environment variables.

---

## 6. Public Healthcheck & Acceptance Verification

Once deployed, verify public accessibility and application integrity:

### 6.1 Automated Verification Script (PowerShell)
Execute the verification test suite from the repository:
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://spktad-ptp-cirebon.onrender.com"
```

### 6.2 Manual CLI Verification Checks

1. **Root Redirect (GET / → 302 to /login)**:
   ```bash
   curl -I https://spktad-ptp-cirebon.onrender.com/
   # Expected: HTTP/2 302 Found, Location: /login
   ```

2. **Primary Login Interface & Database Query (GET /login)**:
   ```bash
   curl -sL https://spktad-ptp-cirebon.onrender.com/login | grep -E "(SPKTAD|Branch Cirebon|_token)"
   # Expected: Matches SPKTAD branding, dynamic branch settings from DB, and CSRF token
   ```

3. **Zero Runtime / Database Errors**:
   ```bash
   curl -sL https://spktad-ptp-cirebon.onrender.com/login | grep -Ei "(500 Internal|SQLSTATE|no such table|Fatal error)"
   # Expected: Zero matches (clean exit code 1)
   ```

4. **Framework Internal Healthcheck (GET /up)**:
   ```bash
   curl -s -w "\nHTTP_STATUS: %{http_code}\n" https://spktad-ptp-cirebon.onrender.com/up
   # Expected: HTTP_STATUS: 200
   ```

5. **Dynamic Captcha SVG Stream (GET /captcha-image)**:
   ```bash
   curl -sI https://spktad-ptp-cirebon.onrender.com/captcha-image | grep "content-type"
   # Expected: content-type: image/svg+xml
   ```

6. **Pre-compiled CSS Static Asset (GET /assets/css/style.css)**:
   ```bash
   curl -sI https://spktad-ptp-cirebon.onrender.com/assets/css/style.css | grep "content-type"
   # Expected: content-type: text/css
   ```

---

## 7. Local Docker Build & Execution

To test the container packaging locally before pushing:

```bash
cd .vscode/ptp

# Build container image
docker build -t spktad-ptp .

# Run container on port 10000
docker run -p 10000:10000 -e APP_KEY=base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8= spktad-ptp

# Access locally
curl -I http://localhost:10000/
curl -sL http://localhost:10000/login
curl -s http://localhost:10000/up
```
