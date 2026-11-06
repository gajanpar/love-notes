<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ActivityLogController extends Controller
{
    /**
     * Display the system activity and audit trail logs with filtering.
     */
    public function index(Request $request): View
    {
        $search = trim((string) $request->get('search', ''));
        $actionFilter = (string) $request->get('action', 'all');
        $roleFilter = (string) $request->get('role', 'all');
        $dateFilter = (string) $request->get('date', '');

        $query = ActivityLog::with('user')->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        if ($actionFilter !== 'all') {
            $query->where('action', 'like', "{$actionFilter}%");
        }

        if ($roleFilter !== 'all') {
            $query->where('user_role', $roleFilter);
        }

        if ($dateFilter !== '') {
            $query->whereDate('created_at', $dateFilter);
        }

        $logs = $query->paginate(25)->withQueryString();

        $actionGroups = [
            'all' => 'Semua Aksi',
            'period' => 'Kelola Periode',
            'edit_request' => 'Persetujuan / Penolakan Akses',
            'user' => 'Manajemen Pengguna',
            'employee' => 'Master Personel TAD',
            'division' => 'Master Divisi',
            'rubrik' => 'Kalibrasi Rubrik',
            'system' => 'Otomasi Sistem / Scheduler',
        ];

        $counts = [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::whereDate('created_at', today())->count(),
            'period' => ActivityLog::where('action', 'like', 'period%')->count(),
            'requests' => ActivityLog::where('action', 'like', 'edit_request%')->count(),
        ];

        return view('admin.activity_logs.index', [
            'logs' => $logs,
            'search' => $search,
            'actionFilter' => $actionFilter,
            'roleFilter' => $roleFilter,
            'dateFilter' => $dateFilter,
            'actionGroups' => $actionGroups,
            'counts' => $counts,
        ]);
    }
}
