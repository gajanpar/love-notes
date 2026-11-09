<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class SettingController extends Controller
{
    /**
     * Display the branch settings and official signatory configuration console.
     */
    public function index(): View
    {
        $settings = Setting::all()->keyBy('key');

        return view('admin.system.settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the branch settings and official signatories with audit trail logging.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Identitas Cabang
            'company_name' => ['required', 'string', 'max:150'],
            'subholding_name' => ['required', 'string', 'max:150'],
            'branch_name' => ['required', 'string', 'max:150'],
            'branch_address' => ['required', 'string', 'max:300'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],

            // Pejabat Penandatangan Resmi
            'branch_manager_name' => ['required', 'string', 'max:150'],
            'branch_manager_nipp' => ['nullable', 'string', 'max:50'],
            'branch_manager_title' => ['required', 'string', 'max:150'],
            'sdm_manager_name' => ['required', 'string', 'max:150'],
            'sdm_manager_nipp' => ['nullable', 'string', 'max:50'],
            'sdm_manager_title' => ['required', 'string', 'max:150'],

            // Catatan Dokumen
            'document_footer_note' => ['nullable', 'string', 'max:500'],
        ]);

        $oldSettings = Setting::all()->pluck('value', 'key')->toArray();
        $changes = [];

        DB::transaction(function () use ($validated, $oldSettings, &$changes) {
            foreach ($validated as $key => $newValue) {
                $oldValue = $oldSettings[$key] ?? null;
                if ($oldValue !== $newValue) {
                    $changes[$key] = [
                        'old' => $oldValue,
                        'new' => $newValue,
                    ];
                }

                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $newValue]
                );
            }

            Setting::clearCache();
        });

        if (! empty($changes)) {
            ActivityLog::record(
                'system.settings_updated',
                'Memperbarui konfigurasi cabang & data pejabat penandatangan ('.count($changes).' parameter diubah)',
                'SystemSetting',
                null,
                ['changes' => $changes]
            );
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'Konfigurasi cabang dan data pejabat penandatangan berhasil diperbarui.');
    }

    /**
     * Reset settings back to official Pelindo Cirebon default parameters.
     */
    public function reset(): RedirectResponse
    {
        $defaults = [
            'company_name' => 'PT Pelabuhan Indonesia (Persero)',
            'subholding_name' => 'PT Pelindo Multi Terminal',
            'branch_name' => 'Branch Cirebon',
            'branch_address' => 'Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111',
            'city' => 'Cirebon',
            'postal_code' => '45111',
            'phone' => '(0231) 202441',
            'email' => 'cirebon@pelindo.co.id',
            'branch_manager_name' => 'Bambang Wijanarko, S.T., M.M.',
            'branch_manager_nipp' => '27608912',
            'branch_manager_title' => 'Branch Manager',
            'sdm_manager_name' => 'Dedi Heryadi, S.E.',
            'sdm_manager_nipp' => '28214055',
            'sdm_manager_title' => 'Manager SDM & Umum',
            'document_footer_note' => 'Dokumen ini diterbitkan secara elektronik oleh Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) PT Pelindo Multi Terminal Branch Cirebon dan memiliki kekuatan hukum kedinasan yang sah.',
        ];

        DB::transaction(function () use ($defaults) {
            foreach ($defaults as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
            Setting::clearCache();
        });

        ActivityLog::record(
            'system.settings_reset',
            'Mengembalikan konfigurasi cabang ke nilai default standar Pelindo Cirebon',
            'SystemSetting',
            null
        );

        return redirect()->route('admin.settings.index')
            ->with('success', 'Konfigurasi cabang berhasil dikembalikan ke standar default Pelindo Cirebon.');
    }
}
