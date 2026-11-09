# TEST_READY — Free Hosting Deployment E2E Test Suite Readiness

**Project**: SPKTAD Free Hosting Deployment & Public Staging Verification  
**Application**: SPKTAD PT Pelindo Multi Terminal Branch Cirebon (Laravel 13 on PHP 8.4, SQLite)  
**Track**: Opaque-Box E2E Public Verification (Milestone E2E Complete)  
**Date**: 2026-11-09  
**Status**: **READY FOR CLOUD DEPLOYMENT & DOWNSTREAM VERIFICATION**  

---

## 1. Readiness Certification

The End-to-End (E2E) Opaque-Box Public Deployment Verification Test Suite has been fully designed, implemented, and verified against both positive (live active server) and negative (fault-injection/offline) baselines.

- **Primary Verification Harness**: `tests/verify_public_deploy.ps1`
- **Architecture & Infrastructure Specification**: `TEST_INFRA.md`
- **Total Test Cases**: 16 automated tests across 4 progressive tiers
- **Platform Compatibility**: Windows PowerShell 5.1+, PowerShell 7+, cross-platform .NET `System.Net.Http`
- **Baseline Verification Result**: 16/16 Passed (100% Success) on active local baseline; 13/16 Failed (Exit Code 1) on negative fault-injection baseline

The test suite is officially ready to gate and verify downstream milestones **M2** (Git Synchronization & Cloud Deployment Execution) and **M3** (Public URL Acceptance, Adversarial Hardening & Forensic Audit).

---

## 2. Test Suite Overview & Tier Breakdown

```
======================================================================
  TIER BREAKDOWN (16 TOTAL TESTS / 4 PROGRESSIVE TIERS)
======================================================================
  [Tier 1] Feature Coverage           : 6 Tests (TLS, 302, 200, /up, Captcha, CSS)
  [Tier 2] Boundary & Corner Cases    : 4 Tests (Cold-start latency, Socket, 404, Security headers)
  [Tier 3] Cross-Feature Interactions : 3 Tests (CSRF, SQLite DB Branch query, Session cookie)
  [Tier 4] Real-World Acceptance      : 3 Tests (Full UI DOM, Zero 500s, Zero SQLSTATE/Runtime errors)
======================================================================
```

### Coverage Detail Matrix:
1. **Tier 1: Feature Coverage (Core Endpoints & Protocols)**
   - `T1.1`: TLS Handshake & Protocol Accessibility (TLS 1.2 / TLS 1.3 negotiation).
   - `T1.2`: Root Route HTTP 302 Redirect (`GET /` -> HTTP 302/301 with `Location: /login`).
   - `T1.3`: Primary Login Interface HTTP 200 (`GET /login` -> HTTP 200 OK, `text/html`, >= 1000 bytes).
   - `T1.4`: Native Framework Healthcheck HTTP 200 (`GET /up` -> HTTP 200 OK).
   - `T1.5`: SVG Captcha Stream Dynamic Generator (`GET /captcha-image` -> HTTP 200 OK, `image/svg+xml`, `<svg>...</svg>`).
   - `T1.6`: Core Stylesheet Static Asset Delivery (`GET /assets/css/style.css` -> HTTP 200 OK, `text/css`, >= 5000 bytes).

2. **Tier 2: Boundary & Corner Cases (Resilience & Edge Conditions)**
   - `T2.1`: Cold-Start Latency & Response Timing Assertion (Latency within configured threshold window).
   - `T2.2`: Socket Timeout Resilience & Connection Re-use (Connection reuse across consecutive calls without socket exhaustion).
   - `T2.3`: Invalid Route Isolation (`GET /probe-404-...` -> HTTP 404 Not Found without leaking internal exceptions).
   - `T2.4`: Defensive Security Headers & Framing Protection (`X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy`).

3. **Tier 3: Cross-Feature Interactions (Data Pipeline & State)**
   - `T3.1`: CSRF Protection Token Embedded in Login Form (`<input type="hidden" name="_token"` with length >= 20 chars).
   - `T3.2`: SQLite Database Query & Branch Master Setting Rendered in DOM (`Branch Cirebon` / `PT Pelabuhan Indonesia` proves SQLite migrations, seeders, and `Setting::getAllKeyValue()` in `AppServiceProvider` executed).
   - `T3.3`: Session Cookie Issuance with HttpOnly Protection (`spktad-ptp-cirebon-session` cookie issued with `HttpOnly = $true`).

4. **Tier 4: Real-World Acceptance (Full Interface DOM & Zero Defects)**
   - `T4.1`: Primary Interface DOM Completeness (Page title `<title>Login - SPKTAD...`, username, password, captcha inputs, and submit button).
   - `T4.2`: Zero 500-Series Internal Server Errors Across Endpoints (0 occurrences of HTTP 500, 502, 503, 504 across all probed URLs).
   - `T4.3`: Zero SQLSTATE, Missing Tables, or Runtime Exceptions (0 occurrences of `SQLSTATE`, `no such table`, `PDOException`, `Whoops!`, `Fatal error`).

---

## 3. How to Execute the Test Suite

### Command 1: Verify Public Staging URL (Render.com Free Web Service)
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<app-name>.onrender.com"
```
*Note: Includes automatic container wake-up probe with retry backoff for sleeping free-tier instances.*

### Command 2: Verify with Verbose Diagnostic Output
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<app-name>.onrender.com" -DetailedOutput
```

### Command 3: Verify Local Environment (Skipping Cold-Start Warmup)
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "http://127.0.0.1:8000" -SkipWarmup
```

### Command 4: Custom Extended Timeout for High Latency
```powershell
powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "https://<app-name>.onrender.com" -TimeoutSeconds 90 -MaxWarmupRetries 5
```

---

## 4. Exit Code Specification

| Exit Code | Meaning | Downstream Action |
| :---: | :--- | :--- |
| **`0`** | **100% Pass (All 16 tests passed cleanly)** | Acceptance criteria fully satisfied; service approved for staging use. |
| **`1`** | **Failure (One or more tests failed)** | Remediation required; check diagnostic audit report output. |

---

## 5. Acceptance Criteria Mapping

| Original Acceptance Criteria | Verified By Tests | Verification Mechanism |
| :--- | :--- | :--- |
| *"The web application is successfully hosted and publicly accessible via HTTP/HTTPS."* | `T1.1`, `T1.2`, `T1.3`, `T1.4`, `T2.1`, `T2.2` | Validates public DNS resolution, TLS handshake, HTTP 302 root redirect to `/login`, HTTP 200 `/login`, HTTP 200 `/up`, and socket resilience within latency window. |
| *"The public URL returns HTTP status 200 and loads the primary application interface without runtime or database errors."* | `T1.3`, `T1.5`, `T1.6`, `T3.1`, `T3.2`, `T3.3`, `T4.1`, `T4.2`, `T4.3` | Validates HTTP 200 status code, complete login DOM (title, credentials inputs, captcha, submit), SVG captcha stream, CSS stylesheet, CSRF token, master branch settings from SQLite, zero 500 errors, and zero SQLSTATE / `no such table` runtime exceptions. |

---

## 6. Instructions for Downstream Agents

### For Milestone M2 (Git Synchronization & Cloud Deployment Execution):
1. Complete Git commit and push to remote branch `prepare_real_data_transition`.
2. Provision Render Web Service using the Docker blueprint (`Dockerfile`, `docker-entrypoint.sh`, `render.yaml`).
3. Obtain the public deployment URL (e.g. `https://spktad-ptp-cirebon.onrender.com`).
4. Execute `verify_public_deploy.ps1` against the live URL.

### For Milestone M3 (Public Acceptance Reviewer & Challenger):
1. Run `powershell -ExecutionPolicy Bypass -File tests/verify_public_deploy.ps1 -TargetUrl "<live-public-url>" -DetailedOutput`.
2. Confirm the exit code is `0` and all 16 tests display `[PASS]`.
3. Verify that `T3.2` confirms SQLite execution and `T4.2`/`T4.3` confirm zero server/database errors.
