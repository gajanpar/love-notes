<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

#[Signature('app:run-benchmark')]
#[Description('Execute full-stack empirical performance & query benchmarks across all modules')]
class RunBenchmark extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(Kernel $kernel): int
    {
        $this->info('Memulai pengujian empiris performa website SPKTAD PTP Cirebon...');

        $admin = User::where('username', 'admin')->first();
        $penilai = User::where('username', 'rudy')->first();

        $unevaluatedEmp = Employee::where('division_id', 5)
            ->whereDoesntHave('evaluations', fn ($q) => $q->where('period_month', 5)->where('period_year', 2026))
            ->first();
        $sampleEmpId = $unevaluatedEmp ? $unevaluatedEmp->id : 15;

        $benchmarks = [
            ['name' => '1. Login Page (Public)', 'method' => 'GET', 'uri' => '/login', 'user' => null],
            ['name' => '2. Captcha SVG Image', 'method' => 'GET', 'uri' => '/captcha-image', 'user' => null],
            ['name' => '3. User Dashboard', 'method' => 'GET', 'uri' => '/dashboard', 'user' => $penilai],
            ['name' => '4. Daftar Penilaian TAD (35 Personel)', 'method' => 'GET', 'uri' => '/penilaian?month=5&year=2026', 'user' => $penilai],
            ['name' => '5. Form Penilaian (17 Indikator AKHLAK)', 'method' => 'GET', 'uri' => "/penilaian/create?employee_id={$sampleEmpId}&month=5&year=2026", 'user' => $penilai],
            ['name' => '6. Rekap Laporan Penilai', 'method' => 'GET', 'uri' => '/laporan?month=4&year=2026', 'user' => $penilai],
            ['name' => '7. Detail Penilaian (User)', 'method' => 'GET', 'uri' => '/laporan/detail/1', 'user' => $penilai],
            ['name' => '8. Cetak Lembar Individual (Kop Pelindo)', 'method' => 'GET', 'uri' => '/laporan/print/1', 'user' => $penilai],
            ['name' => '9. Admin Dashboard (Metrik Cabang)', 'method' => 'GET', 'uri' => '/admin/dashboard', 'user' => $admin],
            ['name' => '10. Admin Kelola Periode (Matriks 12 Bln)', 'method' => 'GET', 'uri' => '/admin/periods', 'user' => $admin],
            ['name' => '11. Admin Approval Pengajuan Akses/Edit', 'method' => 'GET', 'uri' => '/admin/requests', 'user' => $admin],
            ['name' => '12. Admin Master Personel TAD', 'method' => 'GET', 'uri' => '/admin/employees', 'user' => $admin],
            ['name' => '13. Admin Master Akun Pengguna', 'method' => 'GET', 'uri' => '/admin/users', 'user' => $admin],
            ['name' => '14. Admin Master Rubrik AKHLAK', 'method' => 'GET', 'uri' => '/admin/rubrik', 'user' => $admin],
            ['name' => '15. Admin Laporan Eksekutif Bulanan', 'method' => 'GET', 'uri' => '/admin/reports?period_type=monthly&year=2026&month=4', 'user' => $admin],
            ['name' => '16. Admin Laporan Akumulasi 12 Bulan', 'method' => 'GET', 'uri' => '/admin/reports?period_type=annual&year=2026', 'user' => $admin],
            ['name' => '17. Admin Cetak Rekap Bulanan Resmi', 'method' => 'GET', 'uri' => '/admin/reports/print-summary?period_type=monthly&year=2026&month=4', 'user' => $admin],
            ['name' => '18. Admin Cetak Rekap Tahunan Landscape', 'method' => 'GET', 'uri' => '/admin/reports/print-summary?period_type=annual&year=2026', 'user' => $admin],
            ['name' => '19. Admin Streaming CSV Export (BOM)', 'method' => 'GET', 'uri' => '/admin/reports/export?period_type=monthly&year=2026&month=4', 'user' => $admin],
        ];

        $tableData = [];
        $jsonData = [];

        foreach ($benchmarks as $bm) {
            $times = [];
            $queryCount = 0;
            $statusCode = 0;
            $bytes = 0;

            for ($i = 0; $i < 3; $i++) {
                if ($bm['user']) {
                    Auth::login($bm['user']);
                } else {
                    Auth::logout();
                }

                DB::flushQueryLog();
                DB::enableQueryLog();

                $start = microtime(true);

                $request = Request::create($bm['uri'], $bm['method']);
                if ($bm['user']) {
                    $request->setUserResolver(fn () => $bm['user']);
                }

                $response = $kernel->handle($request);

                $elapsed = (microtime(true) - $start) * 1000;
                $times[] = $elapsed;

                if ($i === 0) {
                    $statusCode = $response->getStatusCode();
                    $queryCount = count(DB::getQueryLog());
                    $content = $response->getContent();
                    $bytes = strlen($content ?: '');
                }

                $kernel->terminate($request, $response);
            }

            sort($times);
            $minMs = round($times[0], 2);
            $avgMs = round(array_sum($times) / count($times), 2);
            $maxMs = round($times[count($times) - 1], 2);

            $tableData[] = [
                $bm['name'],
                $statusCode,
                $minMs.' ms',
                $avgMs.' ms',
                $maxMs.' ms',
                $queryCount.' Qs',
                number_format($bytes).' B',
            ];

            $jsonData[] = [
                'name' => $bm['name'],
                'uri' => $bm['uri'],
                'status' => $statusCode,
                'min_ms' => $minMs,
                'avg_ms' => $avgMs,
                'max_ms' => $maxMs,
                'queries' => $queryCount,
                'bytes' => $bytes,
            ];
        }

        $this->table(
            ['Modul / Endpoint', 'Status', 'Min Latency', 'Avg Latency', 'Max Latency', 'SQL Queries', 'Payload Size'],
            $tableData
        );

        $this->info('--- JSON BENCHMARK SUMMARY ---');
        $this->line(json_encode($jsonData));

        return 0;
    }
}
