# Production Deployment Guide: SPKTAD Pelindo Cirebon

This guide outlines the production deployment options for **SPKTAD** (Sistem Penilaian Kinerja Tenaga Alih Daya) of **PT Pelindo Multi Terminal Branch Cirebon**.

---

## Deployment Platform Matrix

| Platform | Cost | Credit Card Required? | Free Tier Specs | Compatibility | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hugging Face Spaces (Docker SDK)** | **$0 / month** | **Strictly ZERO (No Card Needed)** | **2 vCPU · 16 GB RAM · 50 GB Disk** | Native Docker, SQLite, FrankenPHP | **#1 Recommended Primary** |
| **Render Web Service** | $0 / month | **Yes (Credit/Debit Card Enforced)** | 0.1 vCPU · 512 MB RAM · Ephemeral | Docker, FrankenPHP, SQLite | Secondary Alternative |

---

## 1. Primary Option: Hugging Face Spaces (100% Pure Free, Zero Credit Card)

Hugging Face Spaces provides a fully isolated Docker container environment on the **free CPU tier (2 vCPU / 16 GB RAM)** with **zero credit card or payment information required**.

### 1.1 Quick 2-Minute Setup

1. **Create Free Hugging Face Account**:
   - Register at [https://huggingface.co/join](https://huggingface.co/join).
   - Only email verification is required — **no credit card, no debit card, no billing info**.

2. **Create New Space**:
   - Navigate to [https://huggingface.co/new-space](https://huggingface.co/new-space).
   - **Space Name**: e.g., `spktad-pelindo` (or preferred name).
   - **License**: `mit` or `apache-2.0`.
   - **Space SDK**: Select **Docker** (Blank template).
   - **Space Hardware**: Select **CPU basic · 2 vCPU · 16 GB RAM (Free)**.
   - **Visibility**: `Public` (or `Private`).
   - Click **Create Space**.

3. **Deploy from GitHub Repository**:
   Clone your Space or add it as a Git remote, then push the code:
   ```bash
   # Add your Hugging Face Space as a remote
   git remote add hf https://huggingface.co/spaces/<YOUR_HF_USERNAME>/spktad-pelindo

   # Push main branch to your Space
   git push hf main
   ```
   *(When prompted for password, use your Hugging Face Access Token generated from Settings → Access Tokens).*

4. **Live Access & Verification**:
   - Hugging Face automatically detects the root `Dockerfile` and `README.md` frontmatter (`sdk: docker`, `app_port: 7860`).
   - Build completes in ~2 minutes.
   - Your application will be live at:  
     `https://<YOUR_HF_USERNAME>-spktad-pelindo.hf.space`  
     or directly via the Space view:  
     `https://huggingface.co/spaces/<YOUR_HF_USERNAME>/spktad-pelindo`

### 1.2 Hugging Face Architecture & Non-Root Execution

- **Non-Root User**: Hugging Face Spaces runs containers as `UID 1000`. The root and subfolder Dockerfiles pre-configure ownership (`1000:1000`) and `777` permissions across:
  - `/config/caddy` and `/data/caddy` (FrankenPHP runtime state)
  - `/var/www/html/storage` and `/var/www/html/bootstrap/cache`
  - `/var/www/html/database` and SQLite file
- **Port Routing**: Internal container listens on `PORT=7860`, matching `app_port: 7860` in `README.md`.
- **Database Self-Healing**: On boot, `docker-entrypoint.sh` initializes `database.sqlite`, applies migrations, and seeds official Pelindo master data via `ProductionSeeder`.

---

## 2. Environment Variables Reference

Configure environment variables in Hugging Face (Space Settings → Variables and secrets) or Render (Environment Variables):

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `"SPKTAD PTP Cirebon"` | Application title displayed in headers and pages |
| `APP_ENV` | `production` | Enforces production optimizations and security rules |
| `APP_DEBUG` | `false` | Disables debug stack traces for public visitors |
| `APP_KEY` | *(Generate via `php artisan key:generate --show`)* | 32-character AES-256 base64 encryption key |
| `APP_TIMEZONE` | `Asia/Jakarta` | Western Indonesia Time (WIB) for evaluations |
| `APP_LOCALE` | `id` | Indonesian locale formatting for dates and labels |
| `PORT` | `7860` | Web server listening port (7860 for HF Spaces, 10000 for Render) |
| `DB_CONNECTION` | `sqlite` | Database engine driver |
| `DB_DATABASE` | `/var/www/html/database/database.sqlite` | Path to container SQLite database |
| `SESSION_DRIVER` | `file` | Session storage engine |
| `CACHE_STORE` | `file` | Application cache storage engine |
| `QUEUE_CONNECTION` | `sync` | Synchronous queue processing |
| `LOG_CHANNEL` | `stderr` | Aggregates application logs to container runtime logs |
| `TRUSTED_PROXIES` | `*` | Trusts reverse proxy for HTTPS termination |
| `FORCE_HTTPS` | `true` | Enforces HTTPS scheme across redirects and asset links |

---

## 3. Public Healthcheck & Acceptance Verification

Once deployed, verify public accessibility and application integrity:

### 3.1 Automated Verification Script (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<YOUR_APP_URL>"
```

### 3.2 Manual CLI Verification Checks

1. **Root Redirect (GET / → 302 to /login)**:
   ```bash
   curl -I https://<YOUR_APP_URL>/
   # Expected: HTTP/2 302 Found, Location: /login
   ```

2. **Primary Login Interface & Database Query (GET /login)**:
   ```bash
   curl -sL https://<YOUR_APP_URL>/login | grep -E "(SPKTAD|Branch Cirebon|_token)"
   # Expected: Matches SPKTAD branding, dynamic branch settings from DB, and CSRF token
   ```

3. **Zero Runtime / Database Errors**:
   ```bash
   curl -sL https://<YOUR_APP_URL>/login | grep -Ei "(500 Internal|SQLSTATE|no such table|Fatal error)"
   # Expected: Zero matches (clean exit code 1)
   ```

4. **Framework Internal Healthcheck (GET /up)**:
   ```bash
   curl -s -w "\nHTTP_STATUS: %{http_code}\n" https://<YOUR_APP_URL>/up
   # Expected: HTTP_STATUS: 200
   ```

5. **Dynamic Captcha SVG Stream (GET /captcha-image)**:
   ```bash
   curl -sI https://<YOUR_APP_URL>/captcha-image | grep "content-type"
   # Expected: content-type: image/svg+xml
   ```

6. **Static CSS Asset Delivery (GET /assets/css/style.css)**:
   ```bash
   curl -sI https://<YOUR_APP_URL>/assets/css/style.css | grep "content-type"
   # Expected: content-type: text/css
   ```

---

## 4. Default Seeded Credentials

When deployed, the database is pre-seeded with official master data:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `password` | Full system administration & configuration |
| **Branch Manager** | `dwi.priyono` | `password` | Pelindo Branch Cirebon oversight & approval |
| **Ops Supervisor** | `budi.santoso` | `password` | Operasional division evaluation scoring |
| **Teknik Supervisor** | `eko.prasetyo` | `password` | Teknik division evaluation scoring |

---

## 5. Secondary Alternative: Render Free Web Service

> **Notice**: Render now requires adding a valid credit card or debit card upon account creation or service spin-up. If you already have a verified Render account, you can deploy using the instructions below.

### 5.1 1-Click Deployment Blueprint
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/gajanpar/ptp)

**1-Click Deploy URL:**  
`https://render.com/deploy?repo=https://github.com/gajanpar/ptp`

### 5.2 Manual Render Configuration
- **Repository**: `https://github.com/gajanpar/ptp.git`
- **Branch**: `main`
- **Runtime**: `Docker`
- **Instance Type**: `Free` (0.1 vCPU, 512 MB RAM)
- **Environment Variable**: `PORT=10000` (Render defaults to 10000)

---

## 6. Local Docker Testing

To test the container packaging locally before pushing:

### Root Packaging Test (Hugging Face Spaces layout)
```bash
# Build container from repository root
docker build -t spktad-ptp-root -f Dockerfile .

# Run container on port 7860
docker run -p 7860:7860 -e APP_KEY=base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8= spktad-ptp-root

# Test local healthcheck
curl -I http://localhost:7860/
curl -s http://localhost:7860/up
```

### Subfolder Packaging Test
```bash
cd .vscode/ptp
docker build -t spktad-ptp-subfolder -f Dockerfile .
docker run -p 7860:7860 -e APP_KEY=base64:b09RorjNGclUrkvfbCC7cOEzN1n7VWP9KUZf/sLMcz8= spktad-ptp-subfolder
```
