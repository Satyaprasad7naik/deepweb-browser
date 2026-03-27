import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import * as net from 'net';

export type TorStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * TorService — Manages Tor process lifecycle and SOCKS5 proxy.
 *
 * When connected, all browser traffic can be routed through
 * 127.0.0.1:9050 (SOCKS5).
 */
export class TorService extends EventEmitter {
  private status: TorStatus = 'disconnected';
  private torProcess: ChildProcess | null = null;
  private readonly socksPort: number;
  private readonly controlPort: number;
  private connectionTimeout: number;

  constructor(
    socksPort = 9050,
    controlPort = 9051,
    connectionTimeout = 30000
  ) {
    super();
    this.socksPort = socksPort;
    this.controlPort = controlPort;
    this.connectionTimeout = connectionTimeout;
  }

  /** Get current Tor connection status */
  getStatus(): TorStatus {
    return this.status;
  }

  /** Check if Tor is currently running */
  isRunning(): boolean {
    return this.status === 'connected';
  }

  /** Start Tor and wait for it to be ready */
  async connect(): Promise<boolean> {
    if (this.status === 'connected') {
      return true;
    }

    try {
      this.setStatus('connecting');

      // Check if Tor binary is available
      const torAvailable = await this.checkTorInstalled();
      if (!torAvailable) {
        throw new Error(
          'Tor is not installed. Install it from https://www.torproject.org/'
        );
      }

      // Start Tor process
      this.torProcess = spawn('tor', [
        '--SocksPort',
        String(this.socksPort),
        '--ControlPort',
        String(this.controlPort),
        '--DataDirectory',
        './tor-data',
      ]);

      this.torProcess.on('error', (err) => {
        this.setStatus('error');
        this.emit('error', err);
      });

      this.torProcess.on('exit', (code) => {
        if (this.status === 'connected') {
          this.setStatus('disconnected');
          this.emit('disconnected', code);
        }
      });

      // Wait for SOCKS port to become available
      await this.waitForConnection();
      this.setStatus('connected');
      return true;
    } catch (error) {
      this.setStatus('error');
      this.emit('error', error);
      return false;
    }
  }

  /** Stop Tor cleanly */
  async disconnect(): Promise<void> {
    if (this.torProcess) {
      this.torProcess.kill('SIGTERM');
      this.torProcess = null;
    }
    this.setStatus('disconnected');
  }

  /** Get SOCKS5 proxy config for routing traffic */
  getProxyConfig(): { host: string; port: number; type: number } {
    return {
      host: '127.0.0.1',
      port: this.socksPort,
      type: 5, // SOCKS5
    };
  }

  private setStatus(status: TorStatus): void {
    this.status = status;
    this.emit('statusChange', status);
  }

  private checkTorInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const check = spawn('tor', ['--version']);
      check.on('error', () => resolve(false));
      check.on('close', (code) => resolve(code === 0));
    });
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Tor connection timeout'));
      }, this.connectionTimeout);

      const checkPort = () => {
        const socket = new net.Socket();
        socket.connect(this.socksPort, '127.0.0.1', () => {
          socket.destroy();
          clearTimeout(timeout);
          resolve();
        });
        socket.on('error', () => {
          socket.destroy();
          setTimeout(checkPort, 1000);
        });
      };

      checkPort();
    });
  }
}

export default new TorService();
