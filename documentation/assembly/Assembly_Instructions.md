# HerbaDry Monitoring System - Assembly Instructions

## 1. Persiapan

Siapkan seluruh komponen yang tercantum pada Bill of Materials.

Pastikan ESP32, sensor, modul komunikasi, LCD, catu daya, aktuator, dan komponen pendukung berada dalam kondisi baik.

## 2. Perakitan Sistem Elektronik

1. Pasang ESP32 pada expansion board.
2. Hubungkan sensor DHT22 ke ESP32 sesuai wiring diagram.
3. Hubungkan sensor kadar air ke ESP32 sesuai wiring diagram.
4. Hubungkan LCD 20x4 melalui modul I2C.
5. Hubungkan MicroSD card module menggunakan antarmuka SPI.
6. Hubungkan LM2596 sebagai pengatur tegangan sesuai kebutuhan komponen.
7. Hubungkan indikator dan aktuator sesuai wiring diagram.
8. Pastikan seluruh koneksi VCC dan GND telah terhubung dengan benar.

## 3. Perakitan Sistem Pengering

Pasang sensor pada posisi yang memungkinkan sensor membaca kondisi ruang pengering dan bahan secara representatif.

Komponen elektronik harus ditempatkan pada bagian yang terlindung dari panas langsung dan kelembapan.

## 4. Perakitan Sistem Gas

Pasang regulator, fitting, flexible hose, dan smart valve sesuai konfigurasi sistem.

Pastikan seluruh sambungan gas terpasang dengan kuat dan tidak mengalami kebocoran.

## 5. Pemeriksaan

Sebelum sistem diberi daya:

- Periksa polaritas catu daya.
- Periksa koneksi VCC dan GND.
- Periksa koneksi GPIO.
- Pastikan tidak terdapat kabel terkelupas.
- Pastikan komponen elektronik tidak terkena panas secara langsung.
- Periksa sistem gas dari kemungkinan kebocoran.

## 6. Pengujian Awal

Nyalakan sistem menggunakan sumber daya yang sesuai.

Pastikan ESP32 dapat menyala, sensor menghasilkan pembacaan, dan dashboard menerima data.

## 7. Referensi

Gunakan file berikut sebagai referensi perakitan:

- `BOM/Bill_of_Materials.csv`
- `hardware/wiring_diagram/HerbaDry_Wiring_Diagram.png`
- `ESP32/`
