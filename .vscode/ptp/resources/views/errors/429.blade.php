@extends('errors.layout')

@section('title', '429 - Batas Percobaan Terlampaui')
@section('code', '429')
@section('badge', 'Proteksi Keamanan')

@section('icon_bg', '#ffedd5')
@section('icon_color', '#ea580c')
@section('pill_bg', '#fed7aa')
@section('pill_color', '#9a3412')

@section('icon')
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
@endsection

@section('heading', 'Batas Percobaan Terlampaui')
@section('message', 'Sistem mendeteksi terlalu banyak percobaan masuk dalam waktu singkat. Akses masuk dikunci sementara selama 15 menit demi melindungi akun Anda dari potensi pembobolan brute-force.')

@section('actions')
<a href="{{ route('login') }}" class="btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
    <span>Kembali ke Halaman Login</span>
</a>
@endsection
