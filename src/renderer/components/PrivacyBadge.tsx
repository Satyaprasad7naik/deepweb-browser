import React, { useState } from 'react';

interface PrivacyReport {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  trackers: string[];
  warnings: string[];
  recommendation: string;
}

interface PrivacyBadgeProps {
  report: PrivacyReport | null;
  isAnalyzing: boolean;
}

const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ report, isAnalyzing }) => {
  const [showPopup, setShowPopup] = useState(false);

  const getRiskClass = () => {
    if (!report) return 'unknown';
    return report.riskLevel.toLowerCase();
  };

  const getRiskIcon = () => {
    if (isAnalyzing) return '⏳';
    if (!report) return '🛡️';
    switch (report.riskLevel) {
      case 'LOW':
        return '🟢';
      case 'MEDIUM':
        return '🟡';
      case 'HIGH':
        return '🔴';
      default:
        return '🛡️';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`privacy-badge ${getRiskClass()}`}
        onClick={() => setShowPopup(!showPopup)}
        title="AI Privacy Guard"
        id="privacy-badge"
      >
        {getRiskIcon()}
      </button>

      {showPopup && report && (
        <div className="privacy-popup">
          <h3>
            AI Privacy Guard
            <span className={`privacy-risk-badge ${getRiskClass()}`}>{report.riskLevel}</span>
          </h3>

          {report.trackers.length > 0 && (
            <div className="privacy-section">
              <div className="privacy-section-title">Trackers Found ({report.trackers.length})</div>
              <ul className="privacy-list">
                {report.trackers.map((tracker, i) => (
                  <li key={i}>{tracker}</li>
                ))}
              </ul>
            </div>
          )}

          {report.warnings.length > 0 && (
            <div className="privacy-section">
              <div className="privacy-section-title">Warnings</div>
              <ul className="privacy-list">
                {report.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="privacy-section">
            <div className="privacy-section-title">Recommendation</div>
            <div className="privacy-recommendation">{report.recommendation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyBadge;
