import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

export const MessageScreen: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tutoriel' | 'explorer' | 'notif'>('explorer');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subtabs}>
          <TouchableOpacity
            style={styles.subtabBtn}
            onPress={() => setActiveSubTab('tutoriel')}
          >
            <Text style={[styles.subtabText, activeSubTab === 'tutoriel' && styles.subtabActive]}>
              Tutoriel
            </Text>
            {activeSubTab === 'tutoriel' && <View style={styles.subtabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subtabBtn}
            onPress={() => setActiveSubTab('explorer')}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.subtabText, activeSubTab === 'explorer' && styles.subtabActive]}>
                Explorer
              </Text>
              <View style={styles.redDot} />
            </View>
            {activeSubTab === 'explorer' && <View style={styles.subtabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subtabBtn}
            onPress={() => setActiveSubTab('notif')}
          >
            <Text style={[styles.subtabText, activeSubTab === 'notif' && styles.subtabActive]}>
              Notifica...
            </Text>
            {activeSubTab === 'notif' && <View style={styles.subtabIndicator} />}
          </TouchableOpacity>
        </View>

        <Text style={styles.gearIcon}>⚙️</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tutoriel View (4000.jpg) */}
        {activeSubTab === 'tutoriel' && (
          <View>
            <View style={styles.tutorielBanner}>
              <Text style={styles.tutTitle}>À Propos De La Chaîne Tutoriel</Text>
              <Text style={styles.tutSub}>Et Des Articles Dans Votre Langue</Text>
              <TouchableOpacity style={styles.tutBtn}>
                <Text style={styles.tutBtnText}>EN SAVOIR PLUS →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.articleCard}>
              <View style={styles.articleImgPlaceholder}>
                <Text style={{ fontSize: 36 }}>🏡🐔</Text>
              </View>
              <View style={styles.articleBody}>
                <Text style={styles.articleTitle}>
                  Comment construire un poulailler plus intelligent pour son jardin grâce à Spower
                </Text>
                <Text style={styles.articleDesc}>
                  Surveillez de plus près votre poulailler grâce à Spower...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Explorer View (4010.jpg) */}
        {activeSubTab === 'explorer' && (
          <View>
            <View style={styles.articleCard}>
              <View style={styles.floorPlanHero}>
                <Text style={styles.floorPlanBadge}>FREE Floor Plan</Text>
                <Text style={styles.floorPlanText}>Living Room 1 • Kitchen</Text>
              </View>
              <View style={styles.articleBody}>
                <Text style={styles.articleTitle}>
                  Essayez gratuitement Floor Plan avec un exemple d'agencement
                </Text>
                <Text style={styles.articleDesc}>
                  Découvrez un agencement prêt à l'emploi et voyez comment...
                </Text>
              </View>
            </View>

            <View style={styles.articleCard}>
              <View style={styles.articleBody}>
                <View style={styles.updateBadge}>
                  <Text style={styles.updateBadgeText}>Spower Web V3.29.0 Updates</Text>
                </View>
                <Text style={styles.articleTitle}>Mises à jour de Spower Web V3.29.0</Text>
                <Text style={styles.articleDesc}>
                  Découvrez le plan d'étage avec un exemple d'aménagement...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notifications View (4020.jpg) */}
        {activeSubTab === 'notif' && (
          <View>
            <View style={styles.notifCard}>
              <Text style={{ fontSize: 24 }}>📢</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Notification du système</Text>
                <Text style={styles.notifSub}>Vous n'avez aucune notification.</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>

            <View style={styles.notifCard}>
              <Text style={{ fontSize: 24 }}>💠</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Notification de Scène</Text>
                <Text style={styles.notifSub}>Vous n'avez aucune notification.</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>

            <View style={styles.emptyNotifArea}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>📋</Text>
              <Text style={styles.emptyNotifText}>Vous n'avez aucune notification.</Text>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  subtabs: {
    flexDirection: 'row',
    gap: 22,
  },
  subtabBtn: {
    paddingVertical: 14,
    position: 'relative',
  },
  subtabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  subtabActive: {
    color: Colors.text,
    fontWeight: '800',
  },
  subtabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#38bdf8',
    borderRadius: 2,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginLeft: 3,
  },
  gearIcon: {
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  tutorielBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tutTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  tutSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  tutBtn: {
    backgroundColor: '#38bdf8',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 99,
  },
  tutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleImgPlaceholder: {
    height: 140,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorPlanHero: {
    height: 130,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorPlanBadge: {
    backgroundColor: Colors.primary,
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  floorPlanText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  articleBody: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  articleDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  updateBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  updateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  notifSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textLight,
  },
  emptyNotifArea: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyNotifText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
