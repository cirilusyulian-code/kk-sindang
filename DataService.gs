/**
 * DataService.gs
 * Layer akses data ke Google Sheets
 */

const DataService = (function () {

  // ── HEADER SHEET ───────────────────────────────────────
  const KK_HEADERS = [
    'ID_KK','Lingkungan','KBG','Nama_KK','Alamat','Dusun','Desa',
    'Kecamatan','No_HP','Perkawinan_Di_Gereja','Perkawinan_Oleh',
    'Perkawinan_Tanggal','Nomor_Buku_Perkawinan','Catatan_Sipil',
    'Catatan_Sipil_Tanggal','Tanggal_Input','Tanggal_Update'
  ];

  const ANGGOTA_HEADERS = [
    'ID_Anggota','ID_KK','No_Urut','Nama_Baptis','Nama_Lahir','JK',
    'Hub_Keluarga','Lahir_Tempat','Lahir_Tanggal','Baptis_Tempat',
    'Baptis_Tanggal','Komuni_Pertama_Tempat','Komuni_Pertama_Tanggal',
    'Krisma_Tempat','Krisma_Tanggal','Pendidikan_Terakhir','Pekerjaan',
    'Gol_Darah','Nomor_Buku_Baptis','Dipermandikan_Oleh','Nama_Ayah','Nama_Ibu'
  ];

  // ── INTERNAL HELPERS ──────────────────────────────────
  function _ss() {
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) throw new Error('SPREADSHEET_ID belum di-set. Jalankan setup() terlebih dahulu.');
    return SpreadsheetApp.openById(id);
  }

  function _sheet(name) { return _ss().getSheetByName(name); }

  function _uuid() { return Utilities.getUuid(); }
  function _now()  { return new Date().toISOString(); }

  // Membersihkan nilai dari Sheets agar aman ditransfer (mengonversi Date ke string YYYY-MM-DD)
  function _fmtVal(val) {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) {
      if (isNaN(val.getTime())) return '';
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, '0');
      const d = String(val.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }
    return String(val).trim();
  }

  // ── KK / ANGGOTA MAPPING ──────────────────────────────
  function _rowToKK(row) {
    return {
      id_kk                  : _fmtVal(row[0]),
      lingkungan             : _fmtVal(row[1]),
      kbg                    : _fmtVal(row[2]),
      nama_kk                : _fmtVal(row[3]),
      alamat                 : _fmtVal(row[4]),
      dusun                  : _fmtVal(row[5]),
      desa                   : _fmtVal(row[6]),
      kecamatan              : _fmtVal(row[7]),
      no_hp                  : _fmtVal(row[8]),
      perkawinan_di_gereja   : _fmtVal(row[9]),
      perkawinan_oleh        : _fmtVal(row[10]),
      perkawinan_tanggal     : _fmtVal(row[11]),
      nomor_buku_perkawinan  : _fmtVal(row[12]),
      catatan_sipil          : _fmtVal(row[13]),
      catatan_sipil_tanggal  : _fmtVal(row[14]),
      tanggal_input          : _fmtVal(row[15]),
      tanggal_update         : _fmtVal(row[16]),
      anggota                : []
    };
  }

  function _rowToAnggota(row) {
    return {
      id_anggota              : _fmtVal(row[0]),
      id_kk                   : _fmtVal(row[1]),
      no_urut                 : parseInt(row[2], 10) || 1,
      nama_baptis             : _fmtVal(row[3]),
      nama_lahir              : _fmtVal(row[4]),
      jk                      : _fmtVal(row[5]),
      hub_keluarga            : _fmtVal(row[6]),
      lahir_tempat            : _fmtVal(row[7]),
      lahir_tanggal           : _fmtVal(row[8]),
      baptis_tempat           : _fmtVal(row[9]),
      baptis_tanggal          : _fmtVal(row[10]),
      komuni_pertama_tempat   : _fmtVal(row[11]),
      komuni_pertama_tanggal  : _fmtVal(row[12]),
      krisma_tempat           : _fmtVal(row[13]),
      krisma_tanggal          : _fmtVal(row[14]),
      pendidikan_terakhir     : _fmtVal(row[15]),
      pekerjaan               : _fmtVal(row[16]),
      gol_darah               : _fmtVal(row[17]),
      nomor_buku_baptis       : _fmtVal(row[18]),
      dipermandikan_oleh      : _fmtVal(row[19]),
      nama_ayah               : _fmtVal(row[20]),
      nama_ibu                : _fmtVal(row[21])
    };
  }

  function _angRow(kkId, noUrut, ang) {
    return [
      _uuid(), kkId, noUrut,
      ang.nama_baptis           || '',
      ang.nama_lahir            || '',
      ang.jk                    || '',
      ang.hub_keluarga          || '',
      ang.lahir_tempat          || '',
      ang.lahir_tanggal         || '',
      ang.baptis_tempat         || '',
      ang.baptis_tanggal        || '',
      ang.komuni_pertama_tempat || '',
      ang.komuni_pertama_tanggal|| '',
      ang.krisma_tempat         || '',
      ang.krisma_tanggal        || '',
      ang.pendidikan_terakhir   || '',
      ang.pekerjaan             || '',
      ang.gol_darah             || '',
      ang.nomor_buku_baptis     || '',
      ang.dipermandikan_oleh    || '',
      ang.nama_ayah             || '',
      ang.nama_ibu              || ''
    ];
  }

  function _deleteAnggotaByKK(anggotaSheet, kkId) {
    const lastRow = anggotaSheet.getLastRow();
    if (lastRow <= 1) return;
    const data = anggotaSheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][1]).trim() === String(kkId).trim()) {
        anggotaSheet.deleteRow(i + 1);
      }
    }
  }

  // ── PUBLIC API ────────────────────────────────────────
  return {

    getAllKeluarga: function () {
      const kkSheet  = _sheet('Keluarga');
      const angSheet = _sheet('Anggota');
      if (!kkSheet || !angSheet) return [];

      const kkLastRow = kkSheet.getLastRow();
      if (kkLastRow <= 1) return [];

      const kkRaw  = kkSheet.getDataRange().getValues();
      const angLastRow = angSheet.getLastRow();
      const angRaw = angLastRow > 1 ? angSheet.getDataRange().getValues() : [];

      // Buat map anggota per ID_KK
      const angMap = {};
      for (let i = 1; i < angRaw.length; i++) {
        if (!angRaw[i][0]) continue;
        const ang = _rowToAnggota(angRaw[i]);
        if (!angMap[ang.id_kk]) angMap[ang.id_kk] = [];
        angMap[ang.id_kk].push(ang);
      }

      const keluarga = [];
      for (let i = 1; i < kkRaw.length; i++) {
        if (!kkRaw[i][0]) continue; // skip baris kosong
        const kk = _rowToKK(kkRaw[i]);
        kk.anggota = (angMap[kk.id_kk] || []).sort((a, b) => a.no_urut - b.no_urut);
        keluarga.push(kk);
      }
      return keluarga;
    },

    getKeluargaById: function (id) {
      const all = this.getAllKeluarga();
      return all.find(k => k.id_kk === id) || null;
    },

    saveKeluarga: function (data) {
      const ss         = _ss();
      const kkSheet    = ss.getSheetByName('Keluarga');
      const angSheet   = ss.getSheetByName('Anggota');
      const id         = _uuid();
      const now        = _now();

      kkSheet.appendRow([
        id,
        data.lingkungan            || '',
        data.kbg                   || '',
        data.nama_kk               || '',
        data.alamat                || '',
        data.dusun                 || '',
        data.desa                  || '',
        data.kecamatan             || '',
        data.no_hp                 || '',
        data.perkawinan_di_gereja  || '',
        data.perkawinan_oleh       || '',
        data.perkawinan_tanggal    || '',
        data.nomor_buku_perkawinan || '',
        data.catatan_sipil         || '',
        data.catatan_sipil_tanggal || '',
        now, now
      ]);

      (data.anggota || []).forEach((ang, idx) => {
        angSheet.appendRow(_angRow(id, idx + 1, ang));
      });

      return { success: true, id: id };
    },

    updateKeluarga: function (data) {
      const ss       = _ss();
      const kkSheet  = ss.getSheetByName('Keluarga');
      const angSheet = ss.getSheetByName('Anggota');
      const now      = _now();

      // Update baris KK
      const kkData = kkSheet.getDataRange().getValues();
      for (let i = 1; i < kkData.length; i++) {
        if (String(kkData[i][0]).trim() === String(data.id_kk).trim()) {
          kkSheet.getRange(i + 1, 1, 1, KK_HEADERS.length).setValues([[
            data.id_kk,
            data.lingkungan            || '',
            data.kbg                   || '',
            data.nama_kk               || '',
            data.alamat                || '',
            data.dusun                 || '',
            data.desa                  || '',
            data.kecamatan             || '',
            data.no_hp                 || '',
            data.perkawinan_di_gereja  || '',
            data.perkawinan_oleh       || '',
            data.perkawinan_tanggal    || '',
            data.nomor_buku_perkawinan || '',
            data.catatan_sipil         || '',
            data.catatan_sipil_tanggal || '',
            kkData[i][15],             // pertahankan tanggal_input asli
            now
          ]]);
          break;
        }
      }

      // Hapus anggota lama lalu insert ulang
      _deleteAnggotaByKK(angSheet, data.id_kk);
      (data.anggota || []).forEach((ang, idx) => {
        angSheet.appendRow(_angRow(data.id_kk, idx + 1, ang));
      });

      return { success: true };
    },

    deleteKeluarga: function (id) {
      const ss       = _ss();
      const kkSheet  = ss.getSheetByName('Keluarga');
      const angSheet = ss.getSheetByName('Anggota');

      // Hapus baris KK
      const kkData = kkSheet.getDataRange().getValues();
      for (let i = kkData.length - 1; i >= 1; i--) {
        if (String(kkData[i][0]).trim() === String(id).trim()) {
          kkSheet.deleteRow(i + 1);
          break;
        }
      }

      // Hapus semua anggota KK ini
      _deleteAnggotaByKK(angSheet, id);

      return { success: true };
    },

    // ── DASHBOARD STATS ────────────────────────────────
    getDashboardStats: function () {
      const all   = this.getAllKeluarga();
      const today = new Date();

      const stats = {
        total_kk          : all.length,
        total_umat        : 0,
        laki_laki         : 0,
        perempuan         : 0,
        per_lingkungan    : {},
        distribusi_usia   : {
          balita      : 0,  // 0–5
          anak        : 0,  // 6–12
          remaja      : 0,  // 13–17
          dewasa_muda : 0,  // 18–30
          dewasa      : 0,  // 31–59
          lansia      : 0   // 60+
        }
      };

      all.forEach(kk => {
        const ling = kk.lingkungan || 'Lainnya';
        if (!stats.per_lingkungan[ling]) stats.per_lingkungan[ling] = { kk: 0, umat: 0, laki: 0, perempuan: 0 };
        stats.per_lingkungan[ling].kk++;

        (kk.anggota || []).forEach(ang => {
          stats.total_umat++;
          stats.per_lingkungan[ling].umat++;

          if (ang.jk === 'L') { stats.laki_laki++;  stats.per_lingkungan[ling].laki++; }
          else if (ang.jk === 'P') { stats.perempuan++; stats.per_lingkungan[ling].perempuan++; }

          // Hitung usia
          if (ang.lahir_tanggal) {
            try {
              const tgl = new Date(ang.lahir_tanggal);
              if (!isNaN(tgl.getTime())) {
                let usia = today.getFullYear() - tgl.getFullYear();
                const bln = today.getMonth() - tgl.getMonth();
                if (bln < 0 || (bln === 0 && today.getDate() < tgl.getDate())) usia--;
                if      (usia <=  5) stats.distribusi_usia.balita++;
                else if (usia <= 12) stats.distribusi_usia.anak++;
                else if (usia <= 17) stats.distribusi_usia.remaja++;
                else if (usia <= 30) stats.distribusi_usia.dewasa_muda++;
                else if (usia <= 59) stats.distribusi_usia.dewasa++;
                else                 stats.distribusi_usia.lansia++;
              }
            } catch (e) { /* abaikan tanggal tidak valid */ }
          }
        });
      });

      return stats;
    },

    // ── REFERENSI ──────────────────────────────────────
    getReferensi: function () {
      const sheet = _sheet('Referensi');
      if (!sheet || sheet.getLastRow() <= 1) {
        return { lingkungan: [], kbg: {} };
      }
      const data  = sheet.getDataRange().getValues();
      const ref   = { lingkungan: [], kbg: {} };

      for (let i = 1; i < data.length; i++) {
        const ling = _fmtVal(data[i][0]);
        const kbgStr = _fmtVal(data[i][1]);

        if (ling) ref.lingkungan.push(ling);

        if (kbgStr.includes('|')) {
          const parts = kbgStr.split('|');
          const l = parts[0].trim();
          const k = parts[1].trim();
          if (!ref.kbg[l]) ref.kbg[l] = [];
          if (k) ref.kbg[l].push(k);
        }
      }

      // Deduplikasi
      ref.lingkungan = [...new Set(ref.lingkungan)];
      return ref;
    },

    saveReferensi: function (data) {
      const sheet = _sheet('Referensi');
      sheet.clearContents();
      sheet.getRange(1, 1, 1, 2).setValues([['Lingkungan', 'KBG']]);

      const rows = [];
      (data.lingkungan || []).forEach(ling => {
        const kbgList = (data.kbg && data.kbg[ling]) || [];
        if (kbgList.length === 0) {
          rows.push([ling, '']);
        } else {
          kbgList.forEach((kbg, idx) => {
            rows.push([idx === 0 ? ling : '', ling + '|' + kbg]);
          });
        }
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 2).setValues(rows);
      }

      return { success: true };
    }

  }; // end return
})(); // end IIFE
