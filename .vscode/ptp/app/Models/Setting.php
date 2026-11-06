<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $table = 'system_settings';

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'description',
    ];

    /**
     * In-memory runtime cache for the current process/request.
     */
    protected static array $runtimeCache = [];

    /**
     * Cache key for the persistent cache layer.
     */
    public const CACHE_KEY = 'system_settings_dict';

    protected static function booted(): void
    {
        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }

    /**
     * Get a setting value by key with optional default fallback.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $all = static::getAllKeyValue();

        return array_key_exists($key, $all) && $all[$key] !== null && $all[$key] !== ''
            ? $all[$key]
            : $default;
    }

    /**
     * Set/update a setting value by key.
     */
    public static function set(string $key, mixed $value, ?string $group = null): self
    {
        $setting = static::firstOrNew(['key' => $key]);
        $setting->value = $value;
        if ($group !== null) {
            $setting->group = $group;
        }
        $setting->save();

        static::clearCache();

        return $setting;
    }

    /**
     * Retrieve all settings as a flat key-value array with two-tier caching (Memory + Persistent).
     *
     * @return array<string, mixed>
     */
    public static function getAllKeyValue(): array
    {
        if (! empty(static::$runtimeCache)) {
            return static::$runtimeCache;
        }

        try {
            $dict = Cache::rememberForever(self::CACHE_KEY, function () {
                return static::query()->pluck('value', 'key')->toArray();
            });

            static::$runtimeCache = $dict;

            return $dict;
        } catch (\Throwable $e) {
            // Fallback during migrations or fresh installs
            return [];
        }
    }

    /**
     * Retrieve all settings grouped by group category for administration forms.
     *
     * @return array<string, Collection<int, Setting>>
     */
    public static function getAllGrouped(): array
    {
        return static::query()
            ->orderBy('id')
            ->get()
            ->groupBy('group')
            ->toArray();
    }

    /**
     * Invalidate both runtime memory cache and persistent cache.
     */
    public static function clearCache(): void
    {
        static::$runtimeCache = [];
        Cache::forget(self::CACHE_KEY);
    }
}
