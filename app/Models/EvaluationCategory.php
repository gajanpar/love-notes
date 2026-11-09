<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'order_index',
    ];

    public function subcategories(): HasMany
    {
        return $this->hasMany(EvaluationSubcategory::class, 'category_id')->orderBy('order_index');
    }
}
