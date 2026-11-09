<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('period_management', function (Blueprint $table) {
            $table->id();
            $table->foreignId('division_id')->constrained('divisions')->onDelete('restrict');
            $table->unsignedTinyInteger('period_month');
            $table->unsignedSmallInteger('period_year');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['division_id', 'period_month', 'period_year'], 'uniq_div_period');
            $table->index(['period_year', 'period_month', 'division_id'], 'idx_period_lookup');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('period_management');
    }
};
