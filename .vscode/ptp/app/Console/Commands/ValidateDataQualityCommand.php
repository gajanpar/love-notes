<?php

namespace App\Console\Commands;

use App\Services\DataQualityService;
use Illuminate\Console\Command;

class ValidateDataQualityCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ptp:data-quality {--json : Tampilkan output dalam format JSON standar CI/CD}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memeriksa dan memvalidasi kualitas, kelengkapan, keunikan, serta integritas relasional basis data SPKTAD';

    /**
     * Execute the console command.
     */
    public function handle(DataQualityService $service): int
    {
        $audit = $service->auditAll();

        if ($this->option('json')) {
            $this->line(json_encode($audit, JSON_PRETTY_PRINT));

            return $audit['is_production_ready'] ? Command::SUCCESS : Command::FAILURE;
        }

        $this->newLine();
        $this->line('<fg=cyan;options=bold>====================================================================</>');
        $this->line('<fg=cyan;options=bold>  PT PELINDO MULTI TERMINAL BRANCH CIREBON - DATA QUALITY AUDIT      </>');
        $this->line('<fg=cyan;options=bold>====================================================================</>');
        $this->newLine();

        $rows = [];
        foreach ($audit['checks'] as $dimKey => $dimension) {
            foreach ($dimension['rules'] as $rule) {
                $statusColor = $rule['passed'] ? 'green' : ($rule['severity'] === 'CRITICAL' ? 'red' : 'yellow');
                $statusText = $rule['passed'] ? 'PASSED' : 'FLAGGED';

                $rows[] = [
                    strtoupper($dimKey),
                    $rule['name'],
                    "<fg={$statusColor};options=bold>{$statusText}</>",
                    $rule['severity'],
                    $rule['description'],
                ];
            }
        }

        $this->table(['Dimensi', 'Aturan / Pemeriksaan', 'Status', 'Tingkat', 'Keterangan Temuan'], $rows);

        $this->newLine();
        $scoreColor = $audit['health_score'] >= 90 ? 'green' : 'yellow';
        $this->line("Skor Kualitas Data (Health Score) : <fg={$scoreColor};options=bold>{$audit['health_score']}% ({$audit['summary_status']})</>");
        $this->line('Kesiapan Implementasi Produksi   : '.($audit['is_production_ready'] ? '<fg=green;options=bold>SIAP (PRODUCTION READY)</>' : '<fg=red;options=bold>PERLU PERBAIKAN</>'));
        $this->newLine();

        return $audit['is_production_ready'] ? Command::SUCCESS : Command::FAILURE;
    }
}
