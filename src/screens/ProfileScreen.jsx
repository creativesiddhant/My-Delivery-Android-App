import React from 'react';
import { useApp } from '../context/AppContext';
import { userAddresses } from '../data/mockData';
import Button from '../components/Button';

/**
 * ProfileScreen.jsx - User Options & MD3 Showcase
 * 
 * Provides theme controls, address indicators, and acts as an educational resource
 * explaining Material Design 3 attributes utilized throughout this learning sandbox.
 */
export default function ProfileScreen() {
  const { theme, toggleTheme, selectedAddress, setSelectedAddress } = useApp();

  const handleAddressChange = (addr) => {
    setSelectedAddress(addr);
    alert(`Active delivery address updated to: ${addr.label}`);
  };

  return (
    <div className="screen-transition-container" style={profileContainer}>
      {/* Profile Card Header */}
      <div style={profileHeaderCard}>
        <div style={avatarBg}>👤</div>
        <div style={userInfo}>
          <h2 style={userName}>Siddharth Kumar</h2>
          <p style={userContact}>learn.android@gmail.com</p>
          <p style={userContact}>+1 (555) 019-2834</p>
        </div>
      </div>

      {/* Settings Options List */}
      <div style={settingsGroup}>
        <div style={groupTitle}>Preferences</div>
        
        {/* Theme Switch option */}
        <div style={settingsItem} onClick={toggleTheme}>
          <div style={itemLeftRow}>
            <span style={itemIcon}>🎨</span>
            <div style={itemTextCol}>
              <span style={itemLabel}>Dark Theme Mode</span>
              <span style={itemSub}>Toggle between Light & Dark MD3 tones</span>
            </div>
          </div>
          <div style={switchControl(theme === 'dark')}>
            <div style={switchPill(theme === 'dark')} />
          </div>
        </div>

        {/* Selected Address Option */}
        <div style={settingsItem}>
          <div style={itemLeftRow}>
            <span style={itemIcon}>📍</span>
            <div style={itemTextCol}>
              <span style={itemLabel}>Saved Locations</span>
              <span style={itemSub}>Active: {selectedAddress.label}</span>
            </div>
          </div>
        </div>

        {/* Address Selection List */}
        <div style={addressBoxWrapper}>
          {userAddresses.map((addr) => {
            const isSelected = selectedAddress.id === addr.id;
            return (
              <div 
                key={addr.id}
                onClick={() => handleAddressChange(addr)}
                style={{
                  ...addressOption,
                  borderColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                  backgroundColor: isSelected ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{addr.icon}</span>
                  <span style={addressName}>{addr.label}</span>
                </div>
                {isSelected && <span style={checkMark}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* MD3 Learning Panel */}
      <div style={learningCard} className="card-elevation-1">
        <div style={learningTitle}>💡 Material Design 3 Spec Guide</div>
        <p style={learningIntro}>
          Since you are learning, here are the Android design details we implemented in this application:
        </p>

        <div style={specList}>
          <div style={specItem}>
            <strong>Shapes & Radius:</strong> MD3 specifies rounded corners based on container size. Chips & small buttons use Medium (12px) rounding, cards use Large (20px-24px), and bottom sheets/dialogs use Extra Large (28px).
          </div>
          <div style={specItem}>
            <strong>Elevations:</strong> Shadows use a modern soft gradient overlay rather than hard shadows, controlled via box-shadow indexes (Elevation 1 for cards, Elevation 3 for bottom bars).
          </div>
          <div style={specItem}>
            <strong>Color Theming:</strong> HSL tokens enable high contrast. Primary Colors represent actions, while containers utilize highly diluted pastel tints for visual balance.
          </div>
          <div style={specItem}>
            <strong>Micro-Animations:</strong> Active states utilize scaling down elements (scale(0.96)) to give a satisfying "pressed" tactile feel when clicked on mobile screens.
          </div>
        </div>
      </div>

      {/* Sandbox stats */}
      <div style={sandboxStats}>
        <span style={statsLabel}>Sprint 1 Sandbox Build • v1.0.0</span>
      </div>
    </div>
  );
}

// Styles
const profileContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '30px',
};

const profileHeaderCard = {
  display: 'flex',
  gap: '20px',
  padding: '24px 20px',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderBottom: '1px solid var(--md-sys-color-outline)',
  alignItems: 'center',
};

const avatarBg = {
  width: '68px',
  height: '68px',
  borderRadius: '50%',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  boxShadow: 'var(--elevation-1)',
};

const userInfo = {
  display: 'flex',
  flexDirection: 'column',
};

const userName = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '2px',
};

const userContact = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  lineHeight: '1.4',
};

const settingsGroup = {
  padding: '16px 0',
  borderBottom: '1px solid var(--md-sys-color-outline)',
};

const groupTitle = {
  fontSize: '11px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  padding: '0 20px 8px 20px',
};

const settingsItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 20px',
  cursor: 'pointer',
  backgroundColor: 'var(--md-sys-color-surface)',
  transition: 'background-color 0.15s ease',
};

const itemLeftRow = {
  display: 'flex',
  gap: '14px',
  alignItems: 'center',
};

const itemIcon = {
  fontSize: '20px',
};

const itemTextCol = {
  display: 'flex',
  flexDirection: 'column',
};

const itemLabel = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
};

const itemSub = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  marginTop: '2px',
};

const switchControl = (isActive) => ({
  width: '40px',
  height: '22px',
  borderRadius: '100px',
  backgroundColor: isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
});

const switchPill = (isActive) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  position: 'absolute',
  top: '3px',
  left: isActive ? '21px' : '3px',
  transition: 'left 0.2s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const addressBoxWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px 20px 0 20px',
};

const addressOption = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--md-sys-color-outline)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const addressName = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
};

const checkMark = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-primary)',
};

const learningCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  margin: '16px',
  borderRadius: '24px',
  padding: '20px',
  border: '1px solid var(--md-sys-color-outline)',
};

const learningTitle = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '6px',
};

const learningIntro = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
  marginBottom: '14px',
  fontWeight: '500',
};

const specList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const specItem = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-background)',
  lineHeight: '1.4',
  fontWeight: '500',
};

const sandboxStats = {
  textAlign: 'center',
  padding: '8px 0',
  marginTop: 'auto',
};

const statsLabel = {
  fontSize: '10px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '600',
};
