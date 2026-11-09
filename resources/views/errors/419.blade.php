@extends('errors.layout')

@section('title', '419 - Sesi Berakhir')
@section('code', '419')
@section('badge', 'Sesi Kadaluarsa')

@section('icon_bg', '#fef3c7')
@section('icon_color', '#d97706')
@section('pill_bg', '#fde68a')
@section('pill_color', '#92400e')

@section('icon')
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
@endsection

@section('heading', 'Sesi Browser Telah Berakhir')
@section('message', 'Demi melindungi integritas data penilaian kinerja karyawan, sesi kerja Anda dinonaktifkan secara otomatis karena tidak ada aktivitas dalam batas waktu aman. Silakan masuk kembali untuk melanjutkan.')

@section('actions')
<a href="{{ route('login') }}" class="btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
    <span>Login Ulang Sekarang</span>
</a>
<button type="button" onclick="window.location.reload()" class="btn-secondary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
    <span>Muat Ulang Halaman</span>
</button>
@endsection
