# PANDUAN DEMO MODUL 2 — ANTRECUKUR

Acuan: **Modul 2 Pemrograman Mobile — State, Hooks & Navigasi Page**, UMM, Agustus 2026, halaman cetak **42–43** (lembar PDF 42–43). Fitur Codelab mengacu halaman cetak 17 dan 39–41.

## 1. Checklist penilaian resmi

| Kriteria | Bobot | Bukti dalam kode / cara mencoba |
|---|---:|---|
| Codelab 1–2 | 40% | Tab **Layanan** > **Pratinjau tampilan** dan **Panduan penggunaan**. |
| `useState` + `useEffect` | 10% | `src/screens/QueueScreen.tsx`, `src/app/pelanggan/[id].tsx`, `src/QueueContext.tsx`. Cari `useState(` dan `useEffect(`. |
| `push`, `back`, dan satu router lain | 10% | Tombol **Detail ›** menggunakan `router.push`; detail **Kembali** menggunakan `router.back`; detail **Ke Antrean** menggunakan `router.replace`. |
| `_layout.tsx` + `<Stack.Screen>` | 10% | `src/app/_layout.tsx` berisi konfigurasi seluruh route dan `<Stack.Screen>`. |
| Menjawab pertanyaan | 15% | Pelajari penjelasan di bagian 4 dokumen ini. |
| Modifikasi kode langsung | 15% | Coba latihan mandiri di bagian 5. |
| **TOTAL** | **100%** | Bagian tanya jawab dan modifikasi dinilai asisten, bukan otomatis terpenuhi. |

**Catatan:** Codelab 1 dan Codelab 2 yang ada di project ini adalah adaptasi terintegrasi dari tugas di modul. Materi codelab menyebut tugas yang dikerjakan di laboratorium; tetap ikuti mekanisme penilaian dosen/asisten. Beberapa kode contoh modul diberikan melalui tautan eksternal dan tidak seluruh isinya tercetak di PDF.

## 2. Persiapan di laptop / HP

1. Ekstrak ZIP; buka folder `AntreCukur_Modul2_Demo` yang berisi `package.json` di VS Code.
2. Pasang Node.js sesuai versi Expo yang digunakan (misalnya Node.js 22.13+).
3. Pada terminal project jalankan `npm install`, kemudian `npx expo start --go`.
4. Buka Expo Go yang kompatibel dengan SDK 58, pindai QR dan buka aplikasi. Laptop dan HP sebaiknya berada di satu Wi-Fi.
5. Tidak perlu build APK. Internet dibutuhkan untuk install dependency; data antrean disimpan lokal.
6. Jika penampilan data berbeda akibat penyimpanan sebelumnya, buka tab **Layanan** > **Pemeriksaan aplikasi** > **Isi antrean dengan data contoh** (mengganti data yang tersimpan).

## 3. Urutan presentasi praktikum (jalankan di Expo Go)

1. **Demo aplikasi awal**: buka tab Antrean, jelaskan status menunggu / sedang dicukur / selesai, tambah pelanggan, cari, filter, dan riwayat.
2. **Tunjukkan `useState`**: ketik pencarian, lihat daftar berubah; jelaskan `search` dan `setSearch`. Buka dialog Tambah pelanggan: `showAdd` dan `setShowAdd`.
3. **Tunjukkan `useEffect`**: pada `src/screens/QueueScreen.tsx` terdapat timer 30 detik untuk `setNow()`, dibersihkan oleh `clearInterval()`; pada `src/QueueContext.tsx` ada pemuatan data awal.
4. **Tunjukkan `router.push()`**: pada tab Antrean tekan **Detail ›** salah satu pelanggan; tampilan membuka `/pelanggan/[id]`.
5. **Tunjukkan `useLocalSearchParams()`**: pada detail, parameter `id` menentukan pelanggan yang dibuka. Coba Detail untuk pelanggan yang berbeda.
6. **Tunjukkan `router.back()`**: di halaman detail tekan **Kembali (router.back)**, aplikasi kembali ke layar sebelumnya.
7. **Tunjukkan `router.replace()`**: buka detail lagi, tekan **Ke Antrean (router.replace)**, layar aktif diganti antrean utama.
8. **Tunjukkan `<Stack.Screen>`**: buka `src/app/_layout.tsx`, jelaskan judul dan pengaturan screen serta tab tersembunyi dari header.
9. **Pratinjau tampilan**: buka tab Layanan > **Pratinjau tampilan**, lalu tekan **Ubah tampilan**. Jelaskan bagaimana `useContext` mengambil nilai tema dari provider dan meneruskannya ke komponen kartu profil.
10. **Panduan penggunaan**: buka tab Layanan > **Panduan penggunaan**, lalu pilih beberapa topik. Tunjukkan bahwa path yang berbeda menampilkan isi panduan berbeda melalui `src/app/docs/[...slug].tsx`.

## 4. Pertanyaan dan jawaban singkat yang perlu dipahami

**Apa perbedaan state dan variabel biasa?** `useState` menyediakan state dan fungsi setter; memanggil setter membuat React memperbarui tampilan. Variabel lokal biasa tidak otomatis memicu render.

**Mengapa memakai `useEffect`?** Untuk pekerjaan setelah render seperti timer dan pemuatan data. Cleanup mencegah timer berlanjut setelah layar ditutup.

**Apa bedanya `useState` dan `useRef`?** State digunakan untuk nilai yang harus ditampilkan ulang; mengubah `.current` di `useRef` tidak memicu render. Pada `QueueContext.tsx`, ref membantu menjaga state antrean yang terkini saat menulis ke penyimpanan.

**Apa fungsi `useContext`?** Mengambil data dari React Context pada komponen turunan tanpa mengoper props di setiap tingkat. Di Codelab 1, `UserCard` memakai `ThemeContext`.

**Apa fungsi `useMemo`?** Menyimpan hasil perhitungan dan mengulanginya ketika dependensi berubah. Pada detail pelanggan, pencarian pelanggan dihitung dari `queue.customers` dan `id`.

**Apa beda `push`, `back`, `replace`?** `push` membuka layar baru di atas stack, `back` mengembalikan ke sebelumnya, `replace` mengganti layar aktif dalam riwayat stack.

**Mengapa perlu `canGoBack()`?** Untuk memastikan terdapat halaman sebelumnya, terutama jika detail dibuka melalui deep link. Jika tidak ada, aplikasi melakukan `replace('/')`.

**Apa itu dynamic route?** File `[id].tsx` menerima nilai berbeda pada bagian URL yang sama; layar detail AntreCukur adalah contohnya.

**Apa itu catch-all route?** File `[...slug].tsx` membaca banyak segmen URL. Codelab 2 menggunakan `/docs/queue/manage` dan `/docs/app/navigation`, lalu `slug.join('/')` menentukan konten.

**Apa fungsi `_layout.tsx`?** Mendefinisikan navigator atau tata letak bersama untuk halaman-halaman di bawahnya; di project ini, root menggunakan Stack, sedangkan grup `(tabs)` menggunakan Tabs.

**Bagaimana data tetap tersimpan?** `QueueContext.tsx` memuat dan menyimpan state via AsyncStorage secara lokal. Aplikasi ini tidak menggunakan backend/API.

## 5. Latihan perubahan langsung tanpa AI (untuk penilaian 15%)

- **Latihan A:** Ubah judul `<Stack.Screen name="pelanggan/[id]" options={{ title: 'Detail Pelanggan' }} />` menjadi **Informasi Antrean** di `src/app/_layout.tsx`.
- **Latihan B:** Ubah frekuensi `30_000` menjadi `10_000` pada timer halaman detail; jelaskan `1000` milidetik = 1 detik.
- **Latihan C:** Pada `src/app/usecontext_example.tsx`, ubah warna latar tampilan gelap dan warna tombol; tunjukkan perubahannya.
- **Latihan D:** Tambah satu topik dokumentasi di objek `MATERIAL` dalam `src/app/docs/[...slug].tsx`, dan tambah tombolnya di `src/app/docs/index.tsx`.
- **Latihan E:** Di `src/screens/QueueScreen.tsx`, ubah label **Detail ›** menjadi **Lihat antrean ›** tanpa mengubah navigasi.

Selalu jalankan ulang aplikasi dan jelaskan **file yang diubah, baris penting, serta efeknya di layar**.

## 6. Kolaborasi tiga anggota melalui GitHub

Modul secara tegas meminta **3 anggota dalam satu kelompok, satu tema unik di kelas, kontribusi GitHub yang nyata, dan kelanjutan project yang sama untuk Modul 1–6**. ZIP hasil ini **tidak otomatis membuktikan** kontribusi tiap anggota.

Contoh pembagian yang bisa dilakukan secara jujur:

- Anggota A: pahami, uji, dan kerjakan perbaikan pada state dan QueueScreen; commit sendiri.
- Anggota B: pahami, uji, dan kerjakan perbaikan dynamic route, Stack dan navigasi; commit sendiri.
- Anggota C: pahami, uji, dan kerjakan perbaikan Codelab, uji data, serta dokumentasi; commit sendiri.

Gunakan akun GitHub setiap orang untuk **perubahan yang benar-benar mereka buat**; jangan membuat commit palsu atau mengubah nama author untuk meniru kolaborasi. Setiap anggota tetap harus mampu menjelaskan dan memodifikasi aplikasi tanpa membuka modul/AI saat demo.

## 7. Pemeriksaan teknis pada paket ini

- TypeScript (`npm run typecheck`): **lulus**.
- ESLint (`npm run lint`): **lulus**.
- Ekspor web (`npm run export:web`): **lulus**.
- Delapan pengujian logika antrean: **lulus** dengan terlebih dahulu mengompilasi test TypeScript ke CommonJS. Cara ini digunakan karena dependensi yang disertakan dalam ZIP asli adalah binary Windows sedangkan lingkungan pemeriksaan Linux. Setelah `npm install` pada komputer masing-masing, jalankan `npm test` seperti biasa.
- Uji langsung di HP Android/iOS: **belum dilakukan dalam lingkungan ini**. Jalankan semua langkah bagian 3 sebelum presentasi.

**Batasan**: Aplikasi offline, data pelanggan hanya tersimpan di satu perangkat. Tidak ada sinkronisasi ke server; tidak ada fitur login. `npx expo start --go` perlu perangkat yang kompatibel dengan versi SDK proyek.
