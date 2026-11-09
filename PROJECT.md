# Project: SPKTAD Free Hosting Deployment & Public Staging Verification

## Architecture
- **Application**: SPKTAD PT Pelindo Multi Terminal Branch Cirebon (`.vscode/ptp`, Laravel 13 on PHP 8.4).
- **Runtime Environment**:
  - Web Server: Alpine Linux with PHP 8.4 CLI/FPM & SQLite (`pdo_sqlite`, `bcmath`, `intl`, `zip`, `opcache`).
  - Containerization: Single-stage production container with `docker-entrypoint.sh` for auto-initialization.
  - Storage: In-container SQLite at `/var/www/html/database/database.sqlite` (or `/app/database/database.sqlite`).
  - Assets: Self-contained CSS & images in `public/assets/` (no Node.js/Vite needed at runtime).
  - Healthcheck: Native Laravel `/up` endpoint.
- **Target Hosting Platform**:
  - **Render.com Free Web Service** (Docker runtime, $0/month, zero credit card requirement, 750 free hrs/mo, automatic HTTPS `*.onrender.com`).
  - Deployment mechanism: GitHub integration from repository `https://github.com/gajanpar/ptp.git` (branch `prepare_real_data_transition` / `main`), with monorepo root `rootDir: .vscode/ptp` or root `render.yaml` blueprint.
- **Public Verification & Forensics Architecture**:
  - Multi-tier automated verification suite: TLS handshake, HTTP 302 root redirect, HTTP 200 `/login`, DOM branding/CSRF checks, `system_settings` database query checks, zero 500/SQLSTATE error checks, SVG captcha streaming, and `/up` healthcheck.
  - Independent Reviewer validation, Challenger adversarial verification, and Forensic Integrity Audit.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Production Container Packaging (`Dockerfile`) | Alpine-based PHP 8.4 container with required extensions (`pdo_sqlite`, `bcmath`, `intl`, `zip`, `opcache`) and optimized production autoloader. | M1 | R1 (Survey) |
| 2 | Self-Healing Startup Entrypoint (`docker-entrypoint.sh`) | Shell script to create SQLite file, set 775/664 permissions, execute `php artisan migrate --force`, seed official Pelindo master data via `ProductionSeeder`, cache configs/routes, and bind to dynamic `$PORT`. | M1 | R1 (Survey) |
| 3 | Docker Build Optimization (`.dockerignore`) | Exclude tests, development docs, `.git`, `node_modules`, and local SQLite files from container build context. | M1 | R1 (Survey) |
| 4 | Infrastructure-as-Code Blueprint (`render.yaml`) | Declarative Render Web Service specification defining free tier, Singapore region, Docker runtime, and production environment variables. | M1 | R1 (Survey) |
| 5 | Deployment Guide & Environment Specification (`DEPLOYMENT.md`) | Comprehensive documentation of deployment process, environment variables, 1-click deploy URL, and troubleshooting instructions. | M1 | R1 (Survey) |
| 6 | E2E Public Verification Test Harness | Standalone automated test script (`verify_public_deploy.ps1`) executing multi-tier HTTP, DOM, database query, captcha, and error checks against live URL. | E2E | R1/R2 (Acceptance) |
| 7 | Git Repository Commit & Push | Synchronize deployment configuration files to git branch `prepare_real_data_transition` and push to remote GitHub repository `origin`. | M2 | R2 |
| 8 | Cloud Deployment & Service Provisioning | Deploy and activate the Render Web Service with configured environment settings, ensuring successful remote build and healthy container boot. | M2 | R2 |
| 9 | Public URL Acceptance & Health Verification | Verify live URL returns HTTP 200, loads login interface without runtime or database errors, and passes all verification tiers. | M3 | R2 (Acceptance) |
| 10 | Adversarial & Forensic Integrity Audit | Multi-reviewer, Challenger, and Forensic Auditor verification confirming authentic hosting, zero mocks/stubs, and production stability. | M3 | Integrity |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Deployment Configuration & Infrastructure Setup | Implement `Dockerfile`, `docker-entrypoint.sh`, `.dockerignore`, `render.yaml`, and `DEPLOYMENT.md`. | none | DONE |
| E2E | Public Verification Test Suite | Implement automated verification harness (`verify_public_deploy.ps1`) for comprehensive live URL testing. | none | DONE |
| M2 | Git Synchronization & Cloud Deployment Execution | Commit, push to GitHub, provision Render Web Service, and configure environment variables. | M1 | DONE |
| M3 | Live Verification, Adversarial Hardening & Forensic Audit | Execute live E2E verification, review, challenge, and forensic integrity audit. | M2, E2E | IN_PROGRESS |

## Interface Contracts
### Docker Container ↔ Render Cloud Runtime
- Dynamic Port: The web server MUST bind to `0.0.0.0:${PORT:-10000}`.
- Entrypoint: Must execute migrations and `ProductionSeeder` idempotently before accepting HTTP traffic.
- Healthcheck: `GET /up` returns HTTP 200 OK.
- Root Redirect: `GET /` returns HTTP 302 redirecting to `GET /login`.
- Login Interface: `GET /login` returns HTTP 200 OK with CSRF token, SPKTAD branding, Pelindo branch settings from database, and SVG captcha stream.

### Git Repository ↔ Render Build Automation
- Remote URL: `https://github.com/gajanpar/ptp.git`
- Branch: `prepare_real_data_transition` (and/or `main`)
- Monorepo Context: Root `render.yaml` or `rootDir: .vscode/ptp`.

## Code Layout
- Root Directory: `C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition`
- Application Directory: `.vscode/ptp`
- Deployment Packaging:
  - `.vscode/ptp/Dockerfile`
  - `.vscode/ptp/docker-entrypoint.sh`
  - `.vscode/ptp/.dockerignore`
  - `render.yaml` (root and `.vscode/ptp/render.yaml`)
  - `DEPLOYMENT.md` (root and `.vscode/ptp/DEPLOYMENT.md`)
- Verification Scripts:
  - `tests/verify_public_deploy.ps1`
