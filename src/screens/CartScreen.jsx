import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

/**
 * CartScreen.jsx - Checkout Basket Screen
 * 
 * Computes checkout parameters (subtotal, taxes, delivery fees, promo deductions).
 * Handles cart additions/deductions, coupon verification, and order placement.
 */
export default function CartScreen() {
  const { push } = useNavigation();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    selectedAddress, 
    placeOrder 
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');

  // Cart summary calculations
  const calculateItemCost = (cartItem) => {
    const customizationsPrice = cartItem.customizations.reduce(
      (acc, curr) => acc + curr.selectedOption.extraPrice, 0
    );
    return (cartItem.item.price + customizationsPrice) * cartItem.quantity;
  };

  const getSubtotal = () => {
    return cart.reduce((acc, curr) => acc + calculateItemCost(curr), 0);
  };

  // Determine delivery fee based on store types in cart
  const getDeliveryFee = () => {
    if (cart.length === 0) return 0;
    // Free delivery conditions
    const hasFreeFood = cart.some(i => i.type === 'food' && i.storeId === 'rest_1');
    const hasGenie = cart.some(i => i.type === 'courier');
    if (hasFreeFood) return 0;
    if (hasGenie) return 0; // Genie price includes delivery
    return 1.99;
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'FEAST50') {
      setDiscountPercent(50);
      setPromoApplied('FEAST50 (50% Off Food)');
      alert('Promo FEAST50 applied! 50% discount deducted.');
    } else if (code === 'GREEN15') {
      setDiscountPercent(15);
      setPromoApplied('GREEN15 (15% Off Grocery)');
      alert('Promo GREEN15 applied! 15% discount deducted.');
    } else if (code === 'HEALTH20') {
      setDiscountPercent(20);
      setPromoApplied('HEALTH20 (20% Off Wellness)');
      alert('Promo HEALTH20 applied! 20% discount deducted.');
    } else {
      alert('Invalid coupon code! Try FEAST50, GREEN15 or HEALTH20.');
    }
    setPromoCode('');
  };

  const handleCheckout = () => {
    const fee = getDeliveryFee();
    const order = placeOrder(fee);
    if (order) {
      alert(`Order Placed Successfully!\nID: ${order.orderId}\nTotal Charged: $${(order.total - (order.subtotal * (discountPercent/100))).toFixed(2)}`);
      push('Orders');
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discountAmt = subtotal * (discountPercent / 100);
  const tax = (subtotal - discountAmt) * 0.08;
  const grandTotal = subtotal - discountAmt + tax + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="screen-transition-container" style={emptyCartWrapper}>
        <span style={emptyCartIcon}>🛒</span>
        <div style={emptyTitle}>Your cart is empty</div>
        <p style={emptySub}>Add yummy meals or essential groceries to start ordering.</p>
        <Button onClick={() => push('Home')} style={{ width: '180px' }}>
          Explore Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="screen-transition-container" style={cartContainer}>
      {/* Header */}
      <div style={headerTitle}>My Basket</div>

      {/* Cart Items List */}
      <div style={itemsListWrapper}>
        {cart.map((cartItem) => (
          <div key={cartItem.cartItemId} style={cartItemCard}>
            <div style={itemDetailBlock}>
              <div style={itemNameRow}>
                <span style={vegMark(cartItem.item.isVeg)}>
                  {cartItem.item.isVeg !== undefined ? (cartItem.item.isVeg ? '🟢' : '🔴') : '📦'}
                </span>
                <span style={itemNameText}>{cartItem.item.name}</span>
              </div>
              
              {/* Render custom options */}
              {cartItem.customizations.length > 0 && (
                <div style={customizationsList}>
                  {cartItem.customizations.map((cust, idx) => (
                    <div key={idx} style={customItemText}>
                      • {cust.customizationName}: {cust.selectedOption.name}
                      {cust.selectedOption.extraPrice > 0 && ` (+$${cust.selectedOption.extraPrice})`}
                    </div>
                  ))}
                </div>
              )}

              <div style={itemStoreName}>from {cartItem.storeName}</div>
            </div>

            {/* Adjust Quantities Control */}
            <div style={qtyPriceCol}>
              <div style={qtySelector}>
                <button 
                  onClick={() => updateCartQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                  style={qtyBtn}
                >
                  -
                </button>
                <span style={qtyCount}>{cartItem.quantity}</span>
                <button 
                  onClick={() => updateCartQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                  style={qtyBtn}
                >
                  +
                </button>
              </div>
              <span style={itemPriceText}>
                ${calculateItemCost(cartItem).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Address Card */}
      <div style={addressCard} className="card-elevation-1">
        <div style={addressHeader}>
          <span>Delivery Destination</span>
          <button onClick={() => push('Home')} style={changeAddrBtn}>Change</button>
        </div>
        <div style={addressDetailsRow}>
          <span style={{ fontSize: '18px' }}>
            {selectedAddress.label === 'Home' ? '🏠' : '🏢'}
          </span>
          <div style={addressTextCol}>
            <span style={addressLabelText}>{selectedAddress.label} Address</span>
            <span style={addressDetailText}>{selectedAddress.details}</span>
          </div>
        </div>
      </div>

      {/* Promo Coupon Entry */}
      <div style={promoWrapper} className="card-elevation-1">
        <span style={promoTitle}>Apply Promo Code</span>
        <div style={promoInputRow}>
          <input
            type="text"
            placeholder="e.g. FEAST50, GREEN15"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            style={promoInput}
          />
          <button onClick={handleApplyPromo} style={promoApplyBtn}>Apply</button>
        </div>
        {promoApplied && (
          <div style={promoAppliedText}>
            ✓ Coupon Applied: <strong>{promoApplied}</strong>
          </div>
        )}
      </div>

      {/* Receipt Breakdown Card */}
      <div style={receiptCard} className="card-elevation-1">
        <div style={receiptHeader}>Bill Summary</div>
        <div style={receiptRow}>
          <span>Item Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmt > 0 && (
          <div style={{ ...receiptRow, color: 'var(--md-sys-color-secondary)' }}>
            <span>Coupon Discount</span>
            <span>-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div style={receiptRow}>
          <span>Taxes & Fees (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={receiptRow}>
          <span>Delivery Charge</span>
          <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        
        <div style={divider}></div>
        
        <div style={totalRow}>
          <span>To Pay</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Footer CTA */}
      <div style={checkoutFooter}>
        <Button onClick={handleCheckout} fullWidth style={checkoutBtnStyle}>
          Pay & Place Order • ${grandTotal.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}

// Styles
const cartContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '90px', // spacing for CTA
};

const headerTitle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  padding: '16px 16px 8px 16px',
  fontFamily: 'var(--font-family-title)',
};

const itemsListWrapper = {
  display: 'flex',
  flexDirection: 'column',
};

const cartItemCard = {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'var(--md-sys-color-surface)',
  padding: '14px 16px',
  borderBottom: '1px solid var(--md-sys-color-outline)',
  alignItems: 'center',
};

const itemDetailBlock = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingRight: '12px',
};

const itemNameRow = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginBottom: '4px',
};

const vegMark = (isVeg) => ({
  fontSize: '11px',
});

const itemNameText = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
};

const customizationsList = {
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '18px',
  marginBottom: '4px',
};

const customItemText = {
  fontSize: '10px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
};

const itemStoreName = {
  fontSize: '10px',
  color: 'var(--md-sys-color-on-surface-variant)',
  paddingLeft: '18px',
  fontWeight: '600',
};

const qtyPriceCol = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
};

const qtySelector = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  borderRadius: '8px',
  border: '1px solid var(--md-sys-color-outline)',
  overflow: 'hidden',
};

const qtyBtn = {
  border: 'none',
  background: 'none',
  color: 'var(--md-sys-color-primary)',
  width: '28px',
  height: '28px',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const qtyCount = {
  fontSize: '12px',
  fontWeight: '700',
  width: '20px',
  textAlign: 'center',
  color: 'var(--md-sys-color-on-background)',
};

const itemPriceText = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const addressCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  margin: '16px',
  borderRadius: '20px',
  padding: '14px 16px',
  border: '1px solid var(--md-sys-color-outline)',
};

const addressHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '8px',
};

const changeAddrBtn = {
  border: 'none',
  background: 'none',
  color: 'var(--md-sys-color-primary)',
  fontWeight: '700',
  fontSize: '11px',
  cursor: 'pointer',
};

const addressDetailsRow = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
};

const addressTextCol = {
  display: 'flex',
  flexDirection: 'column',
};

const addressLabelText = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
};

const addressDetailText = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  lineHeight: '1.3',
  maxWidth: '280px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const promoWrapper = {
  backgroundColor: 'var(--md-sys-color-surface)',
  margin: '0 16px 16px 16px',
  borderRadius: '20px',
  padding: '14px 16px',
  border: '1px solid var(--md-sys-color-outline)',
};

const promoTitle = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  display: 'block',
  marginBottom: '8px',
};

const promoInputRow = {
  display: 'flex',
  gap: '10px',
};

const promoInput = {
  flex: 1,
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  color: 'var(--md-sys-color-on-background)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  fontFamily: 'var(--font-family-body)',
  outline: 'none',
  fontWeight: '600',
};

const promoApplyBtn = {
  backgroundColor: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
  border: 'none',
  borderRadius: '8px',
  padding: '0 16px',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
};

const promoAppliedText = {
  fontSize: '11px',
  color: 'var(--md-sys-color-secondary)',
  marginTop: '8px',
  fontWeight: '600',
};

const receiptCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  margin: '0 16px 16px 16px',
  borderRadius: '20px',
  padding: '16px',
  border: '1px solid var(--md-sys-color-outline)',
};

const receiptHeader = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '12px',
};

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--md-sys-color-on-surface-variant)',
  marginBottom: '8px',
};

const divider = {
  height: '1.5px',
  backgroundColor: 'var(--md-sys-color-outline)',
  margin: '12px 0',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const checkoutFooter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '12px 16px',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderTop: '1px solid var(--md-sys-color-outline)',
  boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
  zIndex: 10,
};

const checkoutBtnStyle = {
  height: '48px',
  borderRadius: '12px',
};

const emptyCartWrapper = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
  textAlign: 'center',
  gap: '12px',
  backgroundColor: 'var(--md-sys-color-background)',
};

const emptyCartIcon = {
  fontSize: '56px',
  marginBottom: '12px',
};

const emptyTitle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const emptySub = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
  marginBottom: '12px',
};
