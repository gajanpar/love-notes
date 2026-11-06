<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\EvaluationSubcategory;
use App\Services\EvaluationScoringService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Display executive branch performance reports (Monthly & Annual).
     */
    public function index(Request $request): View
    {
        $periodType = $request->get('period_type', 'monthly');
        $year = (int) $request->get('year', 2026);
        $month = (int) $request->get('month', 4); // Default to April 2026 with seeded appraisals
        $divisionId = (string) $request->get('division_id', 'all');

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $divisions = Division::where('is_active', true)->orderBy('id')->get();
        $selectedDivision = $divisionId !== 'all' ? Division::find((int) $divisionId) : null;

        if ($periodType === 'annual') {
            return $this->renderAnnualReport($request, $year, $divisionId, $divisions, $monthNames);
        }

        return $this->renderMonthlyReport($request, $month, $year, $divisionId, $divisions, $monthNames, $selectedDivision);
    }

    /**
     * Show single evaluation detail modal/breakdown with all 17 AKHLAK indicators.
     */
    public function show(int $id)
    {
        $evaluation = Evaluation::with([
            'employee.division',
            'evaluator',
            'details.subcategory.category',
        ])->findOrFail($id);

        $groupedDetails = [];
        foreach ($evaluation->details as $detail) {
            $cat = $detail->subcategory->category;
            $catId = $cat->id;
            if (! isset($groupedDetails[$catId])) {
                $groupedDetails[$catId] = [
                    'category' => $cat,
                    'items' => [],
                ];
            }
            $groupedDetails[$catId]['items'][] = $detail;
        }

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'evaluation' => $evaluation,
                'groupedDetails' => $groupedDetails,
            ]);
        }

        return view('admin.reports.detail', [
            'evaluation' => $evaluation,
            'groupedDetails' => $groupedDetails,
        ]);
    }

    /**
     * Print official individual evaluation form with Pelindo Cirebon letterhead.
     */
    public function printSingle(int $id): View
    {
        $evaluation = Evaluation::with([
            'employee.division',
            'evaluator',
            'details.subcategory.category',
        ])->findOrFail($id);

        $groupedDetails = [];
        foreach ($evaluation->details as $detail) {
            $cat = $detail->subcategory->category;
            $catId = $cat->id;
            if (! isset($groupedDetails[$catId])) {
                $groupedDetails[$catId] = [
                    'category' => $cat,
                    'items' => [],
                ];
            }
            $groupedDetails[$catId]['items'][] = $detail;
        }

        return view('admin.reports.print_single', [
            'evaluation' => $evaluation,
            'groupedDetails' => $groupedDetails,
        ]);
    }

    /**
     * Print official branch summary report (Monthly / Annual) with executive signatures.
     */
    public function printSummary(Request $request): View
    {
        $periodType = $request->get('period_type', 'monthly');
        $year = (int) $request->get('year', 2026);
        $month = (int) $request->get('month', 4);
        $divisionId = (string) $request->get('division_id', 'all');

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $division = $divisionId !== 'all' ? Division::find((int) $divisionId) : null;

        if ($periodType === 'annual') {
            $annualData = $this->computeAnnualData($year, $divisionId);

            return view('admin.reports.print_summary_annual', [
                'year' => $year,
                'division' => $division,
                'annualData' => $annualData,
                'monthNames' => $monthNames,
            ]);
        }

        $query = Evaluation::with(['employee.division', 'evaluator'])
            ->where('period_month', $month)
            ->where('period_year', $year);

        if ($divisionId !== 'all') {
            $query->where('division_id', (int) $divisionId);
        }

        $evaluations = $query->orderByDesc('total_score')->get();

        $metrics = $this->computeMonthlyMetrics($evaluations, $divisionId);

        return view('admin.reports.print_summary', [
            'month' => $month,
            'year' => $year,
            'monthName' => $monthNames[$month] ?? '-',
            'division' => $division,
            'evaluations' => $evaluations,
            'metrics' => $metrics,
        ]);
    }

    /**
     * Secure local CSV/Spreadsheet export (replaces insecure legacy external Google Apps Script).
     * Output includes UTF-8 BOM for seamless rendering in Microsoft Excel and spreadsheet tools.
     */
    public function export(Request $request): StreamedResponse
    {
        $periodType = $request->get('period_type', 'monthly');
        $year = (int) $request->get('year', 2026);
        $month = (int) $request->get('month', 4);
        $divisionId = (string) $request->get('division_id', 'all');

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $subcategories = EvaluationSubcategory::orderBy('order_index')->get();

        $filename = ($periodType === 'annual')
            ? "Laporan_Tahunan_Kinerja_TAD_Pelindo_Cirebon_{$year}.csv"
            : "Laporan_Bulanan_Kinerja_TAD_Pelindo_Cirebon_{$monthNames[$month]}_{$year}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($periodType, $month, $year, $divisionId, $monthNames, $subcategories): void {
            $handle = fopen('php://output', 'w');

            // Defensive security: Sanitize CSV values to prevent CSV Formula Injection (CWE-1236)
            $sanitizeCell = function ($val) {
                if (is_numeric($val) || $val === null) {
                    return $val;
                }
                $str = (string) $val;
                if ($str !== '' && in_array($str[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
                    return "'".$str;
                }

                return $str;
            };

            // Write UTF-8 BOM so Microsoft Excel correctly reads special characters
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Formal Header metadata
            fputcsv($handle, ['PT PELABUHAN INDONESIA (PERSERO) - BRANCH CIREBON']);
            fputcsv($handle, ['SISTEM PENILAIAN KINERJA TENAGA ALIH DAYA (SPKTAD)']);
            if ($periodType === 'annual') {
                fputcsv($handle, ["REKAPITULASI PENILAIAN TAHUNAN - TAHUN {$year}"]);
            } else {
                fputcsv($handle, ["REKAPITULASI PENILAIAN BULANAN - {$monthNames[$month]} {$year}"]);
            }
            fputcsv($handle, ['Tanggal Unduh: '.now()->translatedFormat('d F Y H:i').' WIB']);
            fputcsv($handle, []); // Empty separator line

            if ($periodType === 'annual') {
                $annualData = $this->computeAnnualData($year, $divisionId);

                $columns = ['No', 'NIK', 'Nama Karyawan TAD', 'Divisi Penempatan', 'Jabatan / Posisi', 'Mitra Vendor'];
                for ($m = 1; $m <= 12; $m++) {
                    $columns[] = substr($monthNames[$m], 0, 3);
                }
                $columns[] = 'Bulan Dinilai';
                $columns[] = 'Total Akumulasi';
                $columns[] = 'Rata-Rata Tahunan';
                $columns[] = 'Predikat Akhir';

                fputcsv($handle, $columns);

                foreach ($annualData['rows'] as $idx => $row) {
                    $line = array_map($sanitizeCell, [
                        $idx + 1,
                        $row['employee']->nik,
                        $row['employee']->name,
                        $row['employee']->division->name ?? '-',
                        $row['employee']->position,
                        $row['employee']->vendor_name,
                    ]);

                    for ($m = 1; $m <= 12; $m++) {
                        $line[] = isset($row['monthly_scores'][$m])
                            ? number_format($row['monthly_scores'][$m], 2)
                            : '-';
                    }

                    $line[] = "{$row['evaluated_count']}/12";
                    $line[] = number_format($row['total_score_sum'], 2);
                    $line[] = number_format($row['annual_average'], 2);
                    $line[] = $sanitizeCell($row['predicate']);

                    fputcsv($handle, $line);
                }
            } else {
                $query = Evaluation::with([
                    'employee.division',
                    'evaluator',
                    'details.subcategory',
                ])
                    ->where('period_month', $month)
                    ->where('period_year', $year);

                if ($divisionId !== 'all') {
                    $query->where('division_id', (int) $divisionId);
                }

                $evaluations = $query->orderByDesc('total_score')->get();

                $columns = ['No', 'NIK', 'Nama Karyawan TAD', 'Divisi Penempatan', 'Jabatan', 'Mitra Vendor'];
                foreach ($subcategories as $sub) {
                    $columns[] = "Item #{$sub->order_index} ({$sub->category->name})";
                }
                $columns[] = 'Total Skor (0-100)';
                $columns[] = 'Rata-Rata Rating';
                $columns[] = 'Predikat Kinerja';
                $columns[] = 'Pejabat Penilai';
                $columns[] = 'Tanggal Evaluasi';

                fputcsv($handle, $columns);

                foreach ($evaluations as $idx => $eval) {
                    $detailMap = $eval->details->keyBy('subcategory_id');

                    $line = array_map($sanitizeCell, [
                        $idx + 1,
                        $eval->employee->nik,
                        $eval->employee->name,
                        $eval->employee->division->name ?? '-',
                        $eval->employee->position,
                        $eval->employee->vendor_name,
                    ]);

                    foreach ($subcategories as $sub) {
                        $line[] = isset($detailMap[$sub->id])
                            ? number_format($detailMap[$sub->id]->score, 2)." (R{$detailMap[$sub->id]->rating})"
                            : '-';
                    }

                    $line[] = number_format($eval->total_score, 2);
                    $line[] = number_format($eval->average_score, 2);
                    $line[] = $sanitizeCell($eval->predicate);
                    $line[] = $sanitizeCell($eval->evaluator->name ?? '-');
                    $line[] = $eval->submitted_at ? $eval->submitted_at->format('d/m/Y H:i') : '-';

                    fputcsv($handle, $line);
                }
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Helper to render monthly report view.
     */
    private function renderMonthlyReport(
        Request $request,
        int $month,
        int $year,
        string $divisionId,
        $divisions,
        array $monthNames,
        ?Division $selectedDivision
    ): View {
        $query = Evaluation::with(['employee.division', 'evaluator'])
            ->where('period_month', $month)
            ->where('period_year', $year);

        if ($divisionId !== 'all') {
            $query->where('division_id', (int) $divisionId);
        }

        $evaluations = $query->orderByDesc('total_score')->get();
        $metrics = $this->computeMonthlyMetrics($evaluations, $divisionId);

        // Division comparison
        $divisionComparisons = [];
        foreach ($divisions as $div) {
            $divEvals = Evaluation::where('division_id', $div->id)
                ->where('period_month', $month)
                ->where('period_year', $year)
                ->get();

            $divisionComparisons[] = [
                'division' => $div,
                'count' => $divEvals->count(),
                'avg_score' => $divEvals->count() > 0 ? round($divEvals->avg('total_score'), 2) : 0.0,
                'predicate' => $divEvals->count() > 0 ? EvaluationScoringService::getPredicate($divEvals->avg('total_score')) : 'Belum Ada',
            ];
        }

        return view('admin.reports.index', [
            'periodType' => 'monthly',
            'month' => $month,
            'year' => $year,
            'monthNames' => $monthNames,
            'currentMonthName' => $monthNames[$month] ?? '-',
            'divisionId' => $divisionId,
            'divisions' => $divisions,
            'selectedDivision' => $selectedDivision,
            'evaluations' => $evaluations,
            'metrics' => $metrics,
            'divisionComparisons' => $divisionComparisons,
        ]);
    }

    /**
     * Helper to render annual report view.
     */
    private function renderAnnualReport(
        Request $request,
        int $year,
        string $divisionId,
        $divisions,
        array $monthNames
    ): View {
        $annualData = $this->computeAnnualData($year, $divisionId);

        return view('admin.reports.index', [
            'periodType' => 'annual',
            'month' => 1,
            'year' => $year,
            'monthNames' => $monthNames,
            'currentMonthName' => "Tahun {$year}",
            'divisionId' => $divisionId,
            'divisions' => $divisions,
            'selectedDivision' => $divisionId !== 'all' ? Division::find((int) $divisionId) : null,
            'annualData' => $annualData,
        ]);
    }

    /**
     * Calculate monthly branch metrics.
     */
    private function computeMonthlyMetrics($evaluations, string $divisionId): array
    {
        $targetEmployeeCount = ($divisionId === 'all')
            ? Employee::where('is_active', true)->count()
            : Employee::where('division_id', (int) $divisionId)->where('is_active', true)->count();

        $count = $evaluations->count();
        $averageScore = $count > 0 ? round($evaluations->avg('total_score'), 2) : 0.0;
        $highest = $evaluations->first();
        $lowest = $evaluations->last();
        $completionRate = $targetEmployeeCount > 0 ? round(($count / $targetEmployeeCount) * 100) : 0;

        $predicates = [
            'Sangat Baik' => $evaluations->where('predicate', 'Sangat Baik')->count(),
            'Baik' => $evaluations->where('predicate', 'Baik')->count(),
            'Cukup Baik' => $evaluations->where('predicate', 'Cukup Baik')->count(),
            'Perlu Perhatian' => $evaluations->where('predicate', 'Perlu Perhatian')->count(),
        ];

        return [
            'total_evaluated' => $count,
            'target_employees' => $targetEmployeeCount,
            'completion_rate' => $completionRate,
            'average_score' => $averageScore,
            'branch_predicate' => EvaluationScoringService::getPredicate($averageScore),
            'highest' => $highest,
            'lowest' => $lowest,
            'predicates' => $predicates,
        ];
    }

    /**
     * Calculate annual aggregate data across 12 months for active TAD employees.
     */
    private function computeAnnualData(int $year, string $divisionId): array
    {
        $employeeQuery = Employee::with('division')
            ->where('is_active', true);

        if ($divisionId !== 'all') {
            $employeeQuery->where('division_id', (int) $divisionId);
        }

        $employees = $employeeQuery->orderBy('division_id')->orderBy('name')->get();

        // Get all evaluations for the year
        $evaluations = Evaluation::where('period_year', $year)
            ->get()
            ->groupBy('employee_id');

        $rows = [];
        $totalSum = 0;
        $evaluatedCountTotal = 0;

        $predicateSummary = [
            'Sangat Baik' => 0,
            'Baik' => 0,
            'Cukup Baik' => 0,
            'Perlu Perhatian' => 0,
        ];

        foreach ($employees as $emp) {
            $empEvals = $evaluations->get($emp->id, collect());
            $monthlyScores = [];
            $sum = 0;

            foreach ($empEvals as $ev) {
                $monthlyScores[$ev->period_month] = (float) $ev->total_score;
                $sum += (float) $ev->total_score;
            }

            $count = count($monthlyScores);
            $annualAvg = $count > 0 ? round($sum / $count, 2) : 0.0;
            $predicate = $count > 0 ? EvaluationScoringService::getPredicate($annualAvg) : 'Belum Ada';

            if ($count > 0 && isset($predicateSummary[$predicate])) {
                $predicateSummary[$predicate]++;
                $totalSum += $annualAvg;
                $evaluatedCountTotal++;
            }

            $rows[] = [
                'employee' => $emp,
                'monthly_scores' => $monthlyScores,
                'evaluated_count' => $count,
                'total_score_sum' => round($sum, 2),
                'annual_average' => $annualAvg,
                'predicate' => $predicate,
            ];
        }

        // Sort rows by annual average descending
        usort($rows, function ($a, $b) {
            return $b['annual_average'] <=> $a['annual_average'];
        });

        $grandAverage = $evaluatedCountTotal > 0 ? round($totalSum / $evaluatedCountTotal, 2) : 0.0;

        return [
            'rows' => $rows,
            'total_employees' => $employees->count(),
            'evaluated_employees' => $evaluatedCountTotal,
            'grand_average' => $grandAverage,
            'grand_predicate' => EvaluationScoringService::getPredicate($grandAverage),
            'predicate_summary' => $predicateSummary,
        ];
    }
}
