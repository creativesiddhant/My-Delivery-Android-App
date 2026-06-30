import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

/**
 * OrdersScreen.jsx - Live Order Tracker & History Logs
 * 
 * Displays:
 * 1. Live status stepper for the active delivery (Kitchen -> Picked up -> Nearby -> Done).
 * 2. Historic order listings with custom "Reorder" shortcuts that rebuild cart selections.
 */
export default function OrdersScreen() {
  const { push } = useNavigation();
  const { activeOrder, pastOrders, addToCart } = useApp();

  const handleReorder = (order) => {
    order.items.forEach((cartItem) => {
      // Re-add items to cart
      addToCart(
        cartItem.item,
        cartItem.storeId,
        cartItem.storeName,
        cartItem.customizations,
        cartItem.type
      );
    });
    alert('Items from this order re-added to your cart!');
    push('Cart');
  };

  const renderActiveTracker = () => {
    if (!activeOrder) return null;

    const steps = [
      { key: 'preparing', label: 'Order Confirmed & Preparing', desc: 'The kitchen/store is preparing your items.' },
      { key: 'rider_picked_up', label: 'Out for Delivery', desc: 'Rider is carrying your package to your location.' },
      { key: 'rider_nearby', label: 'Rider Nearby', desc: 'Rider is arriving at your gate. Get ready!' },
      { key: 'delivered', label: 'Delivered', desc: 'Enjoy your package! Thank you for choosing us.' },
    ];

    // Helper to check if a step is active or completed
    const getStepStatus = (stepKey) => {
      const statusHierarchy = ['preparing', 'rider_picked_up', 'rider_nearby', 'delivered'];
      const currentIndex = statusHierarchy.indexOf(activeOrder.status);
      const stepIndex = statusHierarchy.indexOf(stepKey);

      if (currentIndex > stepIndex) return 'completed';
      if (currentIndex === stepIndex) return 'current';
      return 'pending';
    };

    return (
      <div style={trackerCard} className="card-elevation-2">
        <div style={trackerHeader}>
          <span style={livePulse}>🔴 LIVE</span>
          <div style={orderIdText}>Order ID: {activeOrder.orderId}</div>
        </div>

        <div style={statusBanner}>
          <div style={statusTitle}>{activeOrder.storeName}</div>
          <p style={statusMessage}>{activeOrder.message}</p>
        </div>

        {/* Progress Bar */}
        <div style={progressContainer}>
          <div 
            style={{
              ...progressBar,
              width: `${activeOrder.progress}%`,
              backgroundColor: activeOrder.status === 'delivered' ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-primary)'
            }}
          />
        </div>

        {/* Stepper Steps */}
        <div style={stepperContainer}>
          {steps.map((step, idx) => {
            const stepStatus = getStepStatus(step.key);
            return (
              <div key={step.key} style={stepRow}>
                {/* Visual Line connector */}
                {idx < steps.length - 1 && (
                  <div 
                    style={{
                      ...stepConnectorLine,
                      backgroundColor: stepStatus === 'completed' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'
                    }} 
                  />
                )}
                
                {/* Circle Icon */}
                <div style={stepCircle(stepStatus)}>
                  {stepStatus === 'completed' ? '✓' : idx + 1}
                </div>

                <div style={stepTextCol}>
                  <div style={stepLabel(stepStatus === 'current')}>{step.label}</div>
                  <div style={stepDesc}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Items Summary in tracker */}
        <div style={trackerBillSummary}>
          <div style={billSummaryTitle}>Summary</div>
          {activeOrder.items.map((cartItem, idx) => (
            <div key={idx} style={billItemRow}>
              <span>{cartItem.quantity}x {cartItem.item.name}</span>
              <span>
                ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={billTotalRow}>
            <span>Total Paid</span>
            <span>${activeOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="screen-transition-container" style={ordersContainer}>
      <div style={headerTitle}>My Orders</div>

      {/* 1. Live Active Order Tracker */}
      {activeOrder && (
        <div style={sectionWrapper}>
          <div style={sectionLabel}>Active Delivery</div>
          {renderActiveTracker()}
        </div>
      )}

      {/* 2. Past Order Logs */}
      <div style={sectionWrapper}>
        <div style={sectionLabel}>Order History</div>
        {pastOrders.length === 0 ? (
          <div style={emptyHistory} className="card-elevation-1">
            <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>📦</span>
            <div>No orders placed yet</div>
            <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '4px' }}>
              Your order summaries will display here after you checkout items.
            </p>
          </div>
        ) : (
          <div style={historyList}>
            {pastOrders.map((order) => (
              <div key={order.orderId} style={historyCard} className="card-elevation-1">
                <div style={historyHeader}>
                  <div style={historyStoreBlock}>
                    <div style={storeNameText}>{order.storeName}</div>
                    <div style={orderDateText}>{order.date} • {order.items.length} items</div>
                  </div>
                  <span style={deliveredBadge}>Delivered ✓</span>
                </div>

                <div style={historyItemsPreview}>
                  {order.items.map((cartItem, i) => (
                    <span key={i} style={historyItemLabel}>
                      {cartItem.quantity}x {cartItem.item.name}
                      {i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div style={historyFooter}>
                  <span style={historyPrice}>Total: ${order.total.toFixed(2)}</span>
                  <button 
                    onClick={() => handleReorder(order)}
                    style={reorderBtn}
                    className="ripple"
                  >
                    Order Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Space padding */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
}

// Styles
const ordersContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '20px',
};

const headerTitle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  padding: '16px 16px 8px 16px',
  fontFamily: 'var(--font-family-title)',
};

const sectionWrapper = {
  padding: '0 16px 16px 16px',
};

const sectionLabel = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '10px',
};

const trackerCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '24px',
  padding: '20px',
  border: '1.5px solid var(--md-sys-color-outline)',
};

const trackerHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '14px',
};

const livePulse = {
  fontSize: '10px',
  fontWeight: '800',
  color: '#FFFFFF',
  backgroundColor: '#FF3B30',
  padding: '3px 8px',
  borderRadius: '4px',
  letterSpacing: '0.8px',
  animation: 'pulse 1s infinite alternate',
};

const orderIdText = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
};

const statusBanner = {
  marginBottom: '16px',
};

const statusTitle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '4px',
};

const statusMessage = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
  fontWeight: '500',
};

const progressContainer = {
  height: '6px',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  borderRadius: '100px',
  overflow: 'hidden',
  marginBottom: '24px',
};

const progressBar = {
  height: '100%',
  transition: 'width 0.8s ease-in-out',
};

const stepperContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  position: 'relative',
  paddingLeft: '12px',
  marginBottom: '24px',
};

const stepRow = {
  display: 'flex',
  gap: '16px',
  position: 'relative',
  alignItems: 'flex-start',
};

const stepConnectorLine = {
  position: 'absolute',
  top: '24px',
  left: '11px',
  width: '2px',
  height: 'calc(100% + 4px)',
  zIndex: 1,
};

const stepCircle = (status) => {
  let bg = 'var(--md-sys-color-surface-variant)';
  let border = '2px solid var(--md-sys-color-outline)';
  let color = 'var(--md-sys-color-on-surface-variant)';

  if (status === 'completed') {
    bg = 'var(--md-sys-color-primary)';
    border = '2px solid var(--md-sys-color-primary)';
    color = 'var(--md-sys-color-on-primary)';
  } else if (status === 'current') {
    bg = 'var(--md-sys-color-primary-container)';
    border = '2px solid var(--md-sys-color-primary)';
    color = 'var(--md-sys-color-on-primary-container)';
  }

  return {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: bg,
    border: border,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    zIndex: 2,
    transition: 'all 0.3s ease',
  };
};

const stepTextCol = {
  display: 'flex',
  flexDirection: 'column',
};

const stepLabel = (isCurrent) => ({
  fontSize: '13px',
  fontWeight: '800',
  color: isCurrent ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-background)',
  transition: 'color 0.2s ease',
});

const stepDesc = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  marginTop: '2px',
};

const trackerBillSummary = {
  borderTop: '1.5px solid var(--md-sys-color-outline)',
  paddingTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const billSummaryTitle = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '4px',
};

const billItemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '600',
};

const billTotalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginTop: '4px',
};

const emptyHistory = {
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '20px',
  padding: '30px',
  textAlign: 'center',
  border: '1px solid var(--md-sys-color-outline)',
};

const historyList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const historyCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '20px',
  padding: '16px',
  border: '1px solid var(--md-sys-color-outline)',
};

const historyHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderBottom: '1px solid var(--md-sys-color-outline)',
  paddingBottom: '10px',
  marginBottom: '10px',
};

const historyStoreBlock = {
  display: 'flex',
  flexDirection: 'column',
};

const storeNameText = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const orderDateText = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
};

const deliveredBadge = {
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--md-sys-color-secondary)',
  backgroundColor: 'var(--md-sys-color-secondary-container)',
  padding: '2px 8px',
  borderRadius: '6px',
};

const historyItemsPreview = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  marginBottom: '12px',
  lineHeight: '1.4',
};

const historyItemLabel = {
  color: 'var(--md-sys-color-on-surface-variant)',
};

const historyFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const historyPrice = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const reorderBtn = {
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-primary)',
  border: '1.5px solid var(--md-sys-color-primary)',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '11px',
  padding: '6px 14px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};
