<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EvaluationCategory;
use App\Models\EvaluationSubcategory;
use App\Services\EvaluationScoringService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RubrikController extends Controller
{
    /**
     * Display the standardized AKHLAK, 5S, and Discipline evaluation rubric.
     */
    public function index(): View
    {
        $categories = EvaluationCategory::with([
            'subcategories' => function ($query): void {
                $query->withCount('evaluationDetails')->orderBy('order_index');
            },
        ])
            ->withCount('subcategories')
            ->orderBy('order_index')
            ->get();

        $totalCategories = $categories->count();
        $totalSubcategories = $categories->sum('subcategories_count');
        $ratingOptions = EvaluationScoringService::getRatingOptions();
        $maxScorePerItem = EvaluationScoringService::getRatingScore(6);
        $maxTotalScore = round($totalSubcategories * $maxScorePerItem, 2);

        return view('admin.rubrik.index', [
            'categories' => $categories,
            'totalCategories' => $totalCategories,
            'totalSubcategories' => $totalSubcategories,
            'ratingOptions' => $ratingOptions,
            'maxScorePerItem' => $maxScorePerItem,
            'maxTotalScore' => $maxTotalScore,
        ]);
    }

    /**
     * Create a new rubric category.
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:evaluation_categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'order_index' => ['nullable', 'integer', 'min:1', 'max:999'],
        ], [
            'name.unique' => 'Nama kategori penilaian tersebut sudah terdaftar.',
        ]);

        $nextOrder = $validated['order_index'] ?? ((int) EvaluationCategory::max('order_index') + 1);

        $category = EvaluationCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'order_index' => $nextOrder,
        ]);

        return back()->with('success', "Kategori rubrik '{$category->name}' berhasil ditambahkan.");
    }

    /**
     * Update an existing rubric category.
     */
    public function updateCategory(Request $request, EvaluationCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('evaluation_categories', 'name')->ignore($category->id),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'order_index' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $category->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'order_index' => (int) $validated['order_index'],
        ]);

        return back()->with('success', "Kategori rubrik '{$category->name}' berhasil diperbarui.");
    }

    /**
     * Delete a category only if it has no child indicators attached.
     */
    public function destroyCategory(EvaluationCategory $category): RedirectResponse
    {
        if ($category->subcategories()->exists()) {
            return back()->with(
                'error',
                "Kategori '{$category->name}' tidak dapat dihapus karena masih memiliki butir subkategori/indikator aktif."
            );
        }

        $name = $category->name;
        $category->delete();

        return back()->with('success', "Kategori '{$name}' berhasil dihapus.");
    }

    /**
     * Create a new behavioral indicator (subcategory) under an AKHLAK category.
     */
    public function storeSubcategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:evaluation_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'default_reason' => ['nullable', 'string', 'max:1000'],
            'order_index' => ['nullable', 'integer', 'min:1', 'max:999'],
        ]);

        $nextOrder = $validated['order_index'] ?? ((int) EvaluationSubcategory::max('order_index') + 1);

        EvaluationSubcategory::create([
            'category_id' => (int) $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'default_reason' => $validated['default_reason'] ?? null,
            'order_index' => $nextOrder,
        ]);

        return back()->with('success', 'Butir indikator penilaian baru berhasil ditambahkan ke rubrik.');
    }

    /**
     * Update an existing behavioral indicator statement, default reason, or order.
     */
    public function updateSubcategory(Request $request, EvaluationSubcategory $subcategory): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:evaluation_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'default_reason' => ['nullable', 'string', 'max:1000'],
            'order_index' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $subcategory->update([
            'category_id' => (int) $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'default_reason' => $validated['default_reason'] ?? null,
            'order_index' => (int) $validated['order_index'],
        ]);

        return back()->with('success', "Indikator ke-{$subcategory->order_index} berhasil diperbarui.");
    }

    /**
     * Delete an indicator only if it has never been referenced in historical evaluations.
     */
    public function destroySubcategory(EvaluationSubcategory $subcategory): RedirectResponse
    {
        if ($subcategory->evaluationDetails()->exists()) {
            return back()->with(
                'error',
                'Butir indikator ini telah digunakan dalam riwayat penilaian karyawan dan tidak dapat dihapus demi menjaga akurasi skor historis.'
            );
        }

        $subcategory->delete();

        return back()->with('success', 'Butir indikator yang belum memiliki riwayat penilaian berhasil dihapus.');
    }
}
