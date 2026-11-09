# Adversarial Packaging & Security Verification Harness
# Challenger 2 - Milestone 1 Gate
Set-StrictMode -Off
$ErrorActionPreference = "Stop"

$workspaceRoot = "C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition"
$appDir = "$workspaceRoot\.vscode\ptp"
$bashExe = "C:\Program Files\Git\bin\bash.exe"

$results = [System.Collections.Generic.List[PSCustomObject]]::new()

function Record-Test([string]$Category, [string]$TestName, [bool]$Passed, [string]$Details) {
    $item = [PSCustomObject]@{
        Category = $Category
        TestName = $TestName
        Passed   = $Passed
        Details  = $Details
    }
    $results.Add($item)
    $statusStr = if ($Passed) { "[PASS]" } else { "[FAIL]" }
    $color = if ($Passed) { "Green" } else { "Red" }
    Write-Host "$statusStr $Category - $TestName" -ForegroundColor $color
    if (-not $Passed -or $env:VERBOSE) {
        Write-Host "       $Details" -ForegroundColor DarkGray
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  RUNNING ADVERSARIAL PACKAGING & SECURITY VERIFICATION   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# -----------------------------------------------------------------------------
# 1. Container Port & Server Routing Challenge
# -----------------------------------------------------------------------------
$entrypointPath = "$appDir\docker-entrypoint.sh"
$dockerfilePath = "$appDir\Dockerfile"

# 1.1 Bash syntax validation
$syntaxTest = & $bashExe -n "$entrypointPath" 2>&1
$syntaxPassed = ($LASTEXITCODE -eq 0)
Record-Test "Port & Routing" "docker-entrypoint.sh Bash Syntax Check" $syntaxPassed "Bash -n returned code $LASTEXITCODE"

# 1.2 Port resolution under 4 adversarial cases via test_ports.sh
$portTestOut = & $bashExe "$workspaceRoot\tests\test_ports.sh" 2>&1
$portTestPassed = ($LASTEXITCODE -eq 0 -and $portTestOut -match "ALL_PORT_CASES_PASSED")
Record-Test "Port & Routing" "Port Resolution (Unset, 10000, 8080, Empty)" $portTestPassed "$portTestOut"

# 1.3 Server Document Root Routing
$entrypointContent = Get-Content $entrypointPath -Raw
$frankenMatches = $entrypointContent -match 'frankenphp php-server --listen [^ ]+ --root /var/www/html/public'
$phpMatches = $entrypointContent -match 'php -S [^ ]+ -t /var/www/html/public'

Record-Test "Port & Routing" "FrankenPHP Document Root Isolation (/public)" $frankenMatches "Matches frankenphp php-server --root /var/www/html/public"
Record-Test "Port & Routing" "PHP CLI Server Document Root Isolation (-t /public)" $phpMatches "Matches php -S -t /var/www/html/public"

# 1.4 Dockerfile EXPOSE and PORT ENV
$dockerfileContent = Get-Content $dockerfilePath -Raw
$exposeMatches = $dockerfileContent -match 'EXPOSE\s+10000'
$envPortMatches = $dockerfileContent -match 'PORT="10000"'

Record-Test "Port & Routing" "Dockerfile EXPOSE 10000" $exposeMatches "EXPOSE 10000 directive verified"
Record-Test "Port & Routing" "Dockerfile ENV PORT=10000" $envPortMatches "Default PORT=10000 env verified"

# -----------------------------------------------------------------------------
# 2. Secrets Leakage & Security Challenge
# -----------------------------------------------------------------------------
$filesToScan = @(
    "$appDir\Dockerfile",
    "$appDir\docker-entrypoint.sh",
    "$workspaceRoot\render.yaml",
    "$appDir\render.yaml",
    "$workspaceRoot\DEPLOYMENT.md",
    "$appDir\DEPLOYMENT.md"
)

$secretPatterns = @(
    '(?i)AKIA[0-9A-Z]{16}',                     # AWS Access Key
    '(?i)ghp_[0-9a-zA-Z]{36}',                  # GitHub Personal Access Token
    '(?i)BEGIN\s+(RSA|OPENSSH|DSA|EC)\s+PRIVATE',# Private SSH Keys
    '(?i)password\s*=\s*["''][^"'']{6,}["'']',  # Hardcoded passwords (except password123 in seeders)
    '(?i)mysql://',                             # Database connection strings with credentials
    '(?i)postgres://[^:]+:[^@]+@'               # PostgreSQL credentials in URLs
)

$foundLeaks = @()
foreach ($f in $filesToScan) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        foreach ($pattern in $secretPatterns) {
            if ($content -match $pattern) {
                $foundLeaks += "$f matches $pattern"
            }
        }
    }
}
$noLeaks = ($foundLeaks.Count -eq 0)
Record-Test "Secrets & Security" "Zero Hardcoded Secrets/Credentials Scan" $noLeaks "Found leaks: $($foundLeaks -join ', ')"

# 2.2 Verify render.yaml generates APP_KEY dynamically
$renderYamlContent = Get-Content "$workspaceRoot\render.yaml" -Raw
$keyGenMatches = $renderYamlContent -match 'key:\s*APP_KEY\s*\r?\n\s*generateValue:\s*true'
Record-Test "Secrets & Security" "render.yaml Dynamic APP_KEY Generation (generateValue: true)" $keyGenMatches "APP_KEY generation configured"

# 2.3 Verify .dockerignore patterns
$dockerignorePath = "$appDir\.dockerignore"
$dockerignoreExists = Test-Path $dockerignorePath
$dockerignoreContent = if ($dockerignoreExists) { Get-Content $dockerignorePath -Raw } else { "" }

$ignoresEnv = ($dockerignoreContent -match '\.env\b' -and $dockerignoreContent -match '\.env\.\*')
$ignoresSqlite = ($dockerignoreContent -match 'database/\*\.sqlite' -and $dockerignoreContent -match '\*\.sqlite\*')

Record-Test "Secrets & Security" ".dockerignore Exists" $dockerignoreExists "Located at $dockerignorePath"
Record-Test "Secrets & Security" ".dockerignore Blocks Local .env & Variations" $ignoresEnv "Contains .env and .env.* blocks"
Record-Test "Secrets & Security" ".dockerignore Blocks SQLite Databases" $ignoresSqlite "Contains database/*.sqlite and *.sqlite* blocks"

# 2.4 Verify Git index has no committed secrets or sqlite databases
$gitEnv = git ls-files .vscode/ptp/.env
$gitSqlite = git ls-files "*.sqlite*" ".vscode/ptp/database/*.sqlite*"
$gitClean = ([string]::IsNullOrWhiteSpace($gitEnv) -and [string]::IsNullOrWhiteSpace($gitSqlite))
Record-Test "Secrets & Security" "Git Index Excludes Local .env & SQLite Files" $gitClean "git ls-files returned empty for .env and sqlite"

# -----------------------------------------------------------------------------
# 3. 1-Click Deploy URL & Git Branch Verification
# -----------------------------------------------------------------------------
$currentBranch = (git branch --show-current).Trim()
$remoteOrigin = (git remote get-url origin).Trim()

$deploymentContent = Get-Content "$workspaceRoot\DEPLOYMENT.md" -Raw

$expectedUrl = "https://render.com/deploy?repo=https://github.com/gajanpar/love-notes/tree/prepare_real_data_transition"
$urlPresent = $deploymentContent.Contains($expectedUrl)

Record-Test "1-Click Deploy & Git" "Active Branch Matches 'prepare_real_data_transition'" ($currentBranch -eq "prepare_real_data_transition") "Current branch: '$currentBranch'"
Record-Test "1-Click Deploy & Git" "Remote Origin Matches 'https://github.com/gajanpar/love-notes.git'" ($remoteOrigin -eq "https://github.com/gajanpar/love-notes.git") "Remote: '$remoteOrigin'"
Record-Test "1-Click Deploy & Git" "DEPLOYMENT.md Contains Exact 1-Click Deploy URL" $urlPresent "URL verified: $expectedUrl"

# Check render.yaml branch configuration
$renderBranchMatches = $renderYamlContent -match 'branch:\s*prepare_real_data_transition'
Record-Test "1-Click Deploy & Git" "render.yaml Specifies Active Branch" $renderBranchMatches "Configured branch: prepare_real_data_transition"

# -----------------------------------------------------------------------------
# 4. Summary & Exit
# -----------------------------------------------------------------------------
$total = $results.Count
$passedCount = @($results | Where-Object { $_.Passed }).Count
$failedCount = @($results | Where-Object { -not $_.Passed }).Count

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  RESULTS: $passedCount / $total PASSED ($failedCount FAILED)" -ForegroundColor $(if ($failedCount -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failedCount -gt 0) {
    exit 1
} else {
    exit 0
}
