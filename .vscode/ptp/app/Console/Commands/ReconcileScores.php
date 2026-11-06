<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\Evaluation;
use App\Services\EvaluationScoringService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('ptp:reconcile-scores {--dry-run : Simulate reconciliation without database updates}')]
#[Description('Reconcile and sanitize evaluation scores to eliminate legacy rating 2 drift and ensure 100% mathematical precision')]
class ReconcileScores extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        $this->info('Memulai verifikasi dan rekonsiliasi data skor penilaian TAD...');
        if ($isDryRun) {
            $this->warn('[DRY-RUN MODE] Tidak ada perubahan yang disimpan ke basis data.');
        }

        $evaluations = Evaluation::with(['employee', 'details'])->get();
        $totalChecked = $evaluations->count();
        $updatedCount = 0;
        $fixedDetailsCount = 0;

        $discrepancies = [];

        foreach ($evaluations as $eval) {
            $sumScore = 0.0;
            $hasDetailChange = false;

            foreach ($eval->details as $det) {
                $expectedScore = EvaluationScoringService::getRatingScore((int) $det->rating);
                if (abs((float) $det->score - $expectedScore) > 0.001) {
                    $fixedDetailsCount++;
                    $hasDetailChange = true;
                    if (! $isDryRun) {
                        $det->update(['score' => $expectedScore]);
                    }
                }
                $sumScore += $expectedScore;
            }

            $computedTotal = round($sumScore, 2);
            $computedAvg = round($computedTotal / max(1, $eval->details->count()), 2);
            $computedPredicate = EvaluationScoringService::getPredicate($computedTotal);

            $needsUpdate = false;
            $diffs = [];

            if (abs((float) $eval->total_score - $computedTotal) > 0.001) {
                $diffs['total_score'] = ['old' => (float) $eval->total_score, 'new' => $computedTotal];
                $needsUpdate = true;
            }

            if ($eval->predicate !== $computedPredicate) {
                $diffs['predicate'] = ['old' => $eval->predicate, 'new' => $computedPredicate];
                $needsUpdate = true;
            }

            if ($needsUpdate || $hasDetailChange) {
                $updatedCount++;
                $discrepancies[] = [
                    'ID: '.$eval->id,
                    $eval->employee->name ?? 'TAD #'.$eval->employee_id,
                    "Bulan {$eval->period_month}/{$eval->period_year}",
                    $eval->total_score.' -> '.$computedTotal,
                    $eval->predicate.' -> '.$computedPredicate,
                ];

                if (! $isDryRun) {
                    DB::transaction(function () use ($eval, $computedTotal, $computedAvg, $computedPredicate, $diffs) {
                        $eval->update([
                            'total_score' => $computedTotal,
                            'average_score' => $computedAvg,
                            'predicate' => $computedPredicate,
                        ]);

                        ActivityLog::record(
                            'evaluation.reconciled',
                            "Rekonsiliasi otomatis data evaluasi TAD #{$eval->employee_id} ({$eval->employee?->name}) periode {$eval->period_month}/{$eval->period_year}",
                            'Evaluation',
                            $eval->id,
                            [
                                'diffs' => $diffs,
                                'source' => 'reconcile_command',
                            ]
                        );
                    });
                }
            }
        }

        if (! empty($discrepancies)) {
            $this->table(
                ['Eval ID', 'Nama Personel', 'Periode', 'Total Skor (Old -> New)', 'Predikat (Old -> New)'],
                $discrepancies
            );
        }

        $this->info('Rekonsiliasi selesai.');
        $this->line("Total Evaluasi Diperiksa: {$totalChecked}");
        $this->line("Detail Butir Dikoreksi: {$fixedDetailsCount}");
        $this->line("Header Evaluasi Diperbarui: {$updatedCount}");

        return 0;
    }
}
