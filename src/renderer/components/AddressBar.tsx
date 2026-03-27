import React, { useState, useCallback } from 'react';
import { isValidUrl, enforceHttps } from '../../shared/security';

interface AddressBarProps {
  url: string;
  onNavigate: (url: string) => void;
  isLoading: boolean;
}

const AddressBar: React.FC<AddressBarProps> = ({ url, onNavigate, isLoading }) => {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = url.startsWith('https://');
  const isBlank = url === 'about:blank' || url === '';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      let targetUrl = inputValue.trim();

      if (!targetUrl) {
        return;
      }

      if (isValidUrl(targetUrl)) {
        targetUrl = enforceHttps(targetUrl);
      } else if (isValidUrl(`https://${targetUrl}`)) {
        targetUrl = `https://${targetUrl}`;
      } else {
        // Treat as search query
        targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
      }

      onNavigate(targetUrl);
      (document.activeElement as HTMLElement)?.blur();
    },
    [inputValue, onNavigate]
  );

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(url === 'about:blank' ? '' : url);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getSecurityIcon = () => {
    if (isBlank) {return '🔍';}
    if (isSecure) {return '🔒';}
    return '⚠️';
  };

  const getSecurityClass = () => {
    if (isBlank) {return '';}
    if (isSecure) {return 'secure';}
    return 'insecure';
  };

  return (
    <div className="address-bar-wrapper">
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <div className="address-bar">
          <span className={`address-bar-icon ${getSecurityClass()}`}>{getSecurityIcon()}</span>
          <input
            id="address-bar-input"
            type="text"
            value={isFocused ? inputValue : (url === 'about:blank' ? '' : url)}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search or enter URL..."
            autoComplete="off"
            spellCheck={false}
          />
          {isLoading && <div className="address-bar-loading" />}
        </div>
      </form>
    </div>
  );
};

export default AddressBar;
