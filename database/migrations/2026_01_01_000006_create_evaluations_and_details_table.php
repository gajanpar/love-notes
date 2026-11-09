<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('division_id')->constrained('divisions')->onDelete('restrict');
            $table->unsignedTinyInteger('period_month');
            $table->unsignedSmallInteger('period_year');
            $table->decimal('total_score', 6, 2)->default(0.00);
            $table->decimal('average_score', 5, 2)->default(0.00);
            $table->string('predicate', 50)->default('Cukup');
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'submitted'])->default('submitted');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'period_month', 'period_year'], 'uniq_emp_period');
            $table->index(['division_id', 'period_year', 'period_month'], 'idx_div_period_eval');
            $table->index(['user_id', 'period_year', 'period_month'], 'idx_user_period_eval');
        });

        Schema::create('evaluation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_id')->constrained('evaluations')->onDelete('cascade');
            $table->foreignId('subcategory_id')->constrained('evaluation_subcategories')->onDelete('restrict');
            $table->unsignedTinyInteger('rating')->default(1);
            $table->decimal('score', 5, 2)->default(0.98);
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->unique(['evaluation_id', 'subcategory_id'], 'uniq_eval_subcat');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluation_details');
        Schema::dropIfExists('evaluations');
    }
};
