import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, Screen } from '../../components';
import { colors, styles as s } from '../../styles';

/** 2: halaman indeks membuka path docs bertingkat dengan router.push. */
export default function DocsIndex() {
  const router = useRouter();
  return <Screen>
    <BrandHeader />
    <Text style={s.eyebrow}>CODELAB 2 · CATCH-ALL ROUTE</Text>
    <Text style={s.title}>Dokumentasi AntreCukur</Text>
    <Text style={s.subtitle}>Pilih materi. Semua alamat /docs/... dibaca melalui satu file [...slug].tsx.</Text>
    <View style={{ gap: 12 }}>
      <ActionButton title="State · useState" icon="layers-outline" onPress={() => router.push('/docs/react/state')} />
      <ActionButton title="Hooks · useEffect" icon="time-outline" outline onPress={() => router.push('/docs/react/hooks')} />
      <ActionButton title="Routing · Dynamic Route" icon="git-branch-outline" outline onPress={() => router.push('/docs/routing/dynamic')} />
      <ActionButton title="Routing · Stack" icon="albums-outline" outline onPress={() => router.push('/docs/routing/stack')} />
    </View>
    <View style={s.note}><Text style={[s.noteText, { color: colors.green }]}>Contoh: /docs/react/state dan /docs/routing/dynamic memakai halaman yang sama, tetapi kontennya berbeda.</Text></View>
    <ActionButton title="Kembali" icon="arrow-back-outline" outline onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
  </Screen>;
}
