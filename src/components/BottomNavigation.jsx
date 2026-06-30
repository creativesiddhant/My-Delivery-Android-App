import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';

/**
 * BottomNavigation.jsx - Material Design 3 Navigation Bar
 * 
 * Acting as a senior UI architect, we implement the MD3 navigation bar spec:
 * - Active state indicator pill shapes underneath the icon
 * - Bubble badges indicating current cart quantity counts
 * - Smooth state transitions when swapping between stack views
 */
export default function BottomNavigation() {
  const { currentScreen, reset } = useNavigation();
  const { cart } = useApp();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    {
      name: 'Home',
      label: 'Home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      name: 'Search',
      label: 'Search',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ),
    },
    {
      name: 'Cart',
      label: 'Cart',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      badge: totalCartItems,
    },
    {
      name: 'Orders',
      label: 'Orders',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      name: 'Profile',
      label: 'Profile',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  const handleTabClick = (tabName) => {
    reset(tabName);
  };

  // Determine active state helper
  const isActiveTab = (tabName) => {
    // If we're on StoreDetails, "Home" should be active in navigation
    if (tabName === 'Home' && currentScreen.name === 'StoreDetails') return true;
    return currentScreen.name === tabName;
  };

  return (
    <div style={navBarContainer} className="glassmorphic card-elevation-3">
      {tabs.map((tab) => {
        const active = isActiveTab(tab.name);
        return (
          <div
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            style={tabItemStyle}
            className="ripple"
          >
            <div style={iconContainerStyle}>
              {/* Active Pill Outline Overlay (MD3 Style) */}
              <div style={activePillStyle(active)} />
              <div style={iconStyle(active)}>{tab.icon}</div>
              
              {/* Cart Badge Indicator */}
              {tab.badge > 0 ? (
                <div style={badgeStyle}>{tab.badge}</div>
              ) : null}
            </div>
            <span style={labelStyle(active)}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const navBarContainer = {
  display: 'flex',
  height: '76px',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '0 8px 4px 8px',
  borderTop: '1px solid var(--md-sys-color-outline)',
  zIndex: 9,
  transition: 'background-color 0.3s ease',
};

const tabItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flex: 1,
  height: '100%',
  gap: '4px',
  position: 'relative',
};

const iconContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '32px',
};

const activePillStyle = (isActive) => ({
  position: 'absolute',
  width: '64px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: 'var(--md-sys-color-primary-container)',
  opacity: isActive ? 1 : 0,
  transform: isActive ? 'scale(1)' : 'scale(0.8)',
  transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.15s linear',
  zIndex: 1,
});

const iconStyle = (isActive) => ({
  color: isActive ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s ease',
});

const labelStyle = (isActive) => ({
  fontFamily: 'var(--font-family-body)',
  fontSize: '11px',
  fontWeight: isActive ? '700' : '500',
  color: isActive ? 'var(--md-sys-color-on-background)' : 'var(--md-sys-color-on-surface-variant)',
  transition: 'color 0.2s ease',
});

const badgeStyle = {
  position: 'absolute',
  top: '-4px',
  right: '8px',
  backgroundColor: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: '700',
  zIndex: 3,
  border: '1.5px solid var(--md-sys-color-surface)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
};
