// src/data/mockData.ts
import {
  SuratConfig,
  PengajuanSurat,
  PendudukData,
  MutasiRecord,
  AuditLog,
  Role,
  UserRoleInfo,
  APBDesCategory,
  LaporanWarga,
  BeritaItem,
  PerdesItem,
  VillageOfficial,
  WeatherData,
  NewsTickerItem,
  WeatherForecastItem
} from '../types';

export const SURAT_CONFIGS: SuratConfig[] = [
  {
    code: 'SKU',
    title: 'Surat Keterangan Usaha',
    category: 'Usaha',
    sla: '1 hari kerja',
    slaDays: 1,
    icon: 'Store',
    description: 'Surat keterangan resmi untuk pembukaan rekening bank, pengajuan KUR/kredit pertanian, atau legalitas usaha mikro desa.',
    requirements: ['KTP Pemohon (Asli/Scan)', 'Foto Tempat Usaha / Lahan Tani', 'Surat Pengantar RT/RW (Opsional)'],
    fields: [
      { id: 'namaUsaha', label: 'Nama Usaha / Kelompok Tani', type: 'text', placeholder: 'cth: Usaha Tani Hortikultura Daun Bawang "Sukadana Makmur"', required: true },
      { id: 'jenisUsaha', label: 'Bidang / Jenis Usaha', type: 'select', required: true, options: ['Pertanian & Hortikultura (Bawang/Sayur)', 'Perdagangan & Hasil Bumi', 'Kuliner & Olahan Rempah', 'Jasa & Bengkel', 'Kerajinan Bambu & Kayu', 'Agrowisata & Homestay', 'Lainnya'] },
      { id: 'alamatUsaha', label: 'Alamat Lokasi Usaha', type: 'textarea', placeholder: 'cth: Jl. Raya Sukadana No. 14, Blok Cikondang RT 02/03', required: true },
      { id: 'tahunBerdiri', label: 'Tahun Mulai Berdiri', type: 'number', placeholder: 'cth: 2020', required: true },
      { id: 'omsetBulanan', label: 'Perkiraan Omset per Bulan (Rp)', type: 'currency', placeholder: 'cth: 25000000', required: true },
      { id: 'keperluanSurat', label: 'Tujuan & Keperluan Pengajuan', type: 'text', placeholder: 'cth: Pengajuan KUR Pertanian Bank BRI Unit Argapura', required: true }
    ]
  },
  {
    code: 'SKTM',
    title: 'Surat Keterangan Tidak Mampu',
    category: 'Sosial',
    sla: '2 hari kerja',
    slaDays: 2,
    icon: 'HeartHandshake',
    description: 'Surat untuk keringanan biaya sekolah/kuliah (KIP), pengobatan BPJS PBI, atau bantuan sosial terpadu.',
    requirements: ['KTP Pemohon / Wali', 'Kartu Keluarga (KK)', 'Surat Keterangan RT/RW Setempat', 'Foto Rumah Tampak Depan'],
    fields: [
      { id: 'namaSiswa', label: 'Nama Yang Bersangkutan / Anak', type: 'text', placeholder: 'Isi jika untuk keperluan sekolah/kuliah anak' },
      { id: 'sekolahTujuan', label: 'Nama Sekolah / Universitas / Instansi Tujuan', type: 'text', placeholder: 'cth: Universitas Majalengka (UNMA) / SMAN 1 Majalengka', required: true },
      { id: 'pekerjaanKepalaKeluarga', label: 'Pekerjaan Kepala Keluarga', type: 'text', placeholder: 'cth: Buruh Tani Harian Lepas', required: true },
      { id: 'penghasilanKeluarga', label: 'Rata-rata Penghasilan Total Keluarga (Rp)', type: 'currency', placeholder: 'cth: 1200000', required: true },
      { id: 'jumlahTanggungan', label: 'Jumlah Tanggungan Anak/Keluarga', type: 'number', placeholder: 'cth: 3', required: true },
      { id: 'keperluanSpesifik', label: 'Keperluan Bantuan', type: 'select', required: true, options: ['Beasiswa / KIP Kuliah', 'Keringanan Biaya Rumah Sakit (RSUD Majalengka / Cideres)', 'Pendaftaran BPJS PBI', 'Bantuan Sosial / PKH', 'Lainnya'] }
    ]
  },
  {
    code: 'SKN',
    title: 'Surat Pengantar Nikah (N1-N4)',
    category: 'Pernikahan',
    sla: '3 hari kerja',
    slaDays: 3,
    icon: 'Users',
    description: 'Dokumen pengantar model N1 s.d N4 untuk pendaftaran pernikahan resmi di KUA Kecamatan Argapura atau Catatan Sipil.',
    requirements: ['KTP Pemohon & Pasangan', 'Kartu Keluarga (KK)', 'Akta Kelahiran / Ijazah Terakhir', 'Pas Foto Berlatar Biru 3x4 (2 Lembar)'],
    fields: [
      { id: 'namaPasangan', label: 'Nama Lengkap Calon Pasangan', type: 'text', placeholder: 'cth: Neng Siti Fatimah', required: true },
      { id: 'nikPasangan', label: 'NIK Calon Pasangan', type: 'text', placeholder: '16 Digit NIK Pasangan', required: true },
      { id: 'asalDesaPasangan', label: 'Asal Desa / Kelurahan Pasangan', type: 'text', placeholder: 'cth: Desa Tejamulya, Kec. Argapura', required: true },
      { id: 'statusSebelumNikah', label: 'Status Pernikahan Saat Ini', type: 'select', required: true, options: ['Jejaka / Perawan', 'Duda Cerai Hidup', 'Duda Cerai Mati', 'Janda Cerai Hidup', 'Janda Cerai Mati'] },
      { id: 'rencanaTanggalNikah', label: 'Estimasi Tanggal Akad Nikah', type: 'date', required: true },
      { id: 'kuaTujuan', label: 'KUA / Kantor Pencatatan Sipil Tujuan', type: 'text', placeholder: 'cth: KUA Kecamatan Argapura, Kab. Majalengka', required: true }
    ]
  },
  {
    code: 'SKPWNI',
    title: 'Surat Keterangan Pindah (SKPWNI)',
    category: 'Kependudukan',
    sla: '2 hari kerja',
    slaDays: 2,
    icon: 'Navigation',
    description: 'Surat pengantar perpindahan domisili warga antar desa, kecamatan, kabupaten, atau provinsi.',
    requirements: ['KTP Asli Semua Anggota Pindah', 'Kartu Keluarga (KK) Asli', 'Surat Pengantar RT/RW'],
    fields: [
      { id: 'alamatTujuan', label: 'Alamat Lengkap Tujuan Pindah', type: 'textarea', placeholder: 'cth: Jl. Raya KH Abdul Halim No. 45, RT 02/04, Kel. Majalengka Kulon, Kec. Majalengka', required: true },
      { id: 'alasanPindah', label: 'Alasan Pindah Domisili', type: 'select', required: true, options: ['Pekerjaan / Dinas', 'Pendidikan / Sekolah', 'Perumahan Baru', 'Keluarga / Ikut Suami-Istri', 'Kesehatan', 'Lainnya'] },
      { id: 'jenisKepindahan', label: 'Klasifikasi Kepindahan', type: 'select', required: true, options: ['Kepala Keluarga Saja', 'Kepala Keluarga & Seluruh Anggota', 'Kepala Keluarga & Sebagian Anggota', 'Anggota Keluarga Saja'] },
      { id: 'jumlahAnggotaPindah', label: 'Jumlah Anggota Keluarga yang Ikut', type: 'number', placeholder: 'cth: 2', required: true }
    ]
  },
  {
    code: 'SKCK-PENGANTAR',
    title: 'Surat Pengantar SKCK',
    category: 'Kependudukan',
    sla: '1 hari kerja',
    slaDays: 1,
    icon: 'ShieldCheck',
    description: 'Surat keterangan catatan berkelakuan baik dari desa untuk permohonan SKCK di Polsek Argapura / Polres Majalengka.',
    requirements: ['KTP Pemohon', 'Kartu Keluarga (KK)', 'Akta Kelahiran / Ijazah'],
    fields: [
      { id: 'keperluanSKCK', label: 'Keperluan Pembuatan SKCK', type: 'select', required: true, options: ['Melamar Pekerjaan Swasta / BUMN', 'Pendaftaran CPNS / PPPK Kabupaten Majalengka', 'Pendaftaran TNI / POLRI', 'Pendaftaran Perguruan Tinggi', 'Pencalonan Pejabat Publik / BPD', 'Izin Tinggal Luar Negeri / Visa Kerja', 'Lainnya'] },
      { id: 'instansiTujuan', label: 'Instansi / Perusahaan Tujuan', type: 'text', placeholder: 'cth: BKPSDM Pemerintah Kabupaten Majalengka', required: true },
      { id: 'polsekTujuan', label: 'Polsek / Polres Tujuan Pembuatan', type: 'text', placeholder: 'cth: Polsek Argapura / Polres Majalengka', required: true }
    ]
  },
  {
    code: 'SKTD',
    title: 'Surat Keterangan Tidak Sengketa',
    category: 'Kependudukan',
    sla: '3 hari kerja',
    slaDays: 3,
    icon: 'FileCheck2',
    description: 'Surat pernyataan kepemilikan tanah/bangunan atau lahan perkebunan terasering yang sah dan tidak dalam sengketa hukum atau hak.',
    requirements: ['KTP Pemohon', 'Bukti Kepemilikan (Girik/Letter C/AJB/Sertifikat)', 'Surat Pernyataan Batas Tanah dari Saksi Batas'],
    fields: [
      { id: 'nomorLetterC', label: 'Nomor Sertifikat / Girik / Letter C', type: 'text', placeholder: 'cth: Letter C No. 328 Persil 14 Blok Cikondang', required: true },
      { id: 'luasTanah', label: 'Luas Tanah / Bangunan / Lahan Tani (m²)', type: 'number', placeholder: 'cth: 1250', required: true },
      { id: 'lokasiTanah', label: 'Letak / Lokasi Bidang Tanah (Blok / RT / RW)', type: 'text', placeholder: 'cth: Blok Lembah Cikondang, RT 02/03', required: true },
      { id: 'batasUtara', label: 'Batas Sebelah Utara', type: 'text', placeholder: 'cth: Lahan milik Bpk. H. Didin Samsudin', required: true },
      { id: 'batasSelatan', label: 'Batas Sebelah Selatan', type: 'text', placeholder: 'cth: Jalan Desa Sukadana / Saluran Irigasi Ciremai', required: true },
      { id: 'batasTimur', label: 'Batas Sebelah Timur', type: 'text', placeholder: 'cth: Lahan milik Ibu Imas Masitoh', required: true },
      { id: 'batasBarat', label: 'Batas Sebelah Barat', type: 'text', placeholder: 'cth: Saluran Irigasi Hulu Cilongkrang', required: true }
    ]
  }
];

export const MOCK_PENDUDUK: PendudukData[] = [
  {
    nik: '3210091405880001',
    noKk: '3210091208050001',
    nama: 'Asep Supriatna',
    tempatLahir: 'Majalengka',
    tanggalLahir: '1988-05-14',
    jenisKelamin: 'L',
    alamat: 'Blok Sukadana Girang, RT 03 / RW 05',
    rtRw: '03/05',
    pekerjaan: 'Petani Hortikultura & Bawang Daun',
    agama: 'Islam',
    statusPernikahan: 'Kawin',
    status: 'Aktif',
    fotoKtp: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    nik: '3210096011950002',
    noKk: '3210091509080002',
    nama: 'Eni Rohaeni',
    tempatLahir: 'Majalengka',
    tanggalLahir: '1995-11-20',
    jenisKelamin: 'P',
    alamat: 'Blok Sukadana Hilir, RT 02 / RW 01',
    rtRw: '02/01',
    pekerjaan: 'Pengrajin UMKM Olahan Bawang',
    agama: 'Islam',
    statusPernikahan: 'Kawin',
    status: 'Aktif',
    fotoKtp: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  },
  {
    nik: '3210090408010003',
    noKk: '3210092203110003',
    nama: 'Maman Firmansyah',
    tempatLahir: 'Majalengka',
    tanggalLahir: '2001-08-04',
    jenisKelamin: 'L',
    alamat: 'Blok Cikondang, RT 01 / RW 03',
    rtRw: '01/03',
    pekerjaan: 'Mahasiswa (Universitas Majalengka)',
    agama: 'Islam',
    statusPernikahan: 'Belum Kawin',
    status: 'Aktif'
  },
  {
    nik: '3210095703920004',
    noKk: '3210091807140004',
    nama: 'Neng Siti Sarah',
    tempatLahir: 'Majalengka',
    tanggalLahir: '1992-03-17',
    jenisKelamin: 'P',
    alamat: 'Blok Pasir Kaler, RT 04 / RW 02',
    rtRw: '04/02',
    pekerjaan: 'Guru Honorer SDN Sukadana',
    agama: 'Islam',
    statusPernikahan: 'Kawin',
    status: 'Aktif'
  },
  {
    nik: '3210090912790005',
    noKk: '3210090504030005',
    nama: 'Cecep Saepuloh',
    tempatLahir: 'Argapura',
    tanggalLahir: '1979-12-09',
    jenisKelamin: 'L',
    alamat: 'Blok Sukadana Girang, RT 01 / RW 05',
    rtRw: '01/05',
    pekerjaan: 'Petani Hortikultura & Kopi Ciremai',
    agama: 'Islam',
    statusPernikahan: 'Kawin',
    status: 'Aktif'
  },
  {
    nik: '3210096507990006',
    noKk: '3210091106190006',
    nama: 'Ai Rosita',
    tempatLahir: 'Majalengka',
    tanggalLahir: '1999-07-25',
    jenisKelamin: 'P',
    alamat: 'Blok Mekarjaya, RT 03 / RW 01',
    rtRw: '03/01',
    pekerjaan: 'Karyawan Swasta',
    agama: 'Islam',
    statusPernikahan: 'Belum Kawin',
    status: 'Pindah'
  }
];

export const INITIAL_PENGAJUAN: PengajuanSurat[] = [
  {
    id: 'req-001',
    nomorTiket: 'DESA-2026-08-00148',
    nikPemohon: '3210091405880001',
    namaPemohon: 'Asep Supriatna',
    jenisSurat: 'SKU',
    status: 'pending',
    metadata: {
      namaUsaha: 'Usaha Tani & Perdagangan Bawang Daun "Sukadana Makmur"',
      jenisUsaha: 'Pertanian & Hortikultura (Bawang/Sayur)',
      alamatUsaha: 'Jl. Raya Sukadana No. 12, Blok Sukadana Girang RT 03/05',
      tahunBerdiri: 2020,
      omsetBulanan: 24500000,
      keperluanSurat: 'Pengajuan KUR Pertanian Bank BRI Unit Argapura'
    },
    dokumenPrasyarat: [
      { name: 'KTP_Asep_Supriatna.jpg', type: 'image/jpeg', size: '1.4 MB', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
      { name: 'Foto_Lahan_Tani_Bawang.jpg', type: 'image/jpeg', size: '2.1 MB', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80' }
    ],
    createdAt: '2026-08-28 09:15',
    updatedAt: '2026-08-28 09:15',
    deadlineAt: '2026-08-29 17:00',
    timeline: [
      { id: 't-1', timestamp: '28/08/2026 09:15', status: 'Pengajuan Diterima Sistem', actor: 'Sistem E-Government Sukadana', role: 'System', notes: 'Berkas masuk ke antrean kerja loket pelayanan desa' }
    ]
  },
  {
    id: 'req-002',
    nomorTiket: 'DESA-2026-08-00145',
    nikPemohon: '3210096011950002',
    namaPemohon: 'Eni Rohaeni',
    jenisSurat: 'SKTM',
    status: 'review',
    metadata: {
      namaSiswa: 'Rizki Ramadhan',
      sekolahTujuan: 'Universitas Majalengka (UNMA) - Fakultas Pertanian',
      pekerjaanKepalaKeluarga: 'Buruh Tani Harian',
      penghasilanKeluarga: 1200000,
      jumlahTanggungan: 3,
      keperluanSpesifik: 'Beasiswa / KIP Kuliah'
    },
    dokumenPrasyarat: [
      { name: 'KTP_Eni_Rohaeni.jpg', type: 'image/jpeg', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80' },
      { name: 'Kartu_Keluarga_Eni.pdf', type: 'application/pdf', size: '2.4 MB', url: '#' },
      { name: 'Surat_Pengantar_RT02_RW01.jpg', type: 'image/jpeg', size: '890 KB', url: '#' }
    ],
    catatanAdmin: 'Dokumen lengkap. Sedang dilakukan verifikasi silang basis data DTKS oleh petugas loket.',
    createdAt: '2026-08-27 14:20',
    updatedAt: '2026-08-28 08:30',
    deadlineAt: '2026-08-29 17:00',
    timeline: [
      { id: 't-2a', timestamp: '27/08/2026 14:20', status: 'Pengajuan Diterima', actor: 'Sistem', role: 'System' },
      { id: 't-2b', timestamp: '28/08/2026 08:30', status: 'Sedang Diperiksa Petugas', actor: 'Euis Sumarni', role: 'Operator Loket', notes: 'Pemeriksaan kesesuaian data KK dan bukti tidak mampu pemohon' }
    ]
  },
  {
    id: 'req-003',
    nomorTiket: 'DESA-2026-08-00142',
    nikPemohon: '3210090408010003',
    namaPemohon: 'Maman Firmansyah',
    jenisSurat: 'SKCK-PENGANTAR',
    status: 'approved',
    metadata: {
      keperluanSKCK: 'Pendaftaran CPNS / PPPK Kabupaten Majalengka',
      instansiTujuan: 'Badan Kepegawaian dan Pengembangan SDM Kab. Majalengka',
      polsekTujuan: 'Polsek Argapura / Polres Majalengka'
    },
    dokumenPrasyarat: [
      { name: 'KTP_Maman_Firmansyah.jpg', type: 'image/jpeg', size: '1.1 MB', url: '#' },
      { name: 'KK_Maman.pdf', type: 'application/pdf', size: '1.8 MB', url: '#' },
      { name: 'Ijazah_S1_Pertanian.pdf', type: 'application/pdf', size: '3.2 MB', url: '#' }
    ],
    catatanAdmin: 'Verifikasi selesai dan data bersih. Menunggu TTE digital Kuwu / Kepala Desa Sukadana.',
    createdAt: '2026-08-27 10:00',
    updatedAt: '2026-08-28 09:00',
    deadlineAt: '2026-08-28 17:00',
    timeline: [
      { id: 't-3a', timestamp: '27/08/2026 10:00', status: 'Pengajuan Diterima', actor: 'Sistem', role: 'System' },
      { id: 't-3b', timestamp: '27/08/2026 11:30', status: 'Verifikasi Berkas Valid', actor: 'Euis Sumarni', role: 'Operator Loket' },
      { id: 't-3c', timestamp: '28/08/2026 09:00', status: 'Disetujui Sekretaris Desa', actor: 'Dadan Ramdani, S.AP', role: 'Sekretaris Desa', notes: 'Draft surat pengantar SKCK siap ditandatangani Kuwu' }
    ]
  },
  {
    id: 'req-004',
    nomorTiket: 'DESA-2026-08-00140',
    nikPemohon: '3210095703920004',
    namaPemohon: 'Neng Siti Sarah',
    jenisSurat: 'SKPWNI',
    status: 'done',
    metadata: {
      alamatTujuan: 'Jl. Raya KH Abdul Halim No. 45, RT 02/04, Kel. Majalengka Kulon, Kec. Majalengka',
      alasanPindah: 'Pekerjaan / Dinas',
      jenisKepindahan: 'Kepala Keluarga Saja',
      jumlahAnggotaPindah: 1
    },
    dokumenPrasyarat: [
      { name: 'KTP_Neng_Siti_Sarah.jpg', type: 'image/jpeg', size: '950 KB', url: '#' },
      { name: 'KK_Siti_Sarah.pdf', type: 'application/pdf', size: '1.5 MB', url: '#' }
    ],
    dokumenHasil: 'https://sukadana-argapura.desa.id/docs/SKPWNI-2026-08-00140.pdf',
    qrHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    tteMethod: 'bsre',
    signedBy: 'H. Asep Saepudin, S.Pd., M.Si (Kuwu / Kepala Desa Sukadana)',
    signedAt: '2026-08-26 14:10',
    createdAt: '2026-08-25 09:10',
    updatedAt: '2026-08-26 14:10',
    deadlineAt: '2026-08-27 17:00',
    timeline: [
      { id: 't-4a', timestamp: '25/08/2026 09:10', status: 'Pengajuan Diterima', actor: 'Sistem', role: 'System' },
      { id: 't-4b', timestamp: '25/08/2026 13:00', status: 'Verifikasi Dokumen Valid', actor: 'Euis Sumarni', role: 'Operator Loket' },
      { id: 't-4c', timestamp: '26/08/2026 10:00', status: 'Disetujui', actor: 'Dadan Ramdani, S.AP', role: 'Sekretaris Desa' },
      { id: 't-4d', timestamp: '26/08/2026 14:10', status: 'Ditandatangani Elektronik (BSrE BSSN)', actor: 'H. Asep Saepudin, S.Pd., M.Si', role: 'Kuwu / Kepala Desa', notes: 'Sertifikat digital BSrE tersemat resmi dan tersertifikasi hukum' },
      { id: 't-4e', timestamp: '26/08/2026 14:12', status: 'Selesai & Dokumen Siap Unduh', actor: 'Sistem', role: 'System', notes: 'Notifikasi WhatsApp terkirim ke pemohon' }
    ]
  }
];

export const MOCK_ROLES: Record<Role, UserRoleInfo> = {
  superadmin: {
    role: 'superadmin',
    name: 'Rizki Kurniawan, S.Kom',
    title: 'Super Administrator TI Pemdes Sukadana',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'pengajuan:verify',
      'pengajuan:reject',
      'penduduk:write',
      'penduduk:read',
      'cms:publish',
      'user:manage',
      'data:export'
    ]
  },
  kepala_desa: {
    role: 'kepala_desa',
    name: 'H. Asep Saepudin, S.Pd., M.Si',
    title: 'Kuwu / Kepala Desa Sukadana',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'pengajuan:verify',
      'pengajuan:reject',
      'pengajuan:tte',
      'penduduk:read',
      'cms:publish',
      'data:export'
    ]
  },
  sekretaris: {
    role: 'sekretaris',
    name: 'Dadan Ramdani, S.AP',
    title: 'Sekretaris Desa Sukadana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'pengajuan:verify',
      'pengajuan:reject',
      'penduduk:write',
      'penduduk:read',
      'cms:publish',
      'data:export'
    ]
  },
  operator: {
    role: 'operator',
    name: 'Euis Sumarni',
    title: 'Operator Loket Pelayanan E-Gov',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: [
      'pengajuan:verify',
      'penduduk:read'
    ]
  }
};

export const MOCK_MUTASI: MutasiRecord[] = [
  { id: 'mut-1', jenis: 'Lahir', nik: '3210092808260001', nama: 'Fathan Al-Ghifari', tanggal: '2026-08-20', petugas: 'Dadan Ramdani, S.AP', keterangan: 'Kelahiran anak pertama pasangan Asep & Eni (Blok Sukadana Girang)' },
  { id: 'mut-2', jenis: 'Pindah Keluar', nik: '3210096507990006', nama: 'Ai Rosita', tanggal: '2026-08-15', petugas: 'Euis Sumarni', keterangan: 'Pindah domisili kerja ke Majalengka Kota' },
  { id: 'mut-3', jenis: 'Menikah', nik: '3210095703920004', nama: 'Neng Siti Sarah', tanggal: '2026-08-01', petugas: 'Dadan Ramdani, S.AP', keterangan: 'Pembaruan status KK pernikahan baru di Blok Pasir Kaler' }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '28/08/2026 10:12:45', userId: 'usr-kades', userName: 'H. Asep Saepudin', userRole: 'Kepala Desa', action: 'TTE_SIGNED', target: 'DESA-2026-08-00140', details: 'Penandatanganan digital BSrE surat SKPWNI' },
  { id: 'log-2', timestamp: '28/08/2026 09:00:12', userId: 'usr-sekdes', userName: 'Dadan Ramdani, S.AP', userRole: 'Sekretaris Desa', action: 'STATUS_APPROVED', target: 'DESA-2026-08-00142', details: 'Verifikasi final & penerusan draft SKCK Pengantar' },
  { id: 'log-3', timestamp: '28/08/2026 08:30:20', userId: 'usr-operator', userName: 'Euis Sumarni', userRole: 'Operator Loket', action: 'STATUS_REVIEW', target: 'DESA-2026-08-00145', details: 'Membuka antrean berkas SKTM Eni Rohaeni' },
  { id: 'log-4', timestamp: '27/08/2026 16:45:00', userId: 'usr-admin', userName: 'Rizki Kurniawan', userRole: 'Superadmin', action: 'EXPORT_POPULATION', target: 'DATA_PENDUDUK_SUKADANA_AGUSTUS_2026.csv', details: 'Ekspor data kependudukan 5 Blok Sukadana' }
];

export const MOCK_APBDES_2026: APBDesCategory[] = [
  {
    id: 'infra',
    title: 'Infrastruktur & Pembangunan Kawasan',
    icon: 'Building2',
    anggaran: 520000000,
    terserap: 338000000, // 65%
    kegiatan: [
      { nama: 'Pengaspalan & Rabat Beton Jalan Usaha Tani Terasering Cikondang - Pasir Kaler (950m)', anggaran: 220000000, realisasi: 220000000, status: 'Selesai' },
      { nama: 'Pembangunan Saluran Pipanisasi Air Bersih & Irigasi Hulu Lembah Ciremai', anggaran: 180000000, realisasi: 90000000, status: 'Berjalan' },
      { nama: 'Pembangunan TPT (Tembok Penahan Tanah) Longsor Jalur Wisata Agrowisata Sukadana', anggaran: 120000000, realisasi: 28000000, status: 'Berjalan' }
    ]
  },
  {
    id: 'pendidikan',
    title: 'Pertanian, UMKM & Agrowisata',
    icon: 'Store',
    anggaran: 280000000,
    terserap: 140000000, // 50%
    kegiatan: [
      { nama: 'Bantuan Bibit Unggul Bawang Daun, Pupuk Organik & Alsintan Gapoktan Sukadana', anggaran: 120000000, realisasi: 80000000, status: 'Berjalan' },
      { nama: 'Penyertaan Modal BUMDes "Sukadana Mandiri" Sentra Pascapanen & Kopi Ciremai', anggaran: 100000000, realisasi: 60000000, status: 'Berjalan' },
      { nama: 'Pelatihan Digital Marketing, Packaging & E-Commerce Pemuda Tani Desa', anggaran: 60000000, realisasi: 0, status: 'Rencana' }
    ]
  },
  {
    id: 'kesehatan',
    title: 'Kesehatan & Pencegahan Stunting',
    icon: 'Activity',
    anggaran: 190000000,
    terserap: 114000000, // 60%
    kegiatan: [
      { nama: 'Pemberian Makanan Tambahan (PMT) Balita & Ibu Hamil Posyandu Melati 1–5', anggaran: 85000000, realisasi: 58000000, status: 'Berjalan' },
      { nama: 'Operasional, Pemeriksaan Lansia & Insentif Kader Kesehatan Terpadu 5 Blok', anggaran: 65000000, realisasi: 42000000, status: 'Berjalan' },
      { nama: 'Pengadaan Jamban Sehat Keluarga & Pipanisasi PAMSIMAS Blok Sukadana Hilir', anggaran: 40000000, realisasi: 14000000, status: 'Berjalan' }
    ]
  },
  {
    id: 'operasional',
    title: 'Penyelenggaraan Pemerintahan & E-Gov',
    icon: 'Landmark',
    anggaran: 495000000,
    terserap: 312000000, // 63%
    kegiatan: [
      { nama: 'Siltap & Tunjangan Kuwu serta Perangkat Desa Sukadana', anggaran: 320000000, realisasi: 213000000, status: 'Berjalan' },
      { nama: 'Digitalisasi E-Government, Integrasi TTE BSrE & Pemeliharaan Web Desa', anggaran: 75000000, realisasi: 52000000, status: 'Berjalan' },
      { nama: 'Operasional Kantor Balai Desa, Musrenbangdes & Kelembagaan RT/RW', anggaran: 100000000, realisasi: 47000000, status: 'Berjalan' }
    ]
  }
];

export const MOCK_LAPORAN: LaporanWarga[] = [
  {
    id: 'lap-001',
    nomorTiket: 'LAPOR-2026-08-0042',
    kategori: 'Infrastruktur',
    judul: 'Lampu Penerangan Jalan Umum Blok Sukadana Girang Mati Sejak 2 Hari',
    deskripsi: 'Di pertigaan dekat gapura masuk Blok Sukadana Girang lampu jalan padam. Jalanan menjadi gelap gulita saat malam hari dan rawan bagi warga yang melintas dari arah Argapura.',
    lokasi: {
      lat: -6.8985,
      lng: 108.3150,
      alamatDeskriptif: 'Pertigaan Gapura Masuk Blok Sukadana Girang RT 03/RW 05'
    },
    fotoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
    pelapor: 'Asep Supriatna',
    isAnonim: false,
    status: 'Diproses',
    createdAt: '2026-08-27 19:30',
    slaDeadline: '2026-08-29 19:30',
    tanggapan: 'Petugas teknis desa telah dijadwalkan mengganti bohlam LED dan instalasi panel pada Jumat pagi.'
  },
  {
    id: 'lap-002',
    nomorTiket: 'LAPOR-2026-08-0041',
    kategori: 'Infrastruktur',
    judul: 'Pembersihan Longsoran Kecil Tebing Terasering di Blok Cikondang',
    deskripsi: 'Akibat hujan deras semalam, terjadi sedikit runtuhan tanah di pinggir saluran irigasi perkebunan daun bawang Blok Cikondang. Saluran air agak menyempit.',
    lokasi: {
      lat: -6.9015,
      lng: 108.3105,
      alamatDeskriptif: 'Jalur Irigasi Perkebunan Sayur Blok Cikondang RT 01/RW 03'
    },
    fotoUrl: 'https://images.unsplash.com/photo-1611288875665-728b7e28b2db?w=600&auto=format&fit=crop&q=80',
    pelapor: 'Warga Peduli Tani',
    isAnonim: true,
    status: 'Diverifikasi',
    createdAt: '2026-08-28 07:15',
    slaDeadline: '2026-08-30 07:15',
    tanggapan: 'Laporan diverifikasi. Tim BUMDes & satgas pemeliharaan drainase desa akan melakukan kerja bakti normalisasi sore ini.'
  },
  {
    id: 'lap-003',
    nomorTiket: 'LAPOR-2026-08-0039',
    kategori: 'Infrastruktur',
    judul: 'Pipa Air Bersih PAMSIMAS Blok Sukadana Hilir Bocor',
    deskripsi: 'Pipa distribusi air bersih pegunungan di dekat pos kamling bocor sehingga debit air ke pemukiman RT 02 berkurang.',
    lokasi: {
      lat: -6.8970,
      lng: 108.3175,
      alamatDeskriptif: 'Depan Pos Kamling RT 02 Blok Sukadana Hilir'
    },
    pelapor: 'Eni Rohaeni',
    isAnonim: false,
    status: 'Selesai',
    createdAt: '2026-08-25 11:00',
    slaDeadline: '2026-08-27 11:00',
    tanggapan: 'Pipa PVC sambungan telah diganti baru oleh petugas pengelola PAMSIMAS Desa Sukadana. Aliran air bersih kembali lancar normal.'
  }
];

// Data Cuaca Mikroklimat Desa Sukadana (Lereng Gn. Ciremai, Argapura, Majalengka)
export const MOCK_WEATHER: WeatherData = {
  location: 'Desa Sukadana, Argapura',
  region: 'Kabupaten Majalengka, Jawa Barat',
  elevation: '850 mdpl (Lereng Gn. Ciremai)',
  temp: 22,
  tempMin: 18,
  tempMax: 26,
  feelsLike: 21,
  condition: 'Cerah Berawan Sejuk',
  icon: 'cloud-sun',
  humidity: 78,
  windSpeed: 11,
  windDirection: 'Barat Daya (Angin Lembah Ciremai)',
  uvIndex: 4,
  airQuality: 'Sangat Sehat',
  aqiNumber: 16,
  updatedAt: 'Pembaruan Real-Time: Hari Ini, 09:30 WIB',
  agriculturalAdvice: {
    title: 'Kondisi Agroklimat Prima Hortikultura',
    description: 'Suhu sejuk 22°C dan kelembaban 78% sangat kondusif bagi pertumbuhan bawang daun, kentang, dan sawi putih lereng Ciremai.',
    suitableAction: 'Disarankan pemupukan organik cair dan penyiangan gulma pukul 07:00 - 10:30 WIB.',
    caution: 'Waspada potensi kabut tebal dan embun basah di atas elevasi 800 mdpl menjelang sore.'
  },
  forecast: [
    {
      day: 'Hari Ini',
      date: '9 Sep',
      temp: '18° - 24°C',
      tempNum: 22,
      condition: 'Cerah Berawan',
      icon: 'cloud-sun',
      rainProb: 15
    },
    {
      day: 'Besok',
      date: '10 Sep',
      temp: '17° - 23°C',
      tempNum: 21,
      condition: 'Hujan Ringan Siang',
      icon: 'cloud-rain',
      rainProb: 65
    },
    {
      day: 'Lusa',
      date: '11 Sep',
      temp: '18° - 25°C',
      tempNum: 23,
      condition: 'Berawan Lembut',
      icon: 'cloud',
      rainProb: 20
    },
    {
      day: 'Sabtu',
      date: '12 Sep',
      temp: '19° - 26°C',
      tempNum: 24,
      condition: 'Cerah Segar',
      icon: 'sun',
      rainProb: 10
    }
  ]
};

// Siaran Berjalan / Flash News Ticker
export const MOCK_TICKER_ITEMS: NewsTickerItem[] = [
  {
    id: 'ticker-1',
    tag: 'BANSOS DESA',
    type: 'urgent',
    title: 'Penyaluran BLT Dana Desa Triwulan III dijadwalkan Jumat, 12 September di Aula Balai Desa Sukadana. Wajib membawa KTP & KK asli.',
    time: '1 jam lalu',
    linkAction: 'layanan',
    detailText: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa kepada 85 KPM terdaftar. Jam pelayanan 08:30 - 14:00 WIB.'
  },
  {
    id: 'ticker-2',
    tag: 'CUACA TANI',
    type: 'info',
    title: 'Prakiraan Cuaca Lereng Ciremai: Cerah berawan 22°C. Petani bawang daun diimbau menyelesaikan panen terasering sebelum kabut sore.',
    time: '30 mnt lalu',
    detailText: 'Kondisi mikroklimat kondusif untuk panen hortikultura dan distribusi hasil bumi menuju Pasar Induk Majalengka.'
  },
  {
    id: 'ticker-3',
    tag: 'E-GOVERNMENT',
    type: 'info',
    title: 'Layanan Pengajuan Surat SKU, SKTM & SKCK Desa kini siap cetak mandiri 24 jam ber-TTE resmi BSrE BSSN tanpa pungli.',
    time: 'Hari ini',
    linkAction: 'layanan',
    detailText: 'Masyarakat dapat mengunggah berkas prasyarat dari HP, memantau nomor tiket, dan mengunduh surat ber-QR Code resmi.'
  },
  {
    id: 'ticker-4',
    tag: 'GOTONG ROYONG',
    type: 'agenda',
    title: 'Kerja Bakti Normalisasi Saluran Irigasi Tersier Cikondang serentak seluruh RT hari Minggu pukul 07:00 WIB.',
    time: 'Kemarin',
    detailText: 'Pembersihan endapan sedimentasi saluran irigasi agar pasokan air ke 45 hektar sawah terasering lancar sepanjang musim tanam.'
  },
  {
    id: 'ticker-5',
    tag: 'KESEHATAN',
    type: 'agenda',
    title: 'Pelayanan Posyandu Balita & Lansia Flamboyan RW 02 dilaksanakan Rabu depan di Poskesdes Sukadana.',
    time: '2 hari lalu',
    detailText: 'Pemeriksaan tensi, gula darah lansia gratis serta pemberian vitamin dan imunisasi lengkap balita.'
  }
];

export const MOCK_BERITA: BeritaItem[] = [
  {
    id: 'news-1',
    tipe: 'Berita',
    judul: 'Desa Sukadana Luncurkan Layanan E-Persuratan Ber-Tanda Tangan Elektronik Resmi BSrE BSSN',
    slug: 'peluncuran-e-persuratan-digital-desa-sukadana-argapura',
    kategori: 'Pemerintahan & Digital',
    ringkasan: 'Warga Desa Sukadana kini dapat mengajukan SKU, SKTM, SKCK Pengantar secara mandiri 24 jam dengan verifikasi barcode legalitas BSrE BSSN tanpa antrean panjang.',
    konten: '<p>Pemerintah Desa Sukadana, Kecamatan Argapura, Kabupaten Majalengka resmi meluncurkan platform terintegrasi E-Government Web Desa untuk memudahkan warga dalam mengajukan berkas persuratan dan melacak statusnya secara real-time.</p><p>Kuwu Desa Sukadana, H. Asep Saepudin, S.Pd., M.Si menyampaikan bahwa inovasi ini dirancang dengan standar <em>Government as a Service</em> (GaaS), mengedepankan kecepatan layanan tanpa calo dan transparansi penuh APBDes. Melalui sistem barcode bersertifikasi BSrE BSSN, surat keterangan yang diterbitkan berkekuatan hukum penuh dan diakui instansi perbankan maupun kedinasan.</p><p>Warga cukup memasukkan NIK atau nomor tiket untuk memantau tahapan verifikasi mulai dari operator, sekretaris desa, hingga pengesahan digital kepala desa secara transparan.</p>',
    gambar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    penulis: 'Sekretariat Desa Sukadana',
    tanggal: '28 Agustus 2026',
    isPinned: true,
    readTime: '3 mnt baca',
    views: 1420
  },
  {
    id: 'news-2',
    tipe: 'Pengumuman',
    judul: 'Panen Raya Hortikultura Bawang Daun & Pameran UMKM Agrowisata Sukadana Lereng Ciremai',
    slug: 'panen-raya-hortikultura-bawang-daun-sukadana-2026',
    kategori: 'Pertanian & Agrowisata',
    ringkasan: 'Hasil panen daun bawang dan sayuran terasering petani Desa Sukadana berhasil mencatatkan peningkatan produksi 28% dengan kemitraan jalur logistik pasar induk terpadu.',
    konten: '<p>Kelompok Tani (Gapoktan) Sukadana Mandiri bersama BUMDes sukses menggelar panen raya komoditas unggulan daun bawang dan sayuran hortikultura lereng Gunung Ciremai. Kualitas bawang daun Sukadana yang beraroma kuat dan berbatang tebal menjadi primadona pasar agribisnis Jawa Barat.</p><p>Program pompanisasi air irigasi tenaga gravitasi yang didanai melalui APBDes 2026 terbukti berhasil menjaga kelembaban lahan terasering pada musim kemarau basah tahun ini. Ketua BUMDes mengungkapkan bahwa para petani kini dapat menjual hasil panen dengan harga stabil tanpa tertekan perantara tengkulak.</p>',
    gambar: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    penulis: 'BUMDes Sukadana Mandiri',
    tanggal: '27 Agustus 2026',
    isPinned: true,
    readTime: '4 mnt baca',
    views: 980
  },
  {
    id: 'news-3',
    tipe: 'Agenda',
    judul: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Sukadana RKPDes 2027',
    slug: 'agenda-musrenbangdes-sukadana-argapura-tahun-2027',
    kategori: 'Pembangunan',
    ringkasan: 'Musyawarah terbuka penyusunan prioritas proyek desa bersama BPD, Ketua RT/RW, LPM, Tokoh Adat, dan Tokoh Pemuda di Balai Pertemuan Desa Sukadana.',
    konten: '<p>Musrenbangdes akan membahas usulan perbaikan jalan usaha tani, perluasan jaringan irigasi pertanian lereng bukit, serta program beasiswa anak petani berprestasi dan permodalan UMKM ramah lingkungan.</p><p>Keterbukaan aspirasi ini menjadi bukti nyata tata kelola anggaran berbasis partisipatif di mana seluruh warga memiliki hak suara dalam merencanakan masa depan Desa Sukadana.</p>',
    gambar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    penulis: 'BPD Sukadana',
    tanggal: '5 September 2026',
    readTime: '2 mnt baca',
    views: 740
  },
  {
    id: 'news-4',
    tipe: 'Berita',
    judul: 'Peningkatan Jalan Hotmix Usaha Tani Terasering Cikondang Capai 100% dari Dana Desa',
    slug: 'pengaspalan-jalan-usaha-tani-sukadana-tuntas',
    kategori: 'Infrastruktur',
    ringkasan: 'Akses mobilitas angkutan pupuk dan sayuran petani kini mulus setelah jalan usaha tani sepanjang 950 meter selesai diaspal dengan standar konstruksi bermutu.',
    konten: '<p>Pembangunan infrastruktur fisik desa kembali menorehkan capaian gemilang. Ruas jalan usaha tani Cikondang yang sebelumnya berbatu dan licin saat hujan kini telah dilapisi aspal hotmix bermutu tinggi berkat alokasi Dana Desa Bidang Pembangunan Fisik 2026 senilai Rp 245.000.000.</p><p>Kini mobil pikap pengangkut komoditas tani dapat langsung masuk ke bibir terasering, memangkas ongkos pikul petani hingga 50% dan mempercepat waktu kirim ke pasar sayur Argapura.</p>',
    gambar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=800&auto=format&fit=crop&q=80',
    penulis: 'Tim Pelaksana Kegiatan (TPK)',
    tanggal: '22 Agustus 2026',
    readTime: '3 mnt baca',
    views: 610
  },
  {
    id: 'news-5',
    tipe: 'Berita',
    judul: 'Generasi Muda Sukadana Kembangkan Agrowisata Terasering & Kafe Kopi Ciremai Berkelanjutan',
    slug: 'pemuda-desa-sukadana-kembangkan-agrowisata-kopi-terasering',
    kategori: 'Kepemudaan & Wisata',
    ringkasan: 'Karang Taruna Tunas Harapan Sukadana menginisiasi spot eduwisata kopi lereng Ciremai dengan pemandangan lembah Argapura yang menakjubkan.',
    konten: '<p>Memanfaatkan pesona panorama alam lereng Gunung Ciremai yang asri, Karang Taruna Desa Sukadana menggagas destinasi Agrowisata Terasering Kopi Ciremai. Pengunjung tidak hanya disuguhi panorama hamparan kebun hijau berundak, namun juga dapat belajar proses petik merah kopi Robusta dan Arabika lokal serta menyeduhnya secara tradisional.</p><p>Kuwu H. Asep Saepudin mengapresiasi terobosan ini sebagai langkah nyata pemberdayaan generasi muda agar bangga membangun desa dan membuka lapangan kerja kreatif.</p>',
    gambar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    penulis: 'Karang Taruna Sukadana',
    tanggal: '18 Agustus 2026',
    readTime: '3 mnt baca',
    views: 890
  },
  {
    id: 'news-6',
    tipe: 'Pengumuman',
    judul: 'Pencegahan Stunting: Desa Sukadana Bagikan Paket Nutrisi Tambahan Telur & Susu Balita',
    slug: 'pemberian-makanan-tambahan-balita-sukadana-2026',
    kategori: 'Kesehatan Warga',
    ringkasan: 'Program Zero Stunting Desa Sukadana membagikan paket PMT bergizi seimbang untuk 65 balita dan ibu hamil di 4 posyandu desa.',
    konten: '<p>Komitmen menurunkan angka stunting terus digalakkan secara intensif oleh TP-PKK dan Bidan Desa Sukadana. Dalam kegiatan Posyandu Integrasi Layanan Primer (ILP) bulan ini, dibagikan paket Pemberian Makanan Tambahan (PMT) tinggi protein hewani meliputi telur lokal segar, susu balita, kacang hijau, dan madu murni lereng Ciremai.</p><p>Kader posyandu juga memberikan edukasi sanitasi air bersih serta pemantauan kurva tumbuh kembang berat dan tinggi badan anak secara digital.</p>',
    gambar: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop&q=80',
    penulis: 'Kader PKK & Bidan Desa',
    tanggal: '14 Agustus 2026',
    readTime: '2 mnt baca',
    views: 530
  }
];


export const VILLAGE_OFFICIALS: VillageOfficial[] = [
  {
    id: 'kades',
    name: 'H. Asep Saepudin, S.Pd., M.Si',
    role: 'Kuwu / Kepala Desa',
    jabatanLevel: 'kepala',
    nip: '19750814 200212 1 002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    phone: '+62 821-2345-6789',
    quote: 'Membangun Desa Sukadana yang agamis, mandiri, berkeadilan sosial dan melayani sepenuh hati.'
  },
  {
    id: 'sekdes',
    name: 'Dadan Ramdani, S.AP',
    role: 'Sekretaris Desa',
    jabatanLevel: 'sekdes',
    nip: '19840321 200903 1 004',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    phone: '+62 813-9876-5432',
    quote: 'Tertib administrasi persuratan dan keterbukaan informasi adalah pondasi kemajuan warga.',
    reportTo: 'kades'
  },
  {
    id: 'kaur-perencanaan',
    name: 'Cecep Hidayat, ST',
    role: 'Kaur Perencanaan & Pembangunan',
    jabatanLevel: 'kaur',
    nip: '19871105 201101 1 003',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    phone: '+62 856-1122-3344',
    quote: 'Infrastruktur jalan usaha tani dan irigasi berkualitas untuk kemakmuran petani lereng Ciremai.',
    reportTo: 'sekdes'
  },
  {
    id: 'kaur-keuangan',
    name: 'Neni Rosmiati, SE',
    role: 'Kaur Keuangan (Bendahara Desa)',
    jabatanLevel: 'kaur',
    nip: '19910619 201502 2 001',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    phone: '+62 877-4433-2211',
    quote: 'Pengelolaan APBDes yang akuntabel, transparan, dan tepat sasaran bagi seluruh warga.',
    reportTo: 'sekdes'
  },
  {
    id: 'kaur-tu',
    name: 'Rini Andriyani, S.Sos',
    role: 'Kaur Tata Usaha & Umum',
    jabatanLevel: 'kaur',
    nip: '19900408 201302 2 003',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
    phone: '+62 822-3344-5566',
    quote: 'Ketertiban administrasi umum dan arsip desa adalah cerminan profesionalisme pelayanan.',
    reportTo: 'sekdes'
  },
  {
    id: 'kasi-pelayanan',
    name: 'Agus Setiawan, S.IP',
    role: 'Kasi Pelayanan & Kesejahteraan',
    jabatanLevel: 'kasi',
    nip: '19800912 200801 1 005',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    phone: '+62 818-7766-5544',
    quote: 'Pelayanan cepat, ramah tanpa pungutan liar demi kemudahan warga Desa Sukadana.',
    reportTo: 'kades'
  },
  {
    id: 'kasi-pemerintahan',
    name: 'Dadang Hidayat, S.IP',
    role: 'Kasi Pemerintahan',
    jabatanLevel: 'kasi',
    nip: '19821205 200803 1 006',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    phone: '+62 819-8877-6655',
    quote: 'Tertib pemerintahan dan data kependudukan yang akurat adalah hak setiap warga desa.',
    reportTo: 'kades'
  },
  {
    id: 'kasi-kesra',
    name: 'Euis Sumarni, A.Md',
    role: 'Kasi Kesejahteraan & Operator Loket',
    jabatanLevel: 'kasi',
    nip: '19941019 201703 2 007',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    phone: '+62 815-4455-6677',
    quote: 'Kesejahteraan warga adalah prioritas utama layanan kami setiap hari.',
    reportTo: 'kades'
  }
];

export const PERDES_LIST: PerdesItem[] = [
  {
    id: 'perdes-001',
    nomor: '01/PERDES/SKD/2024',
    judul: 'Peraturan Desa tentang APBDes Tahun Anggaran 2024',
    tentang: 'Anggaran Pendapatan dan Belanja Desa (APBDes) Desa Sukadana Tahun Anggaran 2024',
    tanggalPenetapan: '2 Januari 2024',
    tahun: 2024,
    status: 'Berlaku',
    kategori: 'Keuangan',
    keterangan: 'Ditetapkan bersama BPD Desa Sukadana'
  },
  {
    id: 'perdes-002',
    nomor: '02/PERDES/SKD/2024',
    judul: 'Peraturan Desa tentang RKPDes Tahun 2025',
    tentang: 'Rencana Kerja Pemerintah Desa (RKPDes) Sukadana Tahun 2025',
    tanggalPenetapan: '15 Agustus 2024',
    tahun: 2024,
    status: 'Berlaku',
    kategori: 'Pembangunan',
    keterangan: 'Memuat prioritas pembangunan jalan usaha tani dan irigasi'
  },
  {
    id: 'perdes-003',
    nomor: '03/PERDES/SKD/2024',
    judul: 'Peraturan Desa tentang BUMDes Sukadana Mandiri',
    tentang: 'Pembentukan dan Pengelolaan Badan Usaha Milik Desa (BUMDes) Sukadana Mandiri',
    tanggalPenetapan: '10 Maret 2024',
    tahun: 2024,
    status: 'Berlaku',
    kategori: 'Kemasyarakatan',
    keterangan: 'BUMDes mengelola unit simpan pinjam dan pemasaran hasil tani'
  },
  {
    id: 'perdes-004',
    nomor: '01/PERDES/SKD/2023',
    judul: 'Peraturan Desa tentang APBDes Tahun Anggaran 2023',
    tentang: 'Anggaran Pendapatan dan Belanja Desa (APBDes) Desa Sukadana Tahun Anggaran 2023',
    tanggalPenetapan: '3 Januari 2023',
    tahun: 2023,
    status: 'Berlaku',
    kategori: 'Keuangan'
  },
  {
    id: 'perdes-005',
    nomor: '02/PERDES/SKD/2023',
    judul: 'Peraturan Desa tentang Tata Tertib Pemilihan Ketua RT/RW',
    tentang: 'Tata Cara Pemilihan, Pengangkatan dan Pemberhentian Ketua Rukun Tetangga (RT) dan Rukun Warga (RW)',
    tanggalPenetapan: '5 April 2023',
    tahun: 2023,
    status: 'Berlaku',
    kategori: 'Pemerintahan'
  },
  {
    id: 'perdes-006',
    nomor: '01/PERDES/SKD/2022',
    judul: 'Peraturan Desa tentang Pengelolaan Sampah dan Kebersihan Lingkungan',
    tentang: 'Pengelolaan Kebersihan Lingkungan, Bank Sampah, dan Sanksi Administrasi bagi Pembuang Sampah Sembarangan',
    tanggalPenetapan: '12 Februari 2022',
    tahun: 2022,
    status: 'Berlaku',
    kategori: 'Kemasyarakatan',
    keterangan: 'Program bank sampah aktif di 3 RW'
  },
  {
    id: 'perdes-007',
    nomor: '02/PERDES/SKD/2022',
    judul: 'Peraturan Desa tentang Kawasan Agrowisata dan Pelestarian Lingkungan Lereng Ciremai',
    tentang: 'Pengelolaan Kawasan Agrowisata Terasering dan Pelestarian Ekosistem Lereng Gunung Ciremai di Wilayah Desa Sukadana',
    tanggalPenetapan: '18 Juni 2022',
    tahun: 2022,
    status: 'Berlaku',
    kategori: 'Tata Ruang'
  },
  {
    id: 'perdes-008',
    nomor: '01/PERDES/SKD/2021',
    judul: 'Peraturan Desa tentang APBDes Tahun Anggaran 2021',
    tentang: 'Anggaran Pendapatan dan Belanja Desa Sukadana Tahun Anggaran 2021',
    tanggalPenetapan: '4 Januari 2021',
    tahun: 2021,
    status: 'Berlaku',
    kategori: 'Keuangan'
  },
  {
    id: 'perdes-009',
    nomor: '01/PERDES/SKD/2025',
    judul: 'Peraturan Desa tentang APBDes Tahun Anggaran 2025',
    tentang: 'Anggaran Pendapatan dan Belanja Desa (APBDes) Desa Sukadana Tahun Anggaran 2025',
    tanggalPenetapan: '2 Januari 2025',
    tahun: 2025,
    status: 'Berlaku',
    kategori: 'Keuangan',
    keterangan: 'Total APBDes 2025: Rp 1.847.650.000'
  },
  {
    id: 'perdes-010',
    nomor: '02/PERDES/SKD/2025',
    judul: 'Peraturan Desa tentang Pemberdayaan UMKM dan Usaha Tani Digital',
    tentang: 'Pemberdayaan dan Perlindungan Usaha Mikro Kecil Masyarakat (UMKM) serta Digitalisasi Sistem Pemasaran Hasil Pertanian Desa Sukadana',
    tanggalPenetapan: '20 Maret 2025',
    tahun: 2025,
    status: 'Berlaku',
    kategori: 'Kemasyarakatan',
    keterangan: 'Mendukung program digitalisasi pemasaran bawang daun via marketplace'
  }
];

export const MAP_FACILITIES = [
  { id: 'f-1', name: 'Kantor Balai Desa Sukadana', category: 'Pemerintahan', lat: -6.8985, lng: 108.3150, desc: 'Pusat pelayanan administrasi kependudukan & kantor Kuwu Desa Sukadana, Kec. Argapura', icon: 'Landmark' },
  { id: 'f-2', name: 'Puskesmas Pembantu (Pustu) Sukadana', category: 'Kesehatan', lat: -6.8970, lng: 108.3175, desc: 'Layanan gawat darurat ringan, bidan desa, dan posyandu balita & lansia', icon: 'HeartPulse' },
  { id: 'f-3', name: 'SDN Sukadana I & II', category: 'Pendidikan', lat: -6.9005, lng: 108.3130, desc: 'Sekolah dasar negeri berprestasi di kawasan Argapura', icon: 'GraduationCap' },
  { id: 'f-4', name: 'Masjid Jami Al-Barokah Sukadana', category: 'Ibadah', lat: -6.8980, lng: 108.3140, desc: 'Pusat kegiatan keagamaan, pengajian akbar, dan peringatan hari besar Islam', icon: 'MoonStar' },
  { id: 'f-5', name: 'Sentra Daun Bawang & Pasar BUMDes Sukadana Mandiri', category: 'Ekonomi', lat: -6.8965, lng: 108.3185, desc: 'Sentra penampungan & perdagangan hasil hortikultura lereng Ciremai', icon: 'Store' },
  { id: 'f-6', name: 'Agrowisata Lembah Terasering & Kopi Ciremai Sukadana', category: 'Wisata', lat: -6.9020, lng: 108.3220, desc: 'Panorama keindahan terasering perbukitan dan sentra petik sayur & kopi Argapura', icon: 'Compass' },
  { id: 'f-7', name: 'Proyek Pengaspalan Jalan Usaha Tani Terasering Cikondang', category: 'Proyek', lat: -6.9015, lng: 108.3105, desc: 'Peningkatan jalan hotmix usaha tani 950m APBDes 2026 (Status: Selesai 100%)', icon: 'CheckCircle2' },
  { id: 'f-8', name: 'Proyek Saluran Pipanisasi Irigasi Pertanian Sayur Hulu Ciremai', category: 'Proyek', lat: -6.8950, lng: 108.3190, desc: 'Pembangunan pipa air gravitasi irigasi pertanian APBDes 2026 (Anggaran: Rp 180 Jt)', icon: 'Hammer' }
];
