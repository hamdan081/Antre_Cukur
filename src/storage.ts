import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreQueueState } from './queue';
import type { QueueState } from './types';

const STORAGE_KEY = '@antrecukur/queue-v1';

export async function loadQueue(): Promise<QueueState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  const saved = JSON.parse(raw) as { version?: number; state?: unknown };
  const restored = saved.version === 1 ? restoreQueueState(saved.state) : null;
  if (!restored) throw new Error('Data antrean tersimpan tidak valid.');
  return restored;
}

export async function saveQueue(state: QueueState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));
}
