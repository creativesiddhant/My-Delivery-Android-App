import React from 'react';

/**
 * Chips.jsx - Material Design 3 Category & Filter Chips
 * 
 * Used for dynamic category selecting, price filters, or sorting triggers.
 * Includes selective styling based on whether the chip is currently active/selected.
 */
export default function Chips({
  label,
  selected = false,
  onClick,
  icon,
  style = {},
}) {
  const getChipStyles = () => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      borderRadius: '8px', // MD3 chips are typically 8px or rounded corners
      fontFamily: 'var(--font-family-body)',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      userSelect: 'none',
      border: selected 
        ? '1px solid transparent' 
        : '1px solid var(--md-sys-color-outline)',
      backgroundColor: selected 
        ? 'var(--md-sys-color-primary-container)' 
        : 'var(--md-sys-color-surface)',
      color: selected 
        ? 'var(--md-sys-color-on-primary-container)' 
        : 'var(--md-sys-color-on-surface-variant)',
      boxShadow: selected ? 'var(--elevation-1)' : 'none',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      whiteSpace: 'nowrap',
      ...style,
    };
  };

  const handleActiveScale = (e) => {
    e.currentTarget.style.transform = 'scale(0.95)';
  };

  const handleNormalScale = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div
      onClick={onClick}
      style={getChipStyles()}
      onMouseDown={handleActiveScale}
      onMouseUp={handleNormalScale}
      onMouseLeave={handleNormalScale}
      onTouchStart={handleActiveScale}
      onTouchEnd={handleNormalScale}
      className="ripple"
    >
      {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
      <span>{label}</span>
    </div>
  );
}
