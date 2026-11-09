# PANDUAN LENGKAP DEMO MODUL 2 — APLIKASI ANTRECUKUR

> **Acuan Resmi**: Modul 2 Pemrograman Mobile — *State, Hooks & Navigasi Page*, UMM, Agustus 2026, halaman cetak **42–43** (lembar PDF 42–43). Fitur Codelab mengacu pada halaman cetak 17 dan 39–41.

---

## DAFTAR ISI & PENCARIAN CEPAT

- [1. TABEL CHECKLIST KRITERIA PENILAIAN RESMI](#1-tabel-checklist-kriteria-penilaian-resmi)
- [2. PANDUAN PERSIAPAN LAPTOP & HP](#2-panduan-persiapan-laptop--hp)
- [3. URUTAN TAHAP DEMO PRAKTIKUM (PANDUAN LANGKAH DEMI LANGKAH)](#3-urutan-tahap-demo-praktikum-panduan-langkah-demi-langkah)
  - [3.1. Demo 1: Tampilan Utama & Alur Antrean](#31-demo-1-tampilan-utama--alur-antrean)
  - [3.2. Demo 2: Pembuktian useState (Pencarian & Dialog Tambah)](#32-demo-2-pembuktian-usestate-pencarian--dialog-tambah)
  - [3.3. Demo 3: Pembuktian useEffect (Timer Waktu & Memuat Data Awal)](#33-demo-3-pembuktian-useeffect-timer-waktu--memuat-data-awal)
  - [3.4. Demo 4: Navigasi router.push() (Buka Detail Pelanggan)](#34-demo-4-navigasi-routerpush-buka-detail-pelanggan)
  - [3.5. Demo 5: Dynamic Route useLocalSearchParams() (Baca ID Pelanggan)](#35-demo-5-dynamic-route-uselocalsearchparams-baca-id-pelanggan)
  - [3.6. Demo 6: Navigasi router.back() (Kembali ke Halaman Sebelumnya)](#36-demo-6-navigasi-routerback-kembali-ke-halaman-sebelumnya)
  - [3.7. Demo 7: Navigasi router.replace() (Ganti Halaman Aktif)](#37-demo-7-navigasi-routerreplace-ganti-halaman-aktif)
  - [3.8. Demo 8: Pengaturan Navigator Stack.Screen (_layout.tsx)](#38-demo-8-pengaturan-navigator-stackscreen-_layouttsx)
  - [3.9. Demo 9: Codelab 1 (Ganti Tema Dark Mode & useContext)](#39-demo-9-codelab-1-ganti-tema-dark-mode--usecontext)
  - [3.10. Demo 10: Codelab 2 (Dokumentasi Catch-All Route [...slug])](#310-demo-10-codelab-2-dokumentasi-catch-all-route-slug)
- [4. TANYA JAWAB (Q&A) MATERI WAWANCARA DOSEN / ASISTEN](#4-tanya-jawab-qa-materi-wawancara-dosen--asisten)
  - [4.1. Perbedaan State (useState) vs Variabel Biasa](#41-perbedaan-state-usestate-vs-variabel-biasa)
  - [4.2. Fungsi, Kegunaan, dan Alasan Menggunakan useEffect](#42-fungsi-kegunaan-dan-alasan-menggunakan-useeffect)
  - [4.3. Perbedaan useState vs useRef](#43-perbedaan-usestate-vs-useref)
  - [4.4. Fungsi dan Cara Kerja useContext](#44-fungsi-dan-cara-kerja-usecontext)
  - [4.5. Fungsi dan Kegunaan useMemo](#45-fungsi-dan-kegunaan-usememo)
  - [4.6. Perbedaan Navigasi router.push, router.back, dan router.replace](#46-perbedaan-navigasi-routerpush-routerback-dan-routerreplace)
  - [4.7. Alasan dan Fungsi Pengecekan canGoBack()](#47-alasan-dan-fungsi-pengecekan-cangoback)
  - [4.8. Pengertian Dynamic Route ([id].tsx)](#48-pengertian-dynamic-route-idtsx)
  - [4.9. Pengertian Catch-All Route ([...slug].tsx)](#49-pengertian-catch-all-route-slugtsx)
  - [4.10. Fungsi dan Peran File _layout.tsx](#410-fungsi-dan-peran-file-_layouttsx)
  - [4.11. Mekanisme Penyimpanan Data Lokal (AsyncStorage)](#411-mekanisme-penyimpanan-data-lokal-asyncstorage)
- [5. PANDUAN LATIHAN MODIFIKASI KODE LANGSUNG (LIVE CODING)](#5-panduan-latihan-modifikasi-kode-langsung-live-coding)
  - [5.1. Latihan A: Mengubah Judul Header Halaman Detail](#51-latihan-a-mengubah-judul-header-halaman-detail)
  - [5.2. Latihan B: Mengubah Interval Timer Detik](#52-latihan-b-mengubah-interval-timer-detik)
  - [5.3. Latihan C: Mengubah Warna Tema Dark Mode](#53-latihan-c-mengubah-warna-tema-dark-mode)
  - [5.4. Latihan D: Menambah Halaman Topik Dokumentasi Baru](#54-latihan-d-menambah-halaman-topik-dokumentasi-baru)
  - [5.5. Latihan E: Mengubah Teks Label Tombol Antrean](#55-latihan-e-mengubah-teks-label-tombol-antrean)
- [6. PANDUAN KOLABORASI GITHUB 3 ANGGOTA TIM](#6-panduan-kolaborasi-github-3-anggota-tim)
- [7. STATUS PEMERIKSAAN KUALITAS KODE TEKNIS](#7-status-pemeriksaan-kualitas-kode-teknis)

---

## 1. TABEL CHECKLIST KRITERIA PENILAIAN RESMI

| Kriteria Penilaian | Bobot | Bukti Lokasi File Kode / Cara Mencoba | Kata Kunci Pencarian |
|---|---:|---|---|
| **Codelab 1 & Codelab 2** | 40% | Tab **Layanan** > Pilih **Codelab 1 · Dark Mode** atau **Codelab 2 · Dokumentasi**. | `codelab`, `tema`, `dark mode`, `slug` |
| **Penerapan `useState` + `useEffect`** | 10% | `src/screens/QueueScreen.tsx`, `src/app/pelanggan/[id].tsx`, `src/QueueContext.tsx`. Cari kata `useState(` dan `useEffect(`. | `useState`, `useEffect`, `timer`, `search` |
| **Navigasi: `push`, `back`, dan satu router lain (`replace`)** | 10% | Tombol **Detail ›** (`router.push`), tombol detail **Kembali** (`router.back`), tombol detail **Ke Antrean** (`router.replace`). | `router.push`, `router.back`, `router.replace` |
| **Struktur `_layout.tsx` + `<Stack.Screen>`** | 10% | `src/app/_layout.tsx` berisi konfigurasi seluruh route dan tag `<Stack.Screen>`. | `_layout`, `Stack.Screen`, `headerShown` |
| **Menjawab Pertanyaan Lisan (Wawancara)** | 15% | Pelajari materi penjelasan lengkap di [Bagian 4](#4-tanya-jawab-qa-materi-wawancara-dosen--asisten). | `tanya jawab`, `teori`, `wawancara` |
| **Modifikasi Kode Langsung (Live Coding)** | 15% | Kerjakan dan pahami contoh latihan di [Bagian 5](#5-panduan-latihan-modifikasi-kode-langsung-live-coding). | `live coding`, `latihan`, `modifikasi` |
| **TOTAL NILAI** | **100%** | Sesi tanya jawab dan modifikasi dinilai langsung oleh asisten laboratorium. | |

> **Catatan Penilaian**: Codelab 1 dan Codelab 2 di proyek ini merupakan adaptasi resmi dari modul praktikum laboratorium. Beberapa referensi modul merujuk materi eksternal yang diintegrasikan langsung ke dalam kode aplikasi ini.

---

## 2. PANDUAN PERSIAPAN LAPTOP & HP

*Gunakan langkah ini sebelum maju presentasi agar aplikasi siap tampil:*

1. **Buka Proyek**: Ekstrak ZIP, buka folder `AntreCukur_Modul2_Demo` (yang berisi file `package.json`) di aplikasi VS Code.
2. **Cek Versi Node.js**: Pastikan menggunakan Node.js yang sesuai (disarankan Node.js 22.13+ atau LTS terbaru).
3. **Instalasi Paket**: Buka terminal di folder proyek, ketik:
   ```bash
   npm install
   ```
4. **Jalankan Server Expo**: Jalankan perintah:
   ```bash
   npx expo start --go
   ```
5. **Koneksi ke HP (Expo Go)**:
   - Pastikan laptop dan HP tersambung ke **satu jaringan Wi-Fi yang sama**.
   - Buka aplikasi **Expo Go** di HP, pindai QR Code yang muncul di terminal.
6. **Reset Data (Jika Perlu)**: Jika data antrean acak-acakan karena pengujian sebelumnya, buka tab **Layanan** > tekan tombol **Muat data contoh** untuk mengembalikan antrean bawaan.

---

## 3. URUTAN TAHAP DEMO PRAKTIKUM (PANDUAN LANGKAH DEMI LANGKAH)

*Ikuti urutan ini saat mendemonstrasikan aplikasi di hadapan penguji:*

### 3.1. Demo 1: Tampilan Utama & Alur Antrean
- **Aksi**: Buka tab **Antrean**.
- **Penjelasan**: Jelaskan 3 status pelanggan (*Menunggu*, *Sedang Dicukur*, dan *Selesai*). Tunjukkan alur pemanggilan pelanggan berikutnya, penyelesaian cukur, pembatalan antrean, dan riwayat.
- **File Terkait**: `src/screens/QueueScreen.tsx`

### 3.2. Demo 2: Pembuktian useState (Pencarian & Dialog Tambah)
- **Aksi**: Ketik nama di kolom pencarian, tunjukkan daftar menyaring seketika. Buka tombol **+ Pelanggan** untuk memunculkan modal dialog.
- **Penjelasan Kode**: Tunjukkan variabel state `search` & `setSearch`, serta `showAdd` & `setShowAdd`. Saat setter dipanggil, React merender ulang antarmuka dengan data baru.
- **File Terkait**: `src/screens/QueueScreen.tsx`

### 3.3. Demo 3: Pembuktian useEffect (Timer Waktu & Memuat Data Awal)
- **Aksi**: Perhatikan tampilan timer "menit lalu" yang terus terbarukan secara otomatis.
- **Penjelasan Kode**: Tunjukkan pemakaian `useEffect` dengan timer 30 detik (`setInterval`) untuk memperbarui `now`, serta pembersihan memori dengan `clearInterval()` saat komponen ditutup. Tunjukkan juga pemuatan data antrean awal dari storage.
- **File Terkait**: `src/screens/QueueScreen.tsx`, `src/QueueContext.tsx`

### 3.4. Demo 4: Navigasi router.push() (Buka Detail Pelanggan)
- **Aksi**: Tekan tombol **Detail ›** pada salah satu baris pelanggan di antrean.
- **Penjelasan Kode**: Tunjukkan fungsi `router.push('/pelanggan/[id]')`. Menjelaskan bahwa layar baru ditambahkan ke atas tumpukan (stack) navigasi.
- **File Terkait**: `src/screens/QueueScreen.tsx`

### 3.5. Demo 5: Dynamic Route useLocalSearchParams() (Baca ID Pelanggan)
- **Aksi**: Perhatikan detail pelanggan yang terbuka menampilkan data yang sesuai dengan orang yang dipilih.
- **Penjelasan Kode**: Tunjukkan hook `useLocalSearchParams<{ id: string }>()` membaca nilai parameter `id` dari URL/rute secara dinamis.
- **File Terkait**: `src/app/pelanggan/[id].tsx`

### 3.6. Demo 6: Navigasi router.back() (Kembali ke Halaman Sebelumnya)
- **Aksi**: Pada layar detail pelanggan, tekan tombol **Kembali (router.back)**.
- **Penjelasan Kode**: Menjelaskan bahwa `router.back()` mencopot (pop) layar saat ini dari stack dan mengembalikan pengguna ke halaman asal.
- **File Terkait**: `src/app/pelanggan/[id].tsx`

### 3.7. Demo 7: Navigasi router.replace() (Ganti Halaman Aktif)
- **Aksi**: Buka kembali detail pelanggan, lalu tekan tombol **Ke Antrean (router.replace)**.
- **Penjelasan Kode**: Menjelaskan bahwa `router.replace('/')` tidak menambah riwayat tumpukan, melainkan mengganti layar aktif langsung ke beranda antrean.
- **File Terkait**: `src/app/pelanggan/[id].tsx`

### 3.8. Demo 8: Pengaturan Navigator Stack.Screen (_layout.tsx)
- **Aksi**: Buka kode tata letak navigasi di editor.
- **Penjelasan Kode**: Jelaskan konfigurasi `<Stack>` utama, pendaftaran route dengan tag `<Stack.Screen>`, pengaturan judul (`title`), serta opsi menyembunyikan header default (`headerShown: false`) untuk layout tab.
- **File Terkait**: `src/app/_layout.tsx`

### 3.9. Demo 9: Codelab 1 (Ganti Tema Dark Mode & useContext)
- **Aksi**: Masuk tab **Layanan** > tekan **Codelab 1 · Dark Mode**, lalu tekan tombol **Ganti Tema**.
- **Penjelasan Kode**: Komponen anak `UserCard` membaca nilai state tema global secara langsung dari `ThemeContext` melalui hook `useContext(ThemeContext)` tanpa oper-mengoper props berjenjang.
- **File Terkait**: `src/app/usecontext_example.tsx`

### 3.10. Demo 10: Codelab 2 (Dokumentasi Catch-All Route [...slug])
- **Aksi**: Masuk tab **Layanan** > tekan **Codelab 2 · Dokumentasi**, lalu pilih salah satu materi (misal: *State di React* atau *Stack Router*).
- **Penjelasan Kode**: Tunjukkan bagaimana rute `src/app/docs/[...slug].tsx` menangkap banyak segmen URL (seperti `/docs/react/state`) dan menggabungkannya via `slug.join('/')` untuk memilih isi materi yang ditampilkan.
- **File Terkait**: `src/app/docs/[...slug].tsx`, `src/app/docs/index.tsx`

---

## 4. TANYA JAWAB (Q&A) MATERI WAWANCARA DOSEN / ASISTEN

*Hafalkan dan pahami poin-poin berikut untuk menjawab pertanyaan lisan:*

### 4.1. Perbedaan State (useState) vs Variabel Biasa
- **Jawaban**: 
  - **`useState`**: Menyimpan nilai state dan menyediakan fungsi pengubah (*setter*). Setiap kali fungsi setter dipanggil, React akan memicu **render ulang (*re-render*)** pada komponen sehingga tampilan antarmuka (UI) diperbarui secara visual.
  - **Variabel Biasa**: Nilainya bisa berubah di memori, tetapi perubahannya **tidak memicu render ulang**. Akibatnya tampilan di layar HP tidak akan berubah sama sekali.

### 4.2. Fungsi, Kegunaan, dan Alasan Menggunakan useEffect
- **Jawaban**: 
  - Digunakan untuk menangani **efek samping (*side-effects*)** setelah komponen selesai dirender, seperti mengambil data dari penyimpanan lokal (*AsyncStorage*), langganan event, atau menjalankan timer (`setInterval`).
  - **Fungsi Cleanup (`return () => clearInterval(...)`)**: Sangat penting untuk membersihkan timer atau langganan ketika komponen dilepas (*unmount*), sehingga tidak terjadi kebocoran memori (*memory leak*).

### 4.3. Perbedaan useState vs useRef
- **Jawaban**:
  - `useState` memicu pembaruan tampilan antarmuka (UI) setiap kali nilainya diubah melalui fungsi *setter*.
  - `useRef` menyimpan nilai pada properti `.current`. Mengubah `.current` **tidak memicu render ulang**. Sangat berguna untuk menyimpan nilai acuan terkini tanpa mengganggu tampilan (misalnya acuan antrean saat penulisan data ke storage di `QueueContext.tsx`).

### 4.4. Fungsi dan Cara Kerja useContext
- **Jawaban**:
  - Memungkinkan komponen anak untuk langsung mengakses data global dari *Context Provider* tanpa harus mengoper data lewat *props* secara berjenjang di setiap tingkat hierarki (*prop drilling*).
  - Contoh di Codelab 1: Komponen `UserCard` langsung mengambil status tema terang/gelap dari `ThemeContext`.

### 4.5. Fungsi dan Kegunaan useMemo
- **Jawaban**:
  - Mengingat (*memoize*) dan menyimpan hasil perhitungan komputasi yang berat agar tidak dihitung ulang pada setiap render, kecuali jika array dependensinya berubah.
  - Contoh: Pada halaman detail pelanggan, pencarian data pelanggan dihitung ulang hanya ketika daftar antrean `queue.customers` atau parameter `id` mengalami perubahan.

### 4.6. Perbedaan Navigasi router.push, router.back, dan router.replace
- **Jawaban**:
  - **`router.push(path)`**: Menambahkan (*push*) halaman baru ke puncak tumpukan riwayat (*stack*), sehingga pengguna bisa kembali ke halaman sebelumnya.
  - **`router.back()`**: Mencopot (*pop*) halaman teratas dan mengembalikan pengguna tepat ke halaman sebelumnya di riwayat.
  - **`router.replace(path)`**: Mengganti (*replace*) halaman aktif saat ini tanpa menambah riwayat baru. Jika tombol kembali ditekan setelahnya, layar yang digantikan tidak akan dibuka lagi.

### 4.7. Alasan dan Fungsi Pengecekan canGoBack()
- **Jawaban**:
  - Untuk memastikan apakah ada riwayat halaman sebelumnya di dalam stack navigasi.
  - Ini sangat penting untuk mencegah aplikasi tertutup atau error saat halaman dibuka langsung dari tautan luar (*deep linking*). Jika `canGoBack()` bernilai `false`, navigasi diarahkan fallback secara aman via `router.replace('/')`.

### 4.8. Pengertian Dynamic Route ([id].tsx)
- **Jawaban**:
  - Rute navigasi di mana segmen URL bersifat variabel/dinamis. Nama file diapit kurung siku `[id].tsx`.
  - Berapapun ID pelanggan yang dimasukkan (misal: `/pelanggan/1`, `/pelanggan/2`), file yang sama akan menangani halaman tersebut dengan membaca parameter ID via `useLocalSearchParams()`.

### 4.9. Pengertian Catch-All Route ([...slug].tsx)
- **Jawaban**:
  - Rute fleksibel yang dapat menangkap banyak segmen URL bertingkat sekaligus ke dalam bentuk array. Nama file diawali titik tiga `[...slug].tsx`.
  - Contoh: URL `/docs/react/state` akan diterima sebagai array `slug = ['react', 'state']`.

### 4.10. Fungsi dan Peran File _layout.tsx
- **Jawaban**:
  - Berfungsi sebagai pembungkus (*wrapper*) dan pengatur tata letak bersama bagi semua halaman yang ada di dalam direktorinya.
  - Di Expo Router, `_layout.tsx` digunakan untuk mengonfigurasi jenis navigator (seperti `<Stack>` atau `<Tabs>`), menentukan header bersama, judul layar (`title`), serta hak akses rute.

### 4.11. Mekanisme Penyimpanan Data Lokal (AsyncStorage)
- **Jawaban**:
  - Data antrean disimpan secara lokal di memori HP menggunakan library `@react-native-async-storage/async-storage` dalam bentuk string JSON.
  - Tidak memerlukan server/backend database internet; aplikasi dapat bekerja 100% secara offline.

---

## 5. PANDUAN LATIHAN MODIFIKASI KODE LANGSUNG (LIVE CODING)

*Simulasi perubahan kode langsung saat ujian 15%:*

### 5.1. Latihan A: Mengubah Judul Header Halaman Detail
- **Tugas**: Ubah judul header halaman detail pelanggan menjadi **Informasi Antrean**.
- **Lokasi File**: `src/app/_layout.tsx`
- **Kode yang Diubah**:
  ```tsx
  // Sebelum:
  <Stack.Screen name="pelanggan/[id]" options={{ title: 'Detail Pelanggan' }} />

  // Sesudah:
  <Stack.Screen name="pelanggan/[id]" options={{ title: 'Informasi Antrean' }} />
  ```
- **Cara Jelaskan**: "Saya mengubah properti `title` di opsi `Stack.Screen` pada rute `pelanggan/[id]` di file `_layout.tsx`."

### 5.2. Latihan B: Mengubah Interval Timer Detik
- **Tugas**: Ubah interval pembaruan waktu antrean dari 30 detik menjadi 10 detik.
- **Lokasi File**: `src/screens/QueueScreen.tsx` (atau `src/app/pelanggan/[id].tsx`)
- **Kode yang Diubah**:
  ```tsx
  // Cari baris interval:
  const timer = setInterval(() => setNow(Date.now()), 30_000);

  // Ubah menjadi 10 detik (10.000 milidetik):
  const timer = setInterval(() => setNow(Date.now()), 10_000);
  ```
- **Cara Jelaskan**: "Nilai interval diukur dalam milidetik, di mana 1.000 ms = 1 detik, sehingga 10.000 ms berarti interval 10 detik."

### 5.3. Latihan C: Mengubah Warna Tema Dark Mode
- **Tugas**: Ubah warna latar belakang saat Dark Mode aktif di Codelab 1.
- **Lokasi File**: `src/app/usecontext_example.tsx`
- **Kode yang Diubah**:
  ```tsx
  // Cari objek darkStyle / dark:
  // Ubah nilai hex warna background, misalnya dari #1E293B menjadi #111827 atau #0F172A.
  ```
- **Cara Jelaskan**: "Saya mengganti nilai properti `backgroundColor` pada objek gaya tema gelap, lalu melihat perubahannya seketika saat tombol Ganti Tema ditekan."

### 5.4. Latihan D: Menambah Halaman Topik Dokumentasi Baru
- **Tugas**: Tambah satu materi baru di Codelab 2 (Catch-All Route).
- **Lokasi File**: `src/app/docs/[...slug].tsx` dan `src/app/docs/index.tsx`
- **Kode yang Diubah**:
  1. Tambahkan data di objek `MATERIAL` pada `src/app/docs/[...slug].tsx`:
     ```tsx
     'contoh/baru': {
       title: 'Materi Contoh Baru',
       body: 'Penjelasan materi contoh baru di sini...',
     },
     ```
  2. Tambahkan tombol tautannya di `src/app/docs/index.tsx`:
     ```tsx
     <Pressable onPress={() => router.push('/docs/contoh/baru')}>
       <Text>Buka Contoh Baru</Text>
     </Pressable>
     ```

### 5.5. Latihan E: Mengubah Teks Label Tombol Antrean
- **Tugas**: Ubah teks tombol **Detail ›** menjadi **Lihat antrean ›**.
- **Lokasi File**: `src/screens/QueueScreen.tsx`
- **Kode yang Diubah**:
  ```tsx
  // Ganti teks di dalam komponen Text tombol:
  <Text style={styles.detailBtnText}>Lihat antrean ›</Text>
  ```
- **Cara Jelaskan**: "Saya mengubah isi teks tampilan tanpa mengubah logika fungsi `router.push` di pembungkus tombolnya."

---

## 6. PANDUAN KOLABORASI GITHUB 3 ANGGOTA TIM

*Ketentuan Modul: 3 anggota kelompok, 1 tema unik, dan kontribusi nyata riwayat commit Git.*

### Pembagian Tugas yang Direkomendasikan:
- **Anggota 1 (Spesialis State & Alur Antrean)**:
  - Menguasai `useState`, `useEffect`, timer real-time, penambahan antrean, dan filter status.
  - Berkontribusi pada file: `src/screens/QueueScreen.tsx` dan `src/QueueContext.tsx`.
- **Anggota 2 (Spesialis Routing & Tata Letak)**:
  - Menguasai navigasi `push`, `back`, `replace`, dynamic route `[id]`, dan konfigurasi `<Stack>`.
  - Berkontribusi pada file: `src/app/_layout.tsx` dan `src/app/pelanggan/[id].tsx`.
- **Anggota 3 (Spesialis Codelab & Dokumentasi)**:
  - Menguasai `useContext` (Codelab 1), catch-all route `[...slug]` (Codelab 2), dan pengujian data.
  - Berkontribusi pada file: `src/app/usecontext_example.tsx`, folder `src/app/docs/`, dan `README.md`.

> **PENTING**: Lakukan *commit* dan *push* dari akun GitHub masing-masing anggota secara berkala agar riwayat kontribusi kelompok terbukti jelas dan valid.

---

## 7. STATUS PEMERIKSAAN KUALITAS KODE TEKNIS

- **TypeScript (`npm run typecheck`)**: **Lulus (0 error)**.
- **ESLint (`npm run lint`)**: **Lulus (0 warning / error)**.
- **Ekspor Web (`npm run export:web`)**: **Lulus**.
- **Unit Test Logika Antrean (`npm test`)**: **8/8 Lulus**.
- **Sifat Aplikasi**: Berjalan secara offline (data tersimpan di AsyncStorage perangkat), tidak bergantung pada server/database online, dan tidak memerlukan login akun.
