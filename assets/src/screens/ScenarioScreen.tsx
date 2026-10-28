import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useSmartPower } from '../context/SmartPowerContext';
import { Colors } from '../theme/colors';

export const ScenarioScreen: React.FC = () => {
  const { scenes } = useSmartPower();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.headerTitle}>Toutes les maisons</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <Text style={styles.icon}>🔍</Text>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.icon}>⊕</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Empty state illustration matching 2000.jpg */}
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationBox}>📦</Text>
            <Text style={styles.illustrationPlane}>✈️</Text>
          </View>
        </View>

        <Text style={styles.instructionText}>
          Appuyez sur le bouton ci-dessous ou sur le « + » en haut à droite pour créer une scène manuelle ou automatique.
        </Text>

        <TouchableOpacity style={styles.buildBtn}>
          <Text style={styles.buildBtnText}>Construire maintenant</Text>
        </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  chevron: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  illustrationWrap: {
    marginBottom: 24,
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationBox: {
    fontSize: 54,
  },
  illustrationPlane: {
    position: 'absolute',
    top: 20,
    right: 25,
    fontSize: 24,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  buildBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 99,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  buildBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
