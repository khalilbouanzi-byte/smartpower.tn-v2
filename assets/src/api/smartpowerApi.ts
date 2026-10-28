/**
 * SmartPower Unified API Client
 * Connects the mobile app directly to the Flask Backend & MySQL database
 */

export const API_BASE_URL = 'http://192.168.1.10:8080';

export interface BackendModule {
  id: string;
  name: string;
  type: string;
  model: string;
  channels: number;
  online: number | boolean;
  state: string | { switch?: string; power?: number; voltage?: number; current?: number };
  claimCode?: string;
  room_name?: string;
  home_name?: string;
  ip_address?: string;
  ble_mac?: string;
}

export const SmartPowerApi = {
  async getModules(): Promise<BackendModule[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_BASE_URL}/api/modules`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.modules || [];
    } catch (err) {
      console.warn('[SmartPowerApi] getModules error:', err);
      return [];
    }
  },

  async toggleModule(deviceId: string, targetState?: boolean): Promise<{ success: boolean; relay_state?: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/${deviceId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: targetState !== undefined ? (targetState ? 'on' : 'off') : undefined })
      });
      return await res.json();
    } catch (err) {
      console.error('[SmartPowerApi] toggle error:', err);
      return { success: false };
    }
  },

  async registerBleModule(device: {
    id: string;
    name: string;
    room: string;
    type: string;
    ble_mac?: string;
    watts?: number;
    model?: string;
  }): Promise<{ success: boolean; module?: BackendModule; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: device.id,
          name: device.name,
          room: device.room,
          type: device.type.toUpperCase(),
          model: device.model || 'SP-SW1',
          ble_mac: device.ble_mac || `E4:65:B8:${device.id.slice(-4).toUpperCase()}`,
          watts: device.watts || 120
        })
      });
      return await res.json();
    } catch (err) {
      console.error('[SmartPowerApi] register BLE error:', err);
      return { success: false, error: String(err) };
    }
  },

  async deleteModule(deviceId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/${deviceId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('[SmartPowerApi] delete error:', err);
      return false;
    }
  }
};
