import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * AndroidFrame.jsx - Android Device Frame Simulation
 * 
 * Acting as a senior UI architect, we build a pixel-perfect Google Pixel simulation wrapper.
 * Displays local system time, status indicators (Wifi, Battery, Signal), camera notch,
 * and bottom gesture navigation pill.
 */
export default function AndroidFrame({ children }) {
  const { theme } = useApp();
  const [time, setTime] = useState('');

  // Clock Update Effect (HH:MM format)
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`android-frame-wrapper ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="android-device">
        {/* Hardware Notch */}
        <div className="android-camera-notch" />
        
        {/* Status Bar */}
        <div className="android-status-bar">
          <span className="status-bar-time">{time}</span>
          <div className="status-bar-icons">
            {/* Wifi Icon (SVG) */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21l-12-12c2.4-2.4 5.6-3.8 9-3.8s6.6 1.4 9 3.8l-12 12zm0-18c-3.8 0-7.3 1.4-10 3.8l10 10 10-10c-2.7-2.4-6.2-3.8-10-3.8z" />
            </svg>
            {/* Cellular Network Signal (SVG) */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 22h20v-20h-20v20zm18-2h-16v-16h16v16z" />
            </svg>
            {/* Battery Indicator (SVG) */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 5h-3v-2h-4v2h-3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm0 16h-10v-11h10v11z" />
            </svg>
          </div>
        </div>

        {/* Viewport for all application pages */}
        <div className="android-screen-content">
          {children}
        </div>

        {/* Home Screen gesture bar */}
        <div className="android-gesture-bar">
          <div className="android-gesture-pill" />
        </div>
      </div>
    </div>
  );
}
