<?php

/**
 * SPKTAD Layout Remediation E2E Verification Runner
 * PT Pelindo Multi Terminal Branch Cirebon
 *
 * Runs the comprehensive 4-tier LayoutRemediationTest suite via PHPUnit
 * and provides structured, colored console reporting with tier breakdown.
 */

declare(strict_types=1);

// ANSI Color Constants
const COLOR_RESET   = "\033[0m";
const COLOR_BOLD    = "\033[1m";
const COLOR_CYAN    = "\033[36m";
const COLOR_GREEN   = "\033[32m";
const COLOR_YELLOW  = "\033[33m";
const COLOR_RED     = "\033[31m";
const COLOR_MAGENTA = "\033[35m";
const COLOR_GRAY    = "\033[90m";

echo COLOR_CYAN . COLOR_BOLD . "======================================================================\n";
echo "  PT PELINDO MULTI TERMINAL BRANCH CIREBON — SPKTAD LAYOUT AUDIT RUNNER\n";
echo "  Opaque-Box E2E Layout Remediation Verification (Tiers 1-4)\n";
echo "======================================================================\n" . COLOR_RESET . "\n";

$baseDir = dirname(__DIR__);
chdir($baseDir);

$artisan = $baseDir . DIRECTORY_SEPARATOR . 'artisan';
if (!file_exists($artisan)) {
    fwrite(STDERR, COLOR_RED . "Error: 'artisan' not found at {$artisan}\n" . COLOR_RESET);
    exit(1);
}

$testFile = 'tests/Feature/LayoutRemediationTest.php';
echo COLOR_GRAY . "Executing: php artisan test {$testFile}\n" . COLOR_RESET;

$startTime = microtime(true);
$cmd = "php artisan test {$testFile} --compact";
exec($cmd, $outputLines, $returnCode);
$duration = round(microtime(true) - $startTime, 2);

// Decode json output from php artisan test --compact
$fullOutput = implode("\n", $outputLines);
$report = json_decode($fullOutput, true);

if (!is_array($report)) {
    // If output is not JSON, display raw output
    echo $fullOutput . "\n";
    exit($returnCode);
}

$totalTests = $report['tests'] ?? 0;
$passed = $report['passed'] ?? 0;
$failed = $report['failed'] ?? 0;
$assertions = $report['assertions'] ?? 0;
$failures = $report['failures'] ?? [];

echo COLOR_BOLD . "----------------------------------------------------------------------\n";
echo "  VERIFICATION METRICS & BASELINE STATUS\n";
echo "----------------------------------------------------------------------\n" . COLOR_RESET;

printf("  • Total E2E Tests Executed : %s%d%s\n", COLOR_CYAN, $totalTests, COLOR_RESET);
printf("  • Passing Test Assertions  : %s%d%s\n", COLOR_GREEN, $passed, COLOR_RESET);
printf("  • Failing Audit Checks     : %s%d%s\n", ($failed > 0 ? COLOR_YELLOW : COLOR_GREEN), $failed, COLOR_RESET);
printf("  • Total System Assertions  : %s%d%s\n", COLOR_CYAN, $assertions, COLOR_RESET);
printf("  • Execution Duration       : %s%.2f s%s\n", COLOR_GRAY, $duration, COLOR_RESET);
echo "\n";

if (!empty($failures)) {
    echo COLOR_YELLOW . COLOR_BOLD . "  DETECTED REMEDIATION DEFECTS (BASELINE TARGETS FOR M1 & M2):\n" . COLOR_RESET;
    echo COLOR_GRAY . "  --------------------------------------------------------------------\n" . COLOR_RESET;
    
    foreach ($failures as $idx => $f) {
        $testName = $f['test'] ?? 'Unknown Test';
        $shortName = substr($testName, strrpos($testName, '::') !== false ? strrpos($testName, '::') + 2 : 0);
        $message = trim(explode("\n", $f['message'] ?? '')[0]);
        
        printf(
            "  %s[%d]%s %s%-45s%s\n      %s%s%s\n",
            COLOR_RED, $idx + 1, COLOR_RESET,
            COLOR_BOLD, $shortName, COLOR_RESET,
            COLOR_GRAY, $message, COLOR_RESET
        );
    }
    echo "\n";
}

echo COLOR_BOLD . "----------------------------------------------------------------------\n" . COLOR_RESET;
if ($failed === 0 && $totalTests > 0) {
    echo COLOR_GREEN . COLOR_BOLD . "  STATUS: 100% LAYOUT REMEDIATION VERIFIED — ZERO DEFECTS FOUND\n" . COLOR_RESET;
    echo COLOR_GREEN . "  All 4 HIGH severity layout requirements successfully satisfied.\n" . COLOR_RESET;
} else {
    echo COLOR_YELLOW . COLOR_BOLD . "  STATUS: BASELINE ESTABLISHED — {$failed} REMEDIATION TARGETS PENDING M1/M2\n" . COLOR_RESET;
    echo COLOR_YELLOW . "  Test suite is actively enforcing acceptance criteria for Implementation Track.\n" . COLOR_RESET;
}
echo COLOR_CYAN . COLOR_BOLD . "======================================================================\n" . COLOR_RESET;

exit($failed === 0 ? 0 : 1);
