# AntreCukur

Aplikasi mobile sederhana untuk mengelola antrean barbershop. Pelanggan didaftarkan dengan memilih layanan dan kapster. Setiap kapster memiliki antrean sendiri dan dapat melayani satu pelanggan pada satu waktu.

## Fitur

- Tambah pelanggan dengan nama, layanan, dan pilihan kapster.
- Nomor antrean otomatis dan unik secara global (`A-001`, `A-002`, ...).
- Papan kerja per kapster: panggil pelanggan berikutnya dan selesaikan layanan.
- Beberapa kapster dapat melayani pelanggan secara bersamaan.
- Estimasi waktu tunggu berdasarkan durasi layanan pada antrean kapster terkait.
- Pencarian, filter, detail pelanggan, pembatalan antrean, dan riwayat.
- Penyimpanan antrean lokal menggunakan AsyncStorage.
- Roster lokal cadangan agar antrean tetap bisa dipakai tanpa internet.
- Halaman Tim Kapster untuk melihat profil referensi dan memeriksa ketersediaan antrean.
- Pratinjau tampilan dan panduan penggunaan aplikasi.
- Panel pemeriksaan aplikasi menyediakan kontrol simulasi untuk menguji proses berhasil maupun gagal.

## Menjalankan aplikasi

```bash
npm install
npx expo start --go
```

Buka Expo Go dan pindai QR code dari terminal. Profil DummyJSON memerlukan koneksi internet; fitur antrean menggunakan data lokal dan tetap dapat digunakan saat offline.

## Data profil API

Aplikasi menggunakan `https://dummyjson.com/users` sebagai sumber profil umum untuk demonstrasi External API. DummyJSON bukan database pegawai barbershop. Nama operasional `Kapster 1–6` dibuat aplikasi, sedangkan nama profil, foto, telepon, dan informasi rambut dipetakan dari respons API. Rating, pengalaman kerja, dan keahlian profesional tidak dibuat-buat.

Pengecekan ketersediaan dengan Promise adalah simulasi sisi aplikasi untuk demonstrasi Modul 3, bukan pemesanan online atau transaksi ke server.

## Alur penggunaan

1. Tambahkan pelanggan melalui tombol **Tambah pelanggan**.
2. Masukkan nama, pilih layanan, lalu pilih kapster.
3. Pada bagian **Meja kerja kapster**, tekan **Panggil pelanggan berikutnya**.
4. Setelah layanan selesai, tekan **Selesaikan layanan** pada kapster yang sama.
5. Lihat pelanggan selesai atau dibatalkan pada tab **Riwayat**.
6. Gunakan tab **Layanan** untuk melihat harga dan durasi, membuka daftar kapster, mengatur antrean, melihat panduan, atau membuka pemeriksaan aplikasi.

## Struktur penting

| File | Fungsi |
|---|---|
| `src/QueueContext.tsx` | State antrean dan sinkronisasi penyimpanan lokal. |
| `src/BarberContext.tsx` | Memuat roster API dan menyediakan roster lokal cadangan. |
| `src/types.ts` | Interface dan tipe data. |
| `src/data.ts` | Layanan, roster lokal, dan data antrean contoh. |
| `src/queue.ts` | Validasi, pembagian antrean per kapster, status, dan estimasi waktu. |
| `src/services/barberService.ts` | External API dan demonstrasi Promise Modul 3. |
| `src/screens/QueueScreen.tsx` | Papan kerja dan daftar antrean. |
| `src/screens/BarbersScreen.tsx` | Daftar kapster, pemeriksaan ketersediaan, dan kontrol pemeriksaan aplikasi. |
| `src/dialogs.tsx` | Form tambah pelanggan dan konfirmasi. |
| `src/storage.ts` | Baca/tulis antrean menggunakan AsyncStorage. |
| `tests/` | Pengujian logika antrean dan layanan asynchronous. |

## Pemeriksaan kode

```bash
npm run typecheck
npm test
npm run lint
```

Data antrean disimpan pada perangkat yang digunakan dan tidak otomatis tersinkron ke perangkat lain. Data contoh hanya dimuat saat pengguna memilih **Isi antrean dengan data contoh** pada bagian Pemeriksaan aplikasi. Tindakan reset mengganti antrean tersimpan setelah konfirmasi.

Untuk rincian lokasi materi dan latihan presentasi, buka `PANDUAN_DEMO_MODUL3.md`.
