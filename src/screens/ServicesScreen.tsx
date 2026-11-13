import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ActionButton, BrandHeader, formatRupiah, Icon, Screen } from '../components';
import { ConfirmDialog } from '../dialogs';
import { SERVICES } from '../data';
import { useQueue } from '../QueueContext';
import { colors, styles as s } from '../styles';

export default function ServicesScreen() {
  const router = useRouter();
  const { resetQueue } = useQueue();
  const [resetMode, setResetMode] = useState<'demo' | 'empty' | null>(null);
  const [showTesting, setShowTesting] = useState(false);

  return <Screen>
    <BrandHeader />
    <View style={{ gap: 6 }}>
      <Text style={s.eyebrow}>PILIHAN PERAWATAN</Text>
      <Text style={s.title}>Rapi dari kepala.{"\n"}Ringkas di antrean.</Text>
      <Text style={s.subtitle}>Tiga layanan untuk tampilan yang lebih segar.</Text>
    </View>

    {SERVICES.map((service) => <View key={service.id} style={s.serviceCard}>
      <View style={s.row}>
        <View style={s.serviceIcon}>
          <Icon name={service.id === 'cuci' ? 'water-outline' : service.id === 'combo' ? 'sparkles-outline' : 'cut-outline'} size={25} />
        </View>
        <View style={s.grow}>
          <Text style={[s.customerName, { fontSize: 17 }]}>{service.name}</Text>
          <Text style={s.customerMeta}>{service.id === 'potong' ? 'Potongan rapi sesuai gaya pilihan.' : service.id === 'cuci' ? 'Bersih, segar, dan siap beraktivitas.' : 'Potong rambut dan cuci dalam satu giliran.'}</Text>
        </View>
      </View>
      <View style={[s.between, { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }]}>
        <Text style={[s.amount, { fontSize: 20 }]}>{formatRupiah(service.price)}</Text>
        <View style={s.row}><Icon name="time-outline" size={15} color={colors.muted} /><Text style={s.smallText}>± {service.durationMinutes} menit</Text></View>
      </View>
    </View>)}

    <View style={s.note}>
      <View style={s.row}>
        <Icon name="information-circle-outline" />
        <Text style={s.noteText}>Setiap kapster melayani satu pelanggan pada satu waktu. Antrean dan perkiraan waktu dihitung untuk masing-masing kapster.</Text>
      </View>
    </View>

    <View style={{ gap: 12, marginTop: 5 }}>
      <Text style={s.sectionTitle}>Tim kapster</Text>
      <Text style={s.subtitle}>Lihat profil kapster dan periksa ketersediaannya sebelum pelanggan dimasukkan ke antrean.</Text>
      <ActionButton title="Lihat daftar kapster" icon="people-outline" onPress={() => router.push('/barbers')} />
    </View>

    <View style={{ gap: 12, marginTop: 5 }}>
      <Text style={s.sectionTitle}>Pengaturan antrean</Text>
      <Text style={s.subtitle}>Mulai hari baru untuk mengosongkan antrean dan menyiapkan pencatatan dari awal.</Text>
      <ActionButton title="Mulai hari baru" icon="refresh-outline" outline onPress={() => setResetMode('empty')} />
    </View>

    <View style={{ gap: 12, marginTop: 5 }}>
      <Text style={s.sectionTitle}>Preferensi & bantuan</Text>
      <Text style={s.subtitle}>Atur pratinjau tampilan dan lihat panduan singkat penggunaan AntreCukur.</Text>
      <ActionButton title="Pratinjau tampilan" icon="color-palette-outline" outline onPress={() => router.push('/usecontext_example')} />
      <ActionButton title="Panduan penggunaan" icon="book-outline" outline onPress={() => router.push('/docs')} />
    </View>

    <View style={s.serviceCard}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: showTesting }} onPress={() => setShowTesting((value) => !value)} style={s.between}>
        <View style={s.row}>
          <Icon name="construct-outline" size={19} />
          <Text style={[s.customerName, { fontSize: 15 }]}>Pemeriksaan aplikasi</Text>
        </View>
        <Icon name={showTesting ? 'chevron-up-outline' : 'chevron-down-outline'} color={colors.muted} />
      </Pressable>
      {showTesting && <View style={{ gap: 10, paddingTop: 5 }}>
        <Text style={s.smallText}>Gunakan data contoh untuk mencoba alur antrean tanpa memasukkan data pelanggan sungguhan.</Text>
        <ActionButton title="Isi antrean dengan data contoh" icon="people-outline" outline onPress={() => setResetMode('demo')} />
      </View>}
    </View>

    <ConfirmDialog visible={resetMode !== null}
      title={resetMode === 'demo' ? 'Isi antrean dengan data contoh?' : 'Mulai hari baru?'}
      text={resetMode === 'demo'
        ? 'Data antrean dan riwayat saat ini akan diganti dengan tujuh pelanggan contoh. Gunakan pilihan ini hanya untuk mencoba alur aplikasi.'
        : 'Seluruh antrean dan riwayat yang tersimpan di perangkat ini akan dihapus. Nomor antrean dimulai kembali dari A-001.'}
      confirmTitle={resetMode === 'demo' ? 'Gunakan data contoh' : 'Ya, mulai hari baru'}
      onClose={() => setResetMode(null)}
      onConfirm={() => { if (resetMode) resetQueue(resetMode); setResetMode(null); }} />
  </Screen>;
}
