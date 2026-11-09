<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\EditRequest;
use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\EvaluationCategory;
use App\Models\EvaluationDetail;
use App\Models\PeriodManagement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $month = (int) $request->get('month', 5);
        $year = (int) $request->get('year', 2026);

        // Metrik Global Cabang
        $totalEmployees = Employee::where('is_active', true)->count();
        $totalDivisions = Division::where('is_active', true)->count();
        $totalPenilai = User::where('role', 'kepala_divisi')->where('is_active', true)->count();
        $pendingRequestsCount = EditRequest::where('status', 'pending')->count();

        // Evaluasi Cabang di Periode Ini
        $evaluations = Evaluation::with(['employee.division'])
            ->where('period_month', $month)
            ->where('period_year', $year)
            ->get();

        $totalEvaluated = $evaluations->count();
        $totalPending = max(0, $totalEmployees - $totalEvaluated);
        $branchProgress = $totalEmployees > 0
            ? round(($totalEvaluated / $totalEmployees) * 100)
            : 0;

        // Metrik Statistik Lanjutan (Information Richness)
        $averageScore = $totalEvaluated > 0 ? round($evaluations->avg('total_score'), 1) : 0;
        $highestScore = $totalEvaluated > 0 ? round($evaluations->max('total_score'), 1) : 0;
        $lowestScore = $totalEvaluated > 0 ? round($evaluations->min('total_score'), 1) : 0;

        // Predikat Rata-Rata Cabang
        $averagePredicate = 'Belum Ada Data';
        if ($averageScore >= 85.0) {
            $averagePredicate = 'Sangat Baik';
        } elseif ($averageScore >= 70.0) {
            $averagePredicate = 'Baik';
        } elseif ($averageScore >= 55.0) {
            $averagePredicate = 'Cukup Baik';
        } elseif ($averageScore > 0) {
            $averagePredicate = 'Perlu Perhatian';
        }

        // Distribusi Predikat & Persentase
        $predicateCounts = [
            'Sangat Baik' => $evaluations->where('predicate', 'Sangat Baik')->count(),
            'Baik' => $evaluations->where('predicate', 'Baik')->count(),
            'Cukup Baik' => $evaluations->where('predicate', 'Cukup Baik')->count(),
            'Perlu Perhatian' => $evaluations->where('predicate', 'Perlu Perhatian')->count(),
        ];

        $predicatePercentages = [];
        foreach ($predicateCounts as $key => $cnt) {
            $predicatePercentages[$key] = $totalEvaluated > 0 ? round(($cnt / $totalEvaluated) * 100, 1) : 0;
        }

        // 1. Diagnostik 6 Nilai Inti AKHLAK Cabang
        $evalIds = $evaluations->pluck('id');
        $akhlakStats = [];
        $akhlakCategories = EvaluationCategory::whereIn('name', ['Amanah', 'Kompeten', 'Harmonis', 'Loyal', 'Adaptif', 'Kolaboratif'])
            ->with('subcategories')
            ->orderBy('order_index')
            ->get();

        foreach ($akhlakCategories as $cat) {
            $subIds = $cat->subcategories->pluck('id');
            $avgScore = $evalIds->isNotEmpty()
                ? EvaluationDetail::whereIn('evaluation_id', $evalIds)->whereIn('subcategory_id', $subIds)->avg('score')
                : null;

            // Normalized to 100% (max 5.88)
            $normalizedScore = $avgScore ? round(($avgScore / 5.88) * 100, 1) : 0;
            $akhlakStats[$cat->name] = [
                'name' => $cat->name,
                'raw_avg' => $avgScore ? round((float)$avgScore, 2) : 0,
                'score_100' => $normalizedScore,
            ];
        }

        $weakestPillar = null;
        $strongestPillar = null;
        if ($totalEvaluated > 0 && !empty($akhlakStats)) {
            $scores = array_column($akhlakStats, 'score_100', 'name');
            asort($scores);
            $weakestPillar = [
                'name' => array_key_first($scores),
                'score' => reset($scores),
            ];
            $strongestPillar = [
                'name' => array_key_last($scores),
                'score' => end($scores),
            ];
        }

        // 2. Top 5 & Bottom 5 Performers Cabang
        $topPerformers = $evaluations->sortByDesc('total_score')->take(5)->values();
        $bottomPerformers = $evaluations->sortBy('total_score')->take(5)->values();

        // 3. Countdown SLA Gembok (Cutoff tgl 25)
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $cutoffDate = Carbon::create($year, $month, 25, 23, 59, 59);
        $now = Carbon::now();
        $isCutoffPassed = $now->greaterThan($cutoffDate);
        $slaDaysRemaining = $isCutoffPassed ? 0 : max(0, (int) $now->diffInDays($cutoffDate, false));

        // 4. Rekomendasi Kontrak PDS (PT Pelindo Daya Sejahtera)
        $contractRecommendations = [
            'perpanjang' => $evaluations->where('total_score', '>=', 80.0)->count(),
            'bersyarat' => $evaluations->whereBetween('total_score', [70.0, 79.99])->count(),
            'evaluasi' => $evaluations->where('total_score', '<', 70.0)->count(),
        ];

        // 5. Tren Nilai Antar-Bulan (Month-over-Month MoM)
        $prevMonth = $month == 1 ? 12 : $month - 1;
        $prevYear = $month == 1 ? $year - 1 : $year;
        $prevAvg = Evaluation::where('period_month', $prevMonth)
            ->where('period_year', $prevYear)
            ->avg('total_score');

        $momDelta = ($averageScore > 0 && $prevAvg) ? round($averageScore - $prevAvg, 1) : null;
        $prevMonthName = $monthNames[$prevMonth] ?? '-';

        // Ringkasan per Divisi
        $divisions = Division::where('is_active', true)->withCount(['employees' => function ($q) {
            $q->where('is_active', true);
        }])->get();

        $divisionStats = [];
        $lockedDivisionsCount = 0;

        foreach ($divisions as $div) {
            $divEvals = Evaluation::where('division_id', $div->id)
                ->where('period_month', $month)
                ->where('period_year', $year)
                ->get();

            $evalCount = $divEvals->count();
            $status = PeriodManagement::getStatus($div->id, $month, $year);
            if ($status === 'closed') {
                $lockedDivisionsCount++;
            }

            $divAvgScore = $evalCount > 0 ? round($divEvals->avg('total_score'), 1) : 0;

            $divisionStats[] = [
                'division' => $div,
                'total_employees' => $div->employees_count,
                'evaluated_count' => $evalCount,
                'pending_count' => max(0, $div->employees_count - $evalCount),
                'progress' => $div->employees_count > 0 ? round(($evalCount / $div->employees_count) * 100) : 0,
                'average_score' => $divAvgScore,
                'status' => $status,
            ];
        }

        // Permohonan Akses Terbaru
        $recentRequests = EditRequest::with(['requester', 'division', 'employee'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return view('admin.dashboard', [
            'user' => Auth::user(),
            'month' => $month,
            'year' => $year,
            'monthName' => $monthNames[$month] ?? '-',
            'totalEmployees' => $totalEmployees,
            'totalDivisions' => $totalDivisions,
            'totalPenilai' => $totalPenilai,
            'pendingRequestsCount' => $pendingRequestsCount,
            'totalEvaluated' => $totalEvaluated,
            'totalPending' => $totalPending,
            'branchProgress' => $branchProgress,
            'averageScore' => $averageScore,
            'highestScore' => $highestScore,
            'lowestScore' => $lowestScore,
            'averagePredicate' => $averagePredicate,
            'predicateCounts' => $predicateCounts,
            'predicatePercentages' => $predicatePercentages,
            'divisionStats' => $divisionStats,
            'lockedDivisionsCount' => $lockedDivisionsCount,
            'recentRequests' => $recentRequests,

            // 5 Matriks Data Strategis
            'akhlakStats' => $akhlakStats,
            'weakestPillar' => $weakestPillar,
            'strongestPillar' => $strongestPillar,
            'topPerformers' => $topPerformers,
            'bottomPerformers' => $bottomPerformers,
            'slaCutoffDate' => '25 ' . ($monthNames[$month] ?? '-') . ' ' . $year . ', 23:59 WIB',
            'slaDaysRemaining' => $slaDaysRemaining,
            'isCutoffPassed' => $isCutoffPassed,
            'contractRecommendations' => $contractRecommendations,
            'momDelta' => $momDelta,
            'prevMonthName' => $prevMonthName,
        ]);
    }
}
