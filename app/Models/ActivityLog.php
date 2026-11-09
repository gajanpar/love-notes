<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'user_name',
        'user_role',
        'action',
        'description',
        'target_model',
        'target_id',
        'ip_address',
        'user_agent',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convenience logger method for activity tracking.
     */
    public static function log(
        string $action,
        string $description,
        ?int $userId = null,
        ?string $ip = null,
        ?string $ua = null
    ): self {
        $actor = $userId ? User::find($userId) : Auth::user();

        return self::create([
            'user_id' => $actor?->id,
            'user_name' => $actor?->name ?? 'SYSTEM',
            'user_role' => $actor?->role ?? 'system',
            'action' => $action,
            'description' => $description,
            'ip_address' => $ip ?? Request::ip(),
            'user_agent' => $ua ?? Request::userAgent(),
        ]);
    }

    /**
     * Record a system or user activity log entry.
     *
     * @param  string  $action  Identifier e.g. 'period.toggle'
     * @param  string  $description  Human-readable description
     * @param  string|null  $targetModel  e.g. 'PeriodManagement'
     * @param  string|int|null  $targetId  ID of the affected entity
     * @param  array<string, mixed>  $properties  Contextual before/after data
     * @param  User|null  $user  Optional explicit user actor
     */
    public static function record(
        string $action,
        string $description,
        ?string $targetModel = null,
        string|int|null $targetId = null,
        array $properties = [],
        ?User $user = null
    ): self {
        $actor = $user ?? Auth::user();

        return self::create([
            'user_id' => $actor?->id,
            'user_name' => $actor?->name ?? 'SYSTEM',
            'user_role' => $actor?->role ?? 'system',
            'action' => $action,
            'description' => $description,
            'target_model' => $targetModel,
            'target_id' => $targetId ? (string) $targetId : null,
            'ip_address' => Request::ip() ?? '127.0.0.1',
            'user_agent' => substr((string) Request::userAgent(), 0, 255),
            'properties' => $properties,
        ]);
    }
}
