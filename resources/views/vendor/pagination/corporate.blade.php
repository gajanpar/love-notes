@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Navigasi Halaman" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #475569; padding-top: 4px;">
        <div class="tabular-nums" style="font-size: 12.5px; color: #475569;">
            Menampilkan <strong style="color: #0f172a;">{{ $paginator->firstItem() }}</strong> s.d. <strong style="color: #0f172a;">{{ $paginator->lastItem() }}</strong> dari <strong style="color: #0f172a;">{{ $paginator->total() }}</strong> entri
        </div>

        <div style="display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            {{-- Tombol Sebelumnya (Previous) --}}
            @if ($paginator->onFirstPage())
                <span class="pagination-disabled" aria-disabled="true" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #64748b; cursor: not-allowed;" title="Halaman Pertama">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px !important; height: 14px !important; min-width: 14px !important; min-height: 14px !important; max-width: 14px !important; max-height: 14px !important; display: inline-block; vertical-align: middle;"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="pagination-link" aria-label="Halaman sebelumnya" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid #64748b; background: #ffffff; color: #334155; text-decoration: none; transition: background-color 0.15s ease, border-color 0.15s ease;" title="Halaman Sebelumnya">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px !important; height: 14px !important; min-width: 14px !important; min-height: 14px !important; max-width: 14px !important; max-height: 14px !important; display: inline-block; vertical-align: middle;"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </a>
            @endif

            {{-- Elemen Angka Halaman --}}
            @foreach ($elements as $element)
                {{-- Pemisah Tiga Titik (...) --}}
                @if (is_string($element))
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: #64748b;">{{ $element }}</span>
                @endif

                {{-- Array Halaman --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <span class="pagination-disabled tabular-nums" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: #00223B; color: #ffffff; font-weight: 700; font-size: 13px;" aria-current="page">{{ $page }}</span>
                        @else
                            <a href="{{ $url }}" class="pagination-link tabular-nums" aria-label="Halaman {{ $page }}" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid #64748b; background: #ffffff; color: #334155; text-decoration: none; font-size: 13px; font-weight: 500; transition: background-color 0.15s ease, border-color 0.15s ease;">{{ $page }}</a>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Tombol Berikutnya (Next) --}}
            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="pagination-link" aria-label="Halaman berikutnya" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid #64748b; background: #ffffff; color: #334155; text-decoration: none; transition: background-color 0.15s ease, border-color 0.15s ease;" title="Halaman Berikutnya">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px !important; height: 14px !important; min-width: 14px !important; min-height: 14px !important; max-width: 14px !important; max-height: 14px !important; display: inline-block; vertical-align: middle;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
            @else
                <span class="pagination-disabled" aria-disabled="true" style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #64748b; cursor: not-allowed;" title="Halaman Terakhir">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px !important; height: 14px !important; min-width: 14px !important; min-height: 14px !important; max-width: 14px !important; max-height: 14px !important; display: inline-block; vertical-align: middle;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
            @endif
        </div>
    </nav>
@endif
