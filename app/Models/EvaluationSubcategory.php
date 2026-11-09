<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationSubcategory extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'default_reason',
        'order_index',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(EvaluationCategory::class, 'category_id');
    }

    public function evaluationDetails(): HasMany
    {
        return $this->hasMany(EvaluationDetail::class, 'subcategory_id');
    }
}
