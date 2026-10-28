import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '../theme/colors';

interface HomePickerModalProps {
  visible: boolean;
  onClose: () => void;
  homeName: string;
}

export const HomePickerModal: React.FC<HomePickerModalProps> = ({ visible, onClose, homeName }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.dragHandle} />
              
              <TouchableOpacity style={styles.homeItem} onPress={onClose}>
                <Text style={styles.homeItemText}>{homeName}</Text>
                <Text style={styles.checkMark}>✓</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.manageBtn} onPress={onClose}>
                <Text style={styles.manageBtnText}>Gérer Maisons</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  dragHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 99,
    alignSelf: 'center',
    marginBottom: 16,
  },
  homeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  homeItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkMark: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  manageBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  manageBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
