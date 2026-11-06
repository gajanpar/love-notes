@extends('errors.layout')

@section('title', '403 - Akses Dibatasi')
@section('code', '403')
@section('badge', 'Akses Ditolak')

@section('icon_bg', '#fef2f2')
@section('icon_color', '#dc2626')
@section('pill_bg', '#fee2e2')
@section('pill_color', '#b91c1c')

@section('icon')
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>
@endsection

@section('heading', 'Akses Modul Dibatasi')
@section('message', 'Mohon maaf, akun Anda tidak memiliki hak otorisasi yang memadai untuk mengakses modul atau mengeksekusi tindakan ini pada sistem SPKTAD.')

@section('actions')
<a href="{{ url('/dashboard') }}" class="btn-primary">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Kembali ke Dashboard</span>
</a>
@endsection
