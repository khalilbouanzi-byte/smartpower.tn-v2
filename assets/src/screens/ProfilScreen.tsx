import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

export const ProfilScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <Text style={styles.gearIcon}>⚙️</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User info */}
        <View style={styles.userRow}>
          <View>
            <Text style={styles.userName}>Créer un surnom</Text>
            <Text style={styles.userEmail}>khali****anzi@gmail.com</Text>
          </View>
          <Text style={styles.learnMore}>En savoir plus ›</Text>
        </View>

        {/* VIP Upgrade Banner (5000.jpg) */}
        <View style={styles.vipCard}>
          <View style={styles.vipBadge}><Text style={styles.vipBadgeText}>VIP</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vipTitle}>Souscrire à un abonnement</Text>
            <Text style={styles.vipSub}>Débloquez des fonctionnalités...</Text>
          </View>
          <TouchableOpacity style={styles.vipBtn}>
            <Text style={styles.vipBtnText}>Mettre à niveau</Text>
          </TouchableOpacity>
        </View>

        {/* Prime Banner */}
        <View style={styles.primeBanner}>
          <Text style={styles.primeText}>⚡ Try Prime Free for 30 Days</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

        {/* Settings Group */}
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>💙</Text>
            <Text style={styles.rowLabel}>Fonctionne avec</Text>
            <Text style={styles.rowRightInfo}>Google • Alexa • Hue • Matter</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>👥</Text>
            <Text style={styles.rowLabel}>Gérer le partage</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>💬</Text>
            <Text style={styles.rowLabel}>Forum</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>🚗</Text>
            <Text style={styles.rowLabel}>Carplay <Text style={styles.tagAdv}>Advanced</Text></Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>🧪</Text>
            <Text style={styles.rowLabel}>Fonctionnalités du pilote</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>❓</Text>
            <Text style={styles.rowLabel}>Aide et commentaire</Text>
            <Text style={styles.chevron}>›</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.rowIcon}>ℹ️</Text>
            <Text style={styles.rowLabel}>À propos (Spower 5.29.1)</Text>
            <Text style={styles.chevron}>›</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  gearIcon: {
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  learnMore: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  vipCard: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  vipBadge: {
    backgroundColor: '#94a3b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vipBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  vipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  vipSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  vipBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
  },
  vipBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  primeBanner: {
    backgroundColor: '#fef9c3',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  primeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#854d0e',
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  rowIcon: {
    fontSize: 18,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  rowRightInfo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tagAdv: {
    backgroundColor: '#dbeafe',
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textLight,
  },
});
