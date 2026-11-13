import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, Screen } from '../../components';
import { colors, styles as s } from '../../styles';

/** Codelab 2: halaman indeks membuka path docs bertingkat dengan router.push. */
export default function DocsIndex() {
  const router = useRouter();
  return <Screen>
    <BrandHeader />
    <Text style={s.eyebrow}>PUSAT BANTUAN</Text>
    <Text style={s.title}>Panduan AntreCukur</Text>
    <Text style={s.subtitle}>Temukan cara mengelola antrean, memahami status pelayanan, dan menggunakan menu aplikasi.</Text>
    <View style={{ gap: 12 }}>
      <ActionButton title="Mengelola antrean" icon="people-outline" onPress={() => router.push('/docs/queue/manage')} />
      <ActionButton title="Status pelayanan" icon="time-outline" outline onPress={() => router.push('/docs/queue/status')} />
      <ActionButton title="Navigasi aplikasi" icon="git-branch-outline" outline onPress={() => router.push('/docs/app/navigation')} />
      <ActionButton title="Penyimpanan data" icon="phone-portrait-outline" outline onPress={() => router.push('/docs/app/storage')} />
    </View>
    <View style={s.note}><Text style={[s.noteText, { color: colors.green }]}>Data antrean disimpan di perangkat ini. Pastikan perangkat yang digunakan tetap aman dan dapat diakses petugas.</Text></View>
    <ActionButton title="Kembali" icon="arrow-back-outline" outline onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
  </Screen>;
}
