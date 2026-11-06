<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('division_id')->constrained('divisions')->onDelete('restrict');
            $table->string('nik', 50)->nullable();
            $table->string('name', 100);
            $table->string('position', 100)->nullable();
            $table->string('vendor_name', 100)->default('PT Pelindo Daya Sejahtera');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['division_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
