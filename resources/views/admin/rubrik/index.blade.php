@extends('layouts.admin', ['title' => 'Master Rubrik AKHLAK'])

@section('content')
<div class="page-title-box" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
    <div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Master Rubrik Penilaian AKHLAK</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Standarisasi kategori Core Values BUMN AKHLAK, Budaya 5S, Disiplin Diri, dan parameter bobot skor</p>
    </div>

    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button type="button" onclick="openCreateCategoryModal()" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Kategori
        </button>

        <button type="button" onclick="openCreateSubcategoryModal()" style="background: #0072CE; color: #ffffff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(0, 114, 206, 0.25);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Butir Indikator
        </button>
    </div>
</div>

<!-- Ringkasan Kalibrasi Skor & Skala Rating -->
<div class="rubrik-overview-grid">
    <!-- Skala Rating 1-6 -->
    <div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
                <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0;">Matriks Bobot Rating Terstandarisasi</h3>
                <span style="font-size: 12px; color: #64748b;">{{ $totalCategories }} Kategori &bull; {{ $totalSubcategories }} Butir Indikator &bull; Skor Maksimal {{ number_format($maxTotalScore, 2) }}</span>
            </div>
            <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;">SRS v1.0</span>
        </div>

        <div class="rubrik-rating-grid">
            @foreach($ratingOptions as $opt)
                <div style="border: 1px solid #e2e8f0; border-top: 3px solid {{ $opt['color'] }}; border-radius: 8px; padding: 10px 8px; text-align: center; background: #fafafa;">
                    <div style="font-size: 16px; font-weight: 800; color: {{ $opt['color'] }};">R{{ $opt['rating'] }}</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">{{ number_format($opt['score'], 2) }}</div>
                    <div style="font-size: 10.5px; color: #64748b; margin-top: 2px; line-height: 1.2;">{{ $opt['label'] }}</div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Ambang Predikat Kinerja -->
    <div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Ambang Batas Predikat Total Skor (0&ndash;100)</h3>
        <div class="rubrik-threshold-grid">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 12px; border-radius: 8px;">
                <div style="font-weight: 700; color: #15803d;">Sangat Baik</div>
                <div style="color: #166534; font-size: 12px;">Total Skor &ge; 85.00</div>
            </div>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 12px; border-radius: 8px;">
                <div style="font-weight: 700; color: #1d4ed8;">Baik</div>
                <div style="color: #1e40af; font-size: 12px;">Total Skor 70.00 &ndash; 84.99</div>
            </div>
            <div style="background: #fefce8; border: 1px solid #fde68a; padding: 10px 12px; border-radius: 8px;">
                <div style="font-weight: 700; color: #a16207;">Cukup Baik</div>
                <div style="color: #854d0e; font-size: 12px;">Total Skor 55.00 &ndash; 69.99</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 10px 12px; border-radius: 8px;">
                <div style="font-weight: 700; color: #b91c1c;">Perlu Perhatian</div>
                <div style="color: #991b1b; font-size: 12px;">Total Skor &lt; 55.00</div>
            </div>
        </div>
    </div>
</div>

<!-- Daftar Kategori & Subkategori -->
<div style="display: flex; flex-direction: column; gap: 18px;">
    @foreach($categories as $cat)
        <div class="card" style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="padding: 15px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="background: #00223B; color: #38bdf8; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 800;">
                        {{ $cat->order_index }}
                    </span>
                    <div>
                        <h3 style="font-size: 15.5px; font-weight: 700; color: #0f172a; margin: 0;">{{ $cat->name }}</h3>
                        @if($cat->description)
                            <div style="font-size: 12px; color: #64748b;">{{ $cat->description }}</div>
                        @endif
                    </div>
                    <span style="background: #e2e8f0; color: #334155; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 700;">
                        {{ $cat->subcategories_count }} butir
                    </span>
                </div>

                <div style="display: flex; gap: 8px; align-items: center;">
                    <button type="button"
                            class="js-edit-category"
                            data-id="{{ $cat->id }}"
                            data-name="{{ $cat->name }}"
                            data-description="{{ $cat->description }}"
                            data-order="{{ $cat->order_index }}"
                            style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 5px 11px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit Kategori
                    </button>

                    @if($cat->subcategories_count === 0)
                        <form method="POST" action="{{ route('admin.rubrik.categories.destroy', $cat->id) }}" style="margin: 0;" onsubmit="return confirm('Hapus kategori kosong ini?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                                Hapus
                            </button>
                        </form>
                    @endif
                </div>
            </div>

            @if($cat->subcategories->isEmpty())
                <div style="padding: 20px 20px; color: #94a3b8; font-size: 13px; font-style: italic;">
                    Belum ada butir indikator perilaku pada kategori ini.
                </div>
            @else
                <div class="table-responsive">
                    <table class="data-table data-table-rubrik" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 11px; text-transform: uppercase;">
                                <th style="padding: 10px 20px; text-align: start; width: 70px;">Urutan</th>
                                <th style="padding: 10px 16px; text-align: start;">Pernyataan Indikator Objektif</th>
                                <th style="padding: 10px 16px; text-align: start; width: 32%;">Template Alasan Default</th>
                                <th style="padding: 10px 16px; text-align: end; width: 110px;">Digunakan</th>
                                <th style="padding: 10px 20px; text-align: end; width: 140px;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($cat->subcategories as $sub)
                                <tr style="border-bottom: 1px solid #f8fafc;">
                                    <td style="padding: 13px 20px; font-weight: 700; color: #0284c7; text-align: start;">
                                        #{{ $sub->order_index }}
                                    </td>
                                    <td style="padding: 13px 16px; color: #0f172a; font-weight: 600; line-height: 1.45; text-align: start;">
                                        {{ $sub->name }}
                                        @if($sub->description)
                                            <div style="font-size: 11.5px; color: #64748b; font-weight: 400; margin-top: 2px;">{{ $sub->description }}</div>
                                        @endif
                                    </td>
                                    <td style="padding: 13px 16px; color: #475569; font-size: 12px; line-height: 1.45; text-align: start;">
                                        {{ $sub->default_reason ?: '-' }}
                                    </td>
                                    <td style="padding: 13px 16px; text-align: end;">
                                        <span class="tabular-nums" style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;">
                                            {{ $sub->evaluation_details_count }} data
                                        </span>
                                    </td>
                                    <td style="padding: 13px 20px; text-align: end;">
                                        <div style="display: inline-flex; gap: 8px; align-items: center;">
                                            <button type="button"
                                                    class="js-edit-subcategory"
                                                    data-id="{{ $sub->id }}"
                                                    data-category-id="{{ $sub->category_id }}"
                                                    data-name="{{ $sub->name }}"
                                                    data-description="{{ $sub->description }}"
                                                    data-default-reason="{{ $sub->default_reason }}"
                                                    data-order="{{ $sub->order_index }}"
                                                    style="background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; padding: 5px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer;">
                                                Edit Butir
                                            </button>

                                            @if($sub->evaluation_details_count === 0)
                                                <form method="POST" action="{{ route('admin.rubrik.subcategories.destroy', $sub->id) }}" style="margin: 0;" onsubmit="return confirm('Hapus butir indikator yang belum memiliki riwayat penilaian ini?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" title="Hapus indikator tanpa riwayat" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 5px 8px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                    </button>
                                                </form>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    @endforeach
</div>

<!-- Modal Tambah Kategori -->
<div id="createCategoryModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 460px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Tambah Kategori Rubrik</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Buat kelompok aspek evaluasi baru.</p>

        <form method="POST" action="{{ route('admin.rubrik.categories.store') }}">
            @csrf
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nama Kategori <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="name" required placeholder="Contoh: Integritas K3" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Urutan</label>
                    <input type="number" name="order_index" value="{{ $totalCategories + 1 }}" min="1" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Deskripsi Singkat</label>
                <textarea name="description" rows="2" placeholder="Penjelasan aspek kategori (opsional)" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeModalById('createCategoryModal')" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Simpan Kategori</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Edit Kategori -->
<div id="editCategoryModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 460px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Edit Kategori Rubrik</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Perbarui nama, urutan tampil, atau deskripsi kategori.</p>

        <form id="editCategoryForm" method="POST" action="">
            @csrf
            @method('PUT')
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nama Kategori <span style="color: #dc2626;">*</span></label>
                    <input type="text" name="name" id="edit_cat_name" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Urutan <span style="color: #dc2626;">*</span></label>
                    <input type="number" name="order_index" id="edit_cat_order" required min="1" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Deskripsi Singkat</label>
                <textarea name="description" id="edit_cat_description" rows="2" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeModalById('editCategoryModal')" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Tambah Subkategori -->
<div id="createSubcategoryModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 540px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Tambah Butir Indikator Penilaian</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Tambahkan pernyataan perilaku objektif ke dalam kategori rubrik.</p>

        <form method="POST" action="{{ route('admin.rubrik.subcategories.store') }}">
            @csrf
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Kategori Induk <span style="color: #dc2626;">*</span></label>
                    <select name="category_id" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->order_index }}. {{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nomor Urut</label>
                    <input type="number" name="order_index" value="{{ $totalSubcategories + 1 }}" min="1" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Pernyataan Indikator Objektif <span style="color: #dc2626;">*</span></label>
                <textarea name="name" rows="2" required placeholder="Contoh: Mematuhi prosedur keselamatan kerja di area dermaga" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Template Alasan Default (Membantu Penilai)</label>
                <textarea name="default_reason" rows="2" placeholder="Contoh: Melaksanakan SOP keselamatan kerja secara konsisten." style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeModalById('createSubcategoryModal')" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Simpan Indikator</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Edit Subkategori -->
<div id="editSubcategoryModal" class="modal-overlay">
    <div class="modal-box" style="max-width: 540px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Edit Butir Indikator AKHLAK</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Perbarui redaksi pernyataan perilaku objektif atau template alasan default.</p>

        <form id="editSubcategoryForm" method="POST" action="">
            @csrf
            @method('PUT')
            <div class="modal-grid-2">
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Kategori Induk <span style="color: #dc2626;">*</span></label>
                    <select name="category_id" id="edit_sub_category" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->order_index }}. {{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Nomor Urut <span style="color: #dc2626;">*</span></label>
                    <input type="number" name="order_index" id="edit_sub_order" required min="1" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
                </div>
            </div>

            <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Pernyataan Indikator Objektif <span style="color: #dc2626;">*</span></label>
                <textarea name="name" id="edit_sub_name" rows="3" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Catatan Panduan Tambahan (Opsional)</label>
                <input type="text" name="description" id="edit_sub_description" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            </div>

            <div style="margin-bottom: 18px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #334155; margin-bottom: 6px;">Template Alasan Default</label>
                <textarea name="default_reason" id="edit_sub_reason" rows="2" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
            </div>

            <div class="modal-actions-sticky">
                <button type="button" onclick="closeModalById('editSubcategoryModal')" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Batal</button>
                <button type="submit" style="background: #0072CE; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    function openCreateCategoryModal() {
        document.getElementById('createCategoryModal').classList.add('active');
    }
    function openCreateSubcategoryModal() {
        document.getElementById('createSubcategoryModal').classList.add('active');
    }
    function closeModalById(id) {
        document.getElementById(id).classList.remove('active');
    }

    document.querySelectorAll('.js-edit-category').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            document.getElementById('editCategoryForm').action = "{{ url('/admin/rubrik/categories') }}/" + encodeURIComponent(id);
            document.getElementById('edit_cat_name').value = this.dataset.name || '';
            document.getElementById('edit_cat_description').value = this.dataset.description || '';
            document.getElementById('edit_cat_order').value = this.dataset.order || '1';
            document.getElementById('editCategoryModal').classList.add('active');
        });
    });

    document.querySelectorAll('.js-edit-subcategory').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = this.dataset.id;
            document.getElementById('editSubcategoryForm').action = "{{ url('/admin/rubrik/subcategories') }}/" + encodeURIComponent(id);
            document.getElementById('edit_sub_category').value = this.dataset.categoryId || '';
            document.getElementById('edit_sub_name').value = this.dataset.name || '';
            document.getElementById('edit_sub_description').value = this.dataset.description || '';
            document.getElementById('edit_sub_reason').value = this.dataset.defaultReason || '';
            document.getElementById('edit_sub_order').value = this.dataset.order || '1';
            document.getElementById('editSubcategoryModal').classList.add('active');
        });
    });

    window.addEventListener('click', function(e) {
        ['createCategoryModal', 'editCategoryModal', 'createSubcategoryModal', 'editSubcategoryModal'].forEach(function(modalId) {
            var el = document.getElementById(modalId);
            if (e.target === el) el.classList.remove('active');
        });
    });
</script>
@endpush
@endsection
