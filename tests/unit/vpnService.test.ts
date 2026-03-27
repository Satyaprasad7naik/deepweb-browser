import { VpnService } from '../../src/services/vpnService';

// Mock axios to avoid real HTTP calls
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: { ip: '1.2.3.4', country_name: 'Test Country', org: 'Test ISP' },
  }),
}));

describe('VpnService', () => {
  let vpn: VpnService;

  beforeEach(() => {
    vpn = new VpnService();
  });

  test('should start with disconnected status', () => {
    expect(vpn.getStatus()).toBe('disconnected');
  });

  test('should not be connected initially', () => {
    expect(vpn.isConnected()).toBe(false);
  });

  test('should disconnect cleanly', async () => {
    await vpn.disconnect();
    expect(vpn.getStatus()).toBe('disconnected');
  });

  test('should emit statusChange event on disconnect', (done) => {
    vpn.on('statusChange', (status) => {
      expect(status).toBe('disconnected');
      done();
    });
    vpn.disconnect();
  });

  test('should have empty IPs before connection', () => {
    expect(vpn.getOriginalIp()).toBe('');
    expect(vpn.getCurrentIp()).toBe('');
  });
});
