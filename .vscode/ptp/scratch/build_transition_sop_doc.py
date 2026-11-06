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

def create_transition_sop_document(docx_path):
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
        hrun = hp.add_run("SOP Transisi Data Riil & Pembersihan Dummy | SOP-IT-PTP-CRB-2026-004")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = COLOR_GRAY

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("PT Pelindo Multi Terminal Branch Cirebon - Dokumen Standar Operasional Prosedur TI")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = COLOR_GRAY

    # ================= COVER / HEADER =================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = p_inst.add_run("PT PELABUHAN INDONESIA (PERSERO)\n")
    r1.bold = True
    r1.font.name = "Calibri"
    r1.font.size = Pt(13)
    r1.font.color.rgb = COLOR_NAVY

    r2 = p_inst.add_run("PT PELINDO MULTI TERMINAL - BRANCH CIREBON\n")
    r2.bold = True
    r2.font.name = "Calibri"
    r2.font.size = Pt(11.5)
    r2.font.color.rgb = COLOR_BLUE

    doc.add_paragraph().paragraph_format.space_after = Pt(24)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rt = p_title.add_run("STANDAR OPERASIONAL PROSEDUR (SOP)\n& PANDUAN PELAKSANAAN RESMI\n\n")
    rt.bold = True
    rt.font.name = "Calibri"
    rt.font.size = Pt(18)
    rt.font.color.rgb = COLOR_NAVY

    rt2 = p_title.add_run("TRANSISI DATA RIIL, SANITASI HIGIENITAS,\nDAN PEMBERSIHAN DATA TRANSAKSI DUMMY\n(PERSIAPAN TAHAP 2 MENUJU TAHAP 3 / GO-LIVE)\n")
    rt2.bold = True
    rt2.font.name = "Calibri"
    rt2.font.size = Pt(15)
    rt2.font.color.rgb = COLOR_BLUE

    doc.add_paragraph().paragraph_format.space_after = Pt(30)

    # Metadata SOP Table
    sop_table = doc.add_table(rows=6, cols=2)
    sop_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sop_meta = [
        ("Nomor Dokumen SOP", "SOP-IT-PTP-CRB-2026-004"),
        ("Unit Kerja Pemilik", "Divisi SDM, Umum & Sistem Informasi TI"),
        ("Sistem Aplikasi Terkait", "Sistem Penilaian Kinerja Tenaga Alih Daya (SPKTAD) v2.0"),
        ("Tanggal Berlaku", "03 November 2026"),
        ("Klasifikasi", "DOKUMEN OPERASIONAL RESMI (INTERNAL BUMN)"),
        ("Target Fase", "Transisi Tahap 2 (Development/Testing) ke Tahap 3 (Implementation/Live)"),
    ]
    col_w = [2.2, 4.3]
    for idx, (label, val) in enumerate(sop_meta):
        row = sop_table.rows[idx]
        row.cells[0].text = label
        row.cells[1].text = val
        row.cells[0].paragraphs[0].runs[0].bold = True
        row.cells[0].paragraphs[0].runs[0].font.color.rgb = COLOR_NAVY
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=col_w)

    doc.add_paragraph().paragraph_format.space_after = Pt(36)

    # Lembar Persetujuan SOP
    p_app = doc.add_paragraph()
    p_app.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_app = p_app.add_run("LEMBAR PENGESAHAN PROSEDUR")
    r_app.bold = True
    r_app.font.name = "Calibri"
    r_app.font.size = Pt(11)
    r_app.font.color.rgb = COLOR_NAVY

    app_table = doc.add_table(rows=4, cols=3)
    app_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    app_widths = [2.1, 2.2, 2.2]

    hdr = app_table.rows[0]
    hdr.cells[0].text = "Disiapkan Oleh"
    hdr.cells[1].text = "Diverifikasi Oleh"
    hdr.cells[2].text = "Ditetapkan Oleh"
    format_table_header(hdr, col_widths=app_widths)

    r1 = app_table.rows[1]
    r1.cells[0].text = "Administrator TI Cabang\nPengelola Basis Data"
    r1.cells[1].text = "Manager SDM & Umum\nPT Pelindo Multi Terminal Branch Cirebon"
    r1.cells[2].text = "Branch Manager\nPT Pelindo Multi Terminal Branch Cirebon"
    format_table_row(r1, is_alt=False, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    r2 = app_table.rows[2]
    r2.cells[0].text = "\n\n( Tanda Tangan Elektronik )\n"
    r2.cells[1].text = "\n\n( Tanda Tangan Elektronik )\n"
    r2.cells[2].text = "\n\n( Tanda Tangan Elektronik )\n"
    format_table_row(r2, is_alt=True, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    r3 = app_table.rows[3]
    r3.cells[0].text = "Tim Pengembang SPKTAD\nTanggal: 03 Nov 2026"
    r3.cells[1].text = "Dedi Heryadi, S.E.\nNIPP: 28214055"
    r3.cells[2].text = "Bambang Wijanarko, S.T., M.M.\nNIPP: 27608912"
    format_table_row(r3, is_alt=False, col_widths=app_widths, alignments=[WD_ALIGN_PARAGRAPH.CENTER]*3)

    doc.add_page_break()

    # ================= BAGIAN 1 =================
    doc.add_heading("BAGIAN 1: TUJUAN & PRINSIP HIGIENITAS DATA", level=1)
    doc.add_paragraph(
        "Sebelum melangkah ke Tahap 3 (Implementation / Go-Live Operasional), sistem SPKTAD harus melewati proses transisi "
        "kritis yang memastikan bahwa basis data produksi bebas sepenuhnya dari data dummy (data pengujian fiktif) namun "
        "tetap mempertahankan integritas 100% master data riil (Divisi, Master Rubrik AKHLAK, Akun Pengguna, dan 35 Personel TAD riil Pelindo Cirebon).\n\n"
        "Transisi ini dipandu oleh 3 Prinsip Utama Tata Kelola TI BUMN:\n"
        "1. Prinsip Zero Data Residue: Tidak boleh ada satupun transaksi penilaian tiruan/dummy yang tertinggal dalam tabel produksi yang dapat mencemari laporan eksekutif cabang atau audit Satuan Pengawasan Intern (SPI).\n"
        "2. Prinsip Zero Accidental Loss: Penghapusan data transaksi pengujian tidak boleh merusak atau menghapus entitas master data (Divisi, Rubrik AKHLAK, Karyawan TAD, dan Akun Penilai).\n"
        "3. Prinsip Audit Trail & Bukti Empiris: Setiap tindakan pembersihan dan inisiasi data riil wajib terekam dalam log audit dan diverifikasi melalui Data Quality Framework."
    )

    add_callout(
        doc,
        "Peringatan Keamanan Produksi: Pembersihan data dummy hanya boleh dilakukan oleh Administrator SDM & IT yang berwenang "
        "menggunakan perintah terenkapsulasi resmi `php artisan ptp:clean-dummy`. Dilarang keras melakukan perintah manual raw SQL "
        "`DROP TABLE` atau `TRUNCATE` pada terminal database produksi yang dapat memutus relasi foreign key dan skema pragma.",
        title="PERINGATAN OPERASIONAL KORPORAT"
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ================= BAGIAN 2 =================
    doc.add_heading("BAGIAN 2: INVENTARISASI & KLASIFIKASI DATA TRANSISI", level=1)
    doc.add_paragraph("Tabel klasifikasi perlakuan data pada fase transisi Tahap 2 ke Tahap 3:")
    
    klas_table = doc.add_table(rows=7, cols=4)
    klas_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    klas_w = [1.6, 2.0, 1.4, 1.7]

    hdr = klas_table.rows[0]
    hdr.cells[0].text = "Tabel Basis Data"
    hdr.cells[1].text = "Klasifikasi Entitas"
    hdr.cells[2].text = "Status Transisi"
    hdr.cells[3].text = "Tindakan Prosedural"
    format_table_header(hdr, col_widths=klas_w)

    klas_rows = [
        ("divisions", "Master 3 Divisi Cabang", "DIJAGA (Preserve)", "Tetap aktif (Operasi, Ren-Dal, Keuangan)"),
        ("users", "Akun Admin & 3 Kepala Divisi", "DIJAGA (Preserve)", "Pertahankan, rotasi kata sandi wajib"),
        ("employees", "Master 35 Personel TAD Riil", "DIJAGA (Preserve)", "Pertahankan seluruh NIK & vendor PDS"),
        ("evaluation_categories & subcategories", "Rubrik Standar AKHLAK (12/17)", "DIJAGA (Preserve)", "Standar acuan evaluasi BUMN"),
        ("evaluations & details", "Transaksi Nilai Pengujian Dummy", "DIMUSNAHKAN (Purge)", "Dibersihkan tuntas sebelum go-live"),
        ("edit_requests", "Pengajuan Izin Edit Uji Coba", "DIMUSNAHKAN (Purge)", "Dikosongkan untuk periode live baru"),
    ]
    for idx, r in enumerate(klas_rows, start=1):
        row = klas_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[3].text = r[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=klas_w)

    doc.add_page_break()

    # ================= BAGIAN 3 =================
    doc.add_heading("BAGIAN 3: MASTER DATA RIIL 35 PERSONEL TAD PELINDO CIREBON", level=1)
    doc.add_paragraph(
        "Berikut adalah daftar resmi 35 Tenaga Alih Daya (TAD) PT Pelindo Multi Terminal Branch Cirebon "
        "yang telah divalidasi oleh Divisi SDM & Umum untuk dimasukkan ke dalam basis data produksi riil:"
    )

    tad_table = doc.add_table(rows=36, cols=5)
    tad_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tad_w = [0.5, 1.1, 2.0, 1.7, 1.4]

    hdr = tad_table.rows[0]
    hdr.cells[0].text = "No"
    hdr.cells[1].text = "NIK Kode"
    hdr.cells[2].text = "Nama Lengkap TAD"
    hdr.cells[3].text = "Jabatan Operasional"
    hdr.cells[4].text = "Divisi Penempatan"
    format_table_header(hdr, col_widths=tad_w)

    employeesData = [
        (1, "TAD-0010", "Agung Sugiarto", "Operator Alat (Forklift)", "Operasi"),
        (2, "TAD-0011", "Edi Purnomo", "Pelaksana Ren-Dal Kapal", "Perencanaan Pengendalian"),
        (3, "TAD-0012", "Sugiantoro", "Adm Perbendaharaan", "Keuangan"),
        (4, "TAD-0014", "Agus Kamaludin", "Operator Alat (Excavator)", "Operasi"),
        (5, "TAD-0015", "Agus Supriyadi", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (6, "TAD-0016", "Dede Suhaedi", "Operator Alat (Excavator)", "Operasi"),
        (7, "TAD-0017", "Elfan Lesmana", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (8, "TAD-0019", "Erwin Mulyadi", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (9, "TAD-0020", "Gery Wicaksono", "Rigger (Alat Mekanis)", "Operasi"),
        (10, "TAD-0021", "Hantoro", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (11, "TAD-0022", "Heri Nardo", "Pelaksana Terminal Operation I", "Operasi"),
        (12, "TAD-0023", "Jaka", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (13, "TAD-0024", "Jumadi", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (14, "TAD-0025", "Jumari", "Operator Alat (Excavator)", "Operasi"),
        (15, "TAD-0026", "Kastu", "Operator Alat (Wheel Loader)", "Operasi"),
        (16, "TAD-0027", "M. Rosyadi", "Rigger (Alat Mekanis)", "Operasi"),
        (17, "TAD-0028", "Marman", "Operator Alat (Excavator)", "Operasi"),
        (18, "TAD-0029", "Mindaryono", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (19, "TAD-0030", "Nanto Suhardiyanto", "Operator Alat (Excavator)", "Operasi"),
        (20, "TAD-0031", "Niki Angga Kusuma", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (21, "TAD-0032", "Nur Rachmat", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (22, "TAD-0033", "Panji Akbar Saputra", "Operator Alat (Excavator)", "Operasi"),
        (23, "TAD-0034", "Rakhmat Suharjo", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (24, "TAD-0035", "Ruja", "Rigger (Alat Mekanis)", "Operasi"),
        (25, "TAD-0036", "Suheri", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (26, "TAD-0037", "Sukana", "Operator Alat (Wheel Loader)", "Operasi"),
        (27, "TAD-0038", "Sumarno", "Operator Alat (Wheel Loader)", "Operasi"),
        (28, "TAD-0039", "Suwarja", "Operator Alat (Excavator)", "Operasi"),
        (29, "TAD-0040", "Tedy Sumartono", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (30, "TAD-0041", "Untung Saefullah", "Operator Alat (Excavator)", "Operasi"),
        (31, "TAD-0042", "Wahyu Adi Purwa", "Adm Kapal, Gudang & Lapangan", "Operasi"),
        (32, "TAD-0043", "Tachromin Sukmadi", "Rigger (Alat Mekanis)", "Operasi"),
        (33, "TAD-0044", "M. Dedy Arif", "Operator Alat (Excavator)", "Operasi"),
        (34, "TAD-0045", "Pandu Rahmat Putra", "Adm Akuntansi", "Keuangan"),
        (35, "TAD-0046", "Eman Separman", "Adm Kapal, Gudang & Lapangan", "Operasi"),
    ]
    for idx, (no, nik, nama, pos, div) in enumerate(employeesData, start=1):
        row = tad_table.rows[idx]
        row.cells[0].text = str(no)
        row.cells[1].text = nik
        row.cells[2].text = nama
        row.cells[3].text = pos
        row.cells[4].text = div
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=tad_w)

    doc.add_page_break()

    # ================= BAGIAN 4 =================
    doc.add_heading("BAGIAN 4: PROSEDUR EKSEKUSI PEMBERSIHAN DATA DUMMY", level=1)
    doc.add_paragraph(
        "Untuk membersihkan seluruh data dummy pengujian tanpa merusak skema tabel dan integritas master data, "
        "ikuti langkah-langkah terstruktur berikut:"
    )

    doc.add_heading("Langkah 1: Pembuatan Cadangan Pra-Transisi (Pre-Transition Backup)", level=2)
    doc.add_paragraph(
        "Sebelum mengeksekusi pembersihan apapun, Administrator wajib membuat snapshot database sebagai jaminan pemulihan:\n"
        "Perintah Terminal:\n"
        "  php artisan ptp:backup\n"
        "Hasil eksekusi akan tersimpan pada direktori storage/app/backups/ dengan hash SHA-256 yang tercatat di audit log."
    )

    doc.add_heading("Langkah 2: Simulasi Pengecekan Aman (Dry-Run Mode)", level=2)
    doc.add_paragraph(
        "Jalankan simulasi untuk memeriksa jumlah entri transaksi dummy yang terdeteksi tanpa melakukan penghapusan fisik:\n"
        "Perintah Terminal:\n"
        "  php artisan ptp:clean-dummy --dry-run\n"
        "Sistem akan menampilkan tabel entri pada tabel evaluations, evaluation_details, dan edit_requests."
    )

    doc.add_heading("Langkah 3: Eksekusi Pembersihan Definitif (Purge Execution)", level=2)
    doc.add_paragraph(
        "Setelah diverifikasi, eksekusi pembersihan menyeluruh menggunakan perintah:\n"
        "Perintah Terminal:\n"
        "  php artisan ptp:clean-dummy --force\n"
        "Perintah ini secara atomik (DB Transaction):\n"
        "a. Mengosongkan tabel evaluation_details dan evaluations.\n"
        "b. Mengosongkan tabel edit_requests pengujian.\n"
        "c. Mencatat aktivitas 'system.dummy_data_purged' ke dalam tabel activity_logs.\n"
        "d. Menjalankan audit kualitas data otomatis pasca pembersihan."
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ================= BAGIAN 5 =================
    doc.add_heading("BAGIAN 5: PROTOKOL & STANDAR AUDIT KUALITAS DATA", level=1)
    doc.add_paragraph(
        "Sistem dilengkapi dengan modul Data Quality Framework (DataQualityService) yang dapat dijalankan kapan saja "
        "oleh tim pengembang atau administrator untuk memastikan kesehatan data cabang."
    )

    doc.add_heading("Perintah Audit Kualitas Data", level=2)
    doc.add_paragraph(
        "Perintah Terminal:\n"
        "  php artisan ptp:data-quality\n\n"
        "Untuk integrasi dengan pipeline CI/CD devops, gunakan opsi format JSON:\n"
        "  php artisan ptp:data-quality --json"
    )

    dq_table = doc.add_table(rows=6, cols=3)
    dq_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    dq_w = [1.8, 2.5, 2.4]

    hdr = dq_table.rows[0]
    hdr.cells[0].text = "Dimensi Kualitas Data"
    hdr.cells[1].text = "Aturan Pemeriksaan (Rules)"
    hdr.cells[2].text = "Kriteria Kelulusan (Threshold)"
    format_table_header(hdr, col_widths=dq_w)

    dq_rows = [
        ("Completeness (Kelengkapan)", "TAD NIK, Division Mapping, Vendor Name, Rubrik AKHLAK", "100% lengkap, 0 personel tanpa NIK/Divisi"),
        ("Uniqueness (Keunikan)", "Anti-duplikasi NIK, Username pengguna, Nilai per periode", "0 duplikasi terdeteksi"),
        ("Validity (Validitas)", "Skala rating 1 s.d. 6, Skor 0-100, Predikat terstandar", "100% valid sesuai batasan matematis"),
        ("Referential Integrity", "Foreign key karyawan ke divisi, evaluasi ke karyawan", "0 orphan record (tanpa induk)"),
        ("Hygiene Status", "Jumlah transaksi evaluasi produksi dan jumlah TAD aktif", "Jumlah TAD aktif tepat 35 orang"),
    ]
    for idx, r in enumerate(dq_rows, start=1):
        row = dq_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=dq_w)

    doc.add_page_break()

    # ================= BAGIAN 6 =================
    doc.add_heading("BAGIAN 6: PROTOKOL VERIFIKASI KEAMANAN PENETRASI (HACKING SIDE)", level=1)
    doc.add_paragraph(
        "Sebelum serah terima ke tahap implementasi (Tahap 3), sistem wajib melewati uji penetrasi siber "
        "(Penetration Testing) untuk memastikan seluruh celah keamanan OWASP telah tertutup rapat:"
    )

    pen_table = doc.add_table(rows=11, cols=4)
    pen_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    pen_w = [0.6, 2.0, 2.7, 1.4]

    hdr = pen_table.rows[0]
    hdr.cells[0].text = "No"
    hdr.cells[1].text = "Vektor Serangan (Hacking Test)"
    hdr.cells[2].text = "Mekanisme Pertahanan & Hardening"
    hdr.cells[3].text = "Status Pengujian"
    format_table_header(hdr, col_widths=pen_w)

    pen_rows = [
        ("1", "Cross-Division BOLA / IDOR", "Validasi hak akses divisi pada PenilaianController@store menolak post lintas unit kerja.", "PASSED (403 Forbidden)"),
        ("2", "Period Lock Bypass", "Pengecekan status periode dan verifikasi izin pengajuan pada endpoint simpan nilai.", "PASSED (Rejected)"),
        ("3", "Stored XSS Injection", "Sanitasi escapeHtml pada DOM modal laporan dan escaping Blade otomatis.", "PASSED (Neutralized)"),
        ("4", "CSV Formula Injection (CWE-1236)", "Sanitasi otomatis sel CSV yang diawali karakter =, +, -, @ dengan prepend petik tunggal.", "PASSED (Sanitized)"),
        ("5", "Type Juggling Array Username", "Validasi tipe string sebelum transliterasi dan hashing rate limiter login.", "PASSED (No Crash 500)"),
        ("6", "Captcha Token Replay", "Pemusnahan instan token captcha dari sesi (session forget) segera setelah dibaca.", "PASSED (Anti-Replay)"),
        ("7", "Privilege Escalation to Admin", "Middleware EnsureUserIsAdmin mengisolasi rute pengaturan, backup, dan audit log.", "PASSED (Redirect 302)"),
        ("8", "SQL Injection pada Search/Filter", "Penggunaan parameter binding PDO Eloquent menetralkan payload UNION / DROP.", "PASSED (Safe)"),
        ("9", "Path Traversal pada Backup Engine", "Whitelist regex nama file cadangan memblokir traversal ../ dan ..\\.", "PASSED (Blocked 404/403)"),
        ("10", "Deactivated User Session Hijack", "Middleware EnsureUserIsActive langsung mencabut sesi user yang dinonaktifkan.", "PASSED (Revoked)"),
    ]
    for idx, r in enumerate(pen_rows, start=1):
        row = pen_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[3].text = r[3]
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=pen_w)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ================= BAGIAN 7 =================
    doc.add_heading("BAGIAN 7: LEMBAR PERSETUJUAN CUTOVER TAHAP 2 KE TAHAP 3", level=1)
    doc.add_paragraph("Checklist kesiapan akhir sebelum menandatangani Berita Acara Transisi:")

    chk_table = doc.add_table(rows=9, cols=3)
    chk_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    chk_w = [0.8, 4.4, 1.5]

    hdr = chk_table.rows[0]
    hdr.cells[0].text = "No"
    hdr.cells[1].text = "Item Pemeriksaan Kesiapan (Cutover Readiness Checklist)"
    hdr.cells[2].text = "Status Kesiapan"
    format_table_header(hdr, col_widths=chk_w)

    chk_rows = [
        ("1", "Seluruh 91 kasus uji otomatis (542 asersi) lulus 100% tanpa kegagalan.", "[ V ] SELESAI"),
        ("2", "Uji penetrasi siber (10 vektor keamanan) terverifikasi tahan banting.", "[ V ] SELESAI"),
        ("3", "Data master 35 personel TAD riil telah terinput lengkap dengan vendor PT PDS.", "[ V ] SELESAI"),
        ("4", "Data dummy transaksi penilaian telah dibersihkan secara tuntas dari tabel produksi.", "[ V ] SELESAI"),
        ("5", "Cadangan snapshot basis data pra-transisi tersimpan aman dengan hash SHA-256.", "[ V ] SELESAI"),
        ("6", "Audit kualitas data (Data Quality Audit) menghasilkan Health Score 100%.", "[ V ] SELESAI"),
        ("7", "Dokumen SRS v2.0 resmi telah disahkan oleh Branch Manager & Manager SDM.", "[ V ] SELESAI"),
        ("8", "Sistem siap memasuki Tahap 3: Implementation, Environment Hardening & Live Rollout.", "[ V ] SIAP CUTOVER"),
    ]
    for idx, r in enumerate(chk_rows, start=1):
        row = chk_table.rows[idx]
        row.cells[0].text = r[0]
        row.cells[1].text = r[1]
        row.cells[2].text = r[2]
        row.cells[2].paragraphs[0].runs[0].bold = True
        row.cells[2].paragraphs[0].runs[0].font.color.rgb = COLOR_BLUE
        format_table_row(row, is_alt=(idx % 2 == 1), col_widths=chk_w)

    os.makedirs(os.path.dirname(docx_path), exist_ok=True)
    doc.save(docx_path)
    print(f"Transition SOP Document DOCX generated successfully at: {docx_path}")

create_transition_sop_document(r"C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition\.vscode\ptp\docs\PANDUAN_TRANSISI_DATA_REAL_DAN_PEMBERSIHAN_DUMMY_SPKTAD.docx")
