<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->string('group', 50)->default('general');
            $table->string('type', 20)->default('string');
            $table->string('description', 255)->nullable();
            $table->timestamps();
        });

        // Seed initial official Pelindo Cirebon branch configurations
        $now = now();
        $initialSettings = [
            // Identitas Entitas
            [
                'key' => 'company_name',
                'value' => 'PT Pelabuhan Indonesia (Persero)',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Nama Resmi BUMN Induk',
            ],
            [
                'key' => 'subholding_name',
                'value' => 'PT Pelindo Multi Terminal',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Nama Subholding / Entitas Pengelola',
            ],
            [
                'key' => 'branch_name',
                'value' => 'Branch Cirebon',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Nama Kantor Cabang / Unit Kerja',
            ],
            [
                'key' => 'branch_address',
                'value' => 'Jl. Pelabuhan II No. 1, Pasirjambak, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat 45111',
                'group' => 'identity',
                'type' => 'text',
                'description' => 'Alamat Lengkap Kantor Cabang',
            ],
            [
                'key' => 'city',
                'value' => 'Cirebon',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Kota Kedudukan / Penerbitan Dokumen',
            ],
            [
                'key' => 'postal_code',
                'value' => '45111',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Kode Pos Wilayah Pelabuhan',
            ],
            [
                'key' => 'phone',
                'value' => '(0231) 202441',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Nomor Telepon Kantor Cabang',
            ],
            [
                'key' => 'email',
                'value' => 'cirebon@pelindo.co.id',
                'group' => 'identity',
                'type' => 'string',
                'description' => 'Alamat Email Resmi Cabang',
            ],

            // Pejabat Penandatangan Resmi (Official Signatories)
            [
                'key' => 'branch_manager_name',
                'value' => 'Bambang Wijanarko, S.T., M.M.',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'Nama Lengkap Branch Manager / General Manager',
            ],
            [
                'key' => 'branch_manager_nipp',
                'value' => '27608912',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'NIPP / NIK Branch Manager',
            ],
            [
                'key' => 'branch_manager_title',
                'value' => 'Branch Manager',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'Jabatan Resmi Pimpinan Cabang',
            ],
            [
                'key' => 'sdm_manager_name',
                'value' => 'Dedi Heryadi, S.E.',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'Nama Lengkap Manager SDM & Umum',
            ],
            [
                'key' => 'sdm_manager_nipp',
                'value' => '28214055',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'NIPP / NIK Manager SDM & Umum',
            ],
            [
                'key' => 'sdm_manager_title',
                'value' => 'Manager SDM & Umum',
                'group' => 'signatory',
                'type' => 'string',
                'description' => 'Jabatan Resmi Pejabat SDM',
            ],

            // Kebijakan Format & Legal Disclaimer
            [
                'key' => 'document_footer_note',
                'value' => 'Dokumen ini diterbitkan secara elektronik oleh Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) PT Pelindo Multi Terminal Branch Cirebon dan memiliki kekuatan hukum kedinasan yang sah.',
                'group' => 'document',
                'type' => 'text',
                'description' => 'Catatan Kaki Legalitas Resmi Dokumen',
            ],
        ];

        foreach ($initialSettings as &$item) {
            $item['created_at'] = $now;
            $item['updated_at'] = $now;
        }

        DB::table('system_settings')->insert($initialSettings);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
