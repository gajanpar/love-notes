// src/types/index.ts

export type SuratType =
  | 'SKU'            // Surat Keterangan Usaha
  | 'SKTM'           // Surat Keterangan Tidak Mampu
  | 'SKN'            // Surat Pengantar Nikah
  | 'SKPWNI'         // Surat Keterangan Pindah
  | 'SKCK-PENGANTAR' // Surat Pengantar SKCK
  | 'SKTD';          // Surat Keterangan Tidak Sengketa

export type StatusEnum =
  | 'pending'    // Baru dikirim
  | 'review'     // Sedang diperiksa admin
  | 'revision'   // Perlu revisi dokumen
  | 'approved'   // Disetujui, menunggu TTE
  | 'signed'     // Sudah ditandatangani
  | 'done'       // Siap diunduh
  | 'rejected';  // Ditolak

export interface SuratConfig {
  code: SuratType;
  title: string;
  category: 'Kependudukan' | 'Usaha' | 'Sosial' | 'Pernikahan';
  sla: string;
  slaDays: number;
  icon: string;
  description: string;
  requirements: string[];
  fields: FormFieldSchema[];
}

export interface FormFieldSchema {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'currency';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: string[];
  autoFillFrom?: 'nik' | 'nama' | 'alamat' | 'rtRw' | 'pekerjaan' | 'agama';
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  status: string;
  actor: string;
  role: string;
  notes?: string;
}

export interface PengajuanSurat {
  id: string;
  nomorTiket: string;
  nikPemohon: string;
  namaPemohon: string;
  jenisSurat: SuratType;
  status: StatusEnum;
  metadata: Record<string, any>;
  dokumenPrasyarat: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
    previewUrl?: string;
  }>;
  catatanAdmin?: string;
  dokumenHasil?: string;
  qrHash?: string;
  tteMethod?: 'pin' | 'otp' | 'bsre';
  signedBy?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
  deadlineAt: string;
  timeline: ActivityTimelineItem[];
}

export interface PendudukData {
  nik: string;
  noKk: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  rtRw: string;
  pekerjaan: string;
  agama: string;
  statusPernikahan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  status: 'Aktif' | 'Pindah' | 'Meninggal';
  fotoKtp?: string;
}

export interface MutasiRecord {
  id: string;
  jenis: 'Lahir' | 'Menikah' | 'Pindah Masuk' | 'Pindah Keluar' | 'Meninggal';
  nik: string;
  nama: string;
  tanggal: string;
  petugas: string;
  keterangan: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  details: string;
}

export type Role = 'superadmin' | 'kepala_desa' | 'sekretaris' | 'operator';

export type Permission =
  | 'pengajuan:verify'
  | 'pengajuan:reject'
  | 'pengajuan:tte'
  | 'penduduk:write'
  | 'penduduk:read'
  | 'cms:publish'
  | 'user:manage'
  | 'data:export';

export interface UserRoleInfo {
  role: Role;
  name: string;
  title: string;
  avatar: string;
  permissions: Permission[];
}

// Utility: periksa apakah role punya permission tertentu
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  superadmin: ['pengajuan:verify', 'pengajuan:reject', 'penduduk:write', 'penduduk:read', 'cms:publish', 'user:manage', 'data:export'],
  kepala_desa: ['pengajuan:verify', 'pengajuan:reject', 'pengajuan:tte', 'penduduk:read', 'cms:publish', 'data:export'],
  sekretaris:  ['pengajuan:verify', 'pengajuan:reject', 'penduduk:write', 'penduduk:read', 'cms:publish', 'data:export'],
  operator:    ['pengajuan:verify', 'penduduk:read'],
};

export function hasPermission(role: Role, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(perm);
}

export interface APBDesCategory {
  id: string;
  title: string;
  icon: string;
  anggaran: number;
  terserap: number;
  kegiatan: Array<{
    nama: string;
    anggaran: number;
    realisasi: number;
    status: 'Selesai' | 'Berjalan' | 'Rencana';
  }>;
}

export interface LaporanWarga {
  id: string;
  nomorTiket: string;
  kategori: 'Infrastruktur' | 'Kebersihan' | 'Keamanan' | 'Sosial' | 'Pelayanan' | 'Lainnya';
  judul: string;
  deskripsi: string;
  lokasi: {
    lat: number;
    lng: number;
    alamatDeskriptif: string;
  };
  fotoUrl?: string;
  pelapor: string;
  isAnonim: boolean;
  status: 'Menunggu' | 'Diverifikasi' | 'Diproses' | 'Selesai';
  createdAt: string;
  slaDeadline: string;
  tanggapan?: string;
}

export interface BeritaItem {
  id: string;
  tipe: 'Berita' | 'Pengumuman' | 'Agenda';
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  konten: string;
  gambar: string;
  penulis: string;
  tanggal: string;
  isPinned?: boolean;
  readTime?: string;
  views?: number;
}

// Data Cuaca Lereng Gunung Ciremai
export interface WeatherForecastItem {
  day: string;
  date: string;
  temp: string;
  tempNum: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud';
  rainProb: number;
  rainSum?: number;
  uvIndexMax?: number;
  windSpeedMax?: number;
  windGustsMax?: number;
  sunrise?: string;
  sunset?: string;
  moonPhase?: number;
}

export interface HourlyWeatherItem {
  time: string;
  hourStr: string;
  temp: number;
  rainProb: number;
  cloudCover: number;
  windSpeed: number;
  isDay: boolean;
  weatherCode: number;
  humidity?: number;
  surfacePressure?: number;
  soilTemp0cm?: number;
  soilTemp6cm?: number;
  soilTemp18cm?: number;
  soilTemp54cm?: number;
  et0?: number;
  visibility?: number;
  uvIndex?: number;
  windGusts?: number;
  windDirection?: number;
}

export interface SoilTelemetry {
  temp0cm: number;
  temp6cm: number;
  temp18cm: number;
  temp54cm: number;
  evapotranspiration: number;
}

export interface WeatherData {
  location: string;
  region: string;
  elevation: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud';
  humidity: number;
  windSpeed: number;
  windGusts?: number;
  windDirection: string;
  windDirectionDeg?: number;
  uvIndex: number;
  airQuality: string;
  aqiNumber: number;
  updatedAt: string;
  agriculturalAdvice: {
    title: string;
    description: string;
    suitableAction: string;
    caution: string;
  };
  forecast: WeatherForecastItem[];
  // Ranah Luas Telemetri
  surfacePressure?: number;
  dewPoint?: number;
  cloudCover?: number;
  visibilityKm?: number;
  sunriseToday?: string;
  sunsetToday?: string;
  moonPhaseToday?: number;
  soilTelemetry?: SoilTelemetry;
  hourlyTrends?: HourlyWeatherItem[];
}

// News Ticker / Running Info Kilat
export interface NewsTickerItem {
  id: string;
  tag: string;
  type: 'urgent' | 'info' | 'agenda';
  title: string;
  time: string;
  linkAction?: string;
  detailText?: string;
}

// Peraturan Desa
export interface PerdesItem {
  id: string;
  nomor: string;         // cth: "01/PERDES/2024"
  judul: string;
  tentang: string;
  tanggalPenetapan: string;
  tahun: number;
  status: 'Berlaku' | 'Diubah' | 'Dicabut';
  kategori: 'Keuangan' | 'Pembangunan' | 'Kemasyarakatan' | 'Pemerintahan' | 'Tata Ruang' | 'Lainnya';
  dokumenUrl?: string;
  keterangan?: string;
}

// Struktur pejabat dengan hierarki org chart
export interface VillageOfficial {
  id: string;
  name: string;
  role: string;
  jabatanLevel: 'kepala' | 'sekdes' | 'kaur' | 'kasi' | 'staf';
  nip: string;
  avatar: string;
  phone: string;
  quote: string;
  reportTo?: string; // id pejabat atasan
}

export interface BPDMember {
  id: string;
  name: string;
  role: string;
  representativeArea: string;
  avatar: string;
  phone: string;
  quote: string;
  focusArea: string;
}

