import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components';
import { colors } from '../../styles';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 63 + Math.max(insets.bottom, 9), paddingTop: 7, paddingBottom: Math.max(insets.bottom, 9) },
    tabBarHideOnKeyboard: true,
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    sceneStyle: { backgroundColor: colors.background },
  }}>
    <Tabs.Screen name="index" options={{ title: 'Antrean', tabBarIcon: ({ color }) => <Icon name="people-outline" color={color} size={22} /> }} />
    <Tabs.Screen name="riwayat" options={{ title: 'Riwayat', tabBarIcon: ({ color }) => <Icon name="receipt-outline" color={color} size={22} /> }} />
    <Tabs.Screen name="layanan" options={{ title: 'Layanan', tabBarIcon: ({ color }) => <Icon name="cut-outline" color={color} size={22} /> }} />
  </Tabs>;
}
