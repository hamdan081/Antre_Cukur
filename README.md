# AntreCukur

Aplikasi mobile sederhana untuk mengatur antrean pelanggan barbershop. Dibuat dengan React Native, Expo SDK 57, dan TypeScript sebagai bahan belajar dan persiapan demo Modul 1 serta Modul 2 Pemrograman Mobile.

## Fitur

- Tujuh pelanggan contoh tersedia saat pertama kali dibuka.
- Tambah pelanggan dengan nama dan pilihan layanan.
- Panggil pelanggan berdasarkan urutan masuk (FIFO).
- Hanya satu pelanggan dapat berstatus **Sedang Dicukur**.
- Tandai pelayanan selesai atau batalkan pelanggan yang masih menunggu.
- Cari pelanggan, gunakan filter status, dan lihat riwayat pelayanan.
- Data tersimpan di perangkat menggunakan AsyncStorage.
- Reset ke data contoh setelah menyetujui konfirmasi.

Aplikasi tidak memerlukan login atau akun server. Setelah aplikasi dan dependensinya tersedia, pengelolaan antrean dapat digunakan secara offline.

## Persiapan

1. Pasang Node.js **22.13 atau lebih baru**, atau gunakan **Node.js 24 LTS**.
2. Pasang aplikasi **Expo Go** versi yang mendukung SDK 57 di HP.
3. Ekstrak folder proyek, lalu buka folder tersebut di Visual Studio Code.
4. Buka terminal dari folder yang berisi `package.json`.

Internet diperlukan untuk mengunduh dependensi saat pemasangan. Untuk menjalankan melalui Expo Go, laptop dan HP sebaiknya berada di jaringan Wi-Fi yang sama.

## Menjalankan di HP

Jalankan perintah berikut satu kali untuk memasang dependensi:

```bash
npm install
```

Kemudian mulai proyek:

```bash
npm start
```

Terminal akan menampilkan QR code. Buka Expo Go di Android dan pindai QR code tersebut. Pada iPhone, pindai menggunakan aplikasi Kamera lalu buka tautannya di Expo Go. Biarkan proses pada terminal tetap berjalan.

Untuk Expo Go SDK 57 di iPhone, masuk ke akun Expo yang sama pada Expo Go dan Expo CLI jika diminta. Akun ini digunakan untuk membuka proyek pengembangan; aplikasi AntreCukur sendiri tidak memiliki fitur login.

Jika HP tidak terhubung, periksa jaringan Wi-Fi, VPN, dan izin firewall untuk Node.js. Pastikan versi Expo Go mendukung SDK proyek. Hentikan server dengan `Ctrl + C` jika sudah selesai.

## Pratinjau di browser

```bash
npm run web
```

Buka alamat yang ditampilkan terminal. Pratinjau browser membantu memeriksa alur dan tampilan; tetap coba aplikasi di HP sebelum demo.

## Cara menggunakan

1. Saat pertama dibuka, aplikasi memuat tujuh pelanggan contoh: satu selesai, satu sedang dicukur, dan lima menunggu.
2. Isi nama, pilih layanan, lalu tambahkan pelanggan ke antrean.
3. Jika belum ada pelanggan yang sedang dicukur, panggil antrean berikutnya.
4. Setelah pelayanan selesai, tekan tombol selesai pada pelanggan aktif.
5. Panggil pelanggan berikutnya dan ulangi alurnya.
6. Gunakan pencarian/filter untuk menemukan pelanggan dan riwayat untuk melihat pelayanan yang selesai atau dibatalkan.

Pembatalan hanya berlaku untuk pelanggan yang masih menunggu. Nomor pelanggan yang sudah selesai atau dibatalkan tidak mengubah urutan pelanggan lainnya.

Estimasi tunggu dijumlahkan dari durasi layanan pelanggan di depan antrean. Untuk pelanggan yang sedang dicukur, aplikasi memperhitungkan waktu mulai dan perkiraan sisa durasinya. Tampilan estimasi diperbarui setiap 30 detik; waktu tersebut **perkiraan**, bukan janji waktu pelayanan yang pasti. Pelayanan selesai tetap ditandai secara manual.

## Struktur yang perlu dipahami

| File | Isi utama |
| --- | --- |
| `src/app/_layout.tsx` | Tata letak navigasi dan penyedia state aplikasi. |
| `src/app/(tabs)/index.tsx` | Rute tab antrean utama. |
| `src/app/(tabs)/riwayat.tsx` | Rute tab riwayat. |
| `src/app/(tabs)/layanan.tsx` | Rute tab layanan. |
| `src/screens/` | Tampilan layar, input, dan interaksi pengguna. |
| `src/QueueContext.tsx` | State bersama serta pembacaan dan penyimpanan data dengan AsyncStorage. |
| `src/types.ts` | Bentuk data pelanggan, layanan, dan status antrean. |
| `src/data.ts` | Pilihan layanan dan tujuh pelanggan contoh. |
| `src/queue.ts` | Fungsi pengelolaan urutan, status, dan estimasi antrean. |
| `src/styles.ts` | External styles untuk tata letak dan tampilan. |
| `tests/` | Pemeriksaan aturan antrean dan kondisi penting. |

Proyek memakai **Expo Router** untuk berpindah antara tab Antrean, Riwayat, dan Layanan. File rute berada di `src/app/`, sedangkan isi tampilannya dipisahkan ke `src/screens/` agar mudah dipelajari.

## Kaitan dengan rubrik Modul 1

Mengacu pada halaman 45–46 modul yang diberikan: **Codelab 1–5 bernilai 40%** dan **Tugas Pekan Demo bernilai 60%**. Proyek ini merupakan bahan persiapan tugas demo; codelab tetap dikerjakan sesuai arahan praktikum.

| Bagian tugas demo | Bobot | Penerapan atau persiapan |
| --- | --- | --- |
| Custom function & loop | 10% | Fungsi antrean di `src/queue.ts`; `.map()` untuk membuat tampilan dari daftar data. |
| Type & array of objects | 10% | Tipe di `src/types.ts`; daftar objek pelanggan dan layanan di `src/data.ts`. |
| Inline & external styles | 10% | Style dinamis pada komponen; aturan tampilan terpisah di `src/styles.ts`. |
| Menjawab pertanyaan | 15% | Jelaskan bagaimana input mengubah data, bagaimana status berganti, serta mengapa hanya satu pelanggan aktif. |
| Modifikasi kode langsung | 15% | Latihan mengubah warna, tulisan status, data contoh, atau durasi layanan. |

Nilai bagian tanya jawab dan modifikasi bergantung pada pemahaman masing-masing anggota, bukan hanya tampilan aplikasi.

## Latihan sebelum presentasi

- Ikuti alur **input → data pelanggan → daftar → perubahan status → penyimpanan**.
- Jelaskan perbedaan pelanggan menunggu, sedang dicukur, selesai, dan dibatalkan.
- Temukan bagian `.map()` dan jelaskan fungsi `key` untuk setiap pelanggan.
- Ubah warna status atau kartu di `src/styles.ts` dan lihat hasilnya.
- Ubah teks status yang ditampilkan tanpa mengubah nilai status internal secara sembarangan.
- Ubah durasi salah satu layanan di `src/data.ts`, lalu jelaskan pengaruhnya terhadap estimasi tunggu.
- Tambah satu pelanggan contoh dan pastikan identitas serta nomor antreannya tidak bertabrakan.

Pada pekan demo, setiap mahasiswa menunjukkan aplikasi, menjawab pertanyaan, dan memodifikasi kode secara individu. Modul menyatakan praktikan tidak boleh membuka modul atau memakai fitur AI di editor saat sesi demo. Persiapkan dan pahami kode sebelumnya agar dapat bekerja mandiri saat sesi tersebut.

Tema harus unik di seluruh kelas dan didaftarkan sesuai mekanisme praktikum. Kelompok terdiri dari **tiga anggota**; gunakan GitHub untuk menunjukkan pembagian tugas dan kontribusi setiap anggota. Contoh pembagian: tampilan, logika antrean, serta pengujian/dokumentasi; semua anggota tetap perlu memahami alur aplikasi.

## Pemeriksaan proyek

```bash
npm run typecheck
npm run lint
npm test
```

`typecheck` memeriksa tipe TypeScript, `lint` memeriksa penulisan kode, dan `test` memeriksa aturan antrean. Jika mengubah logika, jalankan ketiganya lagi dan coba alur tambah, panggil, selesai, serta batal.

## Batas penggunaan

Data disimpan lokal pada **satu perangkat**, tidak disinkronkan ke HP lain. Data browser terpisah dari data Expo Go. Menghapus data aplikasi atau penyimpanan browser dapat menghapus antrean.

Antrean dan riwayat **tidak otomatis dihapus saat tengah malam**. Riwayat menampilkan seluruh data selesai atau dibatalkan yang tersimpan, bukan hanya data hari ini. Gunakan reset data contoh bila ingin mengulang demonstrasi; tindakan ini mengganti data yang tersimpan dan meminta konfirmasi terlebih dahulu.

## Status pengujian

- TypeScript dan lint: lulus.
- Delapan pengujian aturan antrean: lulus.
- Alur tambah, validasi nama kosong, cari, panggil, selesai, batal, filter riwayat, reset, dan penyimpanan setelah dimuat ulang: berhasil diperiksa di browser.
- Tampilan diperiksa pada ukuran layar 360 × 800 dan 390 × 844 piksel.
- Ekspor bundle untuk Android, iOS, dan web: berhasil. Ini memeriksa kompilasi proyek, bukan pemasangan di HP atau pembuatan APK.
- Pengujian langsung di HP: belum dilakukan.
- Build APK: belum dilakukan. Modul 1 tidak mewajibkan build; Expo Go dapat digunakan untuk demo.

Versi dependensi telah diperiksa dengan alat kompatibilitas Expo. Audit npm masih melaporkan advisory pada dependensi turunan framework dan alat pengembangan. Jangan menjalankan `npm audit fix --force` tanpa meninjau perubahan, karena dapat mengganti versi Expo dan React Native yang kompatibel. Sebelum penggunaan di luar praktikum, tinjau pembaruan framework dan jalankan pemeriksaan ulang.

## Referensi menjalankan proyek

- [Membuat proyek Expo](https://docs.expo.dev/get-started/create-a-project/)
- [Menjalankan proyek dengan Expo Go](https://docs.expo.dev/get-started/start-developing/)
- [AsyncStorage pada Expo](https://docs.expo.dev/versions/latest/sdk/async-storage/)


## Tambahan khusus demo Modul 2

Dokumen utama: **`PANDUAN_DEMO_MODUL2.md`**. Fitur baru ini ditambahkan tanpa menghapus fungsi Modul 1:

- **`useState`**: filter, pencarian, modal tambah/batal (`src/screens/QueueScreen.tsx`), jam pada detail, dan tema Dark Mode.
- **`useEffect`**: interval memperbarui estimasi tiap 30 detik (`src/screens/QueueScreen.tsx`, `src/app/pelanggan/[id].tsx`) dan loading AsyncStorage (`src/QueueContext.tsx`).
- **`router.push()`**: tombol **Detail ›** pada tab Antrean dan Riwayat membuka halaman detail dinamis.
- **`router.back()` dan `router.canGoBack()`**: tombol **Kembali** pada halaman detail (aman untuk deep link).
- **`router.replace()`**: tombol **Ke Antrean** pada halaman detail mengganti halaman aktif.
- **`_layout.tsx` dan `<Stack.Screen>`**: pengaturan Stack route untuk tab, detail pelanggan, Codelab 1, dan dokumentasi.
- **Codelab 1**: buka tab **Layanan** → **Codelab 1 · Dark Mode**, memakai `createContext`, `useContext`, dan `useState`.
- **Codelab 2**: buka tab **Layanan** → **Codelab 2 · Dokumentasi**, lalu pilih topik agar route `docs/[...slug].tsx` membaca segmen path.

Perintah demo sesuai modul:

```bash
npm install
npx expo start --go
```

Aplikasi tidak perlu di-build menjadi APK. Semua kode dan dependensi yang diperlukan ditentukan di `package.json`/`package-lock.json`; folder `node_modules` sengaja tidak dimasukkan ZIP untuk menghindari perbedaan sistem operasi.

Kontribusi GitHub oleh tiga anggota dan demonstrasi serta modifikasi kode secara mandiri tetap harus dilaksanakan oleh kelompok sesuai instruksi praktikum. ZIP ini bukan bukti kontribusi GitHub.
