import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { SmartPowerProvider, useSmartPower } from './src/context/SmartPowerContext';
import { DomicileScreen } from './src/screens/DomicileScreen';
import { ScenarioScreen } from './src/screens/ScenarioScreen';
import { ApercuScreen } from './src/screens/ApercuScreen';
import { MessageScreen } from './src/screens/MessageScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';

import { HomePickerModal } from './src/components/HomePickerModal';
import { AddDeviceModal } from './src/components/AddDeviceModal';
import { QrScannerModal } from './src/components/QrScannerModal';
import { EnergyDashboardModal } from './src/components/EnergyDashboardModal';
import { Colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const {
    homeName,
    homeModalVisible,
    setHomeModalVisible,
    addDeviceModalVisible,
    setAddDeviceModalVisible,
    qrModalVisible,
    setQrModalVisible,
    energyModalVisible,
    setEnergyModalVisible,
    addDevice,
    telemetry,
  } = useSmartPower();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textLight,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => {
            let iconGlyph = '🏠';
            let hasBadge = false;

            if (route.name === 'Domicile') iconGlyph = '🏠';
            else if (route.name === 'Scénario') iconGlyph = '⬡';
            else if (route.name === 'Aperçu') iconGlyph = '⊞';
            else if (route.name === 'Message') {
              iconGlyph = '💬';
              hasBadge = true;
            } else if (route.name === 'Profil') iconGlyph = '👤';

            return (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapFocused]}>
                <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
                  {iconGlyph}
                </Text>
                {hasBadge && <View style={styles.tabBadgeDot} />}
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Domicile" component={DomicileScreen} />
        <Tab.Screen name="Scénario" component={ScenarioScreen} />
        <Tab.Screen name="Aperçu" component={ApercuScreen} />
        <Tab.Screen name="Message" component={MessageScreen} />
        <Tab.Screen name="Profil" component={ProfilScreen} />
      </Tab.Navigator>

      {/* Global Modals from Screenshots */}
      <HomePickerModal
        visible={homeModalVisible}
        onClose={() => setHomeModalVisible(false)}
        homeName={homeName}
      />

      <AddDeviceModal
        visible={addDeviceModalVisible}
        onClose={() => setAddDeviceModalVisible(false)}
        onAddDevice={addDevice}
      />

      <QrScannerModal
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        onManualAdd={() => {
          setQrModalVisible(false);
          setAddDeviceModalVisible(true);
        }}
      />

      <EnergyDashboardModal
        visible={energyModalVisible}
        onClose={() => setEnergyModalVisible(false)}
        telemetry={telemetry}
      />
    </View>
  );
};

export default function App() {
  return (
    <SmartPowerProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <MainNavigator />
      </NavigationContainer>
    </SmartPowerProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    position: 'relative',
  },
  tabIconWrapFocused: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  tabIconText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  tabIconTextFocused: {
    color: '#ffffff',
  },
  tabBadgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});
