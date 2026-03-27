import { TorService } from '../../src/services/torService';

// Mock child_process to avoid actually spawning Tor
jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    on: jest.fn(),
    kill: jest.fn(),
  })),
}));

jest.mock('net', () => ({
  Socket: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  })),
}));

describe('TorService', () => {
  let tor: TorService;

  beforeEach(() => {
    tor = new TorService();
  });

  test('should start with disconnected status', () => {
    expect(tor.getStatus()).toBe('disconnected');
  });

  test('should not be running initially', () => {
    expect(tor.isRunning()).toBe(false);
  });

  test('should return valid SOCKS5 proxy config', () => {
    const config = tor.getProxyConfig();
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe(9050);
    expect(config.type).toBe(5);
  });

  test('should accept custom ports', () => {
    const customTor = new TorService(9150, 9151);
    const config = customTor.getProxyConfig();
    expect(config.port).toBe(9150);
  });

  test('should disconnect cleanly', async () => {
    await tor.disconnect();
    expect(tor.getStatus()).toBe('disconnected');
    expect(tor.isRunning()).toBe(false);
  });

  test('should emit statusChange event on disconnect', (done) => {
    tor.on('statusChange', (status) => {
      expect(status).toBe('disconnected');
      done();
    });
    tor.disconnect();
  });
});
