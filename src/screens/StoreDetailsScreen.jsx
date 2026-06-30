import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { MenuItemCard } from '../components/Card';
import Button from '../components/Button';

/**
 * StoreDetailsScreen.jsx - Store Details & Menu Customizer Sheet
 * 
 * Displays restaurant headers and sorted food items. Adds interactive Customization
 * Bottom sheets overlaying choices like Single/Double patties, bacon toppings, etc.
 */
export default function StoreDetailsScreen() {
  const { currentScreen, pop } = useNavigation();
  const { addToCart } = useApp();
  const { restaurant } = currentScreen.params;

  // State for customization bottom sheet modal
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});

  if (!restaurant) {
    return (
      <div style={errorState}>
        <span>Store data not found.</span>
        <Button onClick={() => pop()}>Go Back</Button>
      </div>
    );
  }

  // Group menu by categories
  const categories = Array.from(new Set(restaurant.menu.map((item) => item.category)));

  const handleOpenCustomizer = (item) => {
    if (!item.customizations || item.customizations.length === 0) {
      // Add straight to cart if no options are present
      addToCart(item, restaurant.id, restaurant.name, [], 'food');
      alert(`Added ${item.name} to cart!`);
      return;
    }

    // Set initial defaults for customization selections
    const initialSelections = {};
    item.customizations.forEach((cust) => {
      if (cust.required) {
        initialSelections[cust.name] = cust.options[0];
      }
    });

    setSelectedCustomizations(initialSelections);
    setCustomizingItem(item);
  };

  const handleToggleOption = (custName, option, isRequired) => {
    setSelectedCustomizations((prev) => {
      const updated = { ...prev };
      if (isRequired) {
        // Single selection radio behaviour
        updated[custName] = option;
      } else {
        // Multiple check box option behaviour (represented as array in prev)
        const currentList = prev[custName] || [];
        const exists = currentList.some(o => o.name === option.name);
        
        if (exists) {
          updated[custName] = currentList.filter(o => o.name !== option.name);
        } else {
          updated[custName] = [...currentList, option];
        }
      }
      return updated;
    });
  };

  const handleConfirmCustomization = () => {
    // Flatten selections into array for AppContext storage
    const flatSelections = [];
    customizingItem.customizations.forEach((cust) => {
      const selected = selectedCustomizations[cust.name];
      if (selected) {
        if (Array.isArray(selected)) {
          selected.forEach(opt => {
            flatSelections.push({ customizationName: cust.name, selectedOption: opt });
          });
        } else {
          flatSelections.push({ customizationName: cust.name, selectedOption: selected });
        }
      }
    });

    addToCart(customizingItem, restaurant.id, restaurant.name, flatSelections, 'food');
    setCustomizingItem(null);
    alert(`Added customized ${customizingItem.name} to cart!`);
  };

  const calculateCustomTotal = () => {
    if (!customizingItem) return 0;
    let total = customizingItem.price;

    customizingItem.customizations.forEach((cust) => {
      const selected = selectedCustomizations[cust.name];
      if (selected) {
        if (Array.isArray(selected)) {
          selected.forEach(opt => { total += opt.extraPrice; });
        } else {
          total += selected.extraPrice;
        }
      }
    });

    return total;
  };

  return (
    <div className="screen-transition-container" style={detailsContainer}>
      {/* Navigation Header */}
      <div style={navHeader}>
        <button onClick={() => pop()} style={backBtn}>
          ◀ Back
        </button>
        <span style={navTitle}>Menu</span>
        <div style={{ width: '48px' }}></div> {/* Spacer balance */}
      </div>

      {/* Brand Header Card */}
      <div style={{ ...brandBanner, background: `linear-gradient(135deg, ${restaurant.accentColor}dd 0%, ${restaurant.accentColor} 100%)` }}>
        <div style={brandIconBg}>{restaurant.featuredImage}</div>
        <div style={brandTextCol}>
          <h2 style={brandName}>{restaurant.name}</h2>
          <p style={brandCuisine}>{restaurant.cuisine}</p>
          <div style={brandStatsRow}>
            <span>⭐ {restaurant.rating} ({restaurant.reviewsCount})</span>
            <span>•</span>
            <span>🛵 {restaurant.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Menu Categories list */}
      <div style={menuListWrapper}>
        {categories.map((cat) => (
          <div key={cat} style={categoryGroup}>
            <div style={categoryTitle}>{cat}</div>
            <div style={categoryItemsList}>
              {restaurant.menu
                .filter((item) => item.category === cat)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddClick={() => handleOpenCustomizer(item)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Customizer Bottom Sheet Modal overlay */}
      {customizingItem && (
        <div style={bottomSheetOverlay} onClick={() => setCustomizingItem(null)}>
          <div style={bottomSheetContent} onClick={(e) => e.stopPropagation()} className="card-elevation-4">
            <div style={sheetHeader}>
              <div style={sheetTitleBlock}>
                <h3 style={sheetItemName}>{customizingItem.name}</h3>
                <p style={sheetItemDesc}>{customizingItem.description}</p>
              </div>
              <button onClick={() => setCustomizingItem(null)} style={closeSheetBtn}>✕</button>
            </div>

            <div style={optionsScrollArea}>
              {customizingItem.customizations.map((cust) => (
                <div key={cust.name} style={custSection}>
                  <div style={custTitleRow}>
                    <span style={custName}>{cust.name}</span>
                    {cust.required ? (
                      <span style={reqBadge}>Required</span>
                    ) : (
                      <span style={optBadge}>Optional</span>
                    )}
                  </div>

                  <div style={optionsList}>
                    {cust.options.map((option) => {
                      const selection = selectedCustomizations[cust.name];
                      const isSelected = cust.required
                        ? selection?.name === option.name
                        : (selection || []).some(o => o.name === option.name);

                      return (
                        <div 
                          key={option.name} 
                          onClick={() => handleToggleOption(cust.name, option, cust.required)}
                          style={{
                            ...optionItem,
                            backgroundColor: isSelected ? 'var(--md-sys-color-primary-container)' : 'transparent',
                            borderColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'
                          }}
                        >
                          <div style={radioOrCheckboxRow}>
                            <div style={cust.required ? radioBox(isSelected) : checkBox(isSelected)} />
                            <span style={optionText}>{option.name}</span>
                          </div>
                          {option.extraPrice > 0 && (
                            <span style={extraPriceText}>+${option.extraPrice.toFixed(2)}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sheet CTA bar */}
            <div style={sheetFooter}>
              <div style={priceBlock}>
                <span style={totalPriceLabel}>Total Price</span>
                <span style={totalPriceAmt}>${calculateCustomTotal().toFixed(2)}</span>
              </div>
              <Button onClick={handleConfirmCustomization} style={addToCartBtnSheet}>
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const detailsContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '20px',
};

const navHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderBottom: '1px solid var(--md-sys-color-outline)',
};

const backBtn = {
  border: 'none',
  background: 'none',
  color: 'var(--md-sys-color-primary)',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: '8px',
};

const navTitle = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const brandBanner = {
  margin: '16px',
  padding: '24px 20px',
  borderRadius: '24px',
  color: '#FFFFFF',
  display: 'flex',
  gap: '16px',
  boxShadow: 'var(--elevation-2)',
};

const brandIconBg = {
  width: '72px',
  height: '72px',
  borderRadius: '16px',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
};

const brandTextCol = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const brandName = {
  fontSize: '18px',
  fontWeight: '800',
  color: '#FFFFFF',
  marginBottom: '2px',
};

const brandCuisine = {
  fontSize: '12px',
  opacity: 0.9,
  marginBottom: '6px',
};

const brandStatsRow = {
  display: 'flex',
  gap: '8px',
  fontSize: '11px',
  fontWeight: '600',
};

const menuListWrapper = {
  flex: 1,
};

const categoryGroup = {
  marginBottom: '16px',
};

const categoryTitle = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  padding: '12px 16px 6px 16px',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
};

const categoryItemsList = {
  display: 'flex',
  flexDirection: 'column',
};

const errorState = {
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
};

// Bottom Sheet Styles
const bottomSheetOverlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  zIndex: 1000,
  animation: 'fadeIn 0.2s ease-out',
};

const bottomSheetContent = {
  backgroundColor: 'var(--md-sys-color-surface)',
  borderTopLeftRadius: '28px',
  borderTopRightRadius: '28px',
  padding: '24px 20px',
  maxHeight: '75%',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
};

const sheetHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingBottom: '16px',
  borderBottom: '1px solid var(--md-sys-color-outline)',
};

const sheetTitleBlock = {
  flex: 1,
  paddingRight: '12px',
};

const sheetItemName = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '4px',
};

const sheetItemDesc = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
};

const closeSheetBtn = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  border: 'none',
  color: 'var(--md-sys-color-on-surface-variant)',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const optionsScrollArea = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 0',
};

const custSection = {
  marginBottom: '20px',
};

const custTitleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};

const custName = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const reqBadge = {
  fontSize: '9px',
  fontWeight: '700',
  color: 'var(--md-sys-color-primary)',
  backgroundColor: 'var(--md-sys-color-primary-container)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const optBadge = {
  fontSize: '9px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const optionsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const optionItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid var(--md-sys-color-outline)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const radioOrCheckboxRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const optionText = {
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--md-sys-color-on-background)',
};

const extraPriceText = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-primary)',
};

const radioBox = (isSelected) => ({
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: `2px solid ${isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
  backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'transparent',
  boxShadow: isSelected ? 'inset 0 0 0 3px var(--md-sys-color-primary-container)' : 'none',
  transition: 'all 0.15s ease',
});

const checkBox = (isSelected) => ({
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  border: `2px solid ${isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
  backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
});

const sheetFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '16px',
  borderTop: '1px solid var(--md-sys-color-outline)',
};

const priceBlock = {
  display: 'flex',
  flexDirection: 'column',
};

const totalPriceLabel = {
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
};

const totalPriceAmt = {
  fontSize: '18px',
  fontWeight: '800',
  color: 'var(--md-sys-color-primary)',
};

const addToCartBtnSheet = {
  width: '140px',
};
