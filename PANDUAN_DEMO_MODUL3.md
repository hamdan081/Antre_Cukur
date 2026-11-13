# PANDUAN DEMO MODUL 3 — ANTRECUKUR

Acuan: Modul 3 Pemrograman Mobile — Pemrograman Asynchronous & API Call, khususnya kriteria penilaian Tugas Pekan Demo halaman 23–24.

## 1. Kriteria penilaian dan bukti kode

| Kriteria | Bobot | Lokasi kode |
|---|---:|---|
| Mengambil data dari External API dan memasukkannya ke Object menggunakan Interface | 10% | `src/types.ts` (`ExternalUserApiResponse`, `Barber`); `src/services/barberService.ts` (`fetchBarbersFromApi`) |
| Menggunakan Custom & Pre-built Async Function | 10% | Custom: `fetchBarbersFromApi()` dan `reloadProfiles()`; Pre-built: `fetch()` dan `response.json()` |
| Menggunakan `.then()`, `resolve()`, dan `reject()` | 10% | `src/services/barberService.ts` (`checkBarberAvailability`, `processAvailabilityCheckWithThen`, `demonstrateStaticPromise`) |
| Menjawab pertanyaan | 15% | Pahami konsep dan alur pada Bagian 4 dokumen ini. |
| Menyelesaikan modifikasi kode langsung | 15% | Latihan pada Bagian 5 dokumen ini. |

Total Tugas Pekan Demo adalah 60%; Codelab 1 berbobot 40% sesuai modul.

## 2. Cara menjalankan aplikasi

```bash
npm install
npx expo start --go
```

Buka Expo Go di HP, lalu pindai QR code dari terminal. Koneksi internet diperlukan untuk memuat profil DummyJSON. Jika API tidak tersedia, aplikasi tetap bisa dipakai menggunakan roster lokal.

## 3. Alur demo aplikasi

1. Buka tab **Layanan**.
2. Pada bagian **Tim kapster**, tekan **Lihat daftar kapster**.
3. Tunjukkan daftar kapster. Nama operasional `Kapster 1` sampai `Kapster 6` dibuat aplikasi agar identitas antrean stabil. Foto dan informasi rambut merupakan data profil referensi dari layanan publik, bukan data pegawai yang diverifikasi.
4. Kembali ke tab **Antrean**, tekan **Tambah pelanggan**, isi nama, pilih layanan, lalu pilih kapster.
5. Setelah pelanggan masuk, lihat pelanggan tersebut tercatat di antrean kapster yang dipilih.
6. Pada tab **Antrean**, tekan **Panggil pelanggan berikutnya** pada kartu kapster yang dipilih. Kapster tersebut berubah menjadi sedang melayani.
7. Tekan **Selesaikan layanan** pada kartu kapster yang sama. Pelanggan berpindah ke tab **Riwayat**.
8. Kembali ke halaman **Tim kapster**. Tekan **Periksa ketersediaan** untuk menjalankan pengecekan asynchronous. Jika kapster sedang melayani, pelanggan baru tetap dapat masuk ke daftar tunggu.
9. Buka bagian **Pemeriksaan aplikasi**. Aktifkan **Paksa pemeriksaan gagal** untuk menguji jalur `reject()` dan `.catch()`. Matikan kembali saklar setelah pengujian.
10. Pada bagian yang sama, tekan **Uji proses berhasil** dan **Uji proses gagal** untuk memperlihatkan `Promise.resolve()` dan `Promise.reject()`.

## 4. Lokasi kode berdasarkan kriteria

### Kriteria 1 — External API dan Interface (10%)

- `src/types.ts`: interface `ExternalUserApiResponse` dan `Barber`.
- `src/services/barberService.ts`: `API_ENDPOINT` dan fungsi `fetchBarbersFromApi()`.
- Di dalam fungsi tersebut, `fetch()` meminta data, `response.json()` membaca JSON, lalu `map()` menyusun array object bertipe `Barber`.
- `src/BarberContext.tsx`: memuat profil API dan menyediakan roster lokal jika jaringan tidak tersedia.

**Catatan kejujuran data:** DummyJSON menyediakan profil pengguna umum, bukan database pegawai barbershop. Aplikasi tidak menganggap informasi rambut sebagai keahlian cukur, dan tidak membuat rating atau pengalaman kerja palsu. `Kapster 1–6` adalah nama operasional demo, sedangkan `profileName` adalah nama pada profil API.

### Kriteria 2 — Custom & Pre-built Async Function (10%)

- Custom Async Function: `fetchBarbersFromApi()` di `src/services/barberService.ts`.
- Custom Async Function tambahan: `reloadProfiles()` di `src/screens/BarbersScreen.tsx`.
- Pre-built: `fetch()` dan `response.json()` di `src/services/barberService.ts`.
- `async` menandai fungsi asynchronous; `await` menunggu Promise pada fungsi tersebut sebelum baris berikutnya diproses.

### Kriteria 3 — `.then()`, `resolve()`, dan `reject()` (10%)

- `checkBarberAvailability()` membuat Promise dengan `new Promise((resolve, reject) => ...)`.
- `resolve(result)` dipanggil ketika kapster dapat menerima pelanggan baru ke daftar tunggu dan pengecekan tidak dipaksa gagal.
- `reject(error)` dipanggil jika pemeriksaan memang tidak dapat menerima antrean atau saklar pengujian kegagalan diaktifkan. Kapster yang sedang melayani tetap dapat menerima pelanggan ke daftar tunggu.
- `processAvailabilityCheckWithThen()` menggunakan `.then()`, `.catch()`, dan `.finally()` untuk menangani hasilnya.
- `demonstrateStaticPromise()` memperlihatkan `Promise.resolve()` dan `Promise.reject()`.

Pengecekan ini adalah simulasi sisi aplikasi untuk kebutuhan pembelajaran. Fitur tersebut **bukan reservasi online** dan tidak mengirim booking ke server.

## 5. Kisi-kisi pertanyaan

### Q1. Apa perbedaan synchronous dan asynchronous?

Synchronous menjalankan perintah secara berurutan; perintah berikutnya menunggu perintah sebelumnya selesai. Asynchronous memungkinkan proses yang memerlukan waktu, seperti permintaan API, berjalan tanpa menghentikan seluruh alur aplikasi. Hasilnya ditangani setelah proses selesai.

### Q2. Apa itu Async Function?

Async Function adalah fungsi yang dideklarasikan dengan kata kunci `async` dan otomatis mengembalikan Promise. Contoh pada project adalah `fetchBarbersFromApi()`.

### Q3. Apa itu Promise dan statusnya?

Promise mewakili hasil proses asynchronous. Statusnya: pending (masih diproses), fulfilled (berhasil), dan rejected (gagal).

### Q4. Apa kegunaan resolve() dan reject()?

`resolve(value)` menandakan Promise berhasil dan membawa hasil. `reject(error)` menandakan Promise gagal dan membawa alasan kesalahan.

### Q5. Apa kegunaan .then()?

`.then()` menerima hasil dari Promise yang fulfilled dan menjalankan callback keberhasilan. Pada project, `.then()` dipakai dalam `processAvailabilityCheckWithThen()`.

### Q6. Apa perbedaan .then() dan async/await?

Keduanya menangani Promise. `.then()` menggunakan callback dan method chaining; `async/await` menulis alur Promise dengan bentuk yang lebih mirip urutan kode biasa serta umum dipasangkan dengan `try/catch`.

### Q7. Mengapa menggunakan Interface?

Interface menjelaskan bentuk data yang diharapkan, membantu TypeScript memeriksa tipe, memberi autocomplete, dan mengurangi kesalahan saat mengakses properti object.

## 6. Contoh modifikasi langsung untuk latihan

1. **Mengubah jumlah profil API:** ubah `limit=6` pada `API_ENDPOINT` di `src/services/barberService.ts`.
2. **Mengubah aturan pengecekan:** ubah kondisi `if (forceReject || !canAcceptQueue)` di `checkBarberAvailability()`; jelaskan dampaknya sebelum mengubah.
3. **Menambah field API:** tambahkan properti pada `ExternalUserApiResponse` di `src/types.ts`, lalu petakan ke object `Barber` pada `fetchBarbersFromApi()`.
4. **Menambah layanan:** tambahkan object layanan pada `SERVICES` dan pastikan `ServiceId` serta `SERVICE_BY_ID` ikut diperbarui.
5. **Mengubah durasi layanan:** ubah `durationMinutes` di `src/data.ts`, lalu jelaskan bahwa estimasi tunggu dihitung dari durasi layanan per kapster.

## 7. Aturan antrean yang diterapkan

- Pelanggan memilih layanan dan kapster saat didaftarkan.
- Nomor antrean tetap unik secara global (`A-001`, `A-002`, dan seterusnya).
- Setiap kapster dapat melayani maksimal satu pelanggan pada satu waktu.
- Kapster berbeda dapat melayani pelanggan secara bersamaan.
- Estimasi tunggu dihitung dari pelanggan aktif dan pelanggan di depan pada antrean kapster yang dipilih.
- Pelanggan yang selesai atau dibatalkan tetap tercatat di riwayat.
- Antrean disimpan lokal di perangkat. Roster lokal membuat pendaftaran tetap bisa digunakan ketika internet tidak tersedia.

## 8. Pemeriksaan sebelum demo

```bash
npm run typecheck
npm test
npm run lint
```

Pastikan kamu dapat menjelaskan alur tambah pelanggan → pilih layanan dan kapster → panggil → selesaikan → riwayat. Pada sesi pekan demo, mahasiswa harus menjawab pertanyaan dan memodifikasi kode secara individu sesuai instruksi praktikum.
