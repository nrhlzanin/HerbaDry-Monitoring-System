# HerbaDry Monitoring System - Operation Instructions

## 1. Persiapan Sistem

Sebelum mengoperasikan sistem, pastikan:

- Seluruh komponen telah terpasang sesuai wiring diagram.
- Sensor terpasang pada posisi yang sesuai.
- ESP32 terhubung dengan sumber daya yang sesuai.
- Jaringan Wi-Fi tersedia.
- Dashboard monitoring dapat diakses.
- Sistem gas telah terpasang dengan benar.
- Tidak terdapat kebocoran pada sambungan gas.

## 2. Menyalakan Sistem

1. Pastikan seluruh koneksi elektronik telah diperiksa.
2. Hubungkan sumber daya ke sistem.
3. ESP32 akan melakukan proses inisialisasi.
4. Tunggu hingga ESP32 terhubung ke jaringan Wi-Fi.
5. Pastikan sensor mulai menghasilkan data pembacaan.

## 3. Memeriksa Data Sensor

Setelah sistem aktif, periksa nilai yang ditampilkan pada dashboard.

Parameter yang dipantau meliputi:

- Suhu.
- Kelembapan relatif.
- Kadar air bahan.
- Durasi proses pengeringan.
- Status sistem.

Pastikan nilai sensor dapat berubah sesuai dengan kondisi lingkungan dan proses pengeringan.

## 4. Memulai Proses Pengeringan

1. Siapkan bahan jamu yang akan dikeringkan.
2. Tempatkan bahan pada ruang pengering.
3. Pastikan sensor kadar air berada pada posisi yang sesuai untuk melakukan pengukuran.
4. Pastikan sensor suhu dan kelembapan berada pada posisi yang dapat merepresentasikan kondisi ruang pengering.
5. Aktifkan sistem pengering sesuai prosedur pengoperasian alat.
6. Pantau parameter proses melalui dashboard.

## 5. Monitoring Selama Proses

Selama proses berlangsung, pengguna dapat memantau data secara real-time melalui dashboard.

Data yang ditampilkan digunakan untuk mengetahui perubahan kondisi selama proses pengeringan.

Data hasil monitoring juga dapat dicatat atau disimpan sesuai dengan konfigurasi sistem.

## 6. Indikator Sistem

LED digunakan sebagai indikator kondisi sistem sesuai dengan logika yang telah diprogram pada firmware.

Buzzer digunakan untuk memberikan pemberitahuan suara ketika kondisi tertentu terpenuhi.

Interpretasi indikator mengikuti konfigurasi firmware pada folder:

`ESP32/`

## 7. Pemantauan Kadar Air

Nilai kadar air digunakan sebagai salah satu parameter untuk menentukan kondisi bahan selama proses pengeringan.

Nilai pembacaan sensor harus diinterpretasikan berdasarkan hasil kalibrasi sensor dan karakteristik bahan yang digunakan.

Untuk bahan yang berbeda, parameter kalibrasi dapat menghasilkan karakteristik pembacaan yang berbeda.

## 8. Penyelesaian Proses

Setelah proses pengeringan selesai:

1. Periksa nilai kadar air pada dashboard.
2. Pastikan kondisi bahan telah memenuhi kriteria pengeringan yang ditentukan.
3. Hentikan proses pemanasan sesuai prosedur sistem.
4. Matikan sumber daya jika sistem tidak digunakan kembali.
5. Biarkan komponen mencapai kondisi aman sebelum dilakukan pemeriksaan atau pemindahan.

## 9. Penyimpanan Data

Data hasil monitoring dapat digunakan untuk dokumentasi dan analisis proses pengeringan.

Data dapat mencakup:

- Waktu pengukuran.
- Suhu.
- Kelembapan.
- Kadar air.
- Durasi proses.
- Status sistem.

Penyimpanan dan tampilan data mengikuti implementasi perangkat lunak pada repository.

## 10. Keselamatan Operasional

Perhatikan keselamatan berikut selama pengoperasian:

- Jangan menyentuh bagian pemanas selama sistem beroperasi.
- Jangan menempatkan komponen elektronik pada area dengan panas berlebih.
- Jauhkan kabel dari sumber panas.
- Jangan mengoperasikan sistem jika terdapat indikasi kebocoran gas.
- Periksa sambungan gas sebelum proses pengeringan.
- Jangan melakukan perubahan koneksi ketika sistem masih mendapat daya.
- Jangan meninggalkan sistem pemanas tanpa pengawasan.
- Gunakan sistem pada area dengan ventilasi yang memadai.
- Hentikan pengoperasian apabila ditemukan kondisi yang tidak normal.

## 11. Troubleshooting Dasar

### ESP32 tidak menyala

Periksa:

- sumber daya;
- kabel USB atau adaptor;
- polaritas;
- koneksi catu daya.

### Sensor tidak menampilkan data

Periksa:

- koneksi VCC;
- koneksi GND;
- koneksi DATA;
- konfigurasi GPIO pada firmware;
- kondisi sensor.

### ESP32 tidak terhubung ke Wi-Fi

Periksa:

- nama jaringan Wi-Fi;
- password Wi-Fi;
- ketersediaan jaringan;
- konfigurasi jaringan pada firmware.

### Dashboard tidak menerima data

Periksa:

- koneksi internet;
- koneksi ESP32;
- konfigurasi layanan penyimpanan/komunikasi;
- konfigurasi perangkat lunak dashboard.

### Nilai sensor tidak sesuai

Periksa:

- posisi sensor;
- kondisi sensor;
- koneksi kabel;
- proses kalibrasi;
- parameter kalibrasi pada firmware.

## 12. Referensi File

File yang berkaitan dengan pengoperasian sistem:

- `ESP32/` - firmware perangkat.
- `index.html` - halaman dashboard.
- `app.js` - fungsi dashboard.
- `style.css` - tampilan dashboard.
- `BOM/Bill_of_Materials.csv` - daftar komponen.
- `hardware/wiring_diagram/HerbaDry_Wiring_Diagram.png` - diagram koneksi perangkat keras.
