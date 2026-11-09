<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Employee;
use App\Models\EvaluationCategory;
use App\Models\EvaluationSubcategory;
use App\Models\PeriodManagement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * ProductionSeeder - Inisiasi Master Data Resmi PT Pelindo Multi Terminal Branch Cirebon
 * Bersih 100% dari data dummy transaksi penilaian (0 evaluations, 0 details, 0 test edit requests).
 */
class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Inisiasi 3 Divisi Operasional Resmi Cabang Cirebon
        $divisions = [
            5 => ['name' => 'Operasi', 'description' => 'Operasional Lapangan & Terminal Nonpetikemas'],
            6 => ['name' => 'Perencanaan Pengendalian', 'description' => 'Perencanaan & Pengendalian Operasi'],
            7 => ['name' => 'Keuangan', 'description' => 'Keuangan, SDM & Umum'],
        ];

        foreach ($divisions as $id => $div) {
            Division::updateOrCreate(['id' => $id], [
                'name' => $div['name'],
                'description' => $div['description'],
                'is_active' => true,
            ]);
        }

        // 2. Inisiasi Akun Pejabat Penilai & Administrator Resmi
        $defaultPassword = Hash::make('password123');

        $users = [
            1 => [
                'name' => 'Administrator SPKTAD',
                'username' => 'admin',
                'password' => $defaultPassword,
                'role' => 'admin',
                'division_id' => null,
                'position' => 'Super Administrator SDM & IT',
            ],
            6 => [
                'name' => 'Rudy Kusuma',
                'username' => 'rudy',
                'password' => $defaultPassword,
                'role' => 'kepala_divisi',
                'division_id' => 5,
                'position' => 'Kepala Divisi Operasi',
            ],
            7 => [
                'name' => 'Mansur',
                'username' => 'mansur',
                'password' => $defaultPassword,
                'role' => 'kepala_divisi',
                'division_id' => 6,
                'position' => 'Kepala Divisi Perencanaan Pengendalian',
            ],
            8 => [
                'name' => 'Rindam Agalvani',
                'username' => 'rindam',
                'password' => $defaultPassword,
                'role' => 'kepala_divisi',
                'division_id' => 7,
                'position' => 'Kepala Divisi Keuangan',
            ],
        ];

        foreach ($users as $id => $u) {
            User::updateOrCreate(['id' => $id], $u);
        }

        // 3. Rubrik Standar Evaluasi AKHLAK & Pelayanan (12 Kategori, 17 Indikator)
        $categoriesData = [
            5 => ['name' => 'Amanah', 'order' => 1],
            6 => ['name' => 'Kompeten', 'order' => 2],
            7 => ['name' => 'Harmonis', 'order' => 3],
            8 => ['name' => 'Loyal', 'order' => 4],
            9 => ['name' => 'Adaptif', 'order' => 5],
            10 => ['name' => 'Kolaboratif', 'order' => 6],
            11 => ['name' => 'Senyum', 'order' => 7],
            12 => ['name' => 'Salam', 'order' => 8],
            13 => ['name' => 'Sapa', 'order' => 9],
            14 => ['name' => 'Terima Kasih', 'order' => 10],
            15 => ['name' => 'Doa & Harapan', 'order' => 11],
            16 => ['name' => 'Disiplin Diri', 'order' => 12],
        ];

        foreach ($categoriesData as $catId => $cat) {
            EvaluationCategory::updateOrCreate(['id' => $catId], [
                'name' => $cat['name'],
                'order_index' => $cat['order'],
            ]);
        }

        $subcategoriesData = [
            13 => [
                'category_id' => 5,
                'name' => 'Bertanggung jawab atas tugas, keputusan, dan tindakan yang dilakukan',
                'default_reason' => 'Bekerja sesuai job desc dan mampu menyelesaikan tugas dengan baik.',
                'order_index' => 1,
            ],
            14 => [
                'category_id' => 5,
                'name' => 'Berpegang teguh kepada nilai moral dan etika',
                'default_reason' => 'Berperilaku baik dalam bekerja.',
                'order_index' => 2,
            ],
            15 => [
                'category_id' => 6,
                'name' => 'Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah',
                'default_reason' => 'Mampu mengoperasikan peralatan kerja dengan aman.',
                'order_index' => 3,
            ],
            16 => [
                'category_id' => 6,
                'name' => 'Menyelesaikan tugas dengan kualitas terbaik',
                'default_reason' => 'Hasil kerja rapi dan sesuai target yang ditentukan.',
                'order_index' => 4,
            ],
            17 => [
                'category_id' => 7,
                'name' => 'Menghargai setiap orang apapun latar belakangnya',
                'default_reason' => 'Menghormati rekan kerja dan atasan.',
                'order_index' => 5,
            ],
            18 => [
                'category_id' => 7,
                'name' => 'Membangun lingkungan kerja yang kondusif',
                'default_reason' => 'Mampu menciptakan lingkungan kerja yang kondusif.',
                'order_index' => 6,
            ],
            19 => [
                'category_id' => 8,
                'name' => 'Menjaga nama baik sesama karyawan, pimpinan, BUMN, dan Negara',
                'default_reason' => 'Memiliki rasa hormat terhadap teman kerja dan menjaga etika perusahaan.',
                'order_index' => 7,
            ],
            20 => [
                'category_id' => 8,
                'name' => 'Patuh kepada pimpinan sepanjang tidak bertentangan dengan hukum dan etika',
                'default_reason' => 'Mengikuti arahan atasan dalam melaksanakan tugas operasional.',
                'order_index' => 8,
            ],
            21 => [
                'category_id' => 9,
                'name' => 'Cepat menyesuaikan diri untuk menjadi lebih baik',
                'default_reason' => 'Perlu waktu dan bimbingan atasan agar dapat menyesuaikan diri agar bisa menjadi lebih baik.',
                'order_index' => 9,
            ],
            22 => [
                'category_id' => 9,
                'name' => 'Terus-menerus melakukan perbaikan mengikuti perkembangan teknologi',
                'default_reason' => 'Perlu bimbingan dari teman-teman sejawat agar bisa mengikuti perkembangan teknologi.',
                'order_index' => 10,
            ],
            23 => [
                'category_id' => 10,
                'name' => 'Memberi kesempatan kepada berbagai pihak untuk berkontribusi dan Terbuka dalam bekerja sama untuk menghasilkan nilai tambah',
                'default_reason' => 'Ikut serta berperan aktif mengingatkan untuk selalu ikut berkontribusi terhadap perusahaan.',
                'order_index' => 11,
            ],
            24 => [
                'category_id' => 11,
                'name' => 'Ramah melaksanakan tugas dengan bahagia melambangkan optimisme, simpati, keceriaan, dan berpikir positif.',
                'default_reason' => 'Membutuhkan motivasi lebih dari teman-teman sejawat agar selalu bahagia, ceria, dan berpikir positif dalam bekerja.',
                'order_index' => 12,
            ],
            25 => [
                'category_id' => 12,
                'name' => 'Salam, ikhlas, bersahabat, kasih sayang, meningkatkan hubungan interpersonal.',
                'default_reason' => 'Menjaga hubungan baik dalam bekerja.',
                'order_index' => 13,
            ],
            26 => [
                'category_id' => 13,
                'name' => 'Sapaan yang hangat, akrab dan bentuk kesiapan melayani',
                'default_reason' => 'Menjaga hubungan baik dalam bekerja dan menjaga hubungan baik dalam melakukan pekerjaan.',
                'order_index' => 14,
            ],
            27 => [
                'category_id' => 14,
                'name' => 'Bentuk apresiasi yang tinggi ungkapan hormat dan membangun ikatan emosional dengan pelanggan',
                'default_reason' => 'Keikutsertaan aktif dalam membangun ikatan emosional dengan pelanggan.',
                'order_index' => 15,
            ],
            28 => [
                'category_id' => 15,
                'name' => 'Mendoakan kebaikan, kesehatan, keselamatan, kebahagiaan, kelancaran dan rezeki bagi pengguna jasa.',
                'default_reason' => 'Selalu mendoakan kepada pengguna jasa agar dimudahkan segala urusan pekerjaan.',
                'order_index' => 16,
            ],
            29 => [
                'category_id' => 16,
                'name' => 'Mentaati peraturan yang ditentukan perusahaan',
                'default_reason' => 'Mentaati peraturan perusahaan dengan seksama.',
                'order_index' => 17,
            ],
        ];

        foreach ($subcategoriesData as $subId => $sub) {
            EvaluationSubcategory::updateOrCreate(['id' => $subId], [
                'category_id' => $sub['category_id'],
                'name' => $sub['name'],
                'default_reason' => $sub['default_reason'],
                'order_index' => $sub['order_index'],
            ]);
        }

        // 4. Inisiasi 35 Data Riil Personel Tenaga Alih Daya (TAD) Pelindo Cirebon
        $employeesData = [
            10 => ['division_id' => 5, 'name' => 'Agung Sugiarto', 'position' => 'Operator Alat (Forklift)'],
            11 => ['division_id' => 6, 'name' => 'Edi Purnomo', 'position' => 'Pelaksana Perencanaan & Pengendalian Kapal'],
            12 => ['division_id' => 7, 'name' => 'Sugiantoro', 'position' => 'Adm Perbendaharaan'],
            14 => ['division_id' => 5, 'name' => 'Agus Kamaludin', 'position' => 'Operator Alat (Excavator)'],
            15 => ['division_id' => 5, 'name' => 'Agus Supriyadi', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            16 => ['division_id' => 5, 'name' => 'Dede Suhaedi', 'position' => 'Operator Alat (Excavator)'],
            17 => ['division_id' => 5, 'name' => 'Elfan Lesmana', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            19 => ['division_id' => 5, 'name' => 'Erwin Mulyadi', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            20 => ['division_id' => 5, 'name' => 'Gery Wicaksono', 'position' => 'Rigger (Alat Mekanis & Non Mekanis)'],
            21 => ['division_id' => 5, 'name' => 'Hantoro', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            22 => ['division_id' => 5, 'name' => 'Heri Nardo', 'position' => 'Pelaksana Terminal Operation I'],
            23 => ['division_id' => 5, 'name' => 'Jaka', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            24 => ['division_id' => 5, 'name' => 'Jumadi', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            25 => ['division_id' => 5, 'name' => 'Jumari', 'position' => 'Operator Alat (Excavator)'],
            26 => ['division_id' => 5, 'name' => 'Kastu', 'position' => 'Operator Alat (Wheel Loader)'],
            27 => ['division_id' => 5, 'name' => 'M. Rosyadi', 'position' => 'Rigger (Alat Mekanis & Non Mekanis)'],
            28 => ['division_id' => 5, 'name' => 'Marman', 'position' => 'Operator Alat (Excavator)'],
            29 => ['division_id' => 5, 'name' => 'Mindaryono', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            30 => ['division_id' => 5, 'name' => 'Nanto Suhardiyanto', 'position' => 'Operator Alat (Excavator)'],
            31 => ['division_id' => 5, 'name' => 'Niki Angga Kusuma', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            32 => ['division_id' => 5, 'name' => 'Nur Rachmat', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            33 => ['division_id' => 5, 'name' => 'Panji Akbar Saputra', 'position' => 'Operator Alat (Excavator)'],
            34 => ['division_id' => 5, 'name' => 'Rakhmat Suharjo', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            35 => ['division_id' => 5, 'name' => 'Ruja', 'position' => 'Rigger (Alat Mekanis & Non Mekanis)'],
            36 => ['division_id' => 5, 'name' => 'Suheri', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            37 => ['division_id' => 5, 'name' => 'Sukana', 'position' => 'Operator Alat (Wheel Loader)'],
            38 => ['division_id' => 5, 'name' => 'Sumarno', 'position' => 'Operator Alat (Wheel Loader)'],
            39 => ['division_id' => 5, 'name' => 'Suwarja', 'position' => 'Operator Alat (Excavator)'],
            40 => ['division_id' => 5, 'name' => 'Tedy Sumartono', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            41 => ['division_id' => 5, 'name' => 'Untung Saefullah', 'position' => 'Operator Alat (Excavator)'],
            42 => ['division_id' => 5, 'name' => 'Wahyu Adi Purwa', 'position' => 'Adm Kapal, Gudang & Lapangan'],
            43 => ['division_id' => 5, 'name' => 'Tachromin Sukmadi Mulya', 'position' => 'Rigger (Alat Mekanis & Non Mekanis)'],
            44 => ['division_id' => 5, 'name' => 'M. Dedy Arif', 'position' => 'Operator Alat (Excavator)'],
            45 => ['division_id' => 7, 'name' => 'Pandu Rahmat Putra', 'position' => 'Adm Akuntansi'],
            46 => ['division_id' => 5, 'name' => 'Eman Separman', 'position' => 'Adm Kapal, Gudang & Lapangan'],
        ];

        foreach ($employeesData as $empId => $emp) {
            Employee::updateOrCreate(['id' => $empId], [
                'division_id' => $emp['division_id'],
                'name' => $emp['name'],
                'position' => $emp['position'],
                'nik' => 'TAD-'.str_pad($empId, 4, '0', STR_PAD_LEFT),
                'vendor_name' => 'PT Pelindo Daya Sejahtera',
                'is_active' => true,
            ]);
        }

        // 5. Inisiasi Status Periode Operasional (Bulan Berjalan Terbuka, Lainnya Tertutup)
        $currentMonth = (int) date('n');
        $currentYear = (int) date('Y');

        foreach ([5, 6, 7] as $divId) {
            // Periode aktif bulan berjalan dibuka
            PeriodManagement::updateOrCreate([
                'division_id' => $divId,
                'period_month' => $currentMonth,
                'period_year' => $currentYear,
            ], [
                'status' => 'open',
                'updated_by' => 1,
            ]);
        }

        // CATATAN PRODUKSI RESMI:
        // Tabel evaluations, evaluation_details, dan edit_requests DIBIARKAN KOSONG (0 entri).
        // Siap digunakan untuk operasional riil penilaian tahun berjalan tanpa residu dummy data.
    }
}
