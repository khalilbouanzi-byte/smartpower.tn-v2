export type RoomType = 'Toutes' | 'Salon' | 'Chambre' | 'Cuisine' | 'Bureau' | 'Jardin' | string;

export interface SmartDevice {
  id: string;
  name: string;
  room: string;
  statusText: string;
  isOn: boolean;
  activeWatts: number;
  type: 'switch' | 'breaker' | 'plug' | 'light' | string;
  isOnline: boolean;
  bleMac?: string;
  rssi?: number;
}

export interface DiscoveredBleDevice {
  id: string;
  name: string;
  model: string;
  type: string;
  bleMac: string;
  rssi: number;
  suggestedRoom: string;
  estimatedWatts: number;
}

export interface SmartScene {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isActive: boolean;
}

export interface GridTelemetry {
  totalWatts: number;
  watts: number;
  activeDevicesCount: number;
  voltage: number;
  current: number;
  dailyKwh: number;
  kwh: number;
  costTnd: number;
  cost: number;
}
