import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
sys.path.append(os.path.dirname(__file__))
from doc_helper import (
    COLOR_NAVY, COLOR_BLUE, COLOR_SKY, COLOR_GRAY, COLOR_DARK,
    format_table_header, format_table_row, add_callout
)

def create_srs_document(docx_path):
    doc = docx.Document()
    
    # Page Margins 1 inch
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("SPKTAD - PT Pelindo Multi Terminal Branch Cirebon | SRS v2.0")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = COLOR_GRAY

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Dokumen Spesifikasi Kebutuhan Perangkat Lunak - Klasifikasi Terbatas BUMN")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = COLOR_GRAY

    # ================= COVER PAGE =================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst1 = p_inst.add_run("PT PELABUHAN INDONESIA (PERSERO)\n")
    r_inst1.bold = True
    r_inst1.font.name = "Calibri"
    r_inst1.font.size = Pt(14)
    r_inst1.font.color.rgb = COLOR_NAVY

    r_inst2 = p_inst.add_run("PT PELINDO MULTI TERMINAL - BRANCH CIREBON\n")
    r_inst2.bold = True
    r_inst2.font.name = "Calibri"
    r_inst2.font.size = Pt(12)
    r_inst2.font.color.rgb = COLOR_BLUE

    r_div = p_inst.add_run("Divisi SDM, Umum, Operasi, dan Sistem Informasi TI\n")
    r_div.font.name = "Calibri"
    r_div.font.size = Pt(10)
    r_div.font.color.rgb = COLOR_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(30)

    # Document Title Box
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t1 = p_title.add_run("SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK\n(SOFTWARE REQUIREMENTS SPECIFICATION - SRS)\n\n")
    r_t1.bold = True
    r_t1.font.name = "Calibri"
    r_t1.font.size = Pt(20)
    r_t1.font.color.rgb = COLOR_NAVY

    r_t2 = p_title.add_run("SISTEM PENILAIAN KINERJA TENAGA ALIH DAYA (SPKTAD)\n")
    r_t2.bold = True
    r_t2.font.name = "Calibri"
    r_t2.font.size = Pt(16)
    r_t2.font.color.rgb = COLOR_BLUE

    r_t3 = p_title.add_run("Berdasarkan Standar Nilai Inti BUMN (AKHLAK) dan Standar Pelayanan Pelindo\n")
    r_t3.font.name = "Calibri"
    r_t3.font.size = Pt(11)
    r_t3.font.color.rgb = COLOR_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(40)

    # Metadata Table
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Nomor Dokumen", "SRS-SPKTAD-PLND-CRB-2026-v2.0"),
        ("Edisi / Versi", "2.0 (Fase Transisi Tahap 2 ke Tahap 3 - Production Ready)"),
        ("Tanggal Terbit", "03 November 2026"),
        ("Status Dokumen", "Dokumen Resmi Pengesahan Spesifikasi & Arsitektur"),
        ("Klasifikasi", "TERBATAS - Internal PT Pelindo Multi Terminal Branch Cirebon"),
        ("Target Implementasi", "Lingkungan Operasional Live (Production Deployment 2026)"),
    ]
    col_w = [2.2, 4.3]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]
        cell_lbl.text = label
        cell_val.text = val
        cell_lbl.paragraphs[0].runs[0].bold = True
        cell_lbl.paragraphs[0].runs[0].font.color.rgb = COLOR_NAVY
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=col_w)

    doc.add_paragraph().paragraph_format.space_after = Pt(40)

    # Pengesahan Table
    p_app = doc.add_paragraph()
    p_app.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_app = p_app.add_run("LEMBAR PENGESAHAN DOKUMEN")
    r_app.bold = True
    r_app.font.name = "Calibri"
    r_app.font.size = Pt(11)
    r_app.font.color.rgb = COLOR_NAVY

    app_table = doc.add_table(rows=4, cols=3)
    app_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    app_widths = [2.1, 2.2, 2.2]

    # Header row
    hdr = app_table.rows[0]
    hdr.cells[0].text = "Disusun Oleh"
    hdr.cells[1].text = "Diperiksa Oleh"
    hdr.cells[2].text = "Disetujui & Ditetapkan Oleh"
    format_table_header(hdr, col_widths=app_widths)

    r1 = app_table.rows[1]
    r1.cells[0].text = "Tim Pengembang & Analis TI\nSPKTAD Project Team"
    r1.cells[1].text = "Manager SDM & Umum\nPT Pelindo Multi Terminal Branch Cirebon"
    r1.cells[2].text = "Branch Manager\nPT Pelindo Multi Terminal Branch Cirebon"
    format_table_row(r1, is_alt=False, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    r2 = app_table.rows[2]
    r2.cells[0].text = "\n\n( Tanda Tangan Elektronik )\n"
    r2.cells[1].text = "\n\n( Tanda Tangan Elektronik )\n"
    r2.cells[2].text = "\n\n( Tanda Tangan Elektronik )\n"
    format_table_row(r2, is_alt=True, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    r3 = app_table.rows[3]
    r3.cells[0].text = "Gajanpar / Lead Architect\nTanggal: 03 Nov 2026"
    r3.cells[1].text = "Dedi Heryadi, S.E.\nNIPP: 28214055"
    r3.cells[2].text = "Bambang Wijanarko, S.T., M.M.\nNIPP: 27608912"
    format_table_row(r3, is_alt=False, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    doc.add_page_break()

    # ================= RIWAYAT REVISI =================
    doc.add_heading("RIWAYAT REVISI DOKUMEN", level=1)
    p_rev = doc.add_paragraph("Pencatatan riwayat evolusi dokumen spesifikasi kebutuhan sistem:")
    
    rev_table = doc.add_table(rows=3, cols=5)
    rev_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rev_widths = [0.8, 1.1, 1.2, 2.4, 1.0]
    
    hdr = rev_table.rows[0]
    hdr.cells[0].text = "Versi"
    hdr.cells[1].text = "Tanggal"
    hdr.cells[2].text = "Penyusun"
    hdr.cells[3].text = "Rangkuman Perubahan Utama"
    hdr.cells[4].text = "Status"
    format_table_header(hdr, col_widths=rev_widths)
    
    row1 = rev_table.rows[1]
    row1.cells[0].text = "1.0"
    row1.cells[1].text = "25 Okt 2026"
    row1.cells[2].text = "Tim TI PKL"
    row1.cells[3].text = "Baseline spesifikasi awal buku panduan pengguna SPKTAD versi prototype PHP native."
    row1.cells[4].text = "Superceded"
    format_table_row(row1, is_alt=False, col_widths=rev_widths)
    
    row2 = rev_table.rows[2]
    row2.cells[0].text = "2.0"
    row2.cells[1].text = "03 Nov 2026"
    row2.cells[2].text = "Lead Arch & Security"
    row2.cells[3].text = "Restrukturisasi enterprise Laravel 11, pengerasan OWASP Top 10 (Anti-IDOR/BOLA, Anti-XSS, Anti-CSV Injection), spesifikasi 28 fitur fungsional, Data Quality Framework, pembersihan data dummy, dan kesiapan transisi Tahap 3 (Go-Live)."
    row2.cells[4].text = "APPROVED"
    format_table_row(row2, is_alt=True, col_widths=rev_widths)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ================= BAB 1 =================
    doc.add_heading("BAB 1: PENDAHULUAN", level=1)
    
    doc.add_heading("1.1 Latar Belakang & Urgensi Digitalisasi", level=2)
    p = doc.add_paragraph(
        "PT Pelabuhan Indonesia (Persero) Subholding PT Pelindo Multi Terminal Branch Cirebon mempekerjakan puluhan Tenaga Alih Daya (TAD) "
        "yang ditempatkan pada berbagai divisi operasional krusial seperti Operasi Pelabuhan (Operator Alat Berat, Rigger, Administrasi Gudang & Kapal), "
        "Perencanaan & Pengendalian Operasi, serta Keuangan & Umum. Kinerja para personel TAD merupakan penentu utama keselamatan kerja (K3), kelancaran "
        "arus barang (dwelling time), dan kepuasan pengguna jasa pelabuhan.\n\n"
        "Sebelumnya, evaluasi berkala dilakukan melalui pencatatan manual berbasis lembaran kertas dan spreadsheet daring yang rentan mengalami manipulasi, "
        "keterlambatan rekapitulasi, kehilangan data historis, serta ketidakakuratan formula penilaian. Berdasarkan Surat Edaran Menteri BUMN No. SE-7/MBU/07/2020 "
        "tentang Nilai-Nilai Utama (Core Values) Sumber Daya Manusia BUMN, setiap insan pelabuhan diwajibkan menjunjung tinggi nilai AKHLAK (Amanah, Kompeten, "
        "Harmonis, Loyal, Adaptif, Kolaboratif) ditambah standar pelayanan ramah (Senyum, Salam, Sapa, Terima Kasih, Doa & Harapan, serta Disiplin Diri)."
    )

    doc.add_heading("1.2 Tujuan Dokumen", level=2)
    p = doc.add_paragraph(
        "Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SRS) versi 2.0 ini disusun sebagai acuan formal, legal, dan teknis yang mengikat bagi:"
    )
    doc.add_paragraph("a. Tim Rekayasa Perangkat Lunak dalam mengimplementasikan seluruh fungsi sistem secara presisi.", style='List Bullet')
    doc.add_paragraph("b. Administrator SDM & IT dalam mengelola master data, hak akses, kebijakan periode, audit log, dan cadangan data.", style='List Bullet')
    doc.add_paragraph("c. Tim Manajemen Pelindo Cirebon (Branch Manager & Manager SDM) dalam pengambilan keputusan perpanjangan kontrak TAD.", style='List Bullet')
    doc.add_paragraph("d. Auditor Internal (SPI BUMN / ISO) dalam memeriksa kepatuhan tata kelola TI dan integritas data.", style='List Bullet')

    doc.add_heading("1.3 Ruang Lingkup Sistem (Scope of System)", level=2)
    p = doc.add_paragraph(
        "Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) mencakup dua sisi fungsional utama:\n"
        "1. Sisi Pengguna Penilai (Kepala Divisi): Pengisian evaluasi 17 butir indikator bulanan, auto-save drafting lokal, pengajuan pembukaan periode/edit nilai, rekapitulasi nilai divisi, dan pencetakan lembar dinas resmi.\n"
        "2. Sisi Administrator SDM & IT: Pemantauan metrik cabang real-time, manajemen matriks 12 bulan x 3 divisi, verifikasi workflow persetujuan, manajemen master data TAD & Divisi, manajemen akun penilai, kalibrasi rubrik AKHLAK, pelaporan eksekutif bulanan/tahunan, ekspor CSV aman, audit trail mutasi data, mesin cadangan & pemulihan bencana (Disaster Recovery), serta pembersihan data dummy."
    )

    doc.add_heading("1.4 Landasan Regulasi & Tata Kelola", level=2)
    doc.add_paragraph("1. Surat Edaran Menteri BUMN No. SE-7/MBU/07/2020 tentang Core Values BUMN (AKHLAK).", style='List Bullet')
    doc.add_paragraph("2. Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).", style='List Bullet')
    doc.add_paragraph("3. Standar Manajemen Keamanan Informasi ISO/IEC 27001:2022 (Kontrol Akses, Audit Log, Integritas Kriptografi).", style='List Bullet')
    doc.add_paragraph("4. Kebijakan Standar Pelayanan Mutu (SPM) PT Pelindo Multi Terminal Branch Cirebon.", style='List Bullet')

    doc.add_heading("1.5 Definisi, Akronim, dan Singkatan", level=2)
    def_table = doc.add_table(rows=9, cols=2)
    def_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    defs = [
        ("SPKTAD", "Sistem Penilaian Kinerja Tenaga Alih Daya"),
        ("TAD", "Tenaga Alih Daya (personel outsourcing penyedia tenaga kerja)"),
        ("AKHLAK", "Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif"),
        ("NIPP", "Nomor Induk Pegawai Pelindo (pejabat penandatangan resmi)"),
        ("RBAC", "Role-Based Access Control (Manajemen hak akses berbasis peran)"),
        ("BOLA / IDOR", "Broken Object Level Authorization / Insecure Direct Object References"),
        ("RTO & RPO", "Recovery Time Objective (< 15 menit) & Recovery Point Objective (0 kehilangan data)"),
        ("WAL", "Write-Ahead Logging (arsitektur konkurensi performa tinggi basis data SQLite)"),
    ]
    def_widths = [1.8, 4.7]
    hdr = def_table.rows[0]
    hdr.cells[0].text = "Istilah / Akronim"
    hdr.cells[1].text = "Definisi & Penjelasan"
    format_table_header(hdr, col_widths=def_widths)
    for idx, (term, desc) in enumerate(defs[1:], start=1):
        row = def_table.rows[idx]
        row.cells[0].text = term
        row.cells[1].text = desc
        row.cells[0].paragraphs[0].runs[0].bold = True
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=def_widths)

    doc.add_page_break()

    # ================= BAB 2 =================
    doc.add_heading("BAB 2: DESKRIPSI UMUM SISTEM", level=1)
    
    doc.add_heading("2.1 Model Pengguna & Matriks Hak Akses (RBAC)", level=2)
    p = doc.add_paragraph("Sistem mengimplementasikan prinsip pemisahan tugas (Segregation of Duties) yang tegas:")
    
    rbac_table = doc.add_table(rows=8, cols=4)
    rbac_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rbac_w = [2.2, 1.4, 1.4, 1.5]
    
    hdr = rbac_table.rows[0]
    hdr.cells[0].text = "Modul / Kemampuan Sistem"
    hdr.cells[1].text = "Super Admin SDM/IT"
    hdr.cells[2].text = "Kepala Divisi (Penilai)"
    hdr.cells[3].text = "Dasar Otoritas"
    format_table_header(hdr, col_widths=rbac_w)
    
    rbac_matrix = [
        ("Penilaian 17 Indikator AKHLAK", "Lihat Rekap", "Input & Simpan Nilai", "Kepala Unit Kerja"),
        ("Pengajuan Akses / Edit Periode", "Verifikasi & Approve", "Mengajukan Permohonan", "Workflow Approval"),
        ("Manajemen Periode (Buka/Tutup)", "Full Otoritas", "Dibatasi Sesuai Status", "Kebijakan SDM"),
        ("Manajemen Master TAD & Divisi", "CRUD Master", "Hanya Karyawan Divisi", "Proteksi Data Master"),
        ("Pengaturan Akun & Reset Password", "Reset Kredensial", "Ubah Password Mandiri", "Self-Service Guard"),
        ("Audit Trail (Activity Logs)", "Akses Penuh + Diff", "Tidak Berhak", "Kepatuhan Audit"),
        ("Cadangan DB & Disaster Recovery", "Eksekusi & Unduh", "Ditolak (403)", "Keamanan Sistem"),
    ]
    for idx, r in enumerate(rbac_matrix, start=1):
        row = rbac_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[3].text = r[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=rbac_w)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    doc.add_heading("2.2 Lingkungan Operasional & Spesifikasi Teknis", level=2)
    doc.add_paragraph("• Bahasa Pemrograman & Runtime: PHP 8.4 (CLI & Web Engine).", style='List Bullet')
    doc.add_paragraph("• Framework Aplikasi: Laravel 11 (Long Term Support Architecture).", style='List Bullet')
    doc.add_paragraph("• Basis Data Utama: SQLite 3 (Mode WAL / Pragma Foreign Keys ON) & Kompatibel Penuh MySQL 8.0/MariaDB.", style='List Bullet')
    doc.add_paragraph("• Frontend Styling: Tailwind CSS & Blade Template Engine Korporat.", style='List Bullet')
    doc.add_paragraph("• Web Server: Nginx 1.24+ / Apache 2.4+ dengan penegakan TLS 1.3.", style='List Bullet')

    add_callout(
        doc,
        "Sistem dibangun dengan prinsip Zero External API Dependencies. Seluruh aset grafis (kop surat dinas Pelindo, generator captcha SVG acak, font kedinasan) "
        "dieksekusi lokal di server tanpa bergantung pada layanan cloud publik (seperti Google Apps Script lama yang rentan downtime atau kebocoran data).",
        title="PRINSIP INDEPENDENSI KORPORAT"
    )

    doc.add_page_break()

    # ================= BAB 3 =================
    doc.add_heading("BAB 3: FORMULA MATEMATIS & RUBRIK AKHLAK TERSTANDARISASI", level=1)
    
    doc.add_paragraph(
        "Salah satu perbaikan arsitektural paling signifikan pada SPKTAD versi 2.0 adalah standardisasi formula penilaian "
        "menggantikan formula lama yang memiliki pembobotan asimetris (bug drift skor 1.98 vs 1.96). "
        "Sistem membagi 100 poin maksimal secara proporsional ke dalam 17 butir indikator kinerja."
    )

    doc.add_heading("3.1 Formula Bobot Rating Indikator (1 s.d. 6)", level=2)
    p_form = doc.add_paragraph(
        "Setiap indikator dinilai menggunakan skala rating 1 s.d. 6 dengan konversi skor matematis:\n"
        "• Rating 1 (Sangat Kurang) : 0.98 poin\n"
        "• Rating 2 (Kurang)         : 1.96 poin\n"
        "• Rating 3 (Cukup)          : 2.94 poin\n"
        "• Rating 4 (Hampir Baik)    : 3.92 poin\n"
        "• Rating 5 (Baik)           : 4.90 poin\n"
        "• Rating 6 (Sangat Baik)    : 5.88 poin\n\n"
        "Rumus Total Skor Akumulasi:\n"
        "Total Skor = Σ (Skor Indikator_i) untuk i = 1 s.d. 17\n"
        "Skor Maksimal Riil = 17 × 5.88 = 99.96 (Dibulatkan secara representatif menjadi 100.00)."
    )

    doc.add_heading("3.2 Pemetaan Predikat Kinerja Resmi Pelindo", level=2)
    pred_table = doc.add_table(rows=5, cols=4)
    pred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    pred_w = [1.8, 1.6, 1.4, 1.7]

    hdr = pred_table.rows[0]
    hdr.cells[0].text = "Rentang Total Skor"
    hdr.cells[1].text = "Predikat Kinerja"
    hdr.cells[2].text = "Indikator Visual"
    hdr.cells[3].text = "Rekomendasi SDM Cabang"
    format_table_header(hdr, col_widths=pred_w)

    preds = [
        ("≥ 85.00 s.d. 100.00", "Sangat Baik", "Badge Hijau Sukses", "Direkomendasikan Perpanjangan"),
        ("70.00 s.d. 84.99", "Baik", "Badge Biru Info", "Dapat Diperpanjang"),
        ("55.00 s.d. 69.99", "Cukup Baik", "Badge Kuning Warning", "Evaluasi & Pembinaan Khusus"),
        ("< 55.00", "Perlu Perhatian", "Badge Merah Bahaya", "Peringatan / Evaluasi Vendor"),
    ]
    for idx, r in enumerate(preds, start=1):
        row = pred_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[3].text = r[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=pred_w)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    doc.add_heading("3.3 Matriks 12 Kategori & 17 Indikator Standar BUMN", level=2)
    rubrik_table = doc.add_table(rows=18, cols=4)
    rubrik_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rub_w = [0.6, 1.6, 2.5, 1.8]

    hdr = rubrik_table.rows[0]
    hdr.cells[0].text = "No"
    hdr.cells[1].text = "Kategori AKHLAK"
    hdr.cells[2].text = "Deskripsi Indikator Perilaku"
    hdr.cells[3].text = "Alasan Bawaan (Default Reason)"
    format_table_header(hdr, col_widths=rub_w)

    rubrik_rows = [
        ("1", "Amanah", "Bertanggung jawab atas tugas, keputusan, dan tindakan yang dilakukan", "Bekerja sesuai job desc dan mampu menyelesaikan tugas dengan baik."),
        ("2", "Amanah", "Berpegang teguh kepada nilai moral dan etika", "Berperilaku baik dalam bekerja."),
        ("3", "Kompeten", "Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah", "Mampu mengoperasikan peralatan kerja dengan aman."),
        ("4", "Kompeten", "Menyelesaikan tugas dengan kualitas terbaik", "Hasil kerja rapi dan sesuai target yang ditentukan."),
        ("5", "Harmonis", "Menghargai setiap orang apapun latar belakangnya", "Menghormati rekan kerja dan atasan."),
        ("6", "Harmonis", "Membangun lingkungan kerja yang kondusif", "Mampu menciptakan lingkungan kerja yang kondusif."),
        ("7", "Loyal", "Menjaga nama baik sesama karyawan, pimpinan, BUMN, dan Negara", "Memiliki rasa hormat terhadap rekan kerja dan menjaga etika perusahaan."),
        ("8", "Loyal", "Patuh kepada pimpinan sepanjang tidak bertentangan dengan hukum dan etika", "Mengikuti arahan atasan dalam melaksanakan tugas operasional."),
        ("9", "Adaptif", "Cepat menyesuaikan diri untuk menjadi lebih baik", "Mampu menyesuaikan diri dengan pola kerja baru."),
        ("10", "Adaptif", "Terus-menerus melakukan perbaikan mengikuti perkembangan teknologi", "Mampu mengoperasikan perangkat kerja modern."),
        ("11", "Kolaboratif", "Memberi kesempatan kepada berbagai pihak untuk berkontribusi & bekerja sama", "Ikut serta aktif berkontribusi terhadap pencapaian target cabang."),
        ("12", "Senyum", "Ramah melaksanakan tugas dengan bahagia melambangkan optimisme & keceriaan", "Menunjukkan sikap ceria, ramah, dan berpikir positif."),
        ("13", "Salam", "Salam, ikhlas, bersahabat, kasih sayang, meningkatkan hubungan interpersonal", "Menjaga hubungan harmonis dan salam dalam kedinasan."),
        ("14", "Sapa", "Sapaan yang hangat, akrab dan bentuk kesiapan melayani pengguna jasa", "Responsif dan sigap saat melayani pihak eksternal/internal."),
        ("15", "Terima Kasih", "Bentuk apresiasi tinggi ungkapan hormat & membangun ikatan emosional", "Menyampaikan apresiasi atas bantuan dan kerja sama tim."),
        ("16", "Doa & Harapan", "Mendoakan kebaikan, kesehatan, keselamatan, dan kelancaran pekerjaan", "Selalu mengutamakan keselamatan kerja (K3) dan doa bersama."),
        ("17", "Disiplin Diri", "Mentaati seluruh peraturan kerja yang ditentukan perusahaan", "Tepat waktu dan patuh pada SOP Pelindo."),
    ]
    for idx, r in enumerate(rubrik_rows, start=1):
        row = rubrik_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[3].text = r[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=rub_w)

    doc.add_page_break()

    # ================= BAB 4 =================
    doc.add_heading("BAB 4: KEBUTUHAN FUNGSIONAL RINCI (SRS-F-01 s.d. SRS-F-28)", level=1)
    
    fn_table = doc.add_table(rows=29, cols=4)
    fn_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    fn_w = [1.2, 2.0, 2.6, 0.7]

    hdr = fn_table.rows[0]
    hdr.cells[0].text = "Kode SRS"
    hdr.cells[1].text = "Nama Kebutuhan Fungsional"
    hdr.cells[2].text = "Spesifikasi Perilaku Sistem"
    hdr.cells[3].text = "Prioritas"
    format_table_header(hdr, col_widths=fn_w)

    fn_list = [
        ("SRS-F-01", "Autentikasi Captcha SVG", "Login multi-role dilindungi SVG captcha acak berdistorsi; jawaban tidak bocor ke DOM/JSON.", "Wajib"),
        ("SRS-F-02", "Brute-Force Rate Limiter", "Membatasi 5 kali kegagalan login per IP/username dengan lockout otomatis 15 menit.", "Wajib"),
        ("SRS-F-03", "Dashboard Analitik Penilai", "Menampilkan statistik penilaian divisi, progress bar dinamis, dan status buka/tutup periode.", "Wajib"),
        ("SRS-F-04", "Katalog Personel TAD Divisi", "Daftar pegawai aktif terpisah antara tab Belum Dinilai dan Sudah Dinilai.", "Wajib"),
        ("SRS-F-05", "Form Penilaian & Auto-Save", "Formulir 17 butir indikator dengan drafting otomatis ke localStorage browser.", "Wajib"),
        ("SRS-F-06", "Standardisasi Skor AKHLAK", "Perhitungan atomik skor 0-100 dan penentuan predikat Sangat Baik s.d. Perlu Perhatian.", "Wajib"),
        ("SRS-F-07", "Anti-IDOR / Anti-BOLA Guard", "Memblokir percobaan penilaian lintas divisi dan manipulasi parameter ID karyawan.", "Wajib"),
        ("SRS-F-08", "Stateful Period Lock", "Sistem mengunci otomatis input penilaian pada periode bulan tertutup.", "Wajib"),
        ("SRS-F-09", "Pengajuan Akses Divisi", "Fitur permohonan pembukaan seluruh akses penilaian periode tertutup kepada Admin.", "Wajib"),
        ("SRS-F-10", "Pengajuan Izin Edit Nilai", "Izin edit individual satu kali pakai (single-use consumable) pasca persetujuan Admin.", "Wajib"),
        ("SRS-F-11", "Laporan Rekap & Cetak Dinas", "Pencetakan formulir penilaian resmi ber-kop PT Pelindo Multi Terminal Branch Cirebon.", "Wajib"),
        ("SRS-F-12", "Profil & Ganti Password Mandiri", "Penggantian kata sandi mandiri dengan validasi kata sandi lama dan banner default pass.", "Wajib"),
        ("SRS-F-13", "Admin Dashboard Eksekutif", "Ringkasan metrik 35 TAD, 3 divisi, distribusi predikat, dan antrian pengajuan akses.", "Wajib"),
        ("SRS-F-14", "Admin Matriks Periode", "Matriks 12 bulan x 3 divisi dengan kontrol buka/tutup mandiri dan bulk-toggle serentak.", "Wajib"),
        ("SRS-F-15", "Admin Approval Workflow", "Antrian verifikasi pengajuan akses/edit dengan pencatatan disposisi dan catatan verifikator.", "Wajib"),
        ("SRS-F-16", "Admin Master Data TAD", "CRUD personel TAD, penomoran otomatis NIK (TAD-XXXX), dan proteksi relasi RESTRICT.", "Wajib"),
        ("SRS-F-17", "Admin Manajemen Divisi", "Pengelolaan unit kerja operasional pelabuhan beserta status aktif/nonaktif.", "Wajib"),
        ("SRS-F-18", "Admin Manajemen Pengguna", "Pengelolaan akun penilai, reset password aman, dan pencabutan sesi instan saat deaktifasi.", "Wajib"),
        ("SRS-F-19", "Admin Kalibrasi Rubrik AKHLAK", "Penyesuaian teks indikator dan alasan bawaan dengan proteksi integritas relasi evaluasi.", "Wajib"),
        ("SRS-F-20", "Admin Laporan Eksekutif Cabang", "Laporan rekapitulasi bulanan dan laporan tahunan akumulasi 12 bulan seluruh divisi.", "Wajib"),
        ("SRS-F-21", "Admin Export CSV & Anti-Formula", "Ekspor data CSV ber-BOM UTF-8 dengan sanitasi otomatis formula Excel (CWE-1236).", "Wajib"),
        ("SRS-F-22", "Admin Enterprise Audit Trail", "Pencatatan otomatis seluruh aksi kritis (mutasi periode, reset sandi, backup) ke activity_logs.", "Wajib"),
        ("SRS-F-23", "Admin Backup & Disaster Recovery", "Snapshot atomik SQLite berkonsistensi tinggi, SHA-256 integrity hash, dan proteksi path traversal.", "Wajib"),
        ("SRS-F-24", "Admin Pejabat Penandatangan", "Pengaturan dinamis nama pejabat (Branch Manager & Manager SDM) dengan two-tier caching.", "Wajib"),
        ("SRS-F-25", "Otomasi Scheduler Period Lock", "Artisan cron daemon pengunci otomatis periode bulan lampau setiap awal bulan 00:00 WIB.", "Wajib"),
        ("SRS-F-26", "CLI Rekonsiliasi Skor", "Perintah konsol pembersihan drift skor dan pemutakhiran predikat pada data legacy.", "Tinggi"),
        ("SRS-F-27", "CLI Pembersihan Data Dummy", "Engine pemusnahan transaksi pengujian fiktif untuk persiapan go-live Tahap 3 riil.", "Wajib"),
        ("SRS-F-28", "Health Check & Log Retention", "Endpoint diagnostik sistem (/up) dan konfigurasi rotasi log harian 14 hari.", "Tinggi"),
    ]
    for idx, f in enumerate(fn_list, start=1):
        row = fn_table.rows[idx]
        row.cells[0].text = f[0]
        row.cells[1].text = f[1]
        row.cells[2].text = f[2]
        row.cells[3].text = f[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=fn_w)

    doc.add_page_break()

    # ================= BAB 5 =================
    doc.add_heading("BAB 5: KEBUTUHAN NON-FUNGSIONAL & KEAMANAN SIBER", level=1)
    
    doc.add_heading("5.1 Keamanan & Ketahanan Penetrasi Siber (OWASP Top 10 Hardened)", level=2)
    doc.add_paragraph("1. Proteksi Injeksi SQL: Seluruh akses database menggunakan PDO Parameterized Queries dan Eloquent ORM.", style='List Bullet')
    doc.add_paragraph("2. Proteksi XSS (Stored & Reflected): Auto-escaping Blade syntax, penambahan filter escapeHtml pada rendering client-side DOM modal laporan.", style='List Bullet')
    doc.add_paragraph("3. Proteksi CSRF: Token acak sinkronisasi terenkripsi pada seluruh request mutasi data state (POST, PUT, DELETE).", style='List Bullet')
    doc.add_paragraph("4. Proteksi BOLA / IDOR: Pengecekan otorisasi divisi berlapis pada endpoint formulir dan penyimpanan evaluasi.", style='List Bullet')
    doc.add_paragraph("5. Proteksi CSV Formula Injection (CWE-1236): Sanitasi seluruh sel teks yang diawali karakter formula (=, +, -, @).", style='List Bullet')
    doc.add_paragraph("6. Enterprise Security Headers: Penerapan header X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, Referrer-Policy, dan Permissions-Policy.", style='List Bullet')

    doc.add_heading("5.2 Metrik Kinerja & SLA", level=2)
    doc.add_paragraph("• Waktu Respons Server: Rata-rata < 80ms, 95th percentile < 200ms pada beban 100 request konkuren.", style='List Bullet')
    doc.add_paragraph("• Ketersediaan (Availability): Target uptime 99.9% pada hari dan jam kerja operasional pelabuhan.", style='List Bullet')
    doc.add_paragraph("• Target Pemulihan Bencana: Recovery Time Objective (RTO) < 15 menit dan Recovery Point Objective (RPO) = 0 kehilangan data.", style='List Bullet')

    doc.add_heading("5.3 Bukti Empiris Verifikasi & Pengujian Otomatis", level=2)
    doc.add_paragraph(
        "Kematangan perangkat lunak dibuktikan dengan portofolio pengujian otomatis komprehensif menggunakan PHPUnit:\n"
        "• Total Berkas Pengujian : 14 Test Suites\n"
        "• Total Kasus Uji         : 91 Automated Tests (100% LULUS)\n"
        "• Total Asersi           : 542 Asersi Validasi (100% LULUS)\n"
        "• Waktu Eksekusi Penuh   : ~10.8 detik\n"
        "• Cakupan Pengujian      : Autentikasi, Hak Akses, Formula Skor, Master Data, Scheduler, Audit Trail, Disaster Recovery, Hardening OWASP, dan Data Quality."
    )

    os.makedirs(os.path.dirname(docx_path), exist_ok=True)
    doc.save(docx_path)
    print(f"SRS Document DOCX generated successfully at: {docx_path}")

create_srs_document(r"C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition\.vscode\ptp\docs\SRS_SPKTAD_Pelindo_Cirebon_v2.0.docx")
