import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { useSmartPower } from '../context/SmartPowerContext';
import { Colors } from '../theme/colors';
import { DiscoveredBleDevice } from '../types';

const BLE_NEARBY_POOL: DiscoveredBleDevice[] = [
  {
    id: 'sp-esp32-dual',
    name: 'SmartPower ESP32 Dual',
    model: 'SP-SW2-BLE',
    type: 'SWITCH',
    bleMac: 'E4:65:B8:F2:ED:08',
    rssi: -45,
    suggestedRoom: 'Salon',
    estimatedWatts: 160
  },
  {
    id: 'sp-pow-elite-ble',
    name: 'Sonoff POW Élite BLE',
    model: 'SP-POW-16',
    type: 'BREAKER',
    bleMac: '30:AE:A4:PO:W1:16',
    rssi: -52,
    suggestedRoom: 'Salon',
    estimatedWatts: 1850
  },
  {
    id: 'sp-switch-ble',
    name: 'Interrupteur SP-SW1',
    model: 'SP-SW1',
    type: 'SWITCH',
    bleMac: '24:0A:C4:76:F3:FC',
    rssi: -61,
    suggestedRoom: 'Chambre',
    estimatedWatts: 90
  },
  {
    id: 'sp-plug-s31-ble',
    name: 'Prise Intelligente S31',
    model: 'SP-PLUG-10',
    type: 'PLUG',
    bleMac: 'A0:20:A6:S3:1B:ED',
    rssi: -68,
    suggestedRoom: 'Bureau',
    estimatedWatts: 75
  },
  {
    id: 'sp-dualr3-ble',
    name: 'Sonoff DualR3 Volets BLE',
    model: 'SP-DUAL-R3',
    type: 'SWITCH',
    bleMac: 'B8:F0:09:A1:22:90',
    rssi: -74,
    suggestedRoom: 'Cuisine',
    estimatedWatts: 250
  }
];

const ROOMS = ['Salon', 'Chambre', 'Cuisine', 'Bureau', 'Jardin'];

interface AddDeviceModalProps {
  visible?: boolean;
  onClose?: () => void;
  onAddDevice?: (name: string, room: string, watts?: number) => Promise<boolean> | void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible: propVisible,
  onClose: propOnClose,
  onAddDevice: propOnAddDevice
}) => {
  const { addDeviceModalVisible, setAddDeviceModalVisible, addBleDevice, devices } = useSmartPower();
  const isVisible = propVisible !== undefined ? propVisible : addDeviceModalVisible;
  const handleClose = propOnClose ? propOnClose : () => handleClose();

  const [activeTab, setActiveTab] = useState<'BLE' | 'MANUAL'>('BLE');
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredBleDevice[]>([]);
  const [selectedBle, setSelectedBle] = useState<DiscoveredBleDevice | null>(null);

  const [deviceName, setDeviceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('Salon');
  const [deviceType, setDeviceType] = useState('switch');
  const [isPairing, setIsPairing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Radar animation
  const radarAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      radarAnim.setValue(0);
    }
  }, [isScanning, radarAnim]);

  // Start BLE Scan when modal opens
  useEffect(() => {
    if (addDeviceModalVisible && activeTab === 'BLE') {
      startBleScan();
    }
  }, [addDeviceModalVisible, activeTab]);

  const startBleScan = () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    setSelectedBle(null);
    setSuccessMessage('');

    // Filter out already added devices
    const existingIds = new Set(devices.map(d => d.id));
    const available = BLE_NEARBY_POOL.filter(d => !existingIds.has(d.id));

    // Stagger device discovery
    setTimeout(() => {
      if (available.length > 0) setDiscoveredDevices(prev => [...prev, available[0]]);
    }, 600);

    setTimeout(() => {
      if (available.length > 1) setDiscoveredDevices(prev => [...prev, available[1]]);
    }, 1400);

    setTimeout(() => {
      if (available.length > 2) setDiscoveredDevices(prev => [...prev, ...available.slice(2)]);
      setIsScanning(false);
    }, 2400);
  };

  const handleSelectBle = (dev: DiscoveredBleDevice) => {
    setSelectedBle(dev);
    setDeviceName(dev.name);
    setSelectedRoom(dev.suggestedRoom || 'Salon');
    setDeviceType(dev.type.toLowerCase());
  };

  const handlePairAndSync = async () => {
    if (!deviceName.trim()) return;
    setIsPairing(true);
    setSuccessMessage('');

    try {
      if (selectedBle) {
        await addBleDevice(selectedBle, deviceName, selectedRoom);
      } else {
        const dummyBle: DiscoveredBleDevice = {
          id: 'sp-' + Date.now().toString(36),
          name: deviceName,
          model: 'SP-SW1',
          type: deviceType.toUpperCase(),
          bleMac: `E4:65:B8:${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
          rssi: -50,
          suggestedRoom: selectedRoom,
          estimatedWatts: 120
        };
        await addBleDevice(dummyBle, deviceName, selectedRoom);
      }

      setSuccessMessage('🎉 Appareil BLE synchronisé dans la base de données !');
      setTimeout(() => {
        setIsPairing(false);
        setSuccessMessage('');
        setSelectedBle(null);
        setDeviceName('');
        handleClose();
      }, 1200);
    } catch (err) {
      setIsPairing(false);
    }
  };

  const radarScale = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.2]
  });

  const radarOpacity = radarAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.3, 0]
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerIcon}>📡</Text>
              <Text style={styles.title}>Ajouter un équipement</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Mode Switcher */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'BLE' && styles.tabBtnActive]}
              onPress={() => setActiveTab('BLE')}
            >
              <Text style={[styles.tabText, activeTab === 'BLE' && styles.tabTextActive]}>
                🔵 Recherche Bluetooth (BLE)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'MANUAL' && styles.tabBtnActive]}
              onPress={() => setActiveTab('MANUAL')}
            >
              <Text style={[styles.tabText, activeTab === 'MANUAL' && styles.tabTextActive]}>
                ✏️ Manuel
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {activeTab === 'BLE' && (
              <View>
                {/* Radar Scan Banner */}
                <View style={styles.radarCard}>
                  <View style={styles.radarWrap}>
                    <Animated.View
                      style={[
                        styles.radarRing,
                        {
                          transform: [{ scale: radarScale }],
                          opacity: radarOpacity
                        }
                      ]}
                    />
                    <View style={styles.radarCenter}>
                      <Text style={{ fontSize: 22 }}>📶</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.radarStatusText}>
                      {isScanning ? 'Scan Bluetooth actif...' : 'Recherche terminée'}
                    </Text>
                    <Text style={styles.radarSubText}>
                      {isScanning
                        ? 'Détection des appareils ESP32 & Sonoff à proximité'
                        : `${discoveredDevices.length} équipement(s) BLE détecté(s)`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.rescanBtn}
                    onPress={startBleScan}
                    disabled={isScanning}
                  >
                    <Text style={styles.rescanText}>{isScanning ? '...' : '↻ Relancer'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Discovered BLE devices list */}
                <Text style={styles.sectionHeader}>APPAREILS BLUETOOTH DÉTECTÉS</Text>

                {discoveredDevices.length === 0 && isScanning && (
                  <View style={styles.emptyWrap}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.emptyText}>Recherche de signaux Bluetooth en cours...</Text>
                  </View>
                )}

                {discoveredDevices.length === 0 && !isScanning && (
                  <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>Aucun nouvel appareil BLE détecté.</Text>
                    <TouchableOpacity onPress={startBleScan} style={{ marginTop: 8 }}>
                      <Text style={{ color: Colors.primary, fontWeight: '700' }}>Relancer la recherche</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {discoveredDevices.map(dev => {
                  const isSelected = selectedBle?.id === dev.id;
                  const signalBar = dev.rssi > -55 ? '●●●●' : dev.rssi > -65 ? '●●●○' : '●●○○';
                  return (
                    <TouchableOpacity
                      key={dev.id}
                      style={[styles.bleItem, isSelected && styles.bleItemActive]}
                      onPress={() => handleSelectBle(dev)}
                    >
                      <View style={[styles.bleIconBox, isSelected && styles.bleIconBoxActive]}>
                        <Text style={{ fontSize: 20 }}>
                          {dev.type === 'BREAKER' ? '⚡' : dev.type === 'PLUG' ? '🔌' : '💡'}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.bleItemTitle}>{dev.name}</Text>
                        <Text style={styles.bleItemSub}>
                          MAC: {dev.bleMac} • {dev.model}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.signalText, dev.rssi > -60 ? { color: '#10B981' } : { color: '#F59E0B' }]}>
                          {signalBar} {dev.rssi} dBm
                        </Text>
                        <Text style={styles.selectHint}>{isSelected ? '✓ Sélectionné' : 'Choisir'}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Device Configuration Form */}
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionHeader}>PARAMÈTRES D'AFFECTATION</Text>

              <Text style={styles.inputLabel}>Nom personnalisé</Text>
              <TextInput
                style={styles.input}
                value={deviceName}
                onChangeText={setDeviceName}
                placeholder="Ex. Lampe Salon, Disjoncteur Chauffe-eau..."
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Pièce d'installation</Text>
              <View style={styles.roomPicker}>
                {ROOMS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roomChip, selectedRoom === r && styles.roomChipActive]}
                    onPress={() => setSelectedRoom(r)}
                  >
                    <Text style={[styles.roomChipText, selectedRoom === r && styles.roomChipTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {activeTab === 'MANUAL' && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputLabel}>Type d'appareil</Text>
                  <View style={styles.roomPicker}>
                    {['switch', 'breaker', 'plug'].map(t => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.roomChip, deviceType === t && styles.roomChipActive]}
                        onPress={() => setDeviceType(t)}
                      >
                        <Text style={[styles.roomChipText, deviceType === t && styles.roomChipTextActive]}>
                          {t.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Success Feedback */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.submitBtn, (!deviceName.trim() || isPairing) && styles.submitBtnDisabled]}
              onPress={handlePairAndSync}
              disabled={!deviceName.trim() || isPairing}
            >
              {isPairing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Connexion Bluetooth & Enregistrement...</Text>
                </View>
              ) : (
                <Text style={styles.submitBtnText}>
                  ⚡ Appairer & Synchroniser dans la base
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: 22,
    marginRight: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },
  closeBtn: {
    padding: 6
  },
  closeText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '700'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginTop: 12,
    marginBottom: 12
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700'
  },
  body: {
    paddingTop: 4
  },
  radarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14
  },
  radarWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radarRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6'
  },
  radarCenter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radarStatusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A'
  },
  radarSubText: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2
  },
  rescanBtn: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  rescanText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6
  },
  bleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8
  },
  bleItemActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF7ED'
  },
  bleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bleIconBoxActive: {
    backgroundColor: '#FFEDD5'
  },
  bleItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  bleItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  signalText: {
    fontSize: 11,
    fontWeight: '700'
  },
  selectHint: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A'
  },
  roomPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  roomChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9'
  },
  roomChipActive: {
    backgroundColor: Colors.primary
  },
  roomChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  roomChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    alignItems: 'center'
  },
  successText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700'
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  submitBtnDisabled: {
    opacity: 0.5
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
