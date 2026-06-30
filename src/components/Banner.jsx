import React, { useState, useEffect } from 'react';
import { promotionalBanners } from '../data/mockData';

/**
 * Banner.jsx - Promotional Slide Carousel
 * 
 * Auto-cycling card slider promoting discount campaigns. Clicking is wired
 * to trigger coupon code notifications or page navigation.
 */
export default function Banner({ onBannerClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard! Paste it at checkout for your discount.`);
  };

  return (
    <div style={carouselContainer}>
      <div 
        style={{
          ...slidesWrapper,
          transform: `translateX(-${activeIndex * 100}%)`
        }}
      >
        {promotionalBanners.map((banner) => (
          <div 
            key={banner.id}
            style={{
              ...slideCard,
              background: banner.color
            }}
            onClick={() => onBannerClick && onBannerClick(banner)}
          >
            <div style={textCol}>
              <span style={badgeStyle}>PROMO</span>
              <h3 style={titleStyle}>{banner.title}</h3>
              <p style={subtitleStyle}>{banner.subtitle}</p>
              
              <div style={couponRow}>
                <span style={codeText}>Code: <strong>{banner.code}</strong></span>
                <button 
                  onClick={(e) => handleCopyCode(e, banner.code)}
                  style={copyBtn}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div style={ctaCol}>
              <button style={ctaButton}>{banner.buttonText}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      <div style={indicatorRow}>
        {promotionalBanners.map((_, i) => (
          <div 
            key={i}
            onClick={() => setActiveIndex(i)}
            style={dotStyle(i === activeIndex)}
          />
        ))}
      </div>
    </div>
  );
}

const carouselContainer = {
  position: 'relative',
  margin: '12px 16px',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: 'var(--elevation-2)',
};

const slidesWrapper = {
  display: 'flex',
  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  width: '100%',
};

const slideCard = {
  flex: '0 0 100%',
  padding: '20px',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  minHeight: '150px',
};

const textCol = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
};

const badgeStyle = {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  padding: '2px 8px',
  borderRadius: '100px',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '1.2px',
  marginBottom: '4px',
};

const titleStyle = {
  color: '#FFFFFF',
  fontSize: '18px',
  fontWeight: '800',
  lineHeight: '1.2',
  marginBottom: '2px',
};

const subtitleStyle = {
  fontSize: '12px',
  opacity: 0.9,
  lineHeight: '1.3',
  marginBottom: '8px',
  paddingRight: '12px',
};

const couponRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  padding: '4px 8px',
  fontSize: '11px',
};

const codeText = {
  color: '#FFFFFF',
};

const copyBtn = {
  border: 'none',
  background: '#FFFFFF',
  color: '#000000',
  borderRadius: '4px',
  padding: '2px 8px',
  fontSize: '10px',
  fontWeight: '700',
  cursor: 'pointer',
};

const ctaCol = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const ctaButton = {
  backgroundColor: '#FFFFFF',
  color: '#000000',
  border: 'none',
  borderRadius: '24px',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const indicatorRow = {
  position: 'absolute',
  bottom: '10px',
  left: '20px',
  display: 'flex',
  gap: '6px',
};

const dotStyle = (isActive) => ({
  width: isActive ? '16px' : '6px',
  height: '6px',
  borderRadius: '100px',
  backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
  transition: 'all 0.25s ease',
  cursor: 'pointer',
});
