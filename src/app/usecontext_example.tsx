import { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { BrandHeader, Screen } from '../components';
import { colors, styles as s } from '../styles';

/** Codelab 1: tema dibagikan dari Home -> Profile -> UserCard melalui Context. */
type ThemeValue = { darkMode: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeValue | null>(null);

function UserCard() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('UserCard harus berada di dalam ThemeContext.Provider');
  const { darkMode, toggleTheme } = theme;
  return <View style={{ padding: 20, borderRadius: 16, backgroundColor: darkMode ? '#182D28' : 'white', gap: 14 }}>
    <Text style={{ color: darkMode ? 'white' : colors.ink, fontSize: 20, fontWeight: '700' }}>Halo, Pengguna AntreCukur!</Text>
    <Text style={{ color: darkMode ? '#CDEAAB' : colors.muted }}>Mode aktif: {darkMode ? 'Gelap' : 'Terang'}</Text>
    <Pressable accessibilityRole="button" onPress={toggleTheme} style={{ padding: 13, borderRadius: 12, backgroundColor: darkMode ? colors.mint : colors.green }}>
      <Text style={{ textAlign: 'center', color: darkMode ? colors.green : 'white', fontWeight: '700' }}>Ganti Tema</Text>
    </Pressable>
  </View>;
}

function Profile() { return <UserCard />; }
function Home() { return <Profile />; }

export default function UseContextExample() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  return <Screen>
    <BrandHeader />
    <Text style={s.eyebrow}>CODELAB 1 · USECONTEXT</Text>
    <Text style={s.title}>Tema untuk semua komponen</Text>
    <Text style={s.subtitle}>useState mengubah nilai tema; useContext mengaksesnya di komponen UserCard tanpa prop drilling.</Text>
    <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode((old) => !old) }}>
      <Home />
    </ThemeContext.Provider>
    <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
      <Text style={{ color: colors.green, fontWeight: '700', textAlign: 'center', padding: 12 }}>← Kembali</Text>
    </Pressable>
  </Screen>;
}
