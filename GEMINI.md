# Aturan & Pedoman Pengembangan: KK Katolik (Google Apps Script)

Repositori ini berisi aplikasi manajemen Kartu Keluarga (KK) Katolik untuk Stasi St. Fransiskus Asisi Sindang (Paroki St. Stephanus Martir Curup), dibangun menggunakan Google Apps Script (GAS) Web App dan Google Sheets.

## 1. Arsitektur & Struktur Proyek
- `Code.gs`: Router web app (`doGet`) dan wrapper RPC untuk pemanggilan dari client (`google.script.run`).
- `DataService.gs`: IIFE layer CRUD Google Sheets dengan caching/formatting data yang aman.
- `Utils.gs`: Script inisialisasi struktur sheet (`setup()`) dan dummy seed data.
- `index.html`: SPA frontend tunggal (HTML, CSS, JS) menggunakan Tailwind CSS CDN, FontAwesome, dan Chart.js.
- `.clasp.json` & `.github/workflows/deploy.yml`: Konfigurasi Clasp dan workflow CI/CD otomatis ke Google Apps Script.

## 2. Invarian & Standar Kode
- **Komunikasi Client-Server**:
  - Semua fungsi di `Code.gs` yang mengembalikan data relasional/objek ke client HARUS dibungkus dengan `JSON.stringify(...)`.
  - Di sisi client (`index.html`), selalu parse data respons dengan `JSON.parse(...)` sebelum diproses.
- **Penanganan Tanggal**:
  - Tanggal pada Google Sheets sering berupa objek `Date` JavaScript yang rentan gagal serialisasi. Selalu gunakan format string standar `YYYY-MM-DD` (gunakan `_fmtVal()` di `DataService.gs`).
- **Skema Data**:
  - Kolom penghubung relasi Keluarga dan Anggota adalah `ID_KK` (UUID).
  - Saat mengubah header di `DataService.gs`, pastikan header di `Utils.gs` sinkron.
- **Konfigurasi Spreadsheet**:
  - Spreadsheet dihubungkan melalui Script Properties: `SPREADSHEET_ID`. Jangan pernah melakukan hardcode ID spreadsheet di dalam kode source.

## 3. Alur Deployment & Git
- Jangan commit file `.clasprc.json` atau file kredensial rahasia (sudah terdaftar di `.gitignore`).
- Push ke branch `main` pada remote `origin` akan secara otomatis memicu GitHub Action untuk push dan deploy versi baru di Google Apps Script via Clasp.
- Pengujian langsung tanpa push GitHub dapat dijalankan dengan: `npx @google/clasp push`.
