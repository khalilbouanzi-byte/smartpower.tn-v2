import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator
} from 'react-native';
import { useSmartPower } from '../context/SmartPowerContext';
import { Colors } from '../theme/colors';

const ROOM_FILTERS = ['Toutes', 'Salon', 'Chambre', 'Cuisine', 'Bureau', 'Jardin'];

export const DomicileScreen: React.FC = () => {
  const {
    devices,
    currentRoom,
    setCurrentRoom,
    toggleDevice,
    telemetry,
    isServerConnected,
    isSyncing,
    lastSyncTime,
    refreshDevices,
    setAddDeviceModalVisible
  } = useSmartPower();

  const filteredDevices =
    currentRoom === 'Toutes' ? devices : devices.filter(d => d.room.toLowerCase() === currentRoom.toLowerCase());

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appTitle}>SmartPower</Text>
          <Text style={styles.homeSubtitle}>Maison Principale</Text>
        </View>

        {/* Sync Status Badge */}
        <TouchableOpacity style={styles.syncBadge} onPress={refreshDevices}>
          <View style={[styles.syncDot, isServerConnected ? styles.syncDotOnline : styles.syncDotOffline]} />
          <Text style={styles.syncText}>
            {isServerConnected ? 'Sync 192.168.1.10:8080' : 'Hors-ligne (Local)'}
          </Text>
          {isSyncing && <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Energy Summary Banner */}
        <View style={styles.energyCard}>
          <View style={styles.energyLeft}>
            <Text style={styles.energyLabel}>PUISSANCE ACTIVE EN DIRECT</Text>
            <Text style={styles.energyValue}>
              {telemetry.totalWatts} <Text style={styles.energyUnit}>Watts</Text>
            </Text>
            <Text style={styles.energySub}>
              {telemetry.activeDevicesCount} appareil(s) en marche • {telemetry.voltage} V
            </Text>
          </View>
          <View style={styles.energyRight}>
            <View style={styles.kwhPill}>
              <Text style={styles.kwhText}>{telemetry.dailyKwh} kWh</Text>
            </View>
            <Text style={styles.costText}>{telemetry.costTnd} TND</Text>
          </View>
        </View>

        {/* Bluetooth Add Device Action Bar */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.bleAddBtn}
            onPress={() => setAddDeviceModalVisible(true)}
          >
            <Text style={styles.bleAddBtnIcon}>📡</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.bleAddBtnTitle}>Ajouter par Bluetooth (BLE)</Text>
              <Text style={styles.bleAddBtnSub}>Recherche d'appareils ESP32 / Sonoff à proximité</Text>
            </View>
            <Text style={styles.bleArrow}>➔</Text>
          </TouchableOpacity>
        </View>

        {/* Room Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsScroll}>
          {ROOM_FILTERS.map(room => (
            <TouchableOpacity
              key={room}
              style={[styles.roomChip, currentRoom === room && styles.roomChipActive]}
              onPress={() => setCurrentRoom(room)}
            >
              <Text style={[styles.roomChipText, currentRoom === room && styles.roomChipTextActive]}>
                {room}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Devices Grid Header */}
        <View style={styles.sectionHeaderWrap}>
          <Text style={styles.sectionTitle}>
            ÉQUIPEMENTS ({filteredDevices.length})
          </Text>
          <Text style={styles.lastSyncLabel}>Mis à jour : {lastSyncTime}</Text>
        </View>

        {/* Device Cards */}
        <View style={styles.grid}>
          {filteredDevices.map(dev => {
            const isBreaker = dev.type === 'breaker';
            const isPlug = dev.type === 'plug';
            return (
              <View key={dev.id} style={[styles.deviceCard, dev.isOn && styles.deviceCardOn]}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.deviceIconBox, dev.isOn && styles.deviceIconBoxOn]}>
                    <Text style={{ fontSize: 22 }}>{isBreaker ? '⚡' : isPlug ? '🔌' : '💡'}</Text>
                  </View>
                  <Switch
                    value={dev.isOn}
                    onValueChange={() => toggleDevice(dev.id)}
                    trackColor={{ false: '#CBD5E1', true: Colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <Text style={styles.deviceName} numberOfLines={1}>
                  {dev.name}
                </Text>
                <Text style={styles.deviceRoom}>{dev.room}</Text>

                <View style={styles.cardBottomRow}>
                  <Text style={[styles.deviceWatts, dev.isOn && styles.deviceWattsOn]}>
                    {dev.isOn ? `${dev.activeWatts} W` : '0 W'}
                  </Text>
                  {dev.bleMac ? (
                    <Text style={styles.bleTag}>BLE</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 50,
    paddingHorizontal: 16
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  homeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  syncDotOnline: {
    backgroundColor: '#10B981'
  },
  syncDotOffline: {
    backgroundColor: '#EF4444'
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  energyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14
  },
  energyLeft: {
    flex: 1
  },
  energyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8
  },
  energyValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4
  },
  energyUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary
  },
  energySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4
  },
  energyRight: {
    alignItems: 'flex-end'
  },
  kwhPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  kwhText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8'
  },
  costText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 6
  },
  actionRow: {
    marginBottom: 14
  },
  bleAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 18,
    padding: 14
  },
  bleAddBtnIcon: {
    fontSize: 24
  },
  bleAddBtnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A'
  },
  bleAddBtnSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2
  },
  bleArrow: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  roomsScroll: {
    marginBottom: 16
  },
  roomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8
  },
  roomChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  roomChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  roomChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8
  },
  lastSyncLabel: {
    fontSize: 10,
    color: '#94A3B8'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  deviceCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  deviceCardOn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFAF5'
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  deviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deviceIconBoxOn: {
    backgroundColor: '#FFEDD5'
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2
  },
  deviceRoom: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC'
  },
  deviceWatts: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8'
  },
  deviceWattsOn: {
    color: Colors.primary
  },
  bleTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  }
});
