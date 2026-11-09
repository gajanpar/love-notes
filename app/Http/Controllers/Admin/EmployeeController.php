<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Division;
use App\Models\Employee;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Display the TAD employee master directory with filtering and statistics.
     */
    public function index(Request $request): View
    {
        $search = trim((string) $request->get('search', ''));
        $currentDivision = (string) $request->get('division_id', 'all');
        $currentStatus = (string) $request->get('status', 'all');

        $query = Employee::with('division')
            ->withCount(['evaluations', 'editRequests'])
            ->orderByDesc('is_active')
            ->orderBy('name');

        if ($search !== '') {
            $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%")
                    ->orWhere('vendor_name', 'like', "%{$search}%");
            });
        }

        if ($currentDivision !== 'all') {
            $query->where('division_id', (int) $currentDivision);
        }

        if ($currentStatus === 'active') {
            $query->where('is_active', true);
        } elseif ($currentStatus === 'inactive') {
            $query->where('is_active', false);
        }

        $employees = $query->paginate(15)->withQueryString();

        $divisions = Division::withCount('employees')->orderBy('id')->get();
        $activeDivisions = $divisions->where('is_active', true)->values();

        $counts = [
            'total' => Employee::count(),
            'active' => Employee::where('is_active', true)->count(),
            'inactive' => Employee::where('is_active', false)->count(),
            'divisions' => $activeDivisions->count(),
        ];

        return view('admin.employees.index', [
            'employees' => $employees,
            'divisions' => $divisions,
            'activeDivisions' => $activeDivisions,
            'counts' => $counts,
            'search' => $search,
            'currentDivision' => $currentDivision,
            'currentStatus' => $currentStatus,
        ]);
    }

    /**
     * Store a newly created TAD employee record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => ['nullable', 'string', 'max:50', 'unique:employees,nik'],
            'name' => ['required', 'string', 'max:100'],
            'division_id' => ['required', 'exists:divisions,id'],
            'position' => ['required', 'string', 'max:100'],
            'vendor_name' => ['required', 'string', 'max:100'],
        ], [
            'nik.unique' => 'NIK / Kode TAD tersebut sudah terdaftar pada karyawan lain.',
            'name.required' => 'Nama lengkap karyawan TAD wajib diisi.',
            'division_id.required' => 'Divisi penempatan wajib dipilih.',
            'position.required' => 'Jabatan operasional wajib diisi.',
        ]);

        $employee = Employee::create([
            'nik' => $validated['nik'] ?: null,
            'name' => $validated['name'],
            'division_id' => (int) $validated['division_id'],
            'position' => $validated['position'],
            'vendor_name' => $validated['vendor_name'],
            'is_active' => true,
        ]);

        if (empty($employee->nik)) {
            $generatedNik = 'TAD-'.str_pad((string) $employee->id, 4, '0', STR_PAD_LEFT);
            if (! Employee::where('nik', $generatedNik)->where('id', '!=', $employee->id)->exists()) {
                $employee->update(['nik' => $generatedNik]);
            }
        }

        ActivityLog::record(
            'employee.created',
            "Menambahkan personel TAD: {$employee->name} ({$employee->nik})",
            'Employee',
            $employee->id,
            ['nik' => $employee->nik, 'division_id' => $employee->division_id, 'position' => $employee->position]
        );

        return back()->with('success', "Karyawan TAD {$employee->name} ({$employee->nik}) berhasil ditambahkan.");
    }

    /**
     * Update an existing TAD employee profile.
     */
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'nik' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('employees', 'nik')->ignore($employee->id),
            ],
            'name' => ['required', 'string', 'max:100'],
            'division_id' => ['required', 'exists:divisions,id'],
            'position' => ['required', 'string', 'max:100'],
            'vendor_name' => ['required', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
        ], [
            'nik.unique' => 'NIK / Kode TAD tersebut sudah digunakan oleh karyawan lain.',
        ]);

        $employee->update([
            'nik' => $validated['nik'] ?: $employee->nik,
            'name' => $validated['name'],
            'division_id' => (int) $validated['division_id'],
            'position' => $validated['position'],
            'vendor_name' => $validated['vendor_name'],
            'is_active' => (bool) $validated['is_active'],
        ]);

        ActivityLog::record(
            'employee.updated',
            "Memperbarui profil personel TAD: {$employee->name} ({$employee->nik})",
            'Employee',
            $employee->id,
            ['nik' => $employee->nik, 'is_active' => (bool) $validated['is_active']]
        );

        return back()->with('success', "Profil karyawan TAD {$employee->name} berhasil diperbarui.");
    }

    /**
     * Toggle active/inactive status while preserving historical evaluations.
     */
    public function toggleStatus(Employee $employee): RedirectResponse
    {
        $newStatus = ! $employee->is_active;
        $employee->update(['is_active' => $newStatus]);

        $statusLabel = $newStatus ? 'DIAKTIFKAN' : 'DINONAKTIFKAN';

        ActivityLog::record(
            'employee.status_toggled',
            "Mengubah status personel TAD {$employee->name} ({$employee->nik}) menjadi {$statusLabel}",
            'Employee',
            $employee->id,
            ['new_status' => $newStatus]
        );

        return back()->with(
            'success',
            "Status personel {$employee->name} berhasil {$statusLabel}. Seluruh arsip riwayat evaluasi tetap terjaga."
        );
    }

    /**
     * Delete a newly created employee only if they have zero evaluation or edit-request history.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        if ($employee->evaluations()->exists() || $employee->editRequests()->exists()) {
            return back()->with(
                'error',
                "Data {$employee->name} tidak dapat dihapus permanen karena memiliki riwayat penilaian historis. Gunakan fitur Nonaktifkan untuk menjaga integritas audit."
            );
        }

        $name = $employee->name;
        $nik = $employee->nik;
        $employee->delete();

        ActivityLog::record(
            'employee.deleted',
            "Menghapus permanen data personel TAD: {$name} ({$nik})",
            'Employee',
            null,
            ['deleted_name' => $name, 'deleted_nik' => $nik]
        );

        return back()->with('success', "Entri karyawan {$name} berhasil dihapus.");
    }

    /**
     * Create a new operational division.
     */
    public function storeDivision(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:divisions,name'],
            'description' => ['nullable', 'string', 'max:255'],
        ], [
            'name.unique' => 'Nama divisi tersebut sudah terdaftar.',
        ]);

        $division = Division::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        ActivityLog::record(
            'division.created',
            "Menambahkan divisi operasional baru: {$division->name}",
            'Division',
            $division->id
        );

        return back()->with('success', "Divisi operasional {$division->name} berhasil ditambahkan.");
    }

    /**
     * Update an existing operational division.
     */
    public function updateDivision(Request $request, Division $division): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('divisions', 'name')->ignore($division->id),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ]);

        $division->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => (bool) $validated['is_active'],
        ]);

        ActivityLog::record(
            'division.updated',
            "Memperbarui data divisi operasional: {$division->name}",
            'Division',
            $division->id,
            ['is_active' => (bool) $validated['is_active']]
        );

        return back()->with('success', "Data Divisi {$division->name} berhasil diperbarui.");
    }
}
