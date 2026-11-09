<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluation_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        Schema::create('evaluation_subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('evaluation_categories')->onDelete('restrict');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->text('default_reason')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'order_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluation_subcategories');
        Schema::dropIfExists('evaluation_categories');
    }
};
