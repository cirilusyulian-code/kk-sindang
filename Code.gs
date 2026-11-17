/**
 * Aplikasi Kartu Keluarga Katolik
 * Stasi St. Fransiskus Asisi Sindang
 * Paroki St. Stephanus Martir Curup
 */

// ============================================================
// ENTRY POINT WEB APP
// ============================================================

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('KK Katolik — Stasi St. Fransiskus Asisi Sindang')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Helper include file HTML lain jika diperlukan
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// WRAPPER FUNCTIONS — dipanggil dari google.script.run
// Mengembalikan JSON string untuk mencegah error serialisasi Date / Objek di Apps Script
// ============================================================

function getAllKeluarga() {
  try {
    return JSON.stringify(DataService.getAllKeluarga());
  } catch (err) {
    throw new Error('Gagal memuat data keluarga: ' + err.message);
  }
}

function getKeluargaById(id) {
  try {
    return JSON.stringify(DataService.getKeluargaById(id));
  } catch (err) {
    throw new Error('Gagal mengambil data KK: ' + err.message);
  }
}

function saveKeluarga(data) {
  try {
    return DataService.saveKeluarga(data);
  } catch (err) {
    throw new Error('Gagal menyimpan KK: ' + err.message);
  }
}

function updateKeluarga(data) {
  try {
    return DataService.updateKeluarga(data);
  } catch (err) {
    throw new Error('Gagal memperbarui KK: ' + err.message);
  }
}

function deleteKeluarga(id) {
  try {
    return DataService.deleteKeluarga(id);
  } catch (err) {
    throw new Error('Gagal menghapus KK: ' + err.message);
  }
}

function getDashboardStats() {
  try {
    return JSON.stringify(DataService.getDashboardStats());
  } catch (err) {
    throw new Error('Gagal memuat statistik dashboard: ' + err.message);
  }
}

function getReferensi() {
  try {
    return JSON.stringify(DataService.getReferensi());
  } catch (err) {
    throw new Error('Gagal memuat referensi: ' + err.message);
  }
}

function saveReferensi(data) {
  try {
    return DataService.saveReferensi(data);
  } catch (err) {
    throw new Error('Gagal menyimpan referensi: ' + err.message);
  }
}

function getAppInfo() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  return {
    spreadsheetUrl : id ? 'https://docs.google.com/spreadsheets/d/' + id : '',
    stasi          : 'Stasi St. Fransiskus Asisi Sindang',
    paroki         : 'Paroki St. Stephanus Martir Curup'
  };
}
