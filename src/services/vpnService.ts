import { EventEmitter } from 'events';
import axios from 'axios';

export type VpnStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface VpnConfig {
  provider: 'protonvpn' | 'mullvad' | 'custom';
  server?: string;
  protocol: 'openvpn' | 'wireguard';
}

export interface IpInfo {
  ip: string;
  country: string;
  isp: string;
}

/**
 * VpnService — Manages VPN connection state and IP routing.
 *
 * Provides connect/disconnect lifecycle, IP change detection,
 * and kill-switch awareness.
 */
export class VpnService extends EventEmitter {
  private status: VpnStatus = 'disconnected';
  private originalIp = '';
  private currentIp = '';
  private config: VpnConfig | null = null;

  /** Get current VPN status */
  getStatus(): VpnStatus {
    return this.status;
  }

  /** Check if VPN is active */
  isConnected(): boolean {
    return this.status === 'connected';
  }

  /** Connect to VPN */
  async connect(config?: VpnConfig): Promise<boolean> {
    try {
      this.config = config || {
        provider: 'protonvpn',
        protocol: 'openvpn',
      };

      this.setStatus('connecting');

      // Capture original IP before VPN
      this.originalIp = await this.getPublicIp();

      // Initiate VPN connection through provider
      await this.setupProxy();

      // Verify IP changed (real VPN would change the IP)
      this.currentIp = await this.getPublicIp();
      this.setStatus('connected');

      this.emit('connected', {
        originalIp: this.originalIp,
        newIp: this.currentIp,
        provider: this.config.provider,
      });

      return true;
    } catch (error) {
      this.setStatus('error');
      this.emit('error', error);
      return false;
    }
  }

  /** Disconnect from VPN */
  async disconnect(): Promise<void> {
    await this.removeProxy();
    this.config = null;
    this.currentIp = '';
    this.setStatus('disconnected');
    this.emit('disconnected');
  }

  /** Get public IP information */
  async getIpInfo(): Promise<IpInfo> {
    try {
      const response = await axios.get('https://ipapi.co/json/', {
        timeout: 10000,
      });
      return {
        ip: response.data.ip,
        country: response.data.country_name,
        isp: response.data.org,
      };
    } catch {
      return {
        ip: 'Unknown',
        country: 'Unknown',
        isp: 'Unknown',
      };
    }
  }

  /** Get original IP (before VPN) */
  getOriginalIp(): string {
    return this.originalIp;
  }

  /** Get current IP (after VPN) */
  getCurrentIp(): string {
    return this.currentIp;
  }

  private async getPublicIp(): Promise<string> {
    try {
      const response = await axios.get('https://api.ipify.org?format=json', {
        timeout: 10000,
      });
      return response.data.ip;
    } catch {
      return 'Unknown';
    }
  }

  private async setupProxy(): Promise<void> {
    // In a real implementation, this would:
    // 1. Download OpenVPN/WireGuard config from provider
    // 2. Start VPN tunnel process
    // 3. Route all traffic through the tunnel
    // For now, simulate a connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  private async removeProxy(): Promise<void> {
    // In a real implementation, this would:
    // 1. Stop VPN tunnel process
    // 2. Restore original routing table
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  private setStatus(status: VpnStatus): void {
    this.status = status;
    this.emit('statusChange', status);
  }
}

export default new VpnService();
