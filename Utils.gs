/**
 * Utils.gs
 * Fungsi setup awal & pembuatan data dummy
 * Jalankan setup() SATU KALI dari GAS Editor
 */

// ============================================================
// FUNGSI UTAMA — jalankan dari GAS Editor (Run > setup)
// ============================================================

function setup() {
  Logger.log('=== MEMULAI SETUP ===');

  // 1. Buat Spreadsheet baru
  const ss = SpreadsheetApp.create('KK Katolik — Stasi St. Fransiskus Asisi Sindang');
  Logger.log('Spreadsheet dibuat: ' + ss.getUrl());

  // 2. Hapus sheet default "Sheet1"
  const defaultSheet = ss.getSheets()[0];

  // 3. Buat sheet-sheet yang diperlukan
  const kkSheet    = ss.insertSheet('Keluarga');
  const angSheet   = ss.insertSheet('Anggota');
  const refSheet   = ss.insertSheet('Referensi');
  ss.deleteSheet(defaultSheet);

  // 4. Set header Keluarga
  kkSheet.getRange(1, 1, 1, 17).setValues([[
    'ID_KK','Lingkungan','KBG','Nama_KK','Alamat','Dusun','Desa',
    'Kecamatan','No_HP','Perkawinan_Di_Gereja','Perkawinan_Oleh',
    'Perkawinan_Tanggal','Nomor_Buku_Perkawinan','Catatan_Sipil',
    'Catatan_Sipil_Tanggal','Tanggal_Input','Tanggal_Update'
  ]]);
  kkSheet.getRange(1, 1, 1, 17).setFontWeight('bold').setBackground('#4A90D9').setFontColor('white');
  kkSheet.setFrozenRows(1);

  // 5. Set header Anggota
  angSheet.getRange(1, 1, 1, 22).setValues([[
    'ID_Anggota','ID_KK','No_Urut','Nama_Baptis','Nama_Lahir','JK',
    'Hub_Keluarga','Lahir_Tempat','Lahir_Tanggal','Baptis_Tempat',
    'Baptis_Tanggal','Komuni_Pertama_Tempat','Komuni_Pertama_Tanggal',
    'Krisma_Tempat','Krisma_Tanggal','Pendidikan_Terakhir','Pekerjaan',
    'Gol_Darah','Nomor_Buku_Baptis','Dipermandikan_Oleh','Nama_Ayah','Nama_Ibu'
  ]]);
  angSheet.getRange(1, 1, 1, 22).setFontWeight('bold').setBackground('#4A90D9').setFontColor('white');
  angSheet.setFrozenRows(1);

  // 6. Set header Referensi + isi data awal
  refSheet.getRange(1, 1, 1, 2).setValues([['Lingkungan', 'KBG']]);
  refSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4A90D9').setFontColor('white');

  const lingkunganList = ['St. Thomas','St. Petrus','Sta. Maria','St. Pius','St. Elisabeth','St. Paulus'];
  const refRows = [];
  lingkunganList.forEach(function(ling) {
    refRows.push([ling, ling + '|KBG 1']);
    refRows.push(['',   ling + '|KBG 2']);
  });
  refSheet.getRange(2, 1, refRows.length, 2).setValues(refRows);

  // 7. Simpan ID spreadsheet ke Properties
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  // 8. Isi data dummy
  _setupDummyData(ss);

  Logger.log('=================================');
  Logger.log('SETUP BERHASIL!');
  Logger.log('Spreadsheet ID : ' + ss.getId());
  Logger.log('URL            : ' + ss.getUrl());
  Logger.log('=================================');
  Logger.log('Selanjutnya: Deploy sebagai Web App (Deploy > New Deployment)');
}

// Jalankan ini jika ingin reset dummy data saja tanpa setup ulang
function resetDummyData() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) { Logger.log('ERROR: Belum di-setup. Jalankan setup() dulu.'); return; }
  const ss = SpreadsheetApp.openById(id);

  // Kosongkan Keluarga & Anggota (pertahankan header)
  const kkSheet  = ss.getSheetByName('Keluarga');
  const angSheet = ss.getSheetByName('Anggota');
  if (kkSheet.getLastRow()  > 1) kkSheet.deleteRows(2, kkSheet.getLastRow() - 1);
  if (angSheet.getLastRow() > 1) angSheet.deleteRows(2, angSheet.getLastRow() - 1);

  _setupDummyData(ss);
  Logger.log('Dummy data berhasil di-reset.');
}

// ============================================================
// INTERNAL: Isi data dummy (18 KK — 3 per lingkungan)
// ============================================================

function _setupDummyData(ss) {
  const kkSheet  = ss.getSheetByName('Keluarga');
  const angSheet = ss.getSheetByName('Anggota');
  const now      = new Date().toISOString();

  // Format: { ling, kbg, nama, alamat, dusun, desa, kec, anggota[] }
  const dummyData = [
    // ── St. Thomas ──────────────────────────────────────
    {
      ling:'St. Thomas', kbg:'KBG 1', nama:'Benediktus Sunaryo',
      alamat:'Jl. Merdeka No.1', dusun:'Dusun I', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Benediktus', nl:'Benediktus Sunaryo', jk:'L', hub:'KK',
          lTempat:'Sindang', lTgl:'1975-05-10', gol:'O',
          pend:'SMA', kerja:'Petani', ayah:'Yosef Sunaryo', ibu:'Maria Sari' },
        { nb:'Veronika',   nl:'Veronika Santi', jk:'P', hub:'Istri',
          lTempat:'Curup', lTgl:'1978-08-15', gol:'A',
          pend:'SMP', kerja:'Ibu Rumah Tangga', ayah:'Paulus Santi', ibu:'Agnes Lestari' },
        { nb:'Yosef',      nl:'Yosef Sunaryo Jr.', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2005-03-20', gol:'O',
          pend:'SMA', kerja:'Pelajar', ayah:'Benediktus Sunaryo', ibu:'Veronika Santi' }
      ]
    },
    {
      ling:'St. Thomas', kbg:'KBG 2', nama:'Yohanes Kristanto',
      alamat:'Jl. Damai No.5', dusun:'Dusun II', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Yohanes',  nl:'Yohanes Kristanto', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1980-11-25', gol:'B',
          pend:'S1', kerja:'Guru', ayah:'Petrus Kristanto', ibu:'Theresia Wati' },
        { nb:'Maria',    nl:'Maria Dewi', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1982-04-12', gol:'AB',
          pend:'S1', kerja:'Guru', ayah:'Lukas Dewi', ibu:'Kristina Setya' },
        { nb:'Andreas',  nl:'Andreas Kristanto', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2008-07-14', gol:'B',
          pend:'SMP', kerja:'Pelajar', ayah:'Yohanes Kristanto', ibu:'Maria Dewi' },
        { nb:'Theresia', nl:'Theresia Kristanto', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2012-01-30', gol:'B',
          pend:'SD', kerja:'Pelajar', ayah:'Yohanes Kristanto', ibu:'Maria Dewi' }
      ]
    },
    {
      ling:'St. Thomas', kbg:'KBG 1', nama:'Fransiskus Hadi',
      alamat:'Jl. Sejahtera No.12', dusun:'Dusun I', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Fransiskus', nl:'Fransiskus Hadi', jk:'L', hub:'KK',
          lTempat:'Curup', lTgl:'1970-02-28', gol:'A',
          pend:'SMA', kerja:'Wiraswasta', ayah:'Yosef Hadi', ibu:'Anastasia Budi' },
        { nb:'Klara', nl:'Klara Susanti', jk:'P', hub:'Istri',
          lTempat:'Marga Sakti', lTgl:'1973-09-05', gol:'O',
          pend:'SMA', kerja:'Pedagang', ayah:'Paulus Susanti', ibu:'Maria Yanti' }
      ]
    },

    // ── St. Petrus ──────────────────────────────────────
    {
      ling:'St. Petrus', kbg:'KBG 1', nama:'Petrus Santoso',
      alamat:'Jl. Pahlawan No.3', dusun:'Dusun III', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Petrus',  nl:'Petrus Santoso', jk:'L', hub:'KK',
          lTempat:'Sindang Jaya', lTgl:'1968-06-15', gol:'O',
          pend:'SMP', kerja:'Petani', ayah:'Yosef Santoso', ibu:'Agnes Lestari' },
        { nb:'Paulina', nl:'Paulina Haryati', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1972-12-20', gol:'A',
          pend:'SMP', kerja:'Ibu Rumah Tangga', ayah:'Andreas Haryati', ibu:'Maria Sari' },
        { nb:'Lukas',   nl:'Lukas Santoso', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2000-04-10', gol:'O',
          pend:'SMA', kerja:'Petani', ayah:'Petrus Santoso', ibu:'Paulina Haryati' },
        { nb:'Regina',  nl:'Regina Santoso', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2003-08-22', gol:'A',
          pend:'SMA', kerja:'Pelajar', ayah:'Petrus Santoso', ibu:'Paulina Haryati' }
      ]
    },
    {
      ling:'St. Petrus', kbg:'KBG 2', nama:'Aloysius Budiman',
      alamat:'Jl. Flamboyan No.7', dusun:'Dusun II', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Aloysius', nl:'Aloysius Budiman', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1985-07-19', gol:'AB',
          pend:'D3', kerja:'Pegawai Swasta', ayah:'Ignatius Budiman', ibu:'Elisabet Wati' },
        { nb:'Elisabet', nl:'Elisabet Rahayu', jk:'P', hub:'Istri',
          lTempat:'Curup', lTgl:'1988-02-14', gol:'B',
          pend:'D3', kerja:'Pegawai Swasta', ayah:'Barnabas Rahayu', ibu:'Anastasia Yuliani' },
        { nb:'Gabriel',  nl:'Gabriel Budiman', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2015-11-03', gol:'B',
          pend:'SD', kerja:'Pelajar', ayah:'Aloysius Budiman', ibu:'Elisabet Rahayu' }
      ]
    },
    {
      ling:'St. Petrus', kbg:'KBG 1', nama:'Simon Purnomo',
      alamat:'Jl. Anggrek No.15', dusun:'Dusun I', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Simon', nl:'Simon Purnomo', jk:'L', hub:'KK',
          lTempat:'Sindang Jaya', lTgl:'1960-03-08', gol:'A',
          pend:'SD', kerja:'Petani', ayah:'Barnabas Purnomo', ibu:'Kristina Yanti' },
        { nb:'Anna',  nl:'Anna Susila', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1963-10-17', gol:'O',
          pend:'SD', kerja:'Ibu Rumah Tangga', ayah:'Yosef Susila', ibu:'Maria Lestari' }
      ]
    },

    // ── Sta. Maria ──────────────────────────────────────
    {
      ling:'Sta. Maria', kbg:'KBG 1', nama:'Markus Setiawan',
      alamat:'Jl. Maria No.2', dusun:'Dusun IV', desa:'Sindang Jaya', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Markus',    nl:'Markus Setiawan', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1977-01-11', gol:'B',
          pend:'SMA', kerja:'Buruh', ayah:'Lukas Setiawan', ibu:'Maria Yuliani' },
        { nb:'Magdalena', nl:'Magdalena Kartini', jk:'P', hub:'Istri',
          lTempat:'Curup', lTgl:'1980-07-21', gol:'O',
          pend:'SMA', kerja:'Ibu Rumah Tangga', ayah:'Lukas Kartini', ibu:'Theresia Sari' },
        { nb:'Yohanes',   nl:'Yohanes Setiawan', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2007-05-16', gol:'B',
          pend:'SMP', kerja:'Pelajar', ayah:'Markus Setiawan', ibu:'Magdalena Kartini' },
        { nb:'Maria',     nl:'Maria Setiawan', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2010-09-04', gol:'O',
          pend:'SD', kerja:'Pelajar', ayah:'Markus Setiawan', ibu:'Magdalena Kartini' },
        { nb:'Fransisca', nl:'Fransisca Setiawan', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2018-12-25', gol:'B',
          pend:'-', kerja:'-', ayah:'Markus Setiawan', ibu:'Magdalena Kartini' }
      ]
    },
    {
      ling:'Sta. Maria', kbg:'KBG 2', nama:'Ignatius Wahyu',
      alamat:'Jl. Sukma No.8', dusun:'Dusun III', desa:'Sindang Jaya', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Ignatius', nl:'Ignatius Wahyu', jk:'L', hub:'KK',
          lTempat:'Sindang', lTgl:'1990-04-25', gol:'A',
          pend:'S1', kerja:'PNS', ayah:'Paulus Wahyu', ibu:'Anastasia Dewi' },
        { nb:'Katarina', nl:'Katarina Putri', jk:'P', hub:'Istri',
          lTempat:'Marga Sakti', lTgl:'1993-08-30', gol:'AB',
          pend:'S1', kerja:'Guru', ayah:'Benediktus Putri', ibu:'Veronika Lestari' },
        { nb:'Pius',     nl:'Pius Wahyu', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2019-06-10', gol:'A',
          pend:'-', kerja:'-', ayah:'Ignatius Wahyu', ibu:'Katarina Putri' }
      ]
    },
    {
      ling:'Sta. Maria', kbg:'KBG 1', nama:'Andreas Susilo',
      alamat:'Jl. Melati No.20', dusun:'Dusun I', desa:'Sindang Jaya', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Andreas', nl:'Andreas Susilo', jk:'L', hub:'KK',
          lTempat:'Curup', lTgl:'1958-09-12', gol:'O',
          pend:'SD', kerja:'Pensiunan', ayah:'Yosef Susilo', ibu:'Agnes Murni' },
        { nb:'Klara',   nl:'Klara Hartini', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1961-11-28', gol:'B',
          pend:'SD', kerja:'Ibu Rumah Tangga', ayah:'Lukas Hartini', ibu:'Maria Lilis' }
      ]
    },

    // ── St. Pius ─────────────────────────────────────────
    {
      ling:'St. Pius', kbg:'KBG 2', nama:'Paulus Gunawan',
      alamat:'Jl. Pius No.4', dusun:'Dusun II', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Paulus',  nl:'Paulus Gunawan', jk:'L', hub:'KK',
          lTempat:'Sindang Jaya', lTgl:'1983-02-16', gol:'B',
          pend:'SMA', kerja:'Wiraswasta', ayah:'Simon Gunawan', ibu:'Maria Yuli' },
        { nb:'Lidwina', nl:'Lidwina Rahayu', jk:'P', hub:'Istri',
          lTempat:'Curup', lTgl:'1986-05-22', gol:'A',
          pend:'SMA', kerja:'Pedagang', ayah:'Yohanes Rahayu', ibu:'Fransisca Sari' },
        { nb:'Pius',    nl:'Pius Gunawan Jr.', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2010-10-11', gol:'B',
          pend:'SD', kerja:'Pelajar', ayah:'Paulus Gunawan', ibu:'Lidwina Rahayu' },
        { nb:'Rosa',    nl:'Rosa Gunawan', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2014-03-07', gol:'A',
          pend:'SD', kerja:'Pelajar', ayah:'Paulus Gunawan', ibu:'Lidwina Rahayu' }
      ]
    },
    {
      ling:'St. Pius', kbg:'KBG 1', nama:'Barnabas Wijaya',
      alamat:'Jl. Sawit No.11', dusun:'Dusun I', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Barnabas',   nl:'Barnabas Wijaya', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1972-08-18', gol:'O',
          pend:'SMP', kerja:'Buruh', ayah:'Paulus Wijaya', ibu:'Kristina Marta' },
        { nb:'Martina',    nl:'Martina Sari', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1975-12-01', gol:'O',
          pend:'SMP', kerja:'Ibu Rumah Tangga', ayah:'Lukas Sari', ibu:'Anastasia Budi' },
        { nb:'Florentina', nl:'Florentina Wijaya', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2002-04-30', gol:'O',
          pend:'SMA', kerja:'Mahasiswi', ayah:'Barnabas Wijaya', ibu:'Martina Sari' }
      ]
    },
    {
      ling:'St. Pius', kbg:'KBG 2', nama:'Dominikus Hartono',
      alamat:'Jl. Cengkeh No.6', dusun:'Dusun III', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Dominikus', nl:'Dominikus Hartono', jk:'L', hub:'KK',
          lTempat:'Sindang Jaya', lTgl:'1965-07-04', gol:'A',
          pend:'SMA', kerja:'Petani', ayah:'Yosef Hartono', ibu:'Agnes Sari' },
        { nb:'Felisitas', nl:'Felisitas Warni', jk:'P', hub:'Istri',
          lTempat:'Curup', lTgl:'1968-03-15', gol:'B',
          pend:'SD', kerja:'Petani', ayah:'Andreas Warni', ibu:'Theresia Lestari' }
      ]
    },

    // ── St. Elisabeth ─────────────────────────────────────
    {
      ling:'St. Elisabeth', kbg:'KBG 1', nama:'Cirilus Yulian Gati Kurniawan',
      alamat:'Sindang Jati', dusun:'Dusun I', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Cirilus', nl:'Yulian Gati Kurniawan', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1996-07-13', gol:'O',
          pend:'S1', kerja:'Pegawai Swasta', ayah:'', ibu:'' },
        { nb:'A.M.',    nl:'Eka Sri Marlisa', jk:'P', hub:'Istri',
          lTempat:'Sindang Jaya', lTgl:'1995-03-28', gol:'A',
          pend:'S1', kerja:'Guru', ayah:'', ibu:'' }
      ]
    },
    {
      ling:'St. Elisabeth', kbg:'KBG 2', nama:'Yusuf Triyanto',
      alamat:'Jl. Elisabeth No.9', dusun:'Dusun II', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Yusuf',   nl:'Yusuf Triyanto', jk:'L', hub:'KK',
          lTempat:'Sindang', lTgl:'1978-10-05', gol:'B',
          pend:'SMA', kerja:'Petani', ayah:'Paulus Triyanto', ibu:'Maria Yanti' },
        { nb:'Elisabet',nl:'Elisabet Murni', jk:'P', hub:'Istri',
          lTempat:'Marga Sakti', lTgl:'1981-06-18', gol:'A',
          pend:'SMA', kerja:'Ibu Rumah Tangga', ayah:'Yosef Murni', ibu:'Anastasia Yanti' },
        { nb:'Mikhael', nl:'Mikhael Triyanto', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2006-02-14', gol:'B',
          pend:'SMA', kerja:'Pelajar', ayah:'Yusuf Triyanto', ibu:'Elisabet Murni' },
        { nb:'Klara',   nl:'Klara Triyanto', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2009-11-20', gol:'A',
          pend:'SMP', kerja:'Pelajar', ayah:'Yusuf Triyanto', ibu:'Elisabet Murni' }
      ]
    },
    {
      ling:'St. Elisabeth', kbg:'KBG 1', nama:'Gregorius Santoso',
      alamat:'Jl. Melur No.13', dusun:'Dusun I', desa:'Sindang Jati', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Gregorius', nl:'Gregorius Santoso', jk:'L', hub:'KK',
          lTempat:'Curup', lTgl:'1955-04-23', gol:'O',
          pend:'SD', kerja:'Pensiunan', ayah:'Yosef Santoso', ibu:'Maria Sari' },
        { nb:'Veronika',  nl:'Veronika Yuliani', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1958-08-30', gol:'O',
          pend:'SD', kerja:'Ibu Rumah Tangga', ayah:'Andreas Yuliani', ibu:'Agnes Lestari' }
      ]
    },

    // ── St. Paulus ────────────────────────────────────────
    {
      ling:'St. Paulus', kbg:'KBG 1', nama:'Lukas Prianto',
      alamat:'Jl. Paulus No.10', dusun:'Dusun IV', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Lukas',   nl:'Lukas Prianto', jk:'L', hub:'KK',
          lTempat:'Sindang Jaya', lTgl:'1979-12-08', gol:'A',
          pend:'SMA', kerja:'Wiraswasta', ayah:'Petrus Prianto', ibu:'Kristina Murni' },
        { nb:'Priska',  nl:'Priska Lestari', jk:'P', hub:'Istri',
          lTempat:'Marga Sakti', lTgl:'1982-09-14', gol:'B',
          pend:'SMA', kerja:'Pedagang', ayah:'Yohanes Lestari', ibu:'Elisabet Wati' },
        { nb:'Barnabas',nl:'Barnabas Prianto', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2008-04-25', gol:'A',
          pend:'SMP', kerja:'Pelajar', ayah:'Lukas Prianto', ibu:'Priska Lestari' },
        { nb:'Lidwina', nl:'Lidwina Prianto', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'2013-07-19', gol:'B',
          pend:'SD', kerja:'Pelajar', ayah:'Lukas Prianto', ibu:'Priska Lestari' }
      ]
    },
    {
      ling:'St. Paulus', kbg:'KBG 2', nama:'Maximilianus Dwi Haryono',
      alamat:'Jl. Mangga No.17', dusun:'Dusun II', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Maximilianus', nl:'Maximilianus Dwi Haryono', jk:'L', hub:'KK',
          lTempat:'Curup', lTgl:'1987-03-01', gol:'AB',
          pend:'D3', kerja:'Teknisi', ayah:'Benediktus Dwi', ibu:'Anastasia Yanti' },
        { nb:'Florentina',   nl:'Florentina Sari', jk:'P', hub:'Istri',
          lTempat:'Sindang', lTgl:'1990-11-25', gol:'O',
          pend:'D3', kerja:'Perawat', ayah:'Andreas Sari', ibu:'Theresia Dewi' },
        { nb:'Mikhael',      nl:'Mikhael Dwi', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'2017-05-30', gol:'AB',
          pend:'-', kerja:'-', ayah:'Maximilianus Dwi Haryono', ibu:'Florentina Sari' }
      ]
    },
    {
      ling:'St. Paulus', kbg:'KBG 1', nama:'Stefanus Budiyono',
      alamat:'Jl. Rambutan No.22', dusun:'Dusun I', desa:'Sindang', kec:'Sindang Kelingi',
      anggota:[
        { nb:'Stefanus', nl:'Stefanus Budiyono', jk:'L', hub:'KK',
          lTempat:'Marga Sakti', lTgl:'1963-01-20', gol:'O',
          pend:'SMA', kerja:'Petani', ayah:'Yosef Budiyono', ibu:'Maria Yanti' },
        { nb:'Susanna',  nl:'Susanna Hartini', jk:'P', hub:'Istri',
          lTempat:'Sindang Jaya', lTgl:'1966-07-08', gol:'A',
          pend:'SMP', kerja:'Ibu Rumah Tangga', ayah:'Lukas Hartini', ibu:'Agnes Sari' },
        { nb:'Yohanes',  nl:'Yohanes Budiyono', jk:'L', hub:'Anak',
          lTempat:'Sindang', lTgl:'1996-09-15', gol:'O',
          pend:'S1', kerja:'Pegawai Swasta', ayah:'Stefanus Budiyono', ibu:'Susanna Hartini' },
        { nb:'Katarina', nl:'Katarina Budiyono', jk:'P', hub:'Anak',
          lTempat:'Sindang', lTgl:'1999-04-12', gol:'A',
          pend:'S1', kerja:'Mahasiswi', ayah:'Stefanus Budiyono', ibu:'Susanna Hartini' }
      ]
    }
  ];

  // Insert semua ke sheet
  dummyData.forEach(function(kk) {
    var kkId = Utilities.getUuid();

    kkSheet.appendRow([
      kkId, kk.ling, kk.kbg, kk.nama,
      kk.alamat, kk.dusun, kk.desa, kk.kec,
      '', '', '', '', '', '', '', now, now
    ]);

    kk.anggota.forEach(function(ang, idx) {
      angSheet.appendRow([
        Utilities.getUuid(), kkId, idx + 1,
        ang.nb, ang.nl, ang.jk, ang.hub,
        ang.lTempat, ang.lTgl,
        '', '', '', '', '', '',
        ang.pend, ang.kerja, ang.gol,
        '', '', ang.ayah, ang.ibu
      ]);
    });
  });

  Logger.log('Dummy data selesai: ' + dummyData.length + ' KK di-import.');
}
