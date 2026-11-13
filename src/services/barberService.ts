import { LOCAL_BARBERS } from '../data';
import type { AvailabilityCheckResult, Barber, ExternalUserApiResponse } from '../types';

/**
 * Modul 3: External API, Custom Async Function, Promise, resolve/reject, dan .then().
 * Profil DummyJSON dipakai sebagai data contoh untuk roster demo, bukan data pegawai nyata.
 */
const API_ENDPOINT = 'https://dummyjson.com/users?limit=6&select=firstName,lastName,email,phone,image,hair';

/** Custom Async Function yang mengambil profil dari External API dan memetakannya ke Interface Barber. */
export async function fetchBarbersFromApi(): Promise<Barber[]> {
  const response = await fetch(API_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Gagal mengambil profil dari API: HTTP ${response.status}`);
  }

  const rawData: ExternalUserApiResponse = await response.json();
  if (!Array.isArray(rawData.users)) {
    throw new Error('Format respons API tidak sesuai.');
  }

  return rawData.users.map((user): Barber => ({
    // ID dan profil eksternal dipakai untuk identitas data demo.
    id: user.id,
    // Nama operasional dibuat stabil agar antrean tetap konsisten meskipun profil API berubah.
    name: `Kapster ${user.id}`,
    profileName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    avatar: user.image,
    hairProfile: user.hair ? `${user.hair.type}, ${user.hair.color}` : 'Tidak tersedia',
    source: 'api',
  }));
}

/** Mengembalikan roster lokal agar fitur antrean tetap bisa digunakan tanpa internet. */
export function getFallbackBarbers(): Barber[] {
  return LOCAL_BARBERS.map((barber) => ({ ...barber }));
}

/**
 * Custom Promise untuk mengecek ketersediaan kapster.
 * Ini simulasi sisi aplikasi; tidak membuat reservasi atau mengirim data booking ke server.
 */
export function checkBarberAvailability(
  barber: Barber,
  canAcceptQueue: boolean,
  forceReject = false,
): Promise<AvailabilityCheckResult> {
  return new Promise<AvailabilityCheckResult>((resolve, reject) => {
    setTimeout(() => {
      if (forceReject || !canAcceptQueue) {
        reject(new Error(forceReject
          ? 'Pemeriksaan ketersediaan belum berhasil. Silakan coba lagi.'
          : `${barber.name} belum dapat menerima antrean baru.`));
        return;
      }

      resolve({
        barberId: barber.id,
        barberName: barber.name,
        available: true,
        message: `${barber.name} dapat menerima pelanggan baru. Jika sedang melayani, pelanggan akan masuk ke daftar tunggu.`,
        checkedAt: Date.now(),
      });
    }, 500);
  });
}

/** Menangani hasil pemeriksaan dan selalu merapikan status proses setelah selesai. */
export function processAvailabilityCheckWithThen(
  barber: Barber,
  canAcceptQueue: boolean,
  forceReject: boolean,
  onSuccess: (result: AvailabilityCheckResult) => void,
  onError: (err: Error) => void,
  onComplete?: () => void,
): void {
  checkBarberAvailability(barber, canAcceptQueue, forceReject)
    .then((result) => {
      onSuccess(result);
      return result;
    })
    .catch((error: Error) => {
      onError(error);
    })
    .finally(() => {
      onComplete?.();
    });
}

/** Demonstrasi tambahan static method Promise.resolve() dan Promise.reject(). */
export function demonstrateStaticPromise(shouldSucceed: boolean): Promise<string> {
  if (shouldSucceed) {
    return Promise.resolve('Simulasi proses berhasil.');
  }
  return Promise.reject(new Error('Simulasi proses gagal berhasil diuji.'));
}

export { API_ENDPOINT };
