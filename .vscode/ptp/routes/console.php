<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Jadwalkan penguncian otomatis periode bulan lampau setiap awal bulan pukul 00:00 WIB
Schedule::command('period:auto-lock')->monthlyOn(1, '00:00');
