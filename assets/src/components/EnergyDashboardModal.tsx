import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { GridTelemetry } from '../types';

interface EnergyDashboardModalProps {
  visible: boolean;
  onClose: () => void;
  telemetry: GridTelemetry;
}

export const EnergyDashboardModal: React.FC<EnergyDashboardModalProps> = ({
  visible,
  onClose,
  telemetry,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Tableau de bord de l'énergie</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Main Power Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroBadge}>EN DIRECT (0ms LAN)</Text>
            <View style={styles.powerRow}>
              <Text style={styles.powerNumber}>{telemetry.watts.toLocaleString()}</Text>
              <Text style={styles.powerUnit}>Watts</Text>
            </View>
            <View style={styles.gridStatsRow}>
              <Text style={styles.gridStat}>Tension: <Text style={styles.statBold}>{telemetry.voltage} V</Text></Text>
              <Text style={styles.gridStat}>Intensité: <Text style={styles.statBold}>{telemetry.current} A</Text></Text>
            </View>
          </View>

          {/* Daily & Monthly Accumulation */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Aujourd'hui</Text>
              <Text style={styles.summaryVal}>{telemetry.kwh} kWh</Text>
              <Text style={styles.summaryCost}>{telemetry.cost} €</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Ce Mois</Text>
              <Text style={styles.summaryVal}>48.20 kWh</Text>
              <Text style={styles.summaryCost}>7.71 €</Text>
            </View>
          </View>

          {/* Device Breakdown List */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Répartition de la puissance</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownItemName}>Chauffage / HVAC</Text>
              <Text style={styles.breakdownItemVal}>1 200 W (58%)</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownItemName}>Électroménager</Text>
              <Text style={styles.breakdownItemVal}>350 W (17%)</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownItemName}>Éclairage & Veille</Text>
              <Text style={styles.breakdownItemVal}>80 W (4%)</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 6,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.text,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 12,
  },
  powerNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Courier',
  },
  powerUnit: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  gridStatsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  gridStat: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statBold: {
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: 4,
  },
  summaryCost: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  breakdownItemName: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  breakdownItemVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
});
