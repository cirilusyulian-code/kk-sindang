# Panduan Setup — Aplikasi KK Katolik
## Stasi St. Fransiskus Asisi Sindang

---

## 📋 Daftar File yang Perlu Di-copy ke Google Apps Script

| File | Tipe di GAS | Keterangan |
|---|---|---|
| `Code.gs` | Script (.gs) | Entry point & wrapper functions |
| `DataService.gs` | Script (.gs) | Layer CRUD ke Google Sheets |
| `Utils.gs` | Script (.gs) | Setup & data dummy |
| `index.html` | HTML | Tampilan web app |

---

## 🚀 Langkah Setup (Lakukan Sekali)

### 1. Buka Google Apps Script
Buka browser → pergi ke: https://script.google.com

### 2. Buat Project Baru
- Klik **"New Project"**
- Rename project: **"KK Katolik Stasi St. Fransiskus"**

### 3. Copy File `.gs`

**File Code.gs:**
- Hapus isi default `Code.gs` yang ada
- Copy-paste isi `Code.gs` dari folder ini

**File DataService.gs:**
- Klik tombol **"+"** di panel kiri (Files)
- Pilih **"Script"** → beri nama `DataService`
- Copy-paste isi `DataService.gs`

**File Utils.gs:**
- Klik **"+"** lagi → pilih **"Script"** → beri nama `Utils`
- Copy-paste isi `Utils.gs`

### 4. Copy File HTML

**File index.html:**
- Klik **"+"** → pilih **"HTML"** → beri nama `index`
- Copy-paste isi `index.html`

### 5. Jalankan Setup

- Di dropdown fungsi (atas, biasanya bertuliskan "myFunction"), pilih **`setup`**
- Klik tombol **▶ Run**
- Saat muncul dialog izin (Authorization required):
  - Klik **"Review Permissions"**
  - Pilih akun Google Anda
  - Klik **"Advanced"** → **"Go to KK Katolik ... (unsafe)"**
  - Klik **"Allow"**
- Lihat log di bawah: akan muncul URL spreadsheet yang baru dibuat

> **Ini otomatis membuat:**
> - Google Spreadsheet baru dengan 3 sheet (Keluarga, Anggota, Referensi)
> - 18 KK data dummy (3 per lingkungan)
> - Daftar 6 Lingkungan + 2 KBG per lingkungan

### 6. Deploy sebagai Web App

- Klik menu **Deploy** (atas kanan) → **"New Deployment"**
- Klik ikon gear ⚙️ → pilih **"Web app"**
- Isi konfigurasi:
  - **Description**: `v1.0 — KK Katolik`
  - **Execute as**: `Me`
  - **Who has access**: `Only myself` ← PENTING untuk keamanan admin only
- Klik **"Deploy"**
- Copy URL yang muncul → ini adalah URL aplikasi Anda

### 7. Buka Aplikasi

Paste URL dari langkah 6 ke browser → Aplikasi siap digunakan!

---

## 🔄 Cara Update Fitur

Setiap kali ada perubahan kode:

1. Edit file di GAS Editor
2. Klik **Deploy** → **"Manage Deployments"**
3. Klik ✏️ Edit pada deployment yang ada
4. Ubah version ke **"New version"**
5. Klik **"Deploy"**

URL tidak berubah, pengguna tidak perlu tahu.

---

## 📊 Struktur Google Sheets yang Dibuat

### Sheet: `Keluarga` (17 kolom)
Data header setiap Kartu Keluarga

### Sheet: `Anggota` (22 kolom)  
Data semua anggota keluarga (linked by ID_KK)

### Sheet: `Referensi` (2 kolom)
Daftar Lingkungan dan KBG yang bisa diubah

---

## 📱 Fitur Aplikasi

| Fitur | Keterangan |
|---|---|
| Dashboard | Statistik KK, umat L/P, grafik usia, rekap per lingkungan |
| Data Keluarga | Tabel daftar KK + search + filter lingkungan/KBG |
| Tambah KK | Form input dengan max 8 anggota (2 tabel per KKK) |
| Edit KK | Pre-filled form untuk ubah data |
| Hapus KK | Konfirmasi sebelum hapus (menghapus header + semua anggota) |
| Cetak KKK | Preview A4 Landscape identik format kartu → Print/PDF |
| Kelola Referensi | Tambah/ubah/hapus daftar Lingkungan & KBG |

---

## ⚠️ Catatan Penting

- Aplikasi memerlukan internet (tidak bisa offline)
- Data tersimpan di Google Sheets milik akun Anda
- Backup otomatis tersedia via Google Drive version history
- Kapasitas: Google Sheets mendukung hingga 10 juta sel (cukup untuk ribuan KK)
- Jangan hapus sheet `Referensi` — data lingkungan & KBG disimpan di sini
