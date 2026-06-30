import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { marketplaceServices, restaurants, groceryCategories, pharmacyProducts, userAddresses } from '../data/mockData';
import SearchBar from '../components/SearchBar';
import Banner from '../components/Banner';
import Chips from '../components/Chips';
import { ServiceCard, RestaurantCard } from '../components/Card';
import Button from '../components/Button';

/**
 * HomeScreen.jsx - Multi-Service Marketplace Home Dashboard
 * 
 * Includes dynamic tabs for Food, Grocery, Pharmacy, and Courier services,
 * with an interactive Genie booking form, cart controls, and light/dark theme triggers.
 */
export default function HomeScreen() {
  const { push } = useNavigation();
  const { 
    theme, 
    toggleTheme, 
    selectedAddress, 
    setSelectedAddress, 
    addToCart, 
    placeOrder 
  } = useApp();
  
  const [selectedService, setSelectedService] = useState('food'); // 'food' | 'grocery' | 'pharmacy' | 'courier'
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [selectedGroceryCat, setSelectedGroceryCat] = useState(groceryCategories[0].id);
  const [selectedPharmacyCat, setSelectedPharmacyCat] = useState(pharmacyProducts[0].id);

  // Genie Courier form state
  const [courierForm, setCourierForm] = useState({
    item: '',
    pickup: '',
    dropoff: '',
    weight: 'Under 5kg'
  });

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleBannerClick = (banner) => {
    if (banner.service) {
      setSelectedService(banner.service);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setShowAddressDropdown(false);
  };

  const handleBookGenie = (e) => {
    e.preventDefault();
    if (!courierForm.item || !courierForm.pickup || !courierForm.dropoff) {
      alert('Please fill in all courier details!');
      return;
    }
    // Simulate booking Genie courier
    alert(`Genie Booking Created!\nItem: ${courierForm.item}\nPickup: ${courierForm.pickup}\nDropoff: ${courierForm.dropoff}\nWeight: ${courierForm.weight}\n\nOur rider will pick up your package in 10 minutes.`);
    
    // Add to active orders via AppContext
    // Creating a mock cart item for courier Genie order
    addToCart(
      {
        id: 'genie_item',
        name: `Genie Courier: ${courierForm.item}`,
        price: 5.99,
        description: `From: ${courierForm.pickup} | To: ${courierForm.dropoff}`
      },
      'genie_store',
      'Genie Courier Service',
      [],
      'courier'
    );
    
    // Reset Form
    setCourierForm({ item: '', pickup: '', dropoff: '', weight: 'Under 5kg' });
    push('Cart');
  };

  return (
    <div className="screen-transition-container" style={homeContainer}>
      {/* Header Row */}
      <div style={headerRow}>
        <div style={addressBlock} onClick={() => setShowAddressDropdown(!showAddressDropdown)}>
          <span style={addressLabel}>
            DELIVER TO {selectedAddress.label === 'Home' ? '🏠' : '🏢'}
          </span>
          <div style={addressSelectRow}>
            <span style={addressDetails}>{selectedAddress.details}</span>
            <span style={dropdownArrow}>▼</span>
          </div>
        </div>

        <button onClick={toggleTheme} style={themeToggleBtn} title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Address Selection Dropdown Overlay */}
      {showAddressDropdown && (
        <div style={dropdownMenu} className="card-elevation-2">
          <div style={dropdownTitle}>Select Delivery Address</div>
          {userAddresses.map((addr) => (
            <div 
              key={addr.id}
              onClick={() => handleAddressSelect(addr)}
              style={{
                ...dropdownItem,
                backgroundColor: selectedAddress.id === addr.id ? 'var(--md-sys-color-primary-container)' : 'transparent'
              }}
            >
              <span style={{ fontSize: '18px' }}>{addr.icon}</span>
              <div style={dropdownTextCol}>
                <div style={dropdownLabel}>{addr.label}</div>
                <div style={dropdownSubtext}>{addr.details}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar Redirect */}
      <SearchBar readOnly={true} />

      {/* Banner Carousel */}
      <Banner onBannerClick={handleBannerClick} />

      {/* Services Hub Grid */}
      <div style={sectionHeader}>Select Service</div>
      <div style={servicesGrid}>
        {marketplaceServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => handleServiceClick(service.id)}
          />
        ))}
      </div>

      {/* Dynamic Subsections based on selected service tab */}
      
      {/* 1. FOOD DELIVERY */}
      {selectedService === 'food' && (
        <>
          <div style={sectionHeader}>Popular Restaurants Near You</div>
          <div style={listContainer}>
            {restaurants.map((rest) => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                onClick={() => push('StoreDetails', { restaurant: rest })}
              />
            ))}
          </div>
        </>
      )}

      {/* 2. INSTANT GROCERY */}
      {selectedService === 'grocery' && (
        <>
          <div style={sectionHeader}>Shop Groceries Instantly</div>
          
          {/* Grocery Categories Chips */}
          <div style={chipScrollRow}>
            {groceryCategories.map((cat) => (
              <Chips
                key={cat.id}
                label={cat.name}
                icon={cat.icon}
                selected={selectedGroceryCat === cat.id}
                onClick={() => setSelectedGroceryCat(cat.id)}
              />
            ))}
          </div>

          {/* Grocery Items List */}
          <div style={productGrid}>
            {groceryCategories
              .find(cat => cat.id === selectedGroceryCat)
              ?.items.map((item) => (
                <div key={item.id} style={productCard} className="card-elevation-1">
                  <div style={productImgBg}>{item.image}</div>
                  <div style={productContent}>
                    <div style={productName}>{item.name}</div>
                    <div style={productWeight}>{item.weight}</div>
                    <div style={productFooter}>
                      <span style={productPrice}>${item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          addToCart(item, 'grocery_store', 'Blink Grocery Store', [], 'grocery');
                          alert(`Added ${item.name} to cart!`);
                        }}
                        style={productAddBtn}
                        className="ripple"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* 3. PHARMACY EXPRESS */}
      {selectedService === 'pharmacy' && (
        <>
          <div style={sectionHeader}>Pharmacy Essentials & Health</div>
          
          {/* Pharmacy Category Selection Chips */}
          <div style={chipScrollRow}>
            {pharmacyProducts.map((cat) => (
              <Chips
                key={cat.id}
                label={cat.name}
                icon={cat.icon}
                selected={selectedPharmacyCat === cat.id}
                onClick={() => setSelectedPharmacyCat(cat.id)}
              />
            ))}
          </div>

          {/* Pharmacy Products Shelf */}
          <div style={productGrid}>
            {pharmacyProducts
              .find(cat => cat.id === selectedPharmacyCat)
              ?.items.map((item) => (
                <div key={item.id} style={productCard} className="card-elevation-1">
                  <div style={productImgBg}>{item.image}</div>
                  <div style={productContent}>
                    <div style={productName}>{item.name}</div>
                    <div style={productWeight}>{item.size}</div>
                    {item.requiresRx && <span style={rxTag}>Rx Needed</span>}
                    <div style={productFooter}>
                      <span style={productPrice}>${item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          addToCart(item, 'pharmacy_store', 'Express Meds Pharmacy', [], 'pharmacy');
                          alert(`Added ${item.name} to cart!`);
                        }}
                        style={productAddBtn}
                        className="ripple"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* 4. COURIER GENIE */}
      {selectedService === 'courier' && (
        <div style={courierWrapper}>
          <div style={sectionHeader}>Genie Instant Courier</div>
          <p style={courierIntro}>Send document folders, house keys, groceries, or gifts across town in under an hour.</p>
          
          <form onSubmit={handleBookGenie} style={courierFormStyle} className="card-elevation-1">
            <div style={inputGroup}>
              <label style={inputLabel}>What are you sending?</label>
              <input
                type="text"
                placeholder="e.g. Work files, Car keys"
                value={courierForm.item}
                onChange={(e) => setCourierForm({ ...courierForm, item: e.target.value })}
                style={formInput}
                required
              />
            </div>
            
            <div style={inputGroup}>
              <label style={inputLabel}>Pickup Address</label>
              <input
                type="text"
                placeholder="Where should rider pick up?"
                value={courierForm.pickup}
                onChange={(e) => setCourierForm({ ...courierForm, pickup: e.target.value })}
                style={formInput}
                required
              />
            </div>
            
            <div style={inputGroup}>
              <label style={inputLabel}>Dropoff Address</label>
              <input
                type="text"
                placeholder="Where should rider drop off?"
                value={courierForm.dropoff}
                onChange={(e) => setCourierForm({ ...courierForm, dropoff: e.target.value })}
                style={formInput}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={inputLabel}>Package Weight Estimation</label>
              <select 
                value={courierForm.weight}
                onChange={(e) => setCourierForm({ ...courierForm, weight: e.target.value })}
                style={formSelect}
              >
                <option>Under 1kg</option>
                <option>Under 5kg</option>
                <option>5kg to 10kg</option>
              </select>
            </div>

            <Button type="submit" variant="filled" fullWidth style={{ marginTop: '10px' }}>
              Book Genie Delivery ($5.99)
            </Button>
          </form>
        </div>
      )}
      
      {/* Spacer */}
      <div style={{ height: '24px' }}></div>
    </div>
  );
}

// Styles
const homeContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  paddingBottom: '20px',
};

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 16px 8px 16px',
  position: 'relative',
};

const addressBlock = {
  cursor: 'pointer',
  maxWidth: '80%',
};

const addressLabel = {
  fontSize: '10px',
  fontWeight: '700',
  color: 'var(--md-sys-color-primary)',
  letterSpacing: '1.1px',
};

const addressSelectRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const addressDetails = {
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--md-sys-color-on-background)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const dropdownArrow = {
  fontSize: '9px',
  color: 'var(--md-sys-color-on-surface-variant)',
};

const themeToggleBtn = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  border: 'none',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease',
};

const dropdownMenu = {
  position: 'absolute',
  top: '64px',
  left: '16px',
  right: '16px',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '16px',
  padding: '12px',
  zIndex: 100,
  border: '1px solid var(--md-sys-color-outline)',
};

const dropdownTitle = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
  marginBottom: '8px',
  paddingLeft: '4px',
};

const dropdownItem = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  marginBottom: '4px',
};

const dropdownTextCol = {
  display: 'flex',
  flexDirection: 'column',
};

const dropdownLabel = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
};

const dropdownSubtext = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '280px',
};

const sectionHeader = {
  fontSize: '15px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  padding: '16px 16px 10px 16px',
  fontFamily: 'var(--font-family-title)',
};

const servicesGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  padding: '0 16px',
};

const listContainer = {
  display: 'flex',
  flexDirection: 'column',
};

const chipScrollRow = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  padding: '0 16px 12px 16px',
  scrollbarWidth: 'none',
};

const productGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  padding: '0 16px',
};

const productCard = {
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid var(--md-sys-color-outline)',
  display: 'flex',
  flexDirection: 'column',
};

const productImgBg = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  height: '110px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '44px',
};

const productContent = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const productName = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
  lineHeight: '1.3',
  marginBottom: '2px',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  height: '34px',
};

const productWeight = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  fontWeight: '500',
  marginBottom: '8px',
};

const productFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
};

const productPrice = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const productAddBtn = {
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-secondary)',
  border: '1.5px solid var(--md-sys-color-secondary)',
  borderRadius: '8px',
  fontWeight: '800',
  fontSize: '11px',
  padding: '4px 10px',
  cursor: 'pointer',
  boxShadow: 'var(--elevation-1)',
};

const rxTag = {
  fontSize: '8px',
  fontWeight: '800',
  backgroundColor: 'rgba(231, 29, 54, 0.1)',
  color: '#E71D36',
  padding: '2px 6px',
  borderRadius: '4px',
  alignSelf: 'flex-start',
  marginBottom: '8px',
  letterSpacing: '0.5px',
};

const courierWrapper = {
  padding: '0 16px',
};

const courierIntro = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
  marginBottom: '14px',
  fontWeight: '500',
};

const courierFormStyle = {
  backgroundColor: 'var(--md-sys-color-surface)',
  padding: '16px',
  borderRadius: '24px',
  border: '1px solid var(--md-sys-color-outline)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const inputLabel = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-surface-variant)',
};

const formInput = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  color: 'var(--md-sys-color-on-background)',
  border: 'none',
  borderRadius: '10px',
  padding: '12px',
  fontSize: '13px',
  fontWeight: '500',
  fontFamily: 'var(--font-family-body)',
  outline: 'none',
};

const formSelect = {
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  color: 'var(--md-sys-color-on-background)',
  border: 'none',
  borderRadius: '10px',
  padding: '12px',
  fontSize: '13px',
  fontWeight: '500',
  fontFamily: 'var(--font-family-body)',
  outline: 'none',
  cursor: 'pointer',
};
