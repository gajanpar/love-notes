<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeriodManagement extends Model
{
    protected $table = 'period_management';

    protected $fillable = [
        'division_id',
        'period_month',
        'period_year',
        'status',
        'updated_by',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function getStatus(int $divisionId, int $month, int $year): string
    {
        $record = self::where('division_id', $divisionId)
            ->where('period_month', $month)
            ->where('period_year', $year)
            ->first();

        if ($record) {
            return $record->status;
        }

        // Default: bulan & tahun sekarang adalah open, selain itu closed
        $currentMonth = (int) date('n');
        $currentYear = (int) date('Y');

        return ($month === $currentMonth && $year === $currentYear) ? 'open' : 'closed';
    }

    public static function setStatus(int $divisionId, int $month, int $year, string $status, ?int $updatedBy = null): self
    {
        return self::updateOrCreate(
            [
                'division_id' => $divisionId,
                'period_month' => $month,
                'period_year' => $year,
            ],
            [
                'status' => $status,
                'updated_by' => $updatedBy,
            ]
        );
    }

    public static function isOpen(int $divisionId, int $month, int $year): bool
    {
        return self::getStatus($divisionId, $month, $year) === 'open';
    }
}
