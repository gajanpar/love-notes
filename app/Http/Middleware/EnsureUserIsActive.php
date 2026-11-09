<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Ensure an authenticated user's account is still active on every request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && ! Auth::user()->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Akun Anda telah dinonaktifkan oleh Administrator.',
                ], 403);
            }

            return redirect()->route('login')
                ->withErrors(['username' => 'Sesi berakhir karena akun Anda telah dinonaktifkan oleh Administrator SDM/IT.']);
        }

        return $next($request);
    }
}
