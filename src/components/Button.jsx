import React from 'react';

/**
 * Button.jsx - Material Design 3 Button Component
 * 
 * Acting as a senior mobile UI architect, this component implements MD3 tactile actions:
 * - Variant options: 'filled' (high emphasis), 'outlined' (medium), 'text' (low)
 * - Ripple animations, icon prefixes, and responsive click handlers
 */
export default function Button({
  children,
  onClick,
  variant = 'filled', // 'filled' | 'outlined' | 'text'
  disabled = false,
  fullWidth = false,
  icon,
  style = {},
  className = '',
}) {
  const getButtonStyles = () => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-family-title)',
      fontWeight: '600',
      fontSize: '14px',
      padding: '12px 24px',
      borderRadius: '20px', // MD3 pill shape
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      width: fullWidth ? '100%' : 'auto',
      outline: 'none',
      userSelect: 'none',
      ...style,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        color: 'var(--md-sys-color-on-surface-variant)',
        opacity: 0.6,
        cursor: 'not-allowed',
        boxShadow: 'none',
      };
    }

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)',
          border: '1.5px solid var(--md-sys-color-primary)',
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)',
          padding: '8px 16px',
        };
      case 'filled':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          boxShadow: 'var(--elevation-1)',
        };
    }
  };

  const handleActiveScale = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'scale(0.96)';
  };

  const handleNormalScale = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={getButtonStyles()}
      onMouseDown={handleActiveScale}
      onMouseUp={handleNormalScale}
      onMouseLeave={handleNormalScale}
      onTouchStart={handleActiveScale}
      onTouchEnd={handleNormalScale}
      className={`ripple ${className}`}
    >
      {icon && <span style={{ display: 'flex', fontSize: '16px' }}>{icon}</span>}
      {children}
    </button>
  );
}
