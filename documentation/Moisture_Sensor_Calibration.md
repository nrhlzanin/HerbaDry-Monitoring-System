# HerbaDry Monitoring System - Moisture Sensor Calibration

## 1. Tujuan

Kalibrasi sensor kadar air dilakukan untuk memperoleh hubungan antara pembacaan sensor dan kadar air aktual bahan yang diukur.

Kalibrasi diperlukan karena karakteristik pembacaan sensor dapat dipengaruhi oleh jenis bahan, kondisi bahan, distribusi air, serta karakteristik sensor.

## 2. Metode Kalibrasi

Kalibrasi dilakukan dengan membandingkan pembacaan sensor kadar air dengan kadar air bahan yang ditentukan menggunakan metode referensi gravimetri.

Metode gravimetri digunakan sebagai nilai referensi untuk mengevaluasi pembacaan sensor.

## 3. Peralatan

Peralatan yang diperlukan:

- HerbaDry Monitoring System.
- Sensor kadar air.
- ESP32.
- Timbangan digital.
- Sampel bahan jamu.
- Wadah sampel.
- Oven pengering atau peralatan pengering referensi.
- Peralatan pendukung lainnya.

## 4. Persiapan Sampel

1. Siapkan sampel bahan jamu yang akan digunakan.
2. Pastikan sampel berasal dari bahan yang sama dengan bahan yang digunakan pada proses pengujian.
3. Potong atau siapkan sampel dengan kondisi yang seragam apabila diperlukan.
4. Timbang massa awal sampel menggunakan timbangan digital.
5. Catat hasil pengukuran.

## 5. Pengukuran Menggunakan Sensor

1. Nyalakan HerbaDry Monitoring System.
2. Pastikan sensor kadar air telah terhubung dengan ESP32.
3. Tempatkan sensor pada sampel.
4. Tunggu hingga pembacaan sensor relatif stabil.
5. Catat nilai pembacaan sensor.
6. Ulangi pengukuran untuk beberapa kondisi kadar air yang berbeda.

## 6. Penentuan Kadar Air Metode Gravimetri

Kadar air referensi ditentukan berdasarkan perubahan massa sampel sebelum dan setelah proses pengeringan.

Massa awal sampel dicatat sebagai:

`m_awal`

Massa sampel setelah proses pengeringan hingga kondisi referensi dicatat sebagai:

`m_kering`

Kadar air berdasarkan basis basah dapat dihitung menggunakan persamaan:

`Kadar Air (%) = ((m_awal - m_kering) / m_awal) × 100`

Hasil perhitungan digunakan sebagai nilai referensi untuk dibandingkan dengan pembacaan sensor.

## 7. Penyusunan Data Kalibrasi

Untuk setiap sampel, catat:

| Sampel | Massa Awal | Massa Kering | Kadar Air Referensi | Pembacaan Sensor |
|---|---:|---:|---:|---:|
| Sampel 1 | — | — | — | — |
| Sampel 2 | — | — | — | — |
| Sampel 3 | — | — | — | — |
| Sampel 4 | — | — | — | — |
| Sampel 5 | — | — | — | — |

Jumlah sampel dan titik pengukuran dapat disesuaikan dengan rancangan eksperimen.

## 8. Penentuan Parameter Kalibrasi

Hasil pembacaan sensor dibandingkan dengan kadar air referensi.

Hubungan antara nilai sensor dan kadar air referensi dapat dianalisis menggunakan regresi yang sesuai dengan karakteristik data.

Parameter hasil kalibrasi kemudian dimasukkan ke dalam firmware ESP32.

## 9. Validasi Kalibrasi

Setelah parameter kalibrasi diperoleh:

1. Siapkan sampel baru.
2. Ukur sampel menggunakan sensor.
3. Tentukan kadar air referensi menggunakan metode gravimetri.
4. Bandingkan hasil sensor dengan nilai referensi.
5. Hitung selisih atau error pengukuran.
6. Evaluasi apakah hasil pengukuran memenuhi kebutuhan sistem.

Sampel yang digunakan untuk validasi sebaiknya berbeda dari sampel yang digunakan untuk memperoleh parameter kalibrasi.

## 10. Faktor yang Dapat Mempengaruhi Pembacaan

Pembacaan sensor kadar air dapat dipengaruhi oleh:

- jenis bahan;
- ukuran dan bentuk bahan;
- posisi sensor;
- distribusi kelembapan dalam bahan;
- suhu bahan;
- kondisi permukaan bahan;
- kedalaman penetrasi sensor;
- karakteristik listrik bahan;
- kualitas koneksi sensor.

Oleh karena itu, parameter kalibrasi yang diperoleh untuk suatu bahan tidak selalu dapat langsung diterapkan pada bahan lain.

## 11. Kriteria Kondisi Kering

Batas kadar air untuk menentukan bahan telah mencapai kondisi kering ditetapkan berdasarkan hasil penelitian dan kebutuhan penyimpanan bahan.

Nilai batas yang digunakan pada sistem harus dicantumkan bersama hasil pengujian dan validasi.

## 12. Dokumentasi

Data hasil kalibrasi sebaiknya disimpan bersama dokumentasi penelitian.

Dokumentasi dapat mencakup:

- data massa sampel;
- hasil pembacaan sensor;
- kadar air referensi;
- persamaan kalibrasi;
- nilai error;
- grafik hubungan sensor dan kadar air referensi;
- hasil validasi.

## 13. Catatan Reproduksibilitas

Prosedur kalibrasi harus dilakukan kembali apabila:

- sensor diganti;
- jenis bahan berubah;
- konfigurasi sensor berubah;
- posisi pemasangan sensor berubah secara signifikan;
- karakteristik sistem berubah.

Parameter kalibrasi yang digunakan dalam firmware harus didokumentasikan agar sistem dapat direplikasi.
