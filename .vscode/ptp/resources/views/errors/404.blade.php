@extends('errors.layout')

@section('title', '404 - Halaman Tidak Ditemukan')
@section('code', '404')
@section('badge', 'Tidak Ditemukan')

@section('icon_bg', '#e0f2fe')
@section('icon_color', '#0369a1')
@section('pill_bg', '#e0f2fe')
@section('pill_color', '#075985')

@section('icon')
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
@endsection

@section('heading', 'Halaman Tidak Ditemukan')
@section('message', 'Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan ke menu lain, atau berkas telah dihapus dari sistem SPKTAD.')

@section('actions')
<a href="{{ url('/dashboard') }}" class="btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Kembali ke Dashboard</span>
</a>
@endsection
