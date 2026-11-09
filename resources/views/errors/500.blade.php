@extends('errors.layout')

@section('title', '500 - Kendala Sistem')
@section('code', '500')
@section('badge', 'Kendala Server')

@section('icon_bg', '#fef2f2')
@section('icon_color', '#b91c1c')
@section('pill_bg', '#fee2e2')
@section('pill_color', '#991b1b')

@section('icon')
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
@endsection

@section('heading', 'Terjadi Kendala Teknis Server')
@section('message', 'Sistem mendeteksi anomali internal saat memproses permintaan Anda. Insiden ini telah dicatat ke dalam log diagnostik untuk ditindaklanjuti oleh Administrator IT Pelindo Cirebon.')

@section('actions')
<button type="button" onclick="window.location.reload()" class="btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
    <span>Coba Muat Ulang</span>
</button>
<a href="{{ url('/dashboard') }}" class="btn-secondary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Kembali ke Beranda</span>
</a>
@endsection
