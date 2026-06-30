import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

/**
 * SearchBar.jsx - Material Design 3 Search Bar
 * 
 * Styled as an MD3 container with search leading icon, placeholder text,
 * and trailing voice or filter action controls. Clicking redirects or focus triggers search route.
 */
export default function SearchBar({
  value = '',
  onChange,
  onFocus,
  placeholder = 'Search dishes, groceries, pharmacy...',
  readOnly = false,
  showFilter = true,
  onFilterClick,
}) {
  const { push } = useNavigation();
  const [voiceActive, setVoiceActive] = useState(false);

  const handleFocus = () => {
    if (readOnly) {
      push('Search');
    } else if (onFocus) {
      onFocus();
    }
  };

  const triggerVoiceSearch = (e) => {
    e.stopPropagation();
    setVoiceActive(true);
    alert('Simulating voice input... Try speaking "Truffle Burgers" or "Organic Apples"');
    setTimeout(() => {
      setVoiceActive(false);
      if (onChange) {
        onChange({ target: { value: 'Truffle Burgers' } });
      }
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <div 
        style={barStyle}
        onClick={handleFocus}
      >
        {/* Search Icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          style={inputStyle}
        />

        {/* Voice Search Simulation Button */}
        <button 
          onClick={triggerVoiceSearch}
          style={voiceBtnStyle(voiceActive)}
          title="Voice Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3v-6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1s-5.3-2.1-5.3-5.1h-1.7c0 3.41 2.72 6.23 6 6.72v3.28h3v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </button>
      </div>

      {showFilter && (
        <button 
          onClick={onFilterClick}
          style={filterBtnStyle}
          className="ripple"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

// Inline Styles for styling layout speed and self-containment
const containerStyle = {
  display: 'flex',
  gap: '12px',
  width: '100%',
  alignItems: 'center',
  padding: '8px 16px',
};

const barStyle = {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  borderRadius: '28px', // MD3 Search standard
  padding: '6px 14px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const iconStyle = {
  color: 'var(--md-sys-color-on-surface-variant)',
  marginRight: '10px',
};

const inputStyle = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  outline: 'none',
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: 'var(--font-family-body)',
  color: 'var(--md-sys-color-on-background)',
  height: '36px',
};

const voiceBtnStyle = (active) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: active ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: active ? 'pulse 1s infinite alternate' : 'none',
  outline: 'none',
});

const filterBtnStyle = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  color: 'var(--md-sys-color-on-surface-variant)',
  border: 'none',
  borderRadius: '50%',
  width: '46px',
  height: '46px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
};
