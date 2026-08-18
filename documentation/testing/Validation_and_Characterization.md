# HerbaDry Monitoring System - Validation and Characterization

## 1. Tujuan Pengujian

Pengujian dilakukan untuk mengevaluasi fungsi dan kinerja HerbaDry Monitoring System dalam memantau proses pengeringan bahan jamu.

Parameter utama yang dievaluasi meliputi:

- suhu;
- kelembapan relatif;
- kadar air bahan;
- pencatatan data;
- konektivitas sistem;
- tampilan dashboard;
- indikator sistem.

## 2. Metode Pengujian

Pengujian dilakukan dengan mengoperasikan sistem pada kondisi pengeringan bahan jamu.

Sensor dipasang pada posisi yang telah ditentukan pada sistem. Data sensor dibaca oleh ESP32 dan dikirimkan ke sistem monitoring.

Hasil pembacaan kemudian dibandingkan dengan metode atau alat referensi yang sesuai untuk parameter yang diuji.

## 3. Pengujian Sensor Suhu

Sensor suhu digunakan untuk memantau perubahan suhu selama proses pengeringan.

Pengujian dilakukan dengan membandingkan pembacaan sensor dengan alat ukur referensi.

| Pengujian | Nilai Referensi (°C) | Nilai Sensor (°C) | Error (%) |
|---|---:|---:|---:|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |

### Hasil

Hasil pengujian menunjukkan kemampuan sensor dalam mendeteksi perubahan suhu selama proses pengeringan.

Nilai error pengukuran dihitung berdasarkan perbedaan antara nilai sensor dan nilai referensi.

## 4. Pengujian Kelembapan

Sensor DHT22 digunakan untuk memantau kelembapan relatif pada ruang pengering.

| Pengujian | Nilai Referensi (%RH) | Nilai Sensor (%RH) | Error (%) |
|---|---:|---:|---:|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |

Hasil pengujian digunakan untuk mengevaluasi kemampuan sistem dalam memantau perubahan kelembapan selama proses pengeringan.

## 5. Pengujian Sensor Kadar Air

Sensor kadar air diuji menggunakan sampel bahan jamu dengan kondisi kadar air yang berbeda.

Nilai pembacaan sensor dibandingkan dengan kadar air yang diperoleh menggunakan metode gravimetri.

| Sampel | Kadar Air Referensi (%) | Pembacaan Sensor (%) | Error (%) |
|---|---:|---:|---:|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |

Hasil pengujian digunakan untuk menentukan karakteristik hubungan antara pembacaan sensor dan kadar air bahan.

## 6. Pengujian Dashboard

Dashboard diuji untuk memastikan data dari ESP32 dapat diterima dan ditampilkan dengan benar.

Parameter yang diperiksa:

- suhu;
- kelembapan;
- kadar air;
- durasi pengeringan;
- status sistem;
- data historis/log.

Hasil pengujian:

| Parameter | Hasil |
|---|---|
| Tampilan suhu | — |
| Tampilan kelembapan | — |
| Tampilan kadar air | — |
| Durasi proses | — |
| Status sistem | — |
| Log data | — |

## 7. Pengujian Konektivitas

Pengujian konektivitas dilakukan untuk memastikan ESP32 dapat terhubung dengan jaringan Wi-Fi dan mengirimkan data ke sistem monitoring.

| Pengujian | Status |
|---|---|
| ESP32 terhubung Wi-Fi | — |
| Data sensor terkirim | — |
| Dashboard menerima data | — |
| Data ditampilkan secara real-time | — |
| Data tersimpan | — |

## 8. Pengujian Indikator

LED dan buzzer diuji berdasarkan kondisi yang telah ditentukan pada firmware.

| Kondisi | LED | Buzzer | Hasil |
|---|---|---|---|
| Sistem aktif | — | — | — |
| Kondisi normal | — | — | — |
| Kondisi tertentu | — | — | — |
| Proses selesai | — | — | — |

## 9. Pengujian Sistem Secara Keseluruhan

Pengujian dilakukan dengan menjalankan sistem secara keseluruhan selama proses pengeringan bahan jamu.

Tahapan pengujian:

1. Menyalakan sistem.
2. Menghubungkan ESP32 ke jaringan Wi-Fi.
3. Memastikan seluruh sensor menghasilkan data.
4. Menempatkan bahan jamu pada ruang pengering.
5. Menjalankan proses pengeringan.
6. Memantau suhu, kelembapan, dan kadar air.
7. Mencatat data selama proses.
8. Mengevaluasi hasil pembacaan sensor.
9. Mengakhiri proses pengeringan.
10. Mengevaluasi data yang diperoleh.

## 10. Hasil Pengujian

Hasil pengujian sistem menunjukkan bahwa HerbaDry Monitoring System dapat digunakan untuk memantau parameter proses pengeringan bahan jamu.

Parameter kinerja yang diperoleh dari pengujian meliputi:

- Akurasi sensor suhu: —.
- Akurasi sensor kelembapan: —.
- Akurasi sensor kadar air: —.
- Waktu respons sistem: —.
- Keberhasilan koneksi Wi-Fi: —.
- Keberhasilan pengiriman data: —.
- Keberhasilan pencatatan data: —.

## 11. Capabilities

HerbaDry Monitoring System memiliki kemampuan:

- Memantau suhu selama proses pengeringan.
- Memantau kelembapan relatif.
- Memantau kadar air bahan.
- Mengirimkan data melalui jaringan Wi-Fi.
- Menampilkan data melalui dashboard.
- Mencatat data hasil monitoring.
- Memberikan indikator kondisi sistem.
- Menyediakan platform yang dapat dikembangkan lebih lanjut.

## 12. Limitations

Beberapa keterbatasan sistem meliputi:

- Akurasi sensor kadar air bergantung pada hasil kalibrasi.
- Pembacaan kadar air dapat dipengaruhi oleh karakteristik bahan.
- Sistem membutuhkan koneksi jaringan untuk fungsi monitoring berbasis jaringan.
- Sensor memiliki rentang pengukuran dan toleransi sesuai spesifikasinya.
- Parameter kalibrasi perlu disesuaikan apabila jenis bahan berubah.
- Komponen elektronik harus terlindung dari panas dan kelembapan berlebih.

## 13. Kesimpulan Pengujian

Berdasarkan hasil validasi dan karakterisasi, HerbaDry Monitoring System digunakan untuk melakukan monitoring parameter pengeringan bahan jamu secara terintegrasi.

Hasil pengujian sensor, komunikasi data, dashboard, dan fungsi sistem digunakan untuk mengevaluasi kemampuan serta keterbatasan hardware.

Data numerik lengkap hasil pengujian disediakan bersama dokumentasi penelitian dan dapat digunakan untuk analisis lebih lanjut.
