import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useBarbers } from '../BarberContext';
import { useQueue } from '../QueueContext';
import { ActionButton, BrandHeader, Icon, Screen } from '../components';
import {
  demonstrateStaticPromise,
  processAvailabilityCheckWithThen,
} from '../services/barberService';
import { colors, styles as s } from '../styles';
import type { AvailabilityCheckResult, Barber } from '../types';

export default function BarbersScreen() {
  const { barbers, loading, error, source, refreshBarbers } = useBarbers();
  const { queue } = useQueue();
  const [forceReject, setForceReject] = useState(false);
  const [showTesting, setShowTesting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function isBarberServing(barber: Barber) {
    return queue.customers.some((customer) => customer.barberId === barber.id && customer.status === 'in_service');
  }

  function getWaitingCount(barber: Barber) {
    return queue.customers.filter((customer) => customer.barberId === barber.id && customer.status === 'waiting').length;
  }

  /** Memuat ulang profil kapster dari layanan data eksternal. */
  const reloadProfiles = async () => {
    setLastResult(null);
    try {
      const data = await refreshBarbers();
      setLastResult({ type: 'success', text: `Daftar kapster berhasil diperbarui (${data.length} profil).` });
    } catch {
      setLastResult({ type: 'error', text: 'Profil online tidak dapat diperbarui. Daftar cadangan tetap bisa digunakan.' });
    }
  };

  /** Memeriksa apakah kapster dapat menerima pelanggan baru ke daftar tunggu. */
  function handleAvailabilityCheck(barber: Barber) {
    setActionLoadingId(barber.id);
    setLastResult(null);
    processAvailabilityCheckWithThen(
      barber,
      true,
      forceReject,
      (result: AvailabilityCheckResult) => setLastResult({ type: 'success', text: result.message }),
      (err: Error) => setLastResult({ type: 'error', text: err.message }),
      () => setActionLoadingId(null),
    );
  }

  /** Kontrol tambahan untuk menguji respons saat proses berhasil maupun gagal. */
  function testStaticPromise(shouldSucceed: boolean) {
    demonstrateStaticPromise(shouldSucceed)
      .then((message) => setLastResult({ type: 'success', text: message }))
      .catch((err: Error) => setLastResult({ type: 'error', text: err.message }));
  }

  return (
    <Screen>
      <BrandHeader />
      <View style={{ gap: 6 }}>
        <Text style={s.eyebrow}>LAYANAN KAPSTER</Text>
        <Text style={s.title}>Tim kapster</Text>
        <Text style={s.subtitle}>
          Lihat profil kapster dan periksa siapa yang dapat menerima pelanggan berikutnya.
        </Text>
      </View>

      <View style={localStyles.infoCard}>
        <View style={s.row}>
          <Icon name="information-circle-outline" size={20} color={colors.green} />
          <Text style={[s.sectionTitle, { fontSize: 15 }]}>Informasi profil</Text>
        </View>
        <Text style={localStyles.infoText}>
          Nama kapster dan status antrean dikelola oleh aplikasi. Foto serta informasi rambut merupakan data profil referensi, bukan data pegawai atau keahlian profesional yang telah diverifikasi. Daftar cadangan tetap tersedia saat perangkat offline.
        </Text>
      </View>

      {lastResult && (
        <View style={[localStyles.resultBanner, lastResult.type === 'success' ? localStyles.bannerSuccess : localStyles.bannerError]}>
          <Icon name={lastResult.type === 'success' ? 'checkmark-circle' : 'alert-circle'} size={20} color={lastResult.type === 'success' ? colors.green : colors.red} />
          <Text style={[localStyles.bannerText, { color: lastResult.type === 'success' ? colors.green : colors.red }]}>{lastResult.text}</Text>
        </View>
      )}

      <View style={{ gap: 12 }}>
        <View style={s.between}>
          <Text style={s.sectionTitle}>Daftar kapster ({barbers.length})</Text>
          <View style={s.badge}><Text style={s.badgeText}>{source === 'api' ? 'Profil online' : 'Daftar cadangan'}</Text></View>
        </View>
        <ActionButton title={loading ? 'Memperbarui daftar...' : 'Perbarui daftar kapster'} icon="refresh-outline" outline disabled={loading} onPress={reloadProfiles} />
      </View>

      {loading && <View style={{ alignItems: 'center', paddingVertical: 14, gap: 8 }}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={s.subtitle}>Memuat daftar kapster...</Text>
      </View>}

      {!!error && !loading && <View style={[s.note, { backgroundColor: colors.amberBg }]}>
        <Text style={{ color: colors.amber, fontWeight: '700' }}>Menggunakan daftar cadangan</Text>
        <Text style={{ color: colors.ink, fontSize: 12 }}>Profil online tidak dapat dimuat. Fitur antrean tetap dapat digunakan.</Text>
      </View>}

      <View style={{ gap: 12 }}>
        {barbers.map((barber) => {
          const serving = isBarberServing(barber);
          const isActing = actionLoadingId === barber.id;
          const waitingCount = getWaitingCount(barber);
          return <View key={barber.id} style={s.serviceCard}>
            <View style={s.row}>
              {barber.avatar ? <Image source={{ uri: barber.avatar }} style={localStyles.avatar} /> :
                <View style={[localStyles.avatar, localStyles.avatarPlaceholder]}><Icon name="person" size={24} color={colors.muted} /></View>}
              <View style={s.grow}>
                <View style={s.row}>
                  <Text style={[s.customerName, { fontSize: 16 }]}>{barber.name}</Text>
                  <View style={[s.badge, { backgroundColor: serving ? colors.amberBg : colors.pale }]}>
                    <Text style={[s.badgeText, { color: serving ? colors.amber : colors.green }]}>{serving ? 'Sedang melayani' : 'Siap menerima antrean'}</Text>
                  </View>
                </View>
                <Text style={s.customerMeta}>Profil referensi: {barber.profileName}</Text>
                <Text style={[s.smallText, { color: colors.ink, marginTop: 2 }]}>Informasi rambut: <Text style={{ color: colors.muted }}>{barber.hairProfile}</Text></Text>
                <Text style={s.smallText}>{waitingCount} pelanggan menunggu pada kapster ini.</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 }}>
              <Pressable onPress={() => handleAvailabilityCheck(barber)} disabled={isActing}
                style={({ pressed }) => [localStyles.bookButton, isActing && s.disabled, pressed && s.pressed]}>
                {isActing ? <ActivityIndicator size="small" color="white" /> : <>
                  <Icon name="checkmark-circle-outline" size={14} color="white" />
                  <Text style={localStyles.bookButtonText}>Periksa ketersediaan</Text>
                </>}
              </Pressable>
            </View>
          </View>;
        })}
      </View>

      <View style={s.serviceCard}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: showTesting }} onPress={() => setShowTesting((value) => !value)} style={s.between}>
          <View style={s.row}>
            <Icon name="construct-outline" size={19} />
            <Text style={[s.customerName, { fontSize: 15 }]}>Pemeriksaan aplikasi</Text>
          </View>
          <Icon name={showTesting ? 'chevron-up-outline' : 'chevron-down-outline'} color={colors.muted} />
        </Pressable>
        {showTesting && <View style={{ gap: 11, paddingTop: 5 }}>
          <Text style={s.smallText}>Kontrol ini digunakan untuk memastikan aplikasi menangani proses yang berhasil maupun kondisi gagal dengan benar.</Text>
          <View style={s.between}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: colors.ink }}>Paksa pemeriksaan gagal</Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>Aktifkan untuk mencoba pesan ketika pemeriksaan tidak berhasil.</Text>
            </View>
            <Switch value={forceReject} onValueChange={setForceReject} trackColor={{ false: colors.border, true: colors.mint }} thumbColor={forceReject ? colors.green : '#f4f3f4'} />
          </View>
          <View style={[s.row, { gap: 8 }]}>
            <Pressable onPress={() => testStaticPromise(true)} style={({ pressed }) => [localStyles.miniButton, pressed && s.pressed]}>
              <Text style={localStyles.miniButtonText}>Uji proses berhasil</Text>
            </Pressable>
            <Pressable onPress={() => testStaticPromise(false)} style={({ pressed }) => [localStyles.miniButton, { borderColor: colors.red }, pressed && s.pressed]}>
              <Text style={[localStyles.miniButtonText, { color: colors.red }]}>Uji proses gagal</Text>
            </Pressable>
          </View>
        </View>}
      </View>
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  infoCard: { backgroundColor: colors.pale, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, gap: 8 },
  infoText: { color: colors.ink, fontSize: 12, lineHeight: 18 },
  resultBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  bannerSuccess: { backgroundColor: colors.pale, borderColor: colors.green },
  bannerError: { backgroundColor: colors.redBg, borderColor: colors.red },
  bannerText: { flex: 1, fontSize: 12, fontWeight: '600', lineHeight: 17 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.pale },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  bookButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.green, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  bookButtonText: { color: 'white', fontSize: 12, fontWeight: '700' },
  miniButton: { flex: 1, borderWidth: 1, borderColor: colors.green, borderRadius: 8, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  miniButtonText: { fontSize: 11, fontWeight: '700', color: colors.green },
});
