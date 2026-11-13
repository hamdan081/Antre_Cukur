import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoState, createEmptyState } from '../src/data';
import {
  addCustomer,
  callNextCustomer,
  cancelWaitingCustomer,
  filterCustomers,
  finishCurrentCustomer,
  formatTicket,
  getCurrentCustomer,
  getEstimatedWaitMinutes,
  getQueueSummary,
  restoreQueueState,
} from '../src/queue';
import type { QueueActionResult, QueueState } from '../src/types';

const NOW = Date.UTC(2026, 9, 8, 6, 0);

function successState(result: QueueActionResult): QueueState {
  if (!result.ok) throw new Error(result.error);
  assert.equal(result.ok, true);
  return result.state;
}

test('data contoh membagi antrean ke beberapa kapster dan menghitung estimasi per kapster', () => {
  const state = createDemoState(NOW);
  const summary = getQueueSummary(state, NOW);
  assert.equal(summary.total, 7);
  assert.equal(summary.waiting, 5);
  assert.equal(summary.inService, 1);
  assert.equal(summary.completed, 1);
  assert.equal(summary.cancelled, 0);
  assert.equal(summary.estimatedQueueMinutes, 45);
  assert.equal(getCurrentCustomer(state, 1)?.name, 'Andi');
  assert.equal(getCurrentCustomer(state, 2), null);
  assert.equal(summary.nextCustomer?.name, 'Budi');
  assert.equal(getEstimatedWaitMinutes(state, 'antre-3', NOW), 15);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-4', NOW), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-5', NOW), 20);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-6', NOW), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-2', NOW), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-1', NOW), null);
});

test('penambahan memvalidasi nama, layanan, kapster dan tidak mengubah state awal', () => {
  const state = createEmptyState();
  const result = addCustomer(state, '  Agus   Setiawan  ', 'cuci', 2, 'Kapster 2', NOW);
  const newState = successState(result);
  assert.equal(newState.customers[0].name, 'Agus Setiawan');
  assert.equal(newState.customers[0].barberId, 2);
  assert.equal(newState.customers[0].barberName, 'Kapster 2');
  assert.equal(newState.customers[0].id, 'antre-1');
  assert.equal(newState.nextTicket, 2);
  assert.equal(state.customers.length, 0);
  assert.equal(addCustomer(state, '   ', 'potong', 1, 'Kapster 1', NOW).ok, false);
  assert.equal(addCustomer(state, 'a'.repeat(41), 'potong', 1, 'Kapster 1', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'invalid', 1, 'Kapster 1', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'potong', 0, 'Kapster 0', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'potong', 1, '', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'potong', 1, 'Kapster 1', Number.NaN).ok, false);
});

test('nomor yang dibatalkan tidak dipakai lagi dan pelanggan aktif tidak dapat dibatalkan', () => {
  let state = createEmptyState();
  state = successState(addCustomer(state, 'Agus', 'potong', 1, 'Kapster 1', NOW));
  state = successState(cancelWaitingCustomer(state, 'antre-1', NOW));
  state = successState(addCustomer(state, 'Bayu', 'cuci', 2, 'Kapster 2', NOW));
  assert.equal(state.customers[1].ticketNumber, 2);
  assert.equal(state.nextTicket, 3);
  state = successState(callNextCustomer(state, 2, NOW));
  assert.equal(cancelWaitingCustomer(state, 'antre-2', NOW).ok, false);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-1', NOW), null);
});

test('setiap kapster dapat melayani satu pelanggan secara bersamaan, tetapi tidak dua pelanggan pada kapster yang sama', () => {
  let state = createEmptyState();
  state = successState(addCustomer(state, 'Agus', 'potong', 1, 'Kapster 1', NOW));
  state = successState(addCustomer(state, 'Bayu', 'cuci', 1, 'Kapster 1', NOW));
  state = successState(addCustomer(state, 'Citra', 'combo', 2, 'Kapster 2', NOW));
  state = successState(callNextCustomer(state, 1, NOW + 1_000));
  state = successState(callNextCustomer(state, 2, NOW + 1_000));
  assert.equal(getCurrentCustomer(state, 1)?.name, 'Agus');
  assert.equal(getCurrentCustomer(state, 2)?.name, 'Citra');
  assert.equal(callNextCustomer(state, 1, NOW + 2_000).ok, false);
  assert.equal(getQueueSummary(state, NOW).inService, 2);
  state = successState(finishCurrentCustomer(state, 1, NOW + 25 * 60_000));
  state = successState(callNextCustomer(state, 1, NOW + 25 * 60_000));
  assert.equal(getCurrentCustomer(state, 1)?.name, 'Bayu');
});

test('pemanggilan selalu mengikuti nomor antrean terkecil milik kapster yang dipilih', () => {
  const demo = createDemoState(NOW);
  const reversed = { ...demo, customers: [...demo.customers].reverse() };
  assert.equal(callNextCustomer(reversed, 1, NOW).ok, false);
  const finished = successState(finishCurrentCustomer(reversed, 1, NOW + 10 * 60_000));
  const next = callNextCustomer(finished, 1, NOW + 10 * 60_000);
  if (!next.ok) throw new Error(next.error);
  assert.equal(next.customer.ticketNumber, 3);
  assert.deepEqual(filterCustomers(reversed, 'waiting').map((item) => item.ticketNumber), [3, 4, 5, 6, 7]);
});

test('alur tambah-panggil-selesai memberikan status dan waktu yang benar', () => {
  let state = successState(addCustomer(createEmptyState(), 'Agus', 'combo', 2, 'Kapster 2', NOW));
  state = successState(callNextCustomer(state, 2, NOW + 60_000));
  assert.equal(state.customers[0].startedAt, NOW + 60_000);
  state = successState(finishCurrentCustomer(state, 2, NOW + 31 * 60_000));
  assert.equal(state.customers[0].status, 'completed');
  assert.equal(state.customers[0].completedAt, NOW + 31 * 60_000);
  assert.equal(callNextCustomer(state, 2, NOW).ok, false);
  assert.equal(finishCurrentCustomer(state, 2, NOW).ok, false);
});

test('estimasi tidak negatif ketika layanan aktif melewati estimasi durasi', () => {
  const state = createDemoState(NOW);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-3', NOW + 60 * 60_000), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-4', NOW + 60 * 60_000), 0);
  assert.equal(getQueueSummary(state, NOW + 60 * 60_000).estimatedQueueMinutes, 40);
});

test('pemulihan menerima data baru, memigrasikan data versi lama, dan menolak status/waktu yang rusak', () => {
  const state = createDemoState(NOW);
  assert.deepEqual(restoreQueueState(JSON.parse(JSON.stringify(state))), state);
  assert.deepEqual(restoreQueueState(createEmptyState()), createEmptyState());
  assert.equal(restoreQueueState(null), null);
  assert.equal(restoreQueueState({ ...state, nextTicket: 5 }), null);
  assert.equal(restoreQueueState({ ...state, customers: [...state.customers, state.customers[0]] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[2], serviceId: 'wrong' }] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[2], name: '' }] }), null);
  const twoActiveBarbers = { ...state, customers: [
    { ...state.customers[2], status: 'in_service' as const, startedAt: NOW },
    { ...state.customers[3], status: 'in_service' as const, startedAt: NOW },
  ] };
  assert.ok(restoreQueueState(twoActiveBarbers), 'Kapster yang berbeda boleh melayani bersamaan.');
  assert.equal(restoreQueueState({ ...twoActiveBarbers, customers: [
    twoActiveBarbers.customers[0], { ...twoActiveBarbers.customers[1], barberId: 1, barberName: 'Kapster 1' },
  ] }), null, 'Satu kapster tidak boleh memiliki dua pelanggan aktif.');
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[0], completedAt: state.customers[0].createdAt - 1 }] }), null);

  const legacy = {
    nextTicket: 2,
    customers: [{
      id: 'antre-1', ticketNumber: 1, name: 'Legacy', serviceId: 'potong', status: 'waiting', createdAt: NOW,
    }],
  };
  const migrated = restoreQueueState(legacy);
  assert.equal(migrated?.customers[0].barberId, 1);
  assert.equal(migrated?.customers[0].barberName, 'Kapster 1');
});

test('label nomor tetap bertambah saat melewati tiga digit', () => {
  assert.equal(formatTicket(1), 'A-001');
  assert.equal(formatTicket(1000), 'A-1000');
});
