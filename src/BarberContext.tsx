import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { fetchBarbersFromApi, getFallbackBarbers } from './services/barberService';
import type { Barber } from './types';

interface BarberContextValue {
  barbers: Barber[];
  loading: boolean;
  error: string | null;
  source: 'api' | 'local';
  refreshBarbers: () => Promise<Barber[]>;
}

const BarberContext = createContext<BarberContextValue | null>(null);

/** Memuat profil API di latar belakang; roster lokal tetap tersedia saat offline. */
export function BarberProvider({ children }: PropsWithChildren) {
  const [barbers, setBarbers] = useState<Barber[]>(getFallbackBarbers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local'>('local');

  const refreshBarbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBarbersFromApi();
      setBarbers(result);
      setSource('api');
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Tidak dapat memuat profil dari API.';
      setBarbers(getFallbackBarbers());
      setSource('local');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchBarbersFromApi()
      .then((result) => {
        if (mounted) {
          setBarbers(result);
          setSource('api');
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Tidak dapat memuat profil dari API.';
          setBarbers(getFallbackBarbers());
          setSource('local');
          setError(message);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <BarberContext.Provider value={{ barbers, loading, error, source, refreshBarbers }}>
      {children}
    </BarberContext.Provider>
  );
}

export function useBarbers() {
  const context = useContext(BarberContext);
  if (!context) throw new Error('useBarbers harus berada di dalam BarberProvider.');
  return context;
}
