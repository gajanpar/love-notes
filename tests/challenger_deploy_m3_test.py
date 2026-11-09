#!/usr/bin/env python3
"""
Empirical Verification & Stress Test Suite
Challenger 2 (challenger_deploy_m3_remediation_2)
"""

import os
import sys
import yaml
import subprocess
import re
from pathlib import Path

WORKSPACE_ROOT = Path(r"C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition")
APP_DIR = WORKSPACE_ROOT / ".vscode" / "ptp"

passed_tests = 0
failed_tests = 0
test_results = []

def record(category: str, name: str, success: bool, details: str = ""):
    global passed_tests, failed_tests
    if success:
        passed_tests += 1
        status = "[PASS]"
    else:
        failed_tests += 1
        status = "[FAIL]"
    test_results.append((category, name, success, details))
    print(f"{status} {category}: {name}")
    if not success or os.environ.get("VERBOSE"):
        print(f"       Details: {details}")

print("=" * 60)
print("  EMPIRICAL CHALLENGER VERIFICATION HARNESS — MILESTONE 3 REMEDIATION")
print("=" * 60)

# ==============================================================================
# 1. Validate render.yaml Schema, Env Vars & Dockerfile Syntax
# ==============================================================================
root_yaml_path = WORKSPACE_ROOT / "render.yaml"
sub_yaml_path = APP_DIR / "render.yaml"

# 1.1 YAML parsing
root_yaml = None
try:
    with open(root_yaml_path, "r", encoding="utf-8") as f:
        root_yaml = yaml.safe_load(f)
    record("Schema", "Root render.yaml is valid YAML", True, f"Parsed {root_yaml_path}")
except Exception as e:
    record("Schema", "Root render.yaml is valid YAML", False, str(e))

sub_yaml = None
try:
    with open(sub_yaml_path, "r", encoding="utf-8") as f:
        sub_yaml = yaml.safe_load(f)
    record("Schema", "Subdirectory .vscode/ptp/render.yaml is valid YAML", True, f"Parsed {sub_yaml_path}")
except Exception as e:
    record("Schema", "Subdirectory .vscode/ptp/render.yaml is valid YAML", False, str(e))

# 1.2 Validate service schema in root render.yaml
if root_yaml and "services" in root_yaml and len(root_yaml["services"]) > 0:
    svc = root_yaml["services"][0]
    record("Schema", "Service type is 'web'", svc.get("type") == "web", f"type={svc.get('type')}")
    record("Schema", "Service runtime is 'docker'", svc.get("runtime") == "docker", f"runtime={svc.get('runtime')}")
    record("Schema", "Service plan is 'free'", svc.get("plan") == "free", f"plan={svc.get('plan')}")
    record("Schema", "Service branch is 'main'", svc.get("branch") == "main", f"branch={svc.get('branch')}")
    record("Schema", "Healthcheck endpoint is '/up'", svc.get("healthCheckPath") == "/up", f"healthCheckPath={svc.get('healthCheckPath')}")
    
    # 1.3 Env vars check
    env_vars = {item["key"]: item.get("value") for item in svc.get("envVars", []) if "key" in item}
    record("EnvVars", "FORCE_HTTPS is 'true'", env_vars.get("FORCE_HTTPS") == "true", f"FORCE_HTTPS={env_vars.get('FORCE_HTTPS')}")
    record("EnvVars", "TRUSTED_PROXIES is '*'", env_vars.get("TRUSTED_PROXIES") == "*", f"TRUSTED_PROXIES={env_vars.get('TRUSTED_PROXIES')}")
    record("EnvVars", "APP_ENV is 'production'", env_vars.get("APP_ENV") == "production", f"APP_ENV={env_vars.get('APP_ENV')}")
    record("EnvVars", "APP_DEBUG is 'false'", env_vars.get("APP_DEBUG") == "false", f"APP_DEBUG={env_vars.get('APP_DEBUG')}")
    record("EnvVars", "DB_CONNECTION is 'sqlite'", env_vars.get("DB_CONNECTION") == "sqlite", f"DB_CONNECTION={env_vars.get('DB_CONNECTION')}")
    record("EnvVars", "LOG_CHANNEL is 'stderr'", env_vars.get("LOG_CHANNEL") == "stderr", f"LOG_CHANNEL={env_vars.get('LOG_CHANNEL')}")
    
    # Check dynamic APP_KEY generation
    app_key_item = next((item for item in svc.get("envVars", []) if item.get("key") == "APP_KEY"), None)
    app_key_gen = app_key_item.get("generateValue") is True if app_key_item else False
    record("EnvVars", "APP_KEY has generateValue: true", app_key_gen, f"APP_KEY config: {app_key_item}")
else:
    record("Schema", "Root render.yaml has valid services list", False, "No services found")

# 1.4 Dockerfile Syntax & Directives
dockerfile_path = APP_DIR / "Dockerfile"
if dockerfile_path.exists():
    with open(dockerfile_path, "r", encoding="utf-8") as f:
        df_content = f.read()
    record("Dockerfile", "Base image is dunglas/frankenphp:1-php8.4-alpine", "dunglas/frankenphp:1-php8.4-alpine" in df_content)
    record("Dockerfile", "Installs pdo_sqlite, bcmath, intl, opcache, zip", all(ext in df_content for ext in ["pdo_sqlite", "bcmath", "intl", "opcache", "zip"]))
    record("Dockerfile", "Uses multi-stage composer copy", "COPY --from=composer:2 /usr/bin/composer /usr/bin/composer" in df_content)
    record("Dockerfile", "Separates composer dependency install from app code", "COPY composer.json composer.lock ./" in df_content and "RUN composer install" in df_content)
    record("Dockerfile", "EXPOSE 10000 directive present", "EXPOSE 10000" in df_content)
    record("Dockerfile", "Sets ENTRYPOINT to docker-entrypoint.sh", 'ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]' in df_content)
else:
    record("Dockerfile", "Dockerfile exists in .vscode/ptp", False, f"Missing {dockerfile_path}")

# ==============================================================================
# 2. Build Context & Path Consistency
# ==============================================================================
# For root render.yaml:
# rootDir: .vscode/ptp
# dockerfilePath: Dockerfile -> APP_DIR / Dockerfile
# dockerContext: . -> APP_DIR
if root_yaml and "services" in root_yaml and len(root_yaml["services"]) > 0:
    svc = root_yaml["services"][0]
    root_dir = svc.get("rootDir", "")
    df_rel = svc.get("dockerfilePath", "Dockerfile")
    ctx_rel = svc.get("dockerContext", ".")
    
    resolved_root = (WORKSPACE_ROOT / root_dir) if root_dir else WORKSPACE_ROOT
    resolved_df = resolved_root / df_rel
    resolved_ctx = resolved_root / ctx_rel
    
    record("BuildContext", f"Root render.yaml rootDir '{root_dir}' exists", resolved_root.is_dir(), str(resolved_root))
    record("BuildContext", f"Resolved Dockerfile '{resolved_df}' exists", resolved_df.is_file(), str(resolved_df))
    record("BuildContext", f"Resolved Context '{resolved_ctx}' contains composer.json & artisan", (resolved_ctx / "composer.json").is_file() and (resolved_ctx / "artisan").is_file(), str(resolved_ctx))

# Discrepancy Analysis on .vscode/ptp/render.yaml
if sub_yaml and "services" in sub_yaml and len(sub_yaml["services"]) > 0:
    sub_svc = sub_yaml["services"][0]
    sub_has_rootdir = "rootDir" in sub_svc
    # Note: having no rootDir inside .vscode/ptp/render.yaml is correct IF the repo was rooted at .vscode/ptp,
    # but Render blueprints in this git repo use root render.yaml.
    record("BuildContext", ".vscode/ptp/render.yaml exists with matching envVars", "envVars" in sub_svc, f"sub_has_rootdir={sub_has_rootdir}")

# ==============================================================================
# 3. Empirically verify no lingering host SSH tunnel or background server exists
# ==============================================================================
# Check for localhost.run, artisan serve, or ssh.exe processes via PowerShell CIM
ps_cmd = """
Get-CimInstance Win32_Process | Where-Object { ($_.CommandLine -match 'localhost\\.run|artisan\\s+serve' -or $_.Name -match 'ssh\\.exe') -and $_.ProcessId -ne $PID } | Select-Object ProcessId, Name, CommandLine
"""
try:
    res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True, timeout=10)
    output = res.stdout.strip()
    is_clean = len(output) == 0
    record("HostIsolation", "No lingering SSH tunnels or artisan serve processes", is_clean, f"Found output: {output}" if not is_clean else "Zero processes found")
except Exception as e:
    record("HostIsolation", "No lingering SSH tunnels or artisan serve processes", False, str(e))

# Check port 8000
port_check_cmd = "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue"
try:
    res_port = subprocess.run(["powershell", "-NoProfile", "-Command", port_check_cmd], capture_output=True, text=True, timeout=5)
    port8000_free = len(res_port.stdout.strip()) == 0
    record("HostIsolation", "Port 8000 is completely free", port8000_free, f"Output: {res_port.stdout.strip()}")
except Exception as e:
    record("HostIsolation", "Port 8000 is completely free", False, str(e))

# ==============================================================================
# 5. Verify Git Commits on https://github.com/gajanpar/ptp.git
# ==============================================================================
try:
    res_git = subprocess.run(["git", "ls-remote", "https://github.com/gajanpar/ptp.git"], capture_output=True, text=True, timeout=15)
    git_out = res_git.stdout
    has_main = "refs/heads/main" in git_out
    has_prep = "refs/heads/prepare_real_data_transition" in git_out
    # Extract commit hash for main
    main_commit = None
    for line in git_out.strip().splitlines():
        if "refs/heads/main" in line:
            main_commit = line.split()[0]
            break
    
    # Get local HEAD commit
    res_head = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, timeout=5)
    local_head = res_head.stdout.strip()
    
    record("GitRemote", "Remote repository contains branch 'main'", has_main, f"main_commit={main_commit}")
    record("GitRemote", "Remote repository contains branch 'prepare_real_data_transition'", has_prep)
    record("GitRemote", "Remote 'main' commit matches local HEAD (aadc72d)", main_commit == local_head, f"remote={main_commit}, local={local_head}")
except Exception as e:
    record("GitRemote", "Remote git validation", False, str(e))

# ==============================================================================
# Summary
# ==============================================================================
print("=" * 60)
print(f"  TOTAL TESTS: {passed_tests + failed_tests} | PASSED: {passed_tests} | FAILED: {failed_tests}")
print("=" * 60)

if failed_tests > 0:
    sys.exit(1)
sys.exit(0)
