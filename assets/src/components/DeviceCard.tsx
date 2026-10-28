import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SmartDevice } from '../types';
import { Colors } from '../theme/colors';

interface DeviceCardProps {
  device: SmartDevice;
  onToggle: (id: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
  return (
    <View style={[styles.card, device.isOn && styles.cardActive]}>
      <View style={styles.leftRow}>
        <View style={[styles.iconWrap, device.isOn && styles.iconWrapActive]}>
          <Text style={styles.iconGlyph}>
            {device.type === 'breaker' ? '🛡️' : device.type === 'plug' ? '🔌' : '⚡'}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.infoBadge}>ⓘ</Text>
            <Text style={styles.statusText}>
              {device.isOn ? `${device.activeWatts} W` : device.statusText}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightRow}>
        <Text style={[styles.wifiIcon, device.isOn && styles.wifiActive]}>📶</Text>
        <Switch
          value={device.isOn}
          onValueChange={() => onToggle(device.id)}
          trackColor={{ false: Colors.switchOff, true: Colors.switchOn }}
          thumbColor="#ffffff"
          ios_backgroundColor={Colors.switchOff}
          style={styles.switchControl}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardActive: {
    borderColor: '#e0f2fe',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryLight,
  },
  iconGlyph: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  infoBadge: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wifiIcon: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  wifiActive: {
    color: '#38bdf8',
  },
  switchControl: {
    transform: [{ scaleX: 1.05 }, { scaleY: 1.05 }],
  },
});
