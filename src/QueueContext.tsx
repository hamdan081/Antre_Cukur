import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { createDemoState, createEmptyState } from './data';
import { loadQueue, saveQueue } from './storage';
import type { QueueActionResult, QueueState } from './types';

interface QueueContextValue {
  queue: QueueState;
  ready: boolean;
  storageError: boolean;
  notice: string;
  runAction: (action: (state: QueueState) => QueueActionResult, successMessage: string) => QueueActionResult | null;
  resetQueue: (mode: 'demo' | 'empty') => void;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: PropsWithChildren) {
  const [queue, setQueue] = useState<QueueState>(createDemoState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState('');
  const stateRef = useRef(queue);
  const writeChain = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    loadQueue().then(async (saved) => {
      if (!mounted) return;
      if (saved) { stateRef.current = saved; setQueue(saved); }
      else {
        try { await saveQueue(stateRef.current); }
        catch { if (mounted) { setStorageError(true); setNotice('Data contoh belum tersimpan di perangkat.'); } }
      }
    }).catch(() => {
      if (mounted) { setStorageError(true); setNotice('Data tersimpan gagal dibaca. Data contoh ditampilkan.'); }
    }).finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timeout);
  }, [notice]);

  function commit(nextState: QueueState) {
    stateRef.current = nextState;
    setQueue(nextState);
    // Tulisan diselesaikan berurutan agar perubahan cepat tidak saling menimpa.
    writeChain.current = writeChain.current.then(() => saveQueue(nextState)).then(() => {
      setStorageError(false);
    }).catch(() => {
      setStorageError(true);
      setNotice('Perubahan belum tersimpan. Coba lagi setelah penyimpanan tersedia.');
    });
  }

  function runAction(action: (state: QueueState) => QueueActionResult, successMessage: string) {
    if (!ready) return null;
    const result = action(stateRef.current);
    if (result.ok) { commit(result.state); setNotice(successMessage); }
    else setNotice(result.error);
    return result;
  }

  function resetQueue(mode: 'demo' | 'empty') {
    if (!ready) return;
    commit(mode === 'demo' ? createDemoState() : createEmptyState());
    setNotice(mode === 'demo' ? 'Lima pelanggan contoh berhasil dimuat.' : 'Antrean baru siap. Nomor dimulai dari A-001.');
  }

  return <QueueContext.Provider value={{ queue, ready, storageError, notice, runAction, resetQueue }}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue harus berada di dalam QueueProvider.');
  return context;
}
