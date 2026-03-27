import { isValidUrl, enforceHttps, sanitizeUrl, isDangerousUrl, extractDomain } from '../../src/shared/security';

describe('Security Utilities', () => {
  describe('isValidUrl', () => {
    test('should accept valid HTTPS URLs', () => {
      expect(isValidUrl('https://google.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?q=test')).toBe(true);
    });

    test('should accept valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    test('should accept about: URLs', () => {
      expect(isValidUrl('about:blank')).toBe(true);
    });

    test('should reject invalid strings', () => {
      expect(isValidUrl('notaurl')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('ftp://files.com')).toBe(false);
    });
  });

  describe('enforceHttps', () => {
    test('should upgrade HTTP to HTTPS', () => {
      expect(enforceHttps('http://example.com')).toBe('https://example.com');
    });

    test('should preserve HTTPS URLs', () => {
      expect(enforceHttps('https://example.com')).toBe('https://example.com');
    });

    test('should preserve localhost', () => {
      expect(enforceHttps('http://localhost:3000')).toBe('http://localhost:3000');
      expect(enforceHttps('http://127.0.0.1:8080')).toBe('http://127.0.0.1:8080');
    });

    test('should preserve about: URLs', () => {
      expect(enforceHttps('about:blank')).toBe('about:blank');
    });
  });

  describe('sanitizeUrl', () => {
    test('should remove UTM parameters', () => {
      const dirty = 'https://example.com/page?utm_source=twitter&utm_medium=social&id=123';
      const result = sanitizeUrl(dirty);
      expect(result).toContain('id=123');
      expect(result).not.toContain('utm_source');
      expect(result).not.toContain('utm_medium');
    });

    test('should remove Facebook click ID', () => {
      const dirty = 'https://example.com/?fbclid=abc123&page=1';
      const result = sanitizeUrl(dirty);
      expect(result).not.toContain('fbclid');
      expect(result).toContain('page=1');
    });

    test('should return original for invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBe('not-a-url');
    });
  });

  describe('isDangerousUrl', () => {
    test('should flag javascript: URLs', () => {
      expect(isDangerousUrl('javascript:alert(1)')).toBe(true);
    });

    test('should flag data:text/html URLs', () => {
      expect(isDangerousUrl('data:text/html,<h1>bad</h1>')).toBe(true);
    });

    test('should not flag regular URLs', () => {
      expect(isDangerousUrl('https://google.com')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    test('should extract domain from URL', () => {
      expect(extractDomain('https://www.google.com/search?q=test')).toBe('www.google.com');
    });

    test('should return empty for invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBe('');
    });
  });
});
