// ============ Security Utilities ============

/**
 * Validate if a string is a valid URL.
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'about:';
  } catch {
    return false;
  }
}

/**
 * Enforce HTTPS by upgrading HTTP URLs to HTTPS.
 * Preserves localhost and about: URLs as-is.
 */
export function enforceHttps(url: string): string {
  if (url.startsWith('about:')) {
    return url;
  }
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
    return url;
  }
  if (url.startsWith('http://')) {
    return url.replace(/^http:\/\//, 'https://');
  }
  return url;
}

/**
 * Sanitize a URL by removing tracking parameters.
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'mc_cid',
      'mc_eid',
      'ref',
    ];
    trackingParams.forEach((param) => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Check if a URL is potentially dangerous.
 */
export function isDangerousUrl(url: string): boolean {
  const dangerousPatterns = [
    /^javascript:/i,
    /^data:text\/html/i,
    /^vbscript:/i,
  ];
  return dangerousPatterns.some((pattern) => pattern.test(url));
}

/**
 * Extract domain from a URL.
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}
