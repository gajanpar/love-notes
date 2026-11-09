<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluationDetail extends Model
{
    protected $fillable = [
        'evaluation_id',
        'subcategory_id',
        'rating',
        'score',
        'reason',
    ];

    protected $casts = [
        'rating' => 'integer',
        'score' => 'float',
    ];

    public function evaluation(): BelongsTo
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(EvaluationSubcategory::class, 'subcategory_id');
    }
}
