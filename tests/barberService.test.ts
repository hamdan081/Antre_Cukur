import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkBarberAvailability,
  demonstrateStaticPromise,
  fetchBarbersFromApi,
  processAvailabilityCheckWithThen,
} from '../src/services/barberService';
import type { Barber, ExternalUserApiResponse, AvailabilityCheckResult } from '../src/types';

const mockBarber: Barber = {
  id: 101,
  name: 'Kapster 101',
  profileName: 'Budi Pratama',
  email: 'budi@example.test',
  phone: '+62 812-3456-7890',
  avatar: 'https://dummyjson.com/icon/budi/128',
  hairProfile: 'Wavy, Black',
  source: 'api',
};

const sampleResponse: ExternalUserApiResponse = {
  users: [{
    id: 101,
    firstName: 'Budi',
    lastName: 'Pratama',
    email: 'budi@example.test',
    phone: '+62 812-3456-7890',
    image: 'https://dummyjson.com/icon/budi/128',
    hair: { type: 'Wavy', color: 'Black' },
  }],
  total: 1,
  skip: 0,
  limit: 1,
};

test('KRITERIA 1 & 2: fetchBarbersFromApi memetakan External API ke Object Interface Barber', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify(sampleResponse), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })) as typeof fetch;

  try {
    const barbers = await fetchBarbersFromApi();
    assert.equal(barbers.length, 1);
    assert.equal(barbers[0].id, 101);
    assert.equal(barbers[0].name, 'Kapster 101');
    assert.equal(barbers[0].profileName, 'Budi Pratama');
    assert.equal(barbers[0].hairProfile, 'Wavy, Black');
    assert.equal(barbers[0].source, 'api');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('KRITERIA 3: checkBarberAvailability me-resolve() ketika kapster tersedia', async () => {
  const result = await checkBarberAvailability(mockBarber, true);
  assert.equal(result.barberId, 101);
  assert.equal(result.available, true);
  assert.ok(result.message.includes('dapat menerima pelanggan baru'));
});

test('KRITERIA 3: checkBarberAvailability me-reject() ketika antrean tidak dapat menerima pelanggan atau forceReject=true', async () => {
  await assert.rejects(
    async () => checkBarberAvailability(mockBarber, false),
    /belum dapat menerima antrean/,
  );
  await assert.rejects(
    async () => checkBarberAvailability(mockBarber, true, true),
    /Pemeriksaan ketersediaan belum berhasil/,
  );
});

test('KRITERIA 3: processAvailabilityCheckWithThen menjalankan .then() atau .catch() dan .finally()', async () => {
  let thenCalled = false;
  let catchCalled = false;

  await new Promise<void>((done) => {
    processAvailabilityCheckWithThen(
      mockBarber,
      true,
      false,
      (result: AvailabilityCheckResult) => {
        thenCalled = true;
        assert.equal(result.barberName, 'Kapster 101');
      },
      () => assert.fail('Kapster tersedia tidak boleh masuk ke catch.'),
      () => { assert.ok(thenCalled); done(); },
    );
  });

  await new Promise<void>((done) => {
    processAvailabilityCheckWithThen(
      mockBarber,
      false,
      false,
      () => assert.fail('Pengecekan yang gagal tidak boleh masuk ke then.'),
      (err: Error) => { catchCalled = true; assert.match(err.message, /belum dapat menerima antrean/); },
      () => { assert.ok(catchCalled); done(); },
    );
  });
});

test('KRITERIA 3: demonstrateStaticPromise menjalankan Promise.resolve dan Promise.reject', async () => {
  const resolveResult = await demonstrateStaticPromise(true);
  assert.equal(resolveResult, 'Simulasi proses berhasil.');
  await assert.rejects(async () => demonstrateStaticPromise(false), /Simulasi proses gagal/);
});
