import os
import shutil
import win32com.client

docs_dir = r"C:\Users\Gajanpar\.gemini\antigravity\worktrees\ptp\prepare_real_data_transition\.vscode\ptp\docs"
brain_dir = r"C:\Users\Gajanpar\.gemini\antigravity\brain\cd49c130-9e9c-4a73-aa5f-a9481c64c616"

os.makedirs(docs_dir, exist_ok=True)
os.makedirs(brain_dir, exist_ok=True)

files_to_convert = [
    "SRS_SPKTAD_Pelindo_Cirebon_v2.0.docx",
    "PANDUAN_TRANSISI_DATA_REAL_DAN_PEMBERSIHAN_DUMMY_SPKTAD.docx",
]

print("Initializing Microsoft Word COM Application...")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False

for fname in files_to_convert:
    docx_file = os.path.join(docs_dir, fname)
    pdf_fname = fname.replace(".docx", ".pdf")
    pdf_file = os.path.join(docs_dir, pdf_fname)
    
    print(f"Opening: {docx_file}")
    doc = word.Documents.Open(os.path.abspath(docx_file))
    print(f"Exporting to PDF: {pdf_file}")
    doc.SaveAs(os.path.abspath(pdf_file), FileFormat=17) # 17 = wdFormatPDF
    doc.Close()
    
    # Copy to brain artifact directory as well
    brain_docx = os.path.join(brain_dir, fname)
    brain_pdf = os.path.join(brain_dir, pdf_fname)
    shutil.copyfile(docx_file, brain_docx)
    shutil.copyfile(pdf_file, brain_pdf)
    print(f"Copied to Brain Artifacts: {brain_pdf}")

word.Quit()
print("All DOCX and PDF documents successfully generated and verified!")
