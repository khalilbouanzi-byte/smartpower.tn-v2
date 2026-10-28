import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SmartDevice, SmartScene, GridTelemetry, RoomType, DiscoveredBleDevice } from '../types';
import { SmartPowerApi, BackendModule } from '../api/smartpowerApi';

interface SmartPowerContextType {
  devices: SmartDevice[];
  scenes: SmartScene[];
  currentRoom: RoomType;
  setCurrentRoom: (room: RoomType) => void;
  telemetry: GridTelemetry;
  powerHistory: number[];
  isServerConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: string;
  toggleDevice: (id: string) => Promise<void>;
  addBleDevice: (bleDevice: DiscoveredBleDevice, customName: string, room: string) => Promise<boolean>;
  addDevice: (name: string, room: string, watts?: number) => Promise<boolean>;
  removeDevice: (id: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
  homeName: string;
  setHomeName: (name: string) => void;
  addDeviceModalVisible: boolean;
  setAddDeviceModalVisible: (v: boolean) => void;
  qrModalVisible: boolean;
  setQrModalVisible: (v: boolean) => void;
  homeModalVisible: boolean;
  setHomeModalVisible: (v: boolean) => void;
  energyModalVisible: boolean;
  setEnergyModalVisible: (v: boolean) => void;
}

const INITIAL_DEVICES: SmartDevice[] = [
  {
    id: 'dev-76f3fc',
    name: 'Interrupteur Principal 76f3fc',
    room: 'Salon',
    statusText: 'En ligne',
    isOn: false,
    activeWatts: 120,
    type: 'switch',
    isOnline: true,
    bleMac: 'E4:65:B8:76:F3:FC',
    rssi: -52
  },
  {
    id: 'dev-pow-elite',
    name: 'Sonoff POW Élite 16A',
    room: 'Salon',
    statusText: 'En ligne',
    isOn: true,
    activeWatts: 1850,
    type: 'breaker',
    isOnline: true,
    bleMac: '30:AE:A4:PO:W1:16',
    rssi: -45
  },
  {
    id: 'dev-s31-bed',
    name: 'Prise Connectée S31',
    room: 'Chambre',
    statusText: 'En ligne',
    isOn: true,
    activeWatts: 85,
    type: 'plug',
    isOnline: true,
    bleMac: '24:0A:C4:S3:1B:ED',
    rssi: -65
  }
];

const INITIAL_SCENES: SmartScene[] = [
  { id: 'sc-1', title: 'Mode Nuit', subtitle: 'Éteint tout sauf chambre', icon: '🌙', isActive: false },
  { id: 'sc-2', title: 'Éco Énergie', subtitle: 'Limite la puissance à 1500W', icon: '⚡', isActive: true },
  { id: 'sc-3', title: 'Départ Maison', subtitle: 'Active alarme & coupe prises', icon: '🚪', isActive: false },
  { id: 'sc-4', title: 'Cinéma Salon', subtitle: 'Tamisé 20% & TV allumée', icon: '🎬', isActive: false }
];

const SmartPowerContext = createContext<SmartPowerContextType | undefined>(undefined);

export const SmartPowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [scenes, setScenes] = useState<SmartScene[]>(INITIAL_SCENES);
  const [currentRoom, setCurrentRoom] = useState<RoomType>('Toutes');
  const [homeName, setHomeName] = useState('Maison Principale');
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('--:--:--');

  const [addDeviceModalVisible, setAddDeviceModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [homeModalVisible, setHomeModalVisible] = useState(false);
  const [energyModalVisible, setEnergyModalVisible] = useState(false);

  // Convert backend module to SmartDevice
  const parseBackendModule = (m: BackendModule): SmartDevice => {
    let stateObj: any = {};
    if (typeof m.state === 'string') {
      try { stateObj = JSON.parse(m.state); } catch (e) { stateObj = {}; }
    } else if (typeof m.state === 'object' && m.state) {
      stateObj = m.state;
    }
    const isOn = stateObj.switch === 'on';
    const watts = stateObj.power || (isOn ? 140 : 0);
    const mType = (m.type || 'SWITCH').toLowerCase();
    const type = mType.includes('breaker') ? 'breaker' : mType.includes('plug') ? 'plug' : 'switch';

    return {
      id: m.id,
      name: m.name || m.id,
      room: m.room_name || 'Salon',
      statusText: m.online ? (isOn ? 'En marche' : 'Éteint') : 'Hors-ligne',
      isOn,
      activeWatts: watts,
      type,
      isOnline: !!m.online,
      bleMac: m.ble_mac || `E4:65:B8:${m.id.slice(-4).toUpperCase()}`,
      rssi: -50 - Math.floor(Math.random() * 25)
    };
  };

  // Sync with backend API
  const refreshDevices = useCallback(async () => {
    try {
      setIsSyncing(true);
      const backendMods = await SmartPowerApi.getModules();
      if (backendMods && backendMods.length > 0) {
        const mapped = backendMods.map(parseBackendModule);
        setDevices(mapped);
        setIsServerConnected(true);
      } else {
        setIsServerConnected(false);
      }
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    } catch (e) {
      setIsServerConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Poll server every 3.5 seconds for live bidirectional sync
  useEffect(() => {
    refreshDevices();
    const timer = setInterval(refreshDevices, 3500);
    return () => clearInterval(timer);
  }, [refreshDevices]);

  // Toggle physical relay and synchronize
  const toggleDevice = async (id: string) => {
    const currentDev = devices.find(d => d.id === id);
    if (!currentDev) return;
    const targetState = !currentDev.isOn;

    // Optimistic UI update
    setDevices(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              isOn: targetState,
              activeWatts: targetState ? Math.max(d.activeWatts, 95) : 0,
              statusText: targetState ? 'En marche' : 'Éteint'
            }
          : d
      )
    );

    // Call backend
    await SmartPowerApi.toggleModule(id, targetState);
    refreshDevices();
  };

  // Register device via Bluetooth BLE and sync to MySQL
  const addBleDevice = async (bleDevice: DiscoveredBleDevice, customName: string, room: string): Promise<boolean> => {
    const devId = bleDevice.id;
    const devName = customName.trim() || bleDevice.name;

    // Call backend BLE register endpoint
    const res = await SmartPowerApi.registerBleModule({
      id: devId,
      name: devName,
      room,
      type: bleDevice.type,
      ble_mac: bleDevice.bleMac,
      watts: bleDevice.estimatedWatts,
      model: bleDevice.model
    });

    if (res.success) {
      await refreshDevices();
      return true;
    } else {
      // Local fallback if server unreachable
      const newDev: SmartDevice = {
        id: devId,
        name: devName,
        room,
        statusText: 'En marche',
        isOn: true,
        activeWatts: bleDevice.estimatedWatts || 120,
        type: bleDevice.type.toLowerCase(),
        isOnline: true,
        bleMac: bleDevice.bleMac,
        rssi: bleDevice.rssi
      };
      setDevices(prev => [...prev, newDev]);
      return true;
    }
  };

  const addDevice = async (name: string, room: string, watts: number = 100): Promise<boolean> => {
    const dummyBle: DiscoveredBleDevice = {
      id: 'sp-' + Date.now().toString(36),
      name: name.trim() || 'Nouvel Équipement',
      model: 'SP-SW1',
      type: 'SWITCH',
      bleMac: `E4:65:B8:${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      rssi: -50,
      suggestedRoom: room || 'Salon',
      estimatedWatts: watts
    };
    return addBleDevice(dummyBle, name, room);
  };

  const removeDevice = async (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    await SmartPowerApi.deleteModule(id);
    refreshDevices();
  };

  // Live telemetry calculations
  const totalWatts = devices.filter(d => d.isOn).reduce((sum, d) => sum + d.activeWatts, 0);
  const activeDevicesCount = devices.filter(d => d.isOn).length;
  const voltage = 230.1;
  const dailyKwh = +(totalWatts * 0.012 + 14.82).toFixed(2);
  const costTnd = +(dailyKwh * 0.185).toFixed(2);

  const current = +(totalWatts / 230).toFixed(2);
  const telemetry: GridTelemetry = {
    totalWatts,
    watts: totalWatts,
    activeDevicesCount,
    voltage,
    current,
    dailyKwh,
    kwh: dailyKwh,
    costTnd,
    cost: costTnd
  };

  const powerHistory = [totalWatts * 0.7, totalWatts * 0.85, totalWatts * 0.8, totalWatts * 0.95, totalWatts];

  return (
    <SmartPowerContext.Provider
      value={{
        devices,
        scenes,
        currentRoom,
        setCurrentRoom,
        telemetry,
        powerHistory,
        isServerConnected,
        isSyncing,
        lastSyncTime,
        toggleDevice,
        addBleDevice,
        addDevice,
        removeDevice,
        refreshDevices,
        homeName,
        setHomeName,
        addDeviceModalVisible,
        setAddDeviceModalVisible,
        qrModalVisible,
        setQrModalVisible,
        homeModalVisible,
        setHomeModalVisible,
        energyModalVisible,
        setEnergyModalVisible
      }}
    >
      {children}
    </SmartPowerContext.Provider>
  );
};

export const useSmartPower = () => {
  const context = useContext(SmartPowerContext);
  if (!context) throw new Error('useSmartPower must be used within a SmartPowerProvider');
  return context;
};
