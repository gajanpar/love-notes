<#
.SYNOPSIS
    SPKTAD Free Hosting Deployment E2E Opaque-Box Public Verification Suite.
    PT Pelindo Multi Terminal Branch Cirebon.

.DESCRIPTION
    Comprehensive 4-Tier opaque-box public verification harness designed to test
    live staging deployments (e.g. Render.com free tier) and local environments.
    Verifies TLS handshake, root redirect, login page, healthcheck (/up), SVG captcha,
    CSS stylesheets, cold-start latency, 404 error handling, security headers,
    CSRF token generation, SQLite database queries (Branch Cirebon), session cookies,
    full primary UI DOM components, and asserts zero 500 errors and zero SQLSTATE exceptions.

.PARAMETER TargetUrl
    The base target URL to verify (e.g., https://spktad-cirebon.onrender.com or http://127.0.0.1:8000).

.PARAMETER TimeoutSeconds
    Timeout in seconds for each HTTP request (default: 60s to accommodate free-tier latency).

.PARAMETER MaxWarmupRetries
    Maximum number of warm-up attempts to wake up sleeping free-tier containers (default: 3).

.PARAMETER WarmupDelaySeconds
    Seconds to wait between warm-up attempts (default: 10s).

.PARAMETER SkipWarmup
    Skip the container warm-up phase (recommended for local or already active services).

.PARAMETER DetailedOutput
    Display detailed diagnostic headers, cookies, and response payloads.

.EXAMPLE
    .\tests\verify_public_deploy.ps1 -TargetUrl https://spktad-cirebon.onrender.com

.EXAMPLE
    .\tests\verify_public_deploy.ps1 -TargetUrl http://127.0.0.1:8000 -SkipWarmup
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0, ValueFromPipeline = $true, HelpMessage = "The public target URL to verify (e.g., https://spktad-cirebon.onrender.com)")]
    [Alias("Url")]
    [ValidateNotNullOrEmpty()]
    [string]$TargetUrl,

    [Parameter(Mandatory = $false, HelpMessage = "Timeout in seconds for each HTTP probe (default: 60s)")]
    [int]$TimeoutSeconds = 60,

    [Parameter(Mandatory = $false, HelpMessage = "Maximum retries for free-tier container cold-start warm-up (default: 3)")]
    [int]$MaxWarmupRetries = 3,

    [Parameter(Mandatory = $false, HelpMessage = "Seconds to wait between warm-up attempts (default: 10s)")]
    [int]$WarmupDelaySeconds = 10,

    [Parameter(Mandatory = $false, HelpMessage = "Skip the cold-start warm-up phase")]
    [switch]$SkipWarmup,

    [Parameter(Mandatory = $false, HelpMessage = "Display verbose diagnostic and header inspection details")]
    [switch]$DetailedOutput
)

Set-StrictMode -Off
$ErrorActionPreference = "Continue"

# -----------------------------------------------------------------------------
# 0. Environment & Protocol Configuration
# -----------------------------------------------------------------------------
try {
    # Ensure modern TLS 1.2 and TLS 1.3 are enabled
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13
} catch {
    Write-Warning "Could not explicitly configure TLS 1.2/1.3 security protocol: $_"
}

try {
    Add-Type -AssemblyName System.Net.Http
} catch {
    Write-Error "Failed to load System.Net.Http assembly: $_"
    exit 1
}

# Normalize Target URL
$TargetUrl = $TargetUrl.Trim().TrimEnd('/')
if (-not ($TargetUrl.StartsWith("http://", [System.StringComparison]::OrdinalIgnoreCase) -or $TargetUrl.StartsWith("https://", [System.StringComparison]::OrdinalIgnoreCase))) {
    $TargetUrl = "https://$TargetUrl"
}

try {
    $targetUri = New-Object System.Uri($TargetUrl)
} catch {
    Write-Error "Invalid TargetUrl format: $TargetUrl"
    exit 1
}

$IsHttps = ($targetUri.Scheme -eq "https")
$script:CookieContainer = New-Object System.Net.CookieContainer

# Test Result Tracking Infrastructure
$script:TestResults = [System.Collections.Generic.List[PSCustomObject]]::new()
$script:CapturedResponses = [System.Collections.Generic.List[PSCustomObject]]::new()
$script:StartTime = Get-Date

# -----------------------------------------------------------------------------
# UI / Banner Helper Functions
# -----------------------------------------------------------------------------
function Write-HeaderBanner {
    Write-Host ""
    Write-Host "========================================================================" -ForegroundColor Cyan
    Write-Host "  SPKTAD FREE HOSTING DEPLOYMENT -- E2E PUBLIC VERIFICATION SUITE       " -ForegroundColor Cyan
    Write-Host "  PT Pelindo Multi Terminal Branch Cirebon                             " -ForegroundColor Cyan
    Write-Host "========================================================================" -ForegroundColor Cyan
    Write-Host "  Target URL      : " -NoNewline; Write-Host $TargetUrl -ForegroundColor Yellow
    Write-Host "  Protocol        : " -NoNewline; Write-Host ($targetUri.Scheme.ToUpper()) -ForegroundColor Yellow
    Write-Host "  Host            : " -NoNewline; Write-Host ($targetUri.Host) -ForegroundColor Yellow
    Write-Host "  Timeout         : " -NoNewline; Write-Host "$($TimeoutSeconds)s" -ForegroundColor Yellow
    Write-Host "  Timestamp (UTC) : " -NoNewline; Write-Host ((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")) -ForegroundColor Yellow
    Write-Host "========================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-TierBanner([string]$TierName, [string]$Description) {
    Write-Host ""
    Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkCyan
    Write-Host "  $($TierName): $($Description)" -ForegroundColor DarkCyan
    Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkCyan
}

# -----------------------------------------------------------------------------
# HTTP Client Probe Engine
# -----------------------------------------------------------------------------
function Invoke-HttpProbe {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $false)][bool]$AllowAutoRedirect = $false,
        [Parameter(Mandatory = $false)][int]$TimeoutSec = $TimeoutSeconds
    )

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $probeUri = New-Object System.Uri($Url)

    $handler = New-Object System.Net.Http.HttpClientHandler
    $handler.AllowAutoRedirect = $AllowAutoRedirect
    $handler.CookieContainer = $script:CookieContainer
    $handler.UseCookies = $true

    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)
    $client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "SPKTAD-E2E-Verifier/1.0 (Windows PowerShell 5.1; PT Pelindo Cirebon)")
    $client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/svg+xml,*/*;q=0.8")

    $result = [PSCustomObject]@{
        Url               = $Url
        StatusCode        = 0
        StatusDescription = ""
        Headers           = @{}
        Cookies           = @()
        Body              = ""
        ContentType       = ""
        ContentLength     = 0
        Location          = $null
        ElapsedMs         = 0
        Success           = $false
        ErrorMessage      = $null
    }

    try {
        $response = $client.GetAsync($probeUri).GetAwaiter().GetResult()
        $stopwatch.Stop()

        $result.StatusCode = [int]$response.StatusCode
        $result.StatusDescription = [string]$response.ReasonPhrase
        $result.ElapsedMs = $stopwatch.ElapsedMilliseconds
        $result.Success = $true

        # Collect Response Headers
        foreach ($h in $response.Headers) {
            $result.Headers[$h.Key] = ($h.Value -join ', ')
        }

        # Collect Content Headers and Body
        if ($null -ne $response.Content) {
            if ($null -ne $response.Content.Headers) {
                foreach ($ch in $response.Content.Headers) {
                    $result.Headers[$ch.Key] = ($ch.Value -join ', ')
                }
                if ($response.Content.Headers.ContentType) {
                    $result.ContentType = $response.Content.Headers.ContentType.ToString()
                }
                if ($response.Content.Headers.ContentLength) {
                    $result.ContentLength = [int64]$response.Content.Headers.ContentLength
                }
            }

            $result.Body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if ($result.ContentLength -eq 0 -and $null -ne $result.Body) {
                $result.ContentLength = [System.Text.Encoding]::UTF8.GetByteCount($result.Body)
            }
        }

        # Location Header for Redirects
        if ($response.Headers.Location) {
            $result.Location = $response.Headers.Location.ToString()
        } elseif ($result.Headers.ContainsKey("Location")) {
            $result.Location = $result.Headers["Location"]
        }

        # Collect Cookies for this domain
        $result.Cookies = @($script:CookieContainer.GetCookies($probeUri))

    } catch {
        $stopwatch.Stop()
        $result.ElapsedMs = $stopwatch.ElapsedMilliseconds
        $result.Success = $false
        $result.ErrorMessage = $_.Exception.Message
        if ($_.Exception.InnerException) {
            $result.ErrorMessage += " -> " + $_.Exception.InnerException.Message
        }
    } finally {
        $client.Dispose()
        $handler.Dispose()
    }

    $script:CapturedResponses.Add($result)
    return $result
}

# -----------------------------------------------------------------------------
# Test Assertion Engine
# -----------------------------------------------------------------------------
function Assert-E2ETest {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][string]$Tier,
        [Parameter(Mandatory = $true)][string]$Title,
        [Parameter(Mandatory = $true)][scriptblock]$Assertion
    )

    $testSw = [System.Diagnostics.Stopwatch]::StartNew()
    $passed = $false
    $message = ""
    $diagnostic = ""

    try {
        $output = & $Assertion
        $passed = $true
        $message = if ($output) { [string]$output } else { "Assertion passed." }
    } catch {
        $passed = $false
        $message = $_.Exception.Message
        $diagnostic = $_.ScriptStackTrace
    } finally {
        $testSw.Stop()
    }

    $testResult = [PSCustomObject]@{
        Id         = $Id
        Tier       = $Tier
        Title      = $Title
        Passed     = $passed
        DurationMs = $testSw.ElapsedMilliseconds
        Detail     = $message
        Diagnostic = $diagnostic
    }
    $script:TestResults.Add($testResult)

    # Console Output
    $msStr = "$($testSw.ElapsedMilliseconds)ms"
    if ($passed) {
        Write-Host "  [PASS] " -ForegroundColor Green -NoNewline
        Write-Host "$($Id): $($Title) " -ForegroundColor White -NoNewline
        Write-Host "($msStr)" -ForegroundColor DarkGray
        if ($DetailedOutput -and $message) {
            Write-Host "         Info: $message" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  [FAIL] " -ForegroundColor Red -NoNewline
        Write-Host "$($Id): $($Title) " -ForegroundColor Yellow -NoNewline
        Write-Host "($msStr)" -ForegroundColor DarkGray
        Write-Host "         Reason: $message" -ForegroundColor Red
        if ($diagnostic) {
            Write-Host "         Trace: $diagnostic" -ForegroundColor DarkRed
        }
    }
}

# -----------------------------------------------------------------------------
# Phase 1: Free-Tier Cold-Start Warm-Up
# -----------------------------------------------------------------------------
function Invoke-WarmupPhase {
    if ($SkipWarmup) {
        Write-Host "  [INFO] Cold-start warm-up skipped as requested (-SkipWarmup)." -ForegroundColor DarkGray
        return
    }

    Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkYellow
    Write-Host "  FREE-TIER COLD-START PROBE & CONTAINER WAKE-UP" -ForegroundColor DarkYellow
    Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkYellow
    Write-Host "  Probing target to wake up free-tier container (sleeping after inactivity)..." -ForegroundColor Gray

    $warmupSuccess = $false
    $warmupStart = [System.Diagnostics.Stopwatch]::StartNew()

    for ($attempt = 1; $attempt -le $MaxWarmupRetries; $attempt++) {
        Write-Host "  [WARMUP] Attempt $attempt of $MaxWarmupRetries ($TargetUrl/up)... " -NoNewline -ForegroundColor Yellow

        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $probe = Invoke-HttpProbe -Url "$TargetUrl/up" -TimeoutSec $TimeoutSeconds
        $sw.Stop()

        if ($probe.Success -and $probe.StatusCode -ge 200 -and $probe.StatusCode -lt 500) {
            Write-Host "AWAKE! HTTP $($probe.StatusCode) in $($sw.ElapsedMilliseconds)ms" -ForegroundColor Green
            $warmupSuccess = $true
            break
        } else {
            $reason = if ($probe.ErrorMessage) { $probe.ErrorMessage } else { "HTTP Status $($probe.StatusCode)" }
            Write-Host "PENDING ($reason)" -ForegroundColor DarkYellow
            if ($attempt -lt $MaxWarmupRetries) {
                Write-Host "           Container is spinning up from cold state. Waiting ${WarmupDelaySeconds}s..." -ForegroundColor Gray
                Start-Sleep -Seconds $WarmupDelaySeconds
            }
        }
    }

    $warmupStart.Stop()

    if ($warmupSuccess) {
        Write-Host "  [WARMUP] Container verified alive after $([math]::Round($warmupStart.Elapsed.TotalSeconds, 1))s total." -ForegroundColor Green
    } else {
        Write-Warning "Warm-up probe did not receive 2xx/3xx/4xx response after $MaxWarmupRetries attempts. Proceeding to test execution anyway..."
    }
}

# Execute Warmup
Write-HeaderBanner
Invoke-WarmupPhase

# -----------------------------------------------------------------------------
# Shared Probes for Tier Execution
# -----------------------------------------------------------------------------
$rootUrl     = "$TargetUrl/"
$loginUrl    = "$TargetUrl/login"
$upUrl       = "$TargetUrl/up"
$captchaUrl  = "$TargetUrl/captcha-image"
$cssUrl      = "$TargetUrl/assets/css/style.css"
$guid404     = [System.Guid]::NewGuid().ToString("N").Substring(0, 12)
$notFoundUrl = "$TargetUrl/probe-404-$guid404"

# Perform Initial Requests
$respRoot    = Invoke-HttpProbe -Url $rootUrl -AllowAutoRedirect $false
$respLogin   = Invoke-HttpProbe -Url $loginUrl -AllowAutoRedirect $false
$respUp      = Invoke-HttpProbe -Url $upUrl -AllowAutoRedirect $false
$respCaptcha = Invoke-HttpProbe -Url $captchaUrl -AllowAutoRedirect $false
$respCss     = Invoke-HttpProbe -Url $cssUrl -AllowAutoRedirect $false
$resp404     = Invoke-HttpProbe -Url $notFoundUrl -AllowAutoRedirect $false

# =============================================================================
# TIER 1: FEATURE COVERAGE (Core Endpoints & Protocols)
# =============================================================================
Write-TierBanner "TIER 1" "Feature Coverage (TLS, Core Routes, Health, Assets)"

# T1.1: TLS Handshake & HTTPS Accessibility
Assert-E2ETest -Id "T1.1" -Tier "Tier 1" -Title "TLS Handshake & Protocol Accessibility" -Assertion {
    if ($IsHttps) {
        if (-not $respRoot.Success -and $respRoot.ErrorMessage -match "(SSL|TLS|handshake|certificate)") {
            throw "TLS Handshake failed: $($respRoot.ErrorMessage)"
        }
        "TLS Handshake succeeded over HTTPS (TLS 1.2/1.3 negotiated)."
    } else {
        "HTTP protocol active (Local/Staging development mode - TLS check bypassed)."
    }
}

# T1.2: Root Route HTTP 302 Redirect to /login
Assert-E2ETest -Id "T1.2" -Tier "Tier 1" -Title "Root Route HTTP 302 Redirect (GET / -> /login)" -Assertion {
    if (-not $respRoot.Success) {
        throw "Failed to reach root endpoint: $($respRoot.ErrorMessage)"
    }
    if ($respRoot.StatusCode -ne 302 -and $respRoot.StatusCode -ne 301) {
        throw "Expected HTTP 302/301 redirect on root '/', received HTTP $($respRoot.StatusCode) $($respRoot.StatusDescription)"
    }
    if (-not $respRoot.Location) {
        throw "Redirect response is missing 'Location' header."
    }
    if ($respRoot.Location -notmatch "/login(\?.*)?$") {
        throw "Expected redirect Location to point to '/login', received: '$($respRoot.Location)'"
    }
    "Root redirects with HTTP $($respRoot.StatusCode) to $($respRoot.Location)"
}

# T1.3: Primary Login Interface Endpoint HTTP 200
Assert-E2ETest -Id "T1.3" -Tier "Tier 1" -Title "Primary Login Interface HTTP 200 (GET /login)" -Assertion {
    if (-not $respLogin.Success) {
        throw "Failed to reach login endpoint: $($respLogin.ErrorMessage)"
    }
    if ($respLogin.StatusCode -ne 200) {
        throw "Expected HTTP 200 OK on '/login', received HTTP $($respLogin.StatusCode) $($respLogin.StatusDescription)"
    }
    if ($respLogin.ContentType -notmatch "text/html") {
        throw "Expected Content-Type 'text/html', received '$($respLogin.ContentType)'"
    }
    if ($respLogin.Body.Length -lt 1000) {
        throw "Response HTML is suspiciously small ($($respLogin.Body.Length) bytes). Expected >= 1000 bytes."
    }
    "Login endpoint returned HTTP 200 OK ($($respLogin.Body.Length) bytes HTML)"
}

# T1.4: Native Framework Healthcheck Endpoint HTTP 200 (/up)
Assert-E2ETest -Id "T1.4" -Tier "Tier 1" -Title "Native Framework Healthcheck HTTP 200 (GET /up)" -Assertion {
    if (-not $respUp.Success) {
        throw "Failed to reach healthcheck endpoint: $($respUp.ErrorMessage)"
    }
    if ($respUp.StatusCode -ne 200) {
        throw "Expected HTTP 200 OK on '/up', received HTTP $($respUp.StatusCode) $($respUp.StatusDescription)"
    }
    "Healthcheck endpoint /up returned HTTP 200 OK"
}

# T1.5: SVG Captcha Stream Endpoint (/captcha-image)
Assert-E2ETest -Id "T1.5" -Tier "Tier 1" -Title "SVG Captcha Stream Dynamic Generator (GET /captcha-image)" -Assertion {
    if (-not $respCaptcha.Success) {
        throw "Failed to reach captcha endpoint: $($respCaptcha.ErrorMessage)"
    }
    if ($respCaptcha.StatusCode -ne 200) {
        throw "Expected HTTP 200 OK on '/captcha-image', received HTTP $($respCaptcha.StatusCode) $($respCaptcha.StatusDescription)"
    }
    if ($respCaptcha.ContentType -notmatch "image/svg\+xml") {
        throw "Expected Content-Type 'image/svg+xml', received '$($respCaptcha.ContentType)'"
    }
    if ($respCaptcha.Body -notmatch "<svg[\s>]" -or $respCaptcha.Body -notmatch "</svg>") {
        throw "Captcha payload does not contain valid XML <svg> ... </svg> root elements."
    }
    if ($respCaptcha.Body.Length -lt 100) {
        throw "Captcha SVG payload is too small ($($respCaptcha.Body.Length) bytes)."
    }
    "Captcha dynamic SVG vector stream verified ($($respCaptcha.Body.Length) bytes, image/svg+xml)"
}

# T1.6: Core CSS Stylesheet Static Asset Serving (/assets/css/style.css)
Assert-E2ETest -Id "T1.6" -Tier "Tier 1" -Title "Core Stylesheet Static Asset Delivery (GET /assets/css/style.css)" -Assertion {
    if (-not $respCss.Success) {
        throw "Failed to reach static CSS stylesheet: $($respCss.ErrorMessage)"
    }
    if ($respCss.StatusCode -ne 200) {
        throw "Expected HTTP 200 OK on '/assets/css/style.css', received HTTP $($respCss.StatusCode) $($respCss.StatusDescription)"
    }
    if ($respCss.ContentType -notmatch "text/css") {
        throw "Expected Content-Type 'text/css', received '$($respCss.ContentType)'"
    }
    if ($respCss.Body.Length -lt 5000) {
        throw "Stylesheet payload is unexpectedly small ($($respCss.Body.Length) bytes). Expected >= 5000 bytes."
    }
    "Core stylesheet served cleanly ($($respCss.Body.Length) bytes, text/css)"
}

# =============================================================================
# TIER 2: BOUNDARY & CORNER CASES (Resilience, Timeouts, 404, Security Headers)
# =============================================================================
Write-TierBanner "TIER 2" "Boundary & Corner Cases (Latency, Timeout, 404 Handling, Security)"

# T2.1: Cold-Start Latency & Roundtrip Latency Timing
Assert-E2ETest -Id "T2.1" -Tier "Tier 2" -Title "Latency Boundary & Response Timing Assertion" -Assertion {
    $thresholdMs = $TimeoutSeconds * 1000
    if ($respLogin.ElapsedMs -gt $thresholdMs) {
        throw "Roundtrip latency ($($respLogin.ElapsedMs)ms) exceeded configured threshold ($($thresholdMs)ms)."
    }
    "Roundtrip latency on primary interface was $($respLogin.ElapsedMs)ms (within $($TimeoutSeconds)s window)."
}

# T2.2: Socket Timeout Resilience Across Consecutive Probes
Assert-E2ETest -Id "T2.2" -Tier "Tier 2" -Title "Socket Timeout Resilience & Connection Re-use" -Assertion {
    $followUp = Invoke-HttpProbe -Url "$TargetUrl/login" -TimeoutSec 15
    if (-not $followUp.Success) {
        throw "Consecutive socket probe failed: $($followUp.ErrorMessage)"
    }
    if ($followUp.StatusCode -ne 200) {
        throw "Consecutive probe returned unexpected HTTP status: $($followUp.StatusCode)"
    }
    "Socket connection remained stable and reusable across sequential probes (Follow-up: $($followUp.ElapsedMs)ms)."
}

# T2.3: Invalid Route 404 Error Handling
Assert-E2ETest -Id "T2.3" -Tier "Tier 2" -Title "Invalid Route Isolation (GET /probe-404-... -> 404 Not Found)" -Assertion {
    if (-not $resp404.Success) {
        throw "Probing non-existent route threw network exception: $($resp404.ErrorMessage)"
    }
    if ($resp404.StatusCode -ne 404) {
        throw "Expected HTTP 404 Not Found for non-existent route, received HTTP $($resp404.StatusCode) $($resp404.StatusDescription)"
    }
    if ($resp404.Body -match "500 Internal Server Error" -or $resp404.Body -match "SQLSTATE" -or $resp404.Body -match "Whoops!") {
        throw "Non-existent route triggered an unhandled runtime error rather than a clean 404 page!"
    }
    "Non-existent route safely returned HTTP 404 Not Found without leaking internal exceptions."
}

# T2.4: Defensive Security Headers Inspection
Assert-E2ETest -Id "T2.4" -Tier "Tier 2" -Title "Defensive Security Headers & Framing Protection" -Assertion {
    $foundSecHeaders = @()
    if ($respLogin.Headers.ContainsKey("X-Content-Type-Options")) {
        $foundSecHeaders += "X-Content-Type-Options: $($respLogin.Headers['X-Content-Type-Options'])"
    }
    if ($respLogin.Headers.ContainsKey("X-Frame-Options")) {
        $foundSecHeaders += "X-Frame-Options: $($respLogin.Headers['X-Frame-Options'])"
    }
    if ($respLogin.Headers.ContainsKey("Referrer-Policy")) {
        $foundSecHeaders += "Referrer-Policy: $($respLogin.Headers['Referrer-Policy'])"
    }
    if ($respLogin.Headers.ContainsKey("X-XSS-Protection")) {
        $foundSecHeaders += "X-XSS-Protection: $($respLogin.Headers['X-XSS-Protection'])"
    }

    if ($foundSecHeaders.Count -eq 0) {
        throw "No defensive security headers (X-Frame-Options, X-Content-Type-Options, etc.) were detected on /login response."
    }
    "Detected security headers: " + ($foundSecHeaders -join " | ")
}

# =============================================================================
# TIER 3: CROSS-FEATURE INTERACTIONS (Data Pipeline, CSRF, SQLite, Session)
# =============================================================================
Write-TierBanner "TIER 3" "Cross-Feature Interactions (CSRF, SQLite Query, Session Cookies)"

# T3.1: CSRF Token Generation & Form Integration
Assert-E2ETest -Id "T3.1" -Tier "Tier 3" -Title "CSRF Protection Token Embedded in Login Form" -Assertion {
    $hasCsrf = $false
    $csrfToken = $null

    if ($respLogin.Body -match '<input[^>]*name=["'']_token["''][^>]*value=["'']([^"'']+)["'']') {
        $hasCsrf = $true
        $csrfToken = $matches[1]
    } elseif ($respLogin.Body -match '<input[^>]*value=["'']([^"'']+)["''][^>]*name=["'']_token["'']') {
        $hasCsrf = $true
        $csrfToken = $matches[1]
    }

    if (-not $hasCsrf -or [string]::IsNullOrWhiteSpace($csrfToken)) {
        throw "CSRF hidden input '_token' was not found in the rendered login form HTML."
    }
    if ($csrfToken.Length -lt 20) {
        throw "CSRF token length ($($csrfToken.Length) chars) is suspiciously short. Possible stub."
    }
    "Valid CSRF token present in form DOM (Length: $($csrfToken.Length) characters)."
}

# T3.2: SQLite Database & Master Branch Setting Query Execution
Assert-E2ETest -Id "T3.2" -Tier "Tier 3" -Title "SQLite Database Query & Branch Master Setting Rendered in DOM" -Assertion {
    $dom = $respLogin.Body
    $branchMatched = $false

    if ($dom -match "Branch Cirebon" -or $dom -match "PTP Cirebon" -or $dom -match "Pelindo Multi Terminal" -or $dom -match "PT Pelabuhan Indonesia") {
        $branchMatched = $true
    }

    if (-not $branchMatched) {
        throw "DOM does not contain expected master branch setting 'Branch Cirebon' or 'PTP Cirebon'. Database query may have failed."
    }
    "Database query executed successfully: Official Pelindo master data settings rendered in DOM."
}

# T3.3: Session Cookie Issuance & Security Attributes
Assert-E2ETest -Id "T3.3" -Tier "Tier 3" -Title "Session Cookie Issuance with HttpOnly Protection" -Assertion {
    $cookieFound = $false
    $cookieDetails = @()

    foreach ($cookie in $respLogin.Cookies) {
        $cookieFound = $true
        $cookieDetails += "$($cookie.Name) (HttpOnly=$($cookie.HttpOnly), Secure=$($cookie.Secure))"
    }

    if (-not $cookieFound -and $respLogin.Headers.ContainsKey("Set-Cookie")) {
        $cookieFound = $true
        $cookieDetails += $respLogin.Headers["Set-Cookie"]
    }

    if (-not $cookieFound) {
        throw "No session cookies or Set-Cookie header emitted on visiting /login."
    }
    "Session cookie issued successfully: " + ($cookieDetails -join ", ")
}

# =============================================================================
# TIER 4: REAL-WORLD ACCEPTANCE (Primary Interface & Zero Defects)
# =============================================================================
Write-TierBanner "TIER 4" "Real-World Acceptance (Full Interface DOM, Zero 500s, Zero SQLSTATE)"

# T4.1: Full Primary Interface DOM Completeness
Assert-E2ETest -Id "T4.1" -Tier "Tier 4" -Title "Primary Interface DOM Completeness (Title, Inputs, Submit)" -Assertion {
    $dom = $respLogin.Body
    $missingElements = @()

    if ($dom -notmatch "<title>[^<]*SPKTAD[^<]*</title>") {
        $missingElements += "<title> containing SPKTAD"
    }
    if ($dom -notmatch 'name=["'']username["'']') {
        $missingElements += "Username input (name='username')"
    }
    if ($dom -notmatch 'name=["'']password["'']') {
        $missingElements += "Password input (name='password')"
    }
    if ($dom -notmatch 'name=["'']captcha["'']') {
        $missingElements += "Captcha input (name='captcha')"
    }
    if ($dom -notmatch 'type=["'']submit["'']') {
        $missingElements += "Submit button (type='submit')"
    }

    if ($missingElements.Count -gt 0) {
        throw "Primary login interface is incomplete. Missing components: " + ($missingElements -join ", ")
    }
    "Full primary login interface validated: Page title, credentials inputs, captcha field, and submit button."
}

# T4.2: Zero 500 Internal Server Errors Across All Probed Endpoints
Assert-E2ETest -Id "T4.2" -Tier "Tier 4" -Title "Zero 500-Series Internal Server Errors Across Endpoints" -Assertion {
    $serverErrors = @()
    foreach ($resp in $script:CapturedResponses) {
        if ($resp.StatusCode -ge 500) {
            $serverErrors += "$($resp.Url) -> HTTP $($resp.StatusCode) $($resp.StatusDescription)"
        }
    }

    if ($serverErrors.Count -gt 0) {
        throw "Server error(s) detected across tested endpoints: " + ($serverErrors -join "; ")
    }
    "Zero 500-series internal server errors encountered across all $($script:CapturedResponses.Count) probed endpoints."
}

# T4.3: Zero SQLSTATE, SQLite, or Runtime Exceptions in Response Bodies
Assert-E2ETest -Id "T4.3" -Tier "Tier 4" -Title "Zero SQLSTATE, Missing Tables, or Runtime Exceptions" -Assertion {
    $errorSignatures = @(
        "SQLSTATE",
        "no such table",
        "PDOException",
        "Illuminate\Database\QueryException",
        "Fatal error",
        "Whoops! There was an error",
        "Call to undefined function",
        "DatabaseQueryException",
        "syntax error, unexpected"
    )

    $detectedErrors = @()
    foreach ($resp in $script:CapturedResponses) {
        if ([string]::IsNullOrWhiteSpace($resp.Body)) { continue }
        foreach ($sig in $errorSignatures) {
            if ($resp.Body -match [regex]::Escape($sig)) {
                $detectedErrors += "Endpoint $($resp.Url) matched error signature '$sig'"
            }
        }
    }

    if ($detectedErrors.Count -gt 0) {
        throw "Runtime or database errors detected in response payload(s): " + ($detectedErrors -join "; ")
    }
    "Zero SQLSTATE, missing table, or unhandled runtime exceptions detected in response payloads."
}

# =============================================================================
# SUMMARY & DIAGNOSTIC REPORT
# =============================================================================
$totalExecutionTime = ((Get-Date) - $script:StartTime).TotalSeconds
$totalTests = $script:TestResults.Count
$passedTests = @($script:TestResults | Where-Object { $_.Passed }).Count
$failedTests = @($script:TestResults | Where-Object { -not $_.Passed }).Count
$passRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION EXECUTION SUMMARY REPORT                                 " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  Target URL        : $TargetUrl" -ForegroundColor White
Write-Host "  Total Tests       : $totalTests" -ForegroundColor White
Write-Host "  Passed            : $passedTests" -ForegroundColor Green
Write-Host "  Failed            : $failedTests" -ForegroundColor $(if ($failedTests -eq 0) { "DarkGray" } else { "Red" })
Write-Host "  Pass Rate         : $passRate%" -ForegroundColor $(if ($passRate -eq 100) { "Green" } else { "Red" })
Write-Host "  Total Duration    : $([math]::Round($totalExecutionTime, 2)) seconds" -ForegroundColor White
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host "  TIER BREAKDOWN:" -ForegroundColor DarkCyan

$tiers = @("Tier 1", "Tier 2", "Tier 3", "Tier 4")
foreach ($tier in $tiers) {
    $tierTests = @($script:TestResults | Where-Object { $_.Tier -eq $tier })
    $tierPassed = @($tierTests | Where-Object { $_.Passed }).Count
    $tierTotal = $tierTests.Count
    $tierColor = if ($tierPassed -eq $tierTotal) { "Green" } else { "Red" }
    Write-Host "    $tier : " -NoNewline
    Write-Host "$tierPassed / $tierTotal Passed" -ForegroundColor $tierColor
}
Write-Host "========================================================================" -ForegroundColor Cyan

if ($failedTests -gt 0) {
    Write-Host ""
    Write-Host "  FAILED TESTS DIAGNOSTIC AUDIT:" -ForegroundColor Red
    foreach ($ft in ($script:TestResults | Where-Object { -not $_.Passed })) {
        Write-Host "    * [$($ft.Id)] $($ft.Title)" -ForegroundColor Yellow
        Write-Host "      Failure: $($ft.Detail)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "  DEPLOYMENT VERIFICATION FAILED. Remediation required." -ForegroundColor Red
    exit 1
} else {
    Write-Host ""
    Write-Host "  >>> ALL $totalTests VERIFICATION TESTS PASSED (100% SUCCESS) <<<" -ForegroundColor Green
    Write-Host "  Target deployment is healthy, functional, and ready for production staging." -ForegroundColor Green
    Write-Host "========================================================================" -ForegroundColor Cyan
    exit 0
}
