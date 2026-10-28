import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onManualAdd: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  onManualAdd,
}) => {
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 200,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, laserAnim]);

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <View style={styles.darkContainer}>
        <SafeAreaView style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Ajouter un appareil</Text>
          <View style={{ width: 28 }} />
        </SafeAreaView>

        {/* Viewfinder Viewport */}
        <View style={styles.viewport}>
          <View style={styles.finderBox}>
            {/* Corners */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Laser Line */}
            <Animated.View
              style={[
                styles.laserLine,
                { transform: [{ translateY: laserAnim }] },
              ]}
            />
          </View>

          <Text style={styles.guideText}>
            Ajuster le code QR dans le cadre pour scanner
          </Text>
        </View>

        {/* Bottom Bar */}
        <SafeAreaView style={styles.bottomBar}>
          <TouchableOpacity style={styles.torchBtn}>
            <Text style={styles.torchIcon}>🔦</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onManualAdd}>
            <Text style={styles.manualLink}>
              Aucun code QR disponible. Ajouter manuellement. ›
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  navBar: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 6,
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 22,
  },
  navTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finderBox: {
    width: 230,
    height: 230,
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: '#22c55e',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  guideText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  bottomBar: {
    paddingBottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  torchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchIcon: {
    fontSize: 20,
  },
  manualLink: {
    color: '#cbd5e1',
    fontSize: 13,
  },
});
