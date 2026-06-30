import React from 'react';

/**
 * Card.jsx - Material Design 3 Card Components
 * 
 * Acting as a senior UI architect, we support 3 card variants:
 * 1. 'service': Main dashboard service tiles (Food, Grocery, etc.)
 * 2. 'restaurant': Full width store search result listings
 * 3. 'menu': Restaurant/store specific menu item listings with cart hooks
 */

// 1. Service Tile Card
export function ServiceCard({ service, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        ...serviceCardStyle,
        backgroundColor: service.bgColor,
        border: `1.5px solid ${service.color}1e`
      }}
      className="ripple card-elevation-1"
    >
      <div style={serviceIconBg}>{service.icon}</div>
      <div style={serviceTextCol}>
        <h3 style={serviceTitle}>{service.title}</h3>
        <p style={serviceSubtitle}>{service.subtitle}</p>
      </div>
      {service.badge && (
        <span style={{ ...serviceBadge, backgroundColor: service.color }}>
          {service.badge}
        </span>
      )}
    </div>
  );
}

// 2. Restaurant Listing Card
export function RestaurantCard({ restaurant, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={restCardStyle}
      className="ripple card-elevation-1"
    >
      <div style={{ ...restImgCol, backgroundColor: `${restaurant.accentColor}12` }}>
        <span style={{ fontSize: '32px' }}>{restaurant.featuredImage}</span>
      </div>
      
      <div style={restContentCol}>
        <div style={restHeaderRow}>
          <h3 style={restName}>{restaurant.name}</h3>
          <span style={restRating}>
            ⭐ {restaurant.rating}
          </span>
        </div>
        
        <p style={restCuisine}>{restaurant.cuisine}</p>
        
        <div style={restDetailsRow}>
          <span>🛵 {restaurant.deliveryTime}</span>
          <span>•</span>
          <span>📍 {restaurant.distance}</span>
          <span>•</span>
          <span>💵 {restaurant.costForTwo} for two</span>
        </div>

        <div style={tagRow}>
          {restaurant.freeDelivery && (
            <span style={freeDelTag}>Free Delivery</span>
          )}
          {restaurant.tags?.map((tag, idx) => (
            <span key={idx} style={normalTag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Menu Item Listing Card
export function MenuItemCard({ item, onAddClick }) {
  return (
    <div style={menuCardStyle}>
      <div style={menuTextCol}>
        <div style={vegIndicatorRow}>
          <span 
            style={vegBadge(item.isVeg)} 
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            {item.isVeg ? '🟢' : '🔴'}
          </span>
          {item.isBestSeller && (
            <span style={bestSellerBadge}>★ Best Seller</span>
          )}
        </div>

        <h4 style={menuItemName}>{item.name}</h4>
        <span style={menuItemPrice}>${item.price.toFixed(2)}</span>
        <p style={menuItemDesc}>{item.description}</p>
      </div>

      <div style={menuActionCol}>
        <div style={itemRatingBadge}>⭐ {item.rating}</div>
        <button 
          onClick={onAddClick}
          style={addCartBtn}
          className="ripple"
        >
          ADD
        </button>
      </div>
    </div>
  );
}

// --- Service Card Styles ---
const serviceCardStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  borderRadius: '20px',
  cursor: 'pointer',
  position: 'relative',
  gap: '14px',
  transition: 'transform 0.15s ease',
  width: '100%',
};

const serviceIconBg = {
  fontSize: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  backgroundColor: 'var(--md-sys-color-surface)',
  boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
};

const serviceTextCol = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const serviceTitle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const serviceSubtitle = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
};

const serviceBadge = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  fontSize: '9px',
  color: '#FFFFFF',
  padding: '3px 8px',
  borderRadius: '100px',
  fontWeight: '700',
  letterSpacing: '0.4px',
};

// --- Restaurant Card Styles ---
const restCardStyle = {
  display: 'flex',
  gap: '16px',
  padding: '16px',
  borderRadius: '24px',
  backgroundColor: 'var(--md-sys-color-surface)',
  cursor: 'pointer',
  margin: '0 16px 14px 16px',
  border: '1px solid var(--md-sys-color-outline)',
  transition: 'all 0.2s ease',
};

const restImgCol = {
  width: '84px',
  height: '84px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
};

const restContentCol = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const restHeaderRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2px',
};

const restName = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  lineHeight: '1.2',
  flex: 1,
  paddingRight: '6px',
};

const restRating = {
  fontSize: '12px',
  fontWeight: '700',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  padding: '2px 6px',
  borderRadius: '6px',
  color: 'var(--md-sys-color-on-background)',
  whiteSpace: 'nowrap',
};

const restCuisine = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  marginBottom: '6px',
  fontWeight: '500',
};

const restDetailsRow = {
  display: 'flex',
  gap: '6px',
  fontSize: '11px',
  fontWeight: '600',
  color: 'var(--md-sys-color-on-surface-variant)',
  marginBottom: '8px',
};

const tagRow = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
};

const freeDelTag = {
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--md-sys-color-secondary)',
  backgroundColor: 'var(--md-sys-color-secondary-container)',
  padding: '2px 8px',
  borderRadius: '6px',
};

const normalTag = {
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  padding: '2px 8px',
  borderRadius: '6px',
};

// --- Menu Item Styles ---
const menuCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '16px',
  borderBottom: '1.5px solid var(--md-sys-color-outline)',
  backgroundColor: 'var(--md-sys-color-surface)',
};

const menuTextCol = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const vegIndicatorRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '4px',
};

const vegBadge = (isVeg) => ({
  fontSize: '11px',
});

const bestSellerBadge = {
  fontSize: '10px',
  color: '#D4AF37',
  fontWeight: '700',
};

const menuItemName = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '2px',
};

const menuItemPrice = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-primary)',
  marginBottom: '6px',
};

const menuItemDesc = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
  fontWeight: '500',
};

const menuActionCol = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '84px',
};

const itemRatingBadge = {
  fontSize: '10px',
  fontWeight: '700',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  padding: '2px 6px',
  borderRadius: '4px',
  marginBottom: '10px',
};

const addCartBtn = {
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-primary)',
  border: '1.5px solid var(--md-sys-color-primary)',
  borderRadius: '10px',
  fontWeight: '800',
  fontSize: '12px',
  width: '76px',
  height: '32px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--elevation-1)',
  transition: 'transform 0.15s ease',
};
