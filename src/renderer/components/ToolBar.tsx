import React from 'react';

interface ToolBarProps {
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onAddTab: () => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  isLoading: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onBack,
  onForward,
  onReload,
  onAddTab,
  onToggleSidebar,
  onToggleDarkMode,
  isLoading,
}) => {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={onToggleSidebar} title="Toggle Sidebar" id="toggle-sidebar">
        ☰
      </button>

      <div className="toolbar-separator" />

      <button className="toolbar-btn" onClick={onBack} title="Go Back" id="nav-back">
        ←
      </button>
      <button className="toolbar-btn" onClick={onForward} title="Go Forward" id="nav-forward">
        →
      </button>
      <button className="toolbar-btn" onClick={onReload} title="Reload" id="nav-reload">
        {isLoading ? '✕' : '↻'}
      </button>

      <div className="toolbar-spacer" />

      <button className="toolbar-btn" onClick={onAddTab} title="New Tab" id="new-tab">
        ＋
      </button>
      <button className="toolbar-btn" onClick={onToggleDarkMode} title="Toggle Theme" id="toggle-theme">
        🌙
      </button>
    </div>
  );
};

export default ToolBar;
