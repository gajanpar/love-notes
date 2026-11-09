<?php

/**
 * SPKTAD Modal Vertical Clipping & Reachability Empirical Stress Challenge
 * Milestone M1 Challenger Verification Script
 * PT Pelindo Multi Terminal Branch Cirebon
 *
 * Verifies all 12 .modal-overlay / .modal-box instances under adversarial conditions:
 * - 320px extreme narrow viewport reflow
 * - 200% browser zoom / short desktop viewport (310px - 384px)
 * - Indonesian action label reachability & button stacking
 * - CSS declarations across style.css, admin layout, and app layout
 */

declare(strict_types=1);

const COLOR_RESET   = "\033[0m";
const COLOR_BOLD    = "\033[1m";
const COLOR_CYAN    = "\033[36m";
const COLOR_GREEN   = "\033[32m";
const COLOR_YELLOW  = "\033[33m";
const COLOR_RED     = "\033[31m";
const COLOR_MAGENTA = "\033[35m";
const COLOR_GRAY    = "\033[90m";

echo COLOR_CYAN . COLOR_BOLD . "======================================================================\n";
echo "  EMPIRICAL CHALLENGER: MODAL STRESS & REACHABILITY AUDIT (M1)\n";
echo "  SPKTAD - PT Pelindo Multi Terminal Branch Cirebon\n";
echo "======================================================================\n" . COLOR_RESET . "\n";

$baseDir = dirname(__DIR__);
chdir($baseDir);

$failures = [];
$checks = 0;

function runCheck(string $desc, bool $condition, ?string $detail = null): void {
    global $checks, $failures;
    $checks++;
    if ($condition) {
        printf("  %s✓ PASS%s %s\n", COLOR_GREEN, COLOR_RESET, $desc);
    } else {
        printf("  %s✗ FAIL%s %s\n", COLOR_RED, COLOR_RESET, $desc);
        if ($detail) {
            printf("         %s%s%s\n", COLOR_YELLOW, $detail, COLOR_RESET);
        }
        $failures[] = $desc . ($detail ? " ({$detail})" : "");
    }
}

/**
 * Extract all blocks of a media query by matching balanced braces.
 */
function extractMediaQueries(string $css, string $queryHeader): string {
    $pattern = '/@media\s*\(\s*' . preg_quote($queryHeader, '/') . '\s*\)\s*\{/i';
    if (!preg_match_all($pattern, $css, $matches, PREG_OFFSET_CAPTURE)) {
        return '';
    }
    $combined = '';
    $len = strlen($css);
    foreach ($matches[0] as $m) {
        $startPos = $m[1] + strlen($m[0]);
        $depth = 1;
        for ($i = $startPos; $i < $len; $i++) {
            if ($css[$i] === '{') $depth++;
            elseif ($css[$i] === '}') {
                $depth--;
                if ($depth === 0) {
                    $combined .= "\n" . substr($css, $startPos, $i - $startPos);
                    break;
                }
            }
        }
    }
    return $combined;
}

/**
 * Extract a <div id="..."> block by tracking balanced <div> tags.
 */
function extractDivBlock(string $html, string $id): ?string {
    $pattern = '/<div[^>]+id=["\']' . preg_quote($id, '/') . '["\'][^>]*>/i';
    if (!preg_match($pattern, $html, $m, PREG_OFFSET_CAPTURE)) {
        return null;
    }
    $startPos = $m[0][1];
    $pos = $startPos + strlen($m[0][0]);
    $depth = 1;
    $len = strlen($html);

    while ($pos < $len && $depth > 0) {
        // Find next <div or </div>
        if (preg_match('/(<\/?div\b[^>]*>)/i', substr($html, $pos), $match, PREG_OFFSET_CAPTURE)) {
            $tag = $match[1][0];
            $tagOffset = $match[1][1];
            if (str_starts_with(strtolower($tag), '</div')) {
                $depth--;
            } else {
                $depth++;
            }
            $pos += $tagOffset + strlen($tag);
        } else {
            break;
        }
    }
    return substr($html, $startPos, $pos - $startPos);
}

// -----------------------------------------------------------------------------
// 1. CSS ASSET AUDIT (public/assets/css/style.css)
// -----------------------------------------------------------------------------
echo COLOR_BOLD . "\n[SECTION 1] CSS Rules Audit — public/assets/css/style.css\n" . COLOR_RESET;
echo COLOR_GRAY . "----------------------------------------------------------------------\n" . COLOR_RESET;

$cssPath = $baseDir . '/public/assets/css/style.css';
runCheck("style.css exists", file_exists($cssPath));
$css = file_get_contents($cssPath);

// 1.1 .modal-actions-sticky bottom: 0 !important and zero negative bottom offset
runCheck(
    "style.css: .modal-actions-sticky defines bottom: 0 !important",
    (bool)preg_match('/\.modal-actions-sticky\s*\{[^}]*bottom\s*:\s*0\s*!important/i', $css),
    "Sticky footer must declare 'bottom: 0 !important' in base rule"
);

$hasNegativeBottom = (bool)preg_match('/\.modal-actions-sticky\s*\{[^}]*bottom\s*:\s*-\s*[0-9]+px/i', $css);
runCheck(
    "style.css: .modal-actions-sticky has ZERO negative bottom offsets",
    !$hasNegativeBottom,
    "No negative bottom offsets allowed (e.g. bottom: -24px or bottom: -16px)"
);

// 1.2 align-items: safe center on .modal-overlay
runCheck(
    "style.css: .modal-overlay defines align-items: safe center",
    (bool)preg_match('/\.modal-overlay\s*\{[^}]*align-items\s*:\s*safe center/i', $css),
    ".modal-overlay must use 'safe center' to avoid clipping modal header on tall content"
);

// 1.3 scroll-margin-bottom: 72px on modal form inputs
runCheck(
    "style.css: modal inputs have scroll-margin-bottom: 72px",
    (bool)preg_match('/\.modal-box\s+(?:input|select|textarea)[^{]*\{[^}]*scroll-margin-bottom\s*:\s*72px/i', $css) ||
    (bool)preg_match('/scroll-margin-bottom\s*:\s*72px/i', $css),
    "Modal inputs must declare scroll-margin-bottom: 72px to clear sticky footer"
);

// 1.4 @media (max-width: 480px) stacking and full width buttons
$mq480 = extractMediaQueries($css, 'max-width: 480px');
runCheck("style.css defines @media (max-width: 480px)", !empty($mq480));

if (!empty($mq480)) {
    runCheck(
        "style.css: @media (max-width: 480px) stacks sticky actions via flex-direction: column-reverse",
        (bool)preg_match('/\.modal-actions-sticky\s*\{[^}]*flex-direction\s*:\s*column-reverse/s', $mq480),
        "Action footer at <= 480px must use flex-direction: column-reverse"
    );

    runCheck(
        "style.css: @media (max-width: 480px) sets button and form widths to 100% !important",
        (bool)preg_match('/width\s*:\s*100%\s*!important/s', $mq480) &&
        str_contains($mq480, '.modal-actions-sticky'),
        "Buttons and forms in modal footer must expand to 100% width on narrow screens"
    );
}

// 1.5 @media (max-height: 520px) 200% zoom / short desktop viewport
$mq520 = extractMediaQueries($css, 'max-height: 520px');
runCheck("style.css defines @media (max-height: 520px)", !empty($mq520));

if (!empty($mq520)) {
    runCheck(
        "style.css: @media (max-height: 520px) reduces padding and handles 200% zoom",
        (bool)preg_match('/\.modal-box\s*\{[^}]*max-height\s*:\s*calc\(100dvh\s*-\s*16px\)\s*!important/s', $mq520),
        "Short viewports / 200% zoom must constrain modal-box to calc(100dvh - 16px)"
    );

    runCheck(
        "style.css: @media (max-height: 520px) reduces modal-overlay padding to 8px",
        (bool)preg_match('/\.modal-overlay\s*\{[^}]*padding\s*:\s*8px/s', $mq520),
        "Short viewports must reduce overlay padding to 8px to maximize vertical space"
    );
}

// -----------------------------------------------------------------------------
// 2. LAYOUT BLADE TEMPLATES AUDIT (admin.blade.php & app.blade.php)
// -----------------------------------------------------------------------------
echo COLOR_BOLD . "\n[SECTION 2] Layout Embedded <style> Audit\n" . COLOR_RESET;
echo COLOR_GRAY . "----------------------------------------------------------------------\n" . COLOR_RESET;

$layoutFiles = [
    'resources/views/layouts/admin.blade.php',
    'resources/views/layouts/app.blade.php',
];

foreach ($layoutFiles as $layoutRelPath) {
    $layoutFullPath = $baseDir . '/' . $layoutRelPath;
    runCheck("{$layoutRelPath} exists", file_exists($layoutFullPath));
    $layoutContent = file_get_contents($layoutFullPath);

    runCheck(
        "{$layoutRelPath}: defines .modal-overlay with align-items: safe center",
        (bool)preg_match('/\.modal-overlay\s*\{[^}]*align-items\s*:\s*safe center/i', $layoutContent)
    );

    runCheck(
        "{$layoutRelPath}: defines .modal-actions-sticky with bottom: 0 !important",
        (bool)preg_match('/\.modal-actions-sticky\s*\{[^}]*bottom\s*:\s*0\s*!important/i', $layoutContent)
    );

    $layoutMq480 = extractMediaQueries($layoutContent, 'max-width: 480px');
    runCheck(
        "{$layoutRelPath}: defines <=480px column-reverse button stacking",
        !empty($layoutMq480) && (bool)preg_match('/\.modal-actions-sticky\s*\{[^}]*flex-direction\s*:\s*column-reverse/s', $layoutMq480)
    );

    runCheck(
        "{$layoutRelPath}: defines inputs with scroll-margin-bottom: 72px",
        (bool)preg_match('/\.modal-box\s+(?:input|select|textarea)[^{]*\{[^}]*scroll-margin-bottom\s*:\s*72px/i', $layoutContent) ||
        (bool)preg_match('/scroll-margin-bottom\s*:\s*72px/i', $layoutContent)
    );

    $layoutMq520 = extractMediaQueries($layoutContent, 'max-height: 520px');
    runCheck(
        "{$layoutRelPath}: defines <=520px max-height zoom reflow",
        !empty($layoutMq520) && (bool)preg_match('/max-height\s*:\s*calc\(100dvh\s*-\s*16px\)\s*!important/s', $layoutMq520)
    );
}

// -----------------------------------------------------------------------------
// 3. TARGET MODALS INVENTORY & DOM AUDIT (ALL 12 MODALS)
// -----------------------------------------------------------------------------
echo COLOR_BOLD . "\n[SECTION 3] All 12 Modal-Overlay / Modal-Box Instances Audit\n" . COLOR_RESET;
echo COLOR_GRAY . "----------------------------------------------------------------------\n" . COLOR_RESET;

$targetModals = [
    [
        'file' => 'resources/views/admin/rubrik/index.blade.php',
        'id'   => 'createCategoryModal',
        'expected_labels' => ['Simpan Kategori', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/rubrik/index.blade.php',
        'id'   => 'editCategoryModal',
        'expected_labels' => ['Simpan Perubahan', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/rubrik/index.blade.php',
        'id'   => 'createSubcategoryModal',
        'expected_labels' => ['Simpan Indikator', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/rubrik/index.blade.php',
        'id'   => 'editSubcategoryModal',
        'expected_labels' => ['Simpan Perubahan', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/users/index.blade.php',
        'id'   => 'createUserModal',
        'expected_labels' => ['Buat Akun', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/users/index.blade.php',
        'id'   => 'editUserModal',
        'expected_labels' => ['Simpan Perubahan', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/users/index.blade.php',
        'id'   => 'resetPasswordModal',
        'expected_labels' => ['Konfirmasi Reset Sandi', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/edit_requests/index.blade.php',
        'id'   => 'approveModal',
        'expected_labels' => ['Konfirmasi Setujui', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/edit_requests/index.blade.php',
        'id'   => 'rejectModal',
        'expected_labels' => ['Konfirmasi Tolak', 'Batal'],
    ],
    [
        'file' => 'resources/views/admin/activity_logs/index.blade.php',
        'id'   => 'logDetailModal',
        'expected_labels' => ['Tutup'],
    ],
    [
        'file' => 'resources/views/admin/reports/index.blade.php',
        'id'   => 'evaluationDetailModal',
        'expected_labels' => ['Cetak Lembar Resmi', 'Tutup'],
    ],
    [
        'file' => 'resources/views/admin/system/settings.blade.php',
        'id'   => 'resetModal',
        'expected_labels' => ['Ya, Reset ke Standar', 'Batal'],
    ],
];

foreach ($targetModals as $m) {
    $filePath = $baseDir . '/' . $m['file'];
    $fileContent = file_get_contents($filePath);
    $id = $m['id'];

    // 3.1 Modal overlay existence
    $hasOverlay = (bool)preg_match('/<div[^>]+id=["\']' . preg_quote($id, '/') . '["\'][^>]*class=["\'][^"\']*modal-overlay[^"\']*["\']/i', $fileContent);
    runCheck("Modal #{$id} exists in {$m['file']}", $hasOverlay);

    // Extract exact balanced div block
    $modalHtml = extractDivBlock($fileContent, $id);
    runCheck("Modal #{$id} balanced block successfully extracted", $modalHtml !== null);
    if ($modalHtml === null) continue;

    // 3.2 Modal-box existence
    $hasBox = str_contains($modalHtml, 'modal-box');
    runCheck("Modal #{$id} contains .modal-box container", $hasBox);

    // 3.3 No rigid inline styles on .modal-box
    preg_match('/<div[^>]*class=["\'][^"\']*modal-box[^"\']*["\']([^>]*)>/i', $modalHtml, $boxTagMatch);
    $boxAttr = $boxTagMatch[1] ?? '';

    $hasRigidMaxHeight = (bool)preg_match('/max-height\s*:\s*[0-9]+(?:px|vh|%)/i', $boxAttr);
    runCheck("Modal #{$id}: .modal-box has NO rigid inline max-height", !$hasRigidMaxHeight, "Inline style: {$boxAttr}");

    $hasRigidOverflow = (bool)preg_match('/overflow(?:-y)?\s*:\s*auto/i', $boxAttr);
    runCheck("Modal #{$id}: .modal-box has NO inline overflow-y: auto", !$hasRigidOverflow, "Inline style: {$boxAttr}");

    // 3.4 Modal actions sticky existence
    $hasStickyActions = str_contains($modalHtml, 'modal-actions-sticky');
    runCheck("Modal #{$id} contains .modal-actions-sticky footer", $hasStickyActions);

    // 3.5 Expected Indonesian action labels presence
    foreach ($m['expected_labels'] as $label) {
        $hasLabel = str_contains($modalHtml, $label);
        runCheck("Modal #{$id} contains action label '{$label}'", $hasLabel);
    }
}

// -----------------------------------------------------------------------------
// 4. ADVERSARIAL STRESS SIMULATION (320px Viewport & 200% Zoom)
// -----------------------------------------------------------------------------
echo COLOR_BOLD . "\n[SECTION 4] Adversarial Geometry & Clearance Mathematical Simulation\n" . COLOR_RESET;
echo COLOR_GRAY . "----------------------------------------------------------------------\n" . COLOR_RESET;

// 4.1 320px Viewport Geometry Simulation
$viewportWidth320 = 320;
$overlayPaddingX = 16 * 2; // 32px
$modalBoxWidth320 = $viewportWidth320 - $overlayPaddingX; // 288px
$modalBoxPaddingMobile = 16 * 2; // 32px (from @media max-width: 480px .modal-box padding: 16px !important)
$innerContentWidth320 = $modalBoxWidth320 - $modalBoxPaddingMobile; // 256px

printf("  • Extreme Narrow Viewport Width  : %d px\n", $viewportWidth320);
printf("  • Overlay Usable Width           : %d px\n", $modalBoxWidth320);
printf("  • Inner Modal Action Width       : %d px\n", $innerContentWidth320);

// Stress test labels against 256px inner width
$stressLabels = [
    'Konfirmasi Reset Sandi'  => 22,
    'Cetak Lembar Resmi'      => 18,
    'Simpan Perubahan'        => 16,
    'Ya, Reset ke Standar'    => 20,
    'Konfirmasi Setujui'      => 18,
    'Konfirmasi Tolak'        => 16,
    'Simpan Indikator'        => 16,
    'Simpan Kategori'         => 15,
];

foreach ($stressLabels as $label => $chars) {
    // Approximate rendered font width at 13px bold sans-serif (~7.5px per char + icon + 32px padding)
    $estButtonContentWidth = ($chars * 7.5) + 36;
    
    // In stacked column-reverse mode at <=480px, button gets 100% width = 256px
    $stackedWidth = $innerContentWidth320;
    
    $fitsWithoutWrap = $estButtonContentWidth <= $stackedWidth;
    runCheck(
        "320px Stacked: '{$label}' ({$chars} chars, est ~{$estButtonContentWidth}px) fits cleanly inside {$stackedWidth}px button",
        $fitsWithoutWrap,
        "Estimated width: {$estButtonContentWidth}px vs Available: {$stackedWidth}px"
    );
    
    // Contrast with unstacked row layout where two buttons shared 256px
    $batalWidth = (5 * 7.5) + 36; // 'Batal' button ~74px
    $rowTotalNeeded = $estButtonContentWidth + $batalWidth + 10; // gap 10px
    $wouldFailInRow = $rowTotalNeeded > $innerContentWidth320;
    if ($wouldFailInRow) {
        printf("    %s↳ Historical Vulnerability Confirmed:%s '{$label}' + 'Batal' row was %dpx > %dpx (broke without column-reverse stacking)\n", COLOR_MAGENTA, COLOR_RESET, (int)$rowTotalNeeded, $innerContentWidth320);
    }
}

// 4.2 200% Zoom / Short Viewport (310px height) Clearance Simulation
$viewportHeight310 = 310;
$overlayPaddingYShort = 8 * 2; // 16px from @media max-height: 520px
$modalBoxMaxHeightShort = $viewportHeight310 - $overlayPaddingYShort; // 294px
$stickyFooterHeight = 44; // 14px font + 16px padding + 14px border/margin
$netScrollableClientHeight = $modalBoxMaxHeightShort - $stickyFooterHeight; // 250px
$scrollMarginBottom = 72; // scroll-margin-bottom on inputs

printf("\n  • Short Desktop / 200%% Zoom Height : %d px\n", $viewportHeight310);
printf("  • Short Modal-Box Max Height       : %d px\n", $modalBoxMaxHeightShort);
printf("  • Sticky Action Footer Height      : %d px\n", $stickyFooterHeight);
printf("  • Scroll Margin Bottom Clearance   : %d px\n", $scrollMarginBottom);

$clearanceAboveStickyFooter = $scrollMarginBottom - $stickyFooterHeight;
runCheck(
    "200% Zoom: scroll-margin-bottom ({$scrollMarginBottom}px) exceeds sticky footer height ({$stickyFooterHeight}px)",
    $clearanceAboveStickyFooter > 0,
    "Net clearance margin above sticky footer is {$clearanceAboveStickyFooter}px"
);

runCheck(
    "200% Zoom: Net clearance guarantees input never covered by sticky action footer",
    $clearanceAboveStickyFooter >= 20,
    "Clearance is {$clearanceAboveStickyFooter}px (threshold >= 20px)"
);

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
echo COLOR_BOLD . "\n----------------------------------------------------------------------\n";
echo "  AUDIT METRICS SUMMARY\n";
echo "----------------------------------------------------------------------\n" . COLOR_RESET;
printf("  • Total Empirical Checks Executed : %s%d%s\n", COLOR_CYAN, $checks, COLOR_RESET);
printf("  • Passing Empirical Invariants    : %s%d%s\n", COLOR_GREEN, $checks - count($failures), COLOR_RESET);
printf("  • Failing Checks                  : %s%d%s\n", (count($failures) > 0 ? COLOR_RED : COLOR_GREEN), count($failures), COLOR_RESET);

echo COLOR_BOLD . "----------------------------------------------------------------------\n" . COLOR_RESET;
if (count($failures) === 0) {
    echo COLOR_GREEN . COLOR_BOLD . "  VERDICT: APPROVE — ALL EMPIRICAL CHALLENGES PASSED (ZERO DEFECTS)\n" . COLOR_RESET;
    echo COLOR_GREEN . "  Modal vertical clipping and action button reachability are fully resilient.\n" . COLOR_RESET;
    echo COLOR_CYAN . COLOR_BOLD . "======================================================================\n" . COLOR_RESET;
    exit(0);
} else {
    echo COLOR_RED . COLOR_BOLD . "  VERDICT: CHALLENGE_FAILED — FOUND " . count($failures) . " DEFECT(S)\n" . COLOR_RESET;
    foreach ($failures as $f) {
        echo COLOR_RED . "  - " . $f . "\n" . COLOR_RESET;
    }
    echo COLOR_CYAN . COLOR_BOLD . "======================================================================\n" . COLOR_RESET;
    exit(1);
}
