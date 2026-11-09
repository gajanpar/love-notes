<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Evaluation;
use App\Models\EvaluationCategory;
use App\Models\EvaluationDetail;
use App\Models\PeriodManagement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $divisionId = $user->division_id;

        $month = (int) $request->get('month', 5);
        $year = (int) $request->get('year', 2026);

        // Karyawan di divisi penilai
        $employeesQuery = Employee::where('is_active', true);
        if ($divisionId) {
            $employeesQuery->where('division_id', $divisionId);
        }
        $totalEmployees = $employeesQuery->count();

        // Karyawan yang sudah dinilai pada periode terpilih
        $evaluationsQuery = Evaluation::with(['employee.division'])
            ->where('period_month', $month)
            ->where('period_year', $year);

        if ($divisionId) {
            $evaluationsQuery->where('division_id', $divisionId);
        }

        $evaluations = $evaluationsQuery->get();
        $evaluatedEmployeeIds = $evaluations->pluck('employee_id')->toArray();
        $totalEvaluated = count(array_unique($evaluatedEmployeeIds));
        $totalPending = max(0, $totalEmployees - $totalEvaluated);

        $progressPercentage = $totalEmployees > 0
            ? round(($totalEvaluated / $totalEmployees) * 100)
            : 0;

        $periodStatus = $divisionId
            ? PeriodManagement::getStatus($divisionId, $month, $year)
            : 'open';

        $systemStatus = $progressPercentage >= 100 ? 'Selesai' : 'Dalam Proses';
        if ($periodStatus === 'closed') {
            $systemStatus = 'Periode Ditutup';
        }

        // Rata-rata skor divisi
        $averageScore = $totalEvaluated > 0 ? round($evaluations->avg('total_score'), 1) : 0;

        // Distribusi predikat di divisi ini
        $predicateCounts = [
            'Sangat Baik' => $evaluations->where('predicate', 'Sangat Baik')->count(),
            'Baik' => $evaluations->where('predicate', 'Baik')->count(),
            'Cukup Baik' => $evaluations->where('predicate', 'Cukup Baik')->count(),
            'Perlu Perhatian' => $evaluations->where('predicate', 'Perlu Perhatian')->count(),
        ];

        // 1. Diagnostik 6 Nilai Inti AKHLAK Divisi Ini
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

        // 2. Top & Bottom Performers di Divisi Ini
        $topPerformers = $evaluations->sortByDesc('total_score')->take(5)->values();
        $bottomPerformers = $evaluations->sortBy('total_score')->take(5)->values();

        // 3. Countdown SLA Gembok (Pengingat Tegas Penilai)
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $cutoffDate = Carbon::create($year, $month, 25, 23, 59, 59);
        $now = Carbon::now();
        $isCutoffPassed = $now->greaterThan($cutoffDate);
        $slaDaysRemaining = $isCutoffPassed ? 0 : max(0, (int) $now->diffInDays($cutoffDate, false));

        // 5. Tren Nilai Antar-Bulan Divisi (MoM)
        $prevMonth = $month == 1 ? 12 : $month - 1;
        $prevYear = $month == 1 ? $year - 1 : $year;
        $prevDivQuery = Evaluation::where('period_month', $prevMonth)->where('period_year', $prevYear);
        if ($divisionId) {
            $prevDivQuery->where('division_id', $divisionId);
        }
        $prevDivAvg = $prevDivQuery->avg('total_score');

        $momDelta = ($averageScore > 0 && $prevDivAvg) ? round($averageScore - $prevDivAvg, 1) : null;
        $prevMonthName = $monthNames[$prevMonth] ?? '-';

        // Antrian Prioritas TAD yang Belum Dinilai
        $pendingEmployees = Employee::where('is_active', true)
            ->when($divisionId, fn($q) => $q->where('division_id', $divisionId))
            ->whereNotIn('id', $evaluatedEmployeeIds)
            ->orderBy('name', 'asc')
            ->take(5)
            ->get();

        // Evaluasi Terbaru yang telah selesai
        $recentEvaluated = Evaluation::with('employee')
            ->where('period_month', $month)
            ->where('period_year', $year)
            ->when($divisionId, fn($q) => $q->where('division_id', $divisionId))
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        return view('user.dashboard', [
            'user' => $user,
            'division' => $user->division,
            'month' => $month,
            'year' => $year,
            'monthName' => $monthNames[$month] ?? '-',
            'totalEmployees' => $totalEmployees,
            'totalPending' => $totalPending,
            'totalEvaluated' => $totalEvaluated,
            'progressPercentage' => $progressPercentage,
            'periodStatus' => $periodStatus,
            'systemStatus' => $systemStatus,
            'averageScore' => $averageScore,
            'predicateCounts' => $predicateCounts,
            'pendingEmployees' => $pendingEmployees,
            'recentEvaluated' => $recentEvaluated,

            // Data Matriks Baru
            'akhlakStats' => $akhlakStats,
            'weakestPillar' => $weakestPillar,
            'strongestPillar' => $strongestPillar,
            'topPerformers' => $topPerformers,
            'bottomPerformers' => $bottomPerformers,
            'slaCutoffDate' => '25 ' . ($monthNames[$month] ?? '-') . ' ' . $year . ', 23:59 WIB',
            'slaDaysRemaining' => $slaDaysRemaining,
            'isCutoffPassed' => $isCutoffPassed,
            'momDelta' => $momDelta,
            'prevMonthName' => $prevMonthName,
        ]);
    }
}
