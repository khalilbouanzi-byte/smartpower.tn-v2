import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useSmartPower } from '../context/SmartPowerContext';
import { Colors } from '../theme/colors';

export const ApercuScreen: React.FC = () => {
  const { devices, setEnergyModalVisible } = useSmartPower();

  const activeCount = devices.filter(d => d.isOn).length;
  const activeWatts = devices.filter(d => d.isOn).reduce((s, d) => s + d.activeWatts, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.headerTitle}>My Home</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.centerTitle}>Aperçu</Text>

        <Text style={styles.menuIcon}>•••</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card 1: Appareils allumés */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Appareils allumés</Text>
          <View style={styles.cardRow}>
            <View style={styles.leafIconBadge}>
              <Text style={{ fontSize: 26 }}>🍃</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.mainCardHeading}>
                {activeCount === 0
                  ? 'Tous les appareils sont éteints.'
                  : `${activeCount} appareil${activeCount > 1 ? 's' : ''} allumé${activeCount > 1 ? 's' : ''} (${activeWatts} W)`}
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: Tableau de bord de l'énergie (Clickable) */}
        <TouchableOpacity style={styles.card} onPress={() => setEnergyModalVisible(true)}>
          <Text style={styles.cardLabel}>Tableau de bord de l'énergie</Text>
          <View style={styles.cardRow}>
            <View style={styles.energyIconBadge}>
              <Text style={{ fontSize: 26 }}>⚡</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.mainCardHeading}>Tableau de bord de l'énergie</Text>
              <Text style={styles.cardSubText}>Voir la consommation d'électricité.</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3: Simulation de présence */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Simulation de présence</Text>
          <View style={styles.cardRow}>
            <View style={styles.presenceIconBadge}>
              <Text style={{ fontSize: 26 }}>🏠</Text>
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.mainCardHeading}>Simulation de présence</Text>
              <Text style={styles.cardSubText}>
                Allumez ou éteignez les appareils au hasard pour simuler quelqu'un à la maison.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  chevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  centerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  menuIcon: {
    fontSize: 16,
    color: Colors.text,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leafIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presenceIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  mainCardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  cardSubText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  chevronRight: {
    fontSize: 22,
    color: Colors.textLight,
  },
});
