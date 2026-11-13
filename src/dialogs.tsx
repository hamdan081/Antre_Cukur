import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useBarbers } from './BarberContext';
import { SERVICES } from './data';
import { addCustomer, formatTicket, getQueueSummary } from './queue';
import { useQueue } from './QueueContext';
import { ActionButton, formatRupiah, Icon } from './components';
import { colors, styles as s } from './styles';
import type { ServiceId } from './types';

export function AddCustomerDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { queue, runAction, ready } = useQueue();
  const { barbers, source } = useBarbers();
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState<ServiceId>('potong');
  const [barberId, setBarberId] = useState<number>(1);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (visible) submitting.current = false;
  }, [visible]);

  const selectedBarber = barbers.find((barber) => barber.id === barberId) ?? barbers[0];

  function submit() {
    if (submitting.current) return;
    if (!selectedBarber) { setError('Daftar kapster belum tersedia.'); return; }
    submitting.current = true;
    const result = runAction(
      (state) => addCustomer(state, name, serviceId, selectedBarber.id, selectedBarber.name),
      `Pelanggan masuk antrean ${formatTicket(queue.nextTicket)} untuk ${selectedBarber.name}.`,
    );
    if (!result) { submitting.current = false; return; }
    if (!result.ok) { submitting.current = false; setError(result.error); return; }
    Keyboard.dismiss();
    setName(''); setError(''); setServiceId('potong'); setBarberId(barbers[0]?.id ?? 1); onClose();
  }

  function close() { setName(''); setError(''); setServiceId('potong'); onClose(); }

  return <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
    <KeyboardAvoidingView style={s.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={s.modalCard} accessibilityViewIsModal>
        <View style={s.between}>
          <View style={s.grow}><Text style={s.modalTitle}>Tambah pelanggan</Text><Text style={s.subtitle}>Pilih layanan dan kapster agar antrean terarah.</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup formulir" onPress={close} style={s.close}><Icon name="close" /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 18 }}>
          <View>
            <Text style={s.label}>Nama pelanggan</Text>
            <TextInput accessibilityLabel="Nama pelanggan" placeholder="Contoh: Raka" placeholderTextColor={colors.muted} value={name} onChangeText={(text) => { setName(text); setError(''); }}
              maxLength={40} autoCapitalize="words" returnKeyType="done" onSubmitEditing={submit} style={[s.input, !!error && s.inputError]} />
            {!!error && <Text style={s.errorText} accessibilityLiveRegion="polite">{error}</Text>}
          </View>

          <View>
            <Text style={s.label}>Pilih layanan</Text>
            <View style={{ gap: 9 }}>
              {SERVICES.map((service) => <Pressable key={service.id} accessibilityRole="radio" accessibilityLabel={service.name} accessibilityState={{ checked: serviceId === service.id }}
                onPress={() => setServiceId(service.id)} style={[s.serviceOption, serviceId === service.id && s.serviceSelected]}>
                <View style={[s.radio, serviceId === service.id && { borderColor: colors.green }]}>{serviceId === service.id && <View style={s.radioDot} />}</View>
                <View style={s.grow}><Text style={s.customerName}>{service.name}</Text><Text style={s.customerMeta}>{service.durationMinutes} menit</Text></View>
                <Text style={s.amount}>{formatRupiah(service.price)}</Text>
              </Pressable>)}
            </View>
          </View>

          <View>
            <View style={s.between}>
              <Text style={s.label}>Pilih kapster</Text>
              <Text style={s.smallText}>{source === 'api' ? 'Profil online' : 'Daftar cadangan'}</Text>
            </View>
            <View style={{ gap: 8 }}>
              {barbers.map((barber) => {
                const isSelected = barberId === barber.id;
                const active = queue.customers.some((customer) => customer.barberId === barber.id && customer.status === 'in_service');
                const waiting = queue.customers.filter((customer) => customer.barberId === barber.id && customer.status === 'waiting').length;
                return <Pressable key={barber.id} accessibilityRole="radio" accessibilityLabel={barber.name} accessibilityState={{ checked: isSelected }}
                  onPress={() => { setBarberId(barber.id); setError(''); }} style={[s.serviceOption, isSelected && s.serviceSelected]}>
                  <View style={[s.radio, isSelected && { borderColor: colors.green }]}>{isSelected && <View style={s.radioDot} />}</View>
                  <View style={s.grow}>
                    <Text style={s.customerName}>{barber.name}</Text>
                    <Text style={s.customerMeta}>{waiting} menunggu · {active ? 'sedang melayani' : 'siap menerima antrean'}</Text>
                  </View>
                  {active && <View style={[s.badge, { backgroundColor: colors.amberBg }]}><Text style={[s.badgeText, { color: colors.amber }]}>Aktif</Text></View>}
                </Pressable>;
              })}
            </View>
            <Text style={[s.smallText, { marginTop: 7 }]}>
              {source === 'api'
                ? 'Informasi profil merupakan data referensi, bukan data pegawai yang terverifikasi. Ketersediaan dihitung dari antrean pada perangkat.'
                : 'Koneksi internet tidak tersedia; daftar cadangan digunakan agar pendaftaran antrean tetap berjalan.'}
            </Text>
          </View>

          <View style={s.formNote}>
            <Icon name="ticket-outline" size={18} />
            <View style={s.grow}>
              <Text style={[s.label, { marginBottom: 3 }]}>Nomor {formatTicket(queue.nextTicket)}</Text>
              <Text style={s.smallText}>{getQueueSummary(queue).waiting} pelanggan sedang menunggu secara keseluruhan.</Text>
              {selectedBarber && <Text style={s.smallText}>Kapster tujuan: {selectedBarber.name}.</Text>}
            </View>
          </View>
          <ActionButton title="Masukkan antrean" icon="add-circle-outline" onPress={submit} disabled={!ready || !selectedBarber} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

export function ConfirmDialog({ visible, title, text, confirmTitle, onConfirm, onClose }: {
  visible: boolean; title: string; text: string; confirmTitle: string; onConfirm: () => void; onClose: () => void;
}) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.modalBackdrop}><View style={s.modalCard} accessibilityViewIsModal>
      <View style={s.between}><Text style={[s.modalTitle, s.grow]}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Tutup konfirmasi" style={s.close} onPress={onClose}><Icon name="close" /></Pressable></View>
      <Text style={s.subtitle}>{text}</Text>
      <ActionButton title={confirmTitle} onPress={onConfirm} />
      <ActionButton title="Kembali" outline onPress={onClose} />
    </View></View>
  </Modal>;
}
