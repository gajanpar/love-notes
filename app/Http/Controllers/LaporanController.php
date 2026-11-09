<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $divisionId = $user->division_id;

        $month = (int) $request->get('month', 4); // default April 2026 yang sudah ada 3 evaluasi di seeder
        $year = (int) $request->get('year', 2026);

        $evaluations = Evaluation::with(['employee', 'evaluator'])
            ->where('period_month', $month)
            ->where('period_year', $year)
            ->when($divisionId, function ($query, $divId) {
                return $query->where('division_id', $divId);
            })
            ->orderBy('total_score', 'desc')
            ->get();

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return view('user.laporan.index', [
            'month' => $month,
            'year' => $year,
            'monthNames' => $monthNames,
            'evaluations' => $evaluations,
            'totalEvaluations' => $evaluations->count(),
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $divisionId = $user->division_id;

        $evaluation = Evaluation::with(['employee', 'evaluator', 'details.subcategory.category'])
            ->findOrFail($id);

        if ($divisionId && $evaluation->division_id !== $divisionId) {
            abort(403, 'Anda tidak berhak melihat data divisi lain.');
        }

        // Kelompokkan details berdasarkan kategori
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

        return view('user.laporan.detail', [
            'evaluation' => $evaluation,
            'groupedDetails' => $groupedDetails,
        ]);
    }

    public function print($id)
    {
        $user = Auth::user();
        $divisionId = $user->division_id;

        $evaluation = Evaluation::with(['employee', 'evaluator', 'details.subcategory.category'])
            ->findOrFail($id);

        if ($divisionId && $evaluation->division_id !== $divisionId) {
            abort(403);
        }

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

        return view('user.laporan.print', [
            'evaluation' => $evaluation,
            'groupedDetails' => $groupedDetails,
        ]);
    }
}
