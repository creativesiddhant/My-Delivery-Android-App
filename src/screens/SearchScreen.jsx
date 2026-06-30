import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';
import { restaurants, groceryCategories, pharmacyProducts } from '../data/mockData';
import SearchBar from '../components/SearchBar';
import Chips from '../components/Chips';
import { RestaurantCard } from '../components/Card';

/**
 * SearchScreen.jsx - Discover & Filters Screen
 * 
 * Allows users to search for keywords across food menu items, grocery items, and pharmacy catalog.
 * Supports active filter pills (Top Rated, Veg Only, Free Delivery) and suggestions triggers.
 */
export default function SearchScreen() {
  const { push } = useNavigation();
  const { addToCart } = useApp();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ restaurants: [], grocery: [], pharmacy: [] });
  
  // Filter states
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [filterFreeDelivery, setFilterFreeDelivery] = useState(false);

  const recentSearches = ['Truffle', 'Cherry', 'Pizza', 'Milk', 'Allergy'];

  // Search logic handler
  useEffect(() => {
    const term = query.toLowerCase().trim();

    // 1. Filter Restaurants & Menus
    let filteredRest = restaurants.filter((rest) => {
      const matchName = rest.name.toLowerCase().includes(term);
      const matchCuisine = rest.cuisine.toLowerCase().includes(term);
      const matchMenu = rest.menu.some(
        (item) => item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
      );
      return matchName || matchCuisine || matchMenu;
    });

    if (filterTopRated) {
      filteredRest = filteredRest.filter((r) => r.rating >= 4.8);
    }
    if (filterFreeDelivery) {
      filteredRest = filteredRest.filter((r) => r.freeDelivery);
    }
    if (filterVeg) {
      // Show restaurants having vegetarian options
      filteredRest = filteredRest.filter((r) => r.menu.some(item => item.isVeg));
    }

    // 2. Filter Groceries
    let filteredGrocery = [];
    groceryCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.name.toLowerCase().includes(term)) {
          filteredGrocery.push(item);
        }
      });
    });

    // 3. Filter Pharmacy
    let filteredPharmacy = [];
    pharmacyProducts.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.name.toLowerCase().includes(term)) {
          filteredPharmacy.push(item);
        }
      });
    });

    setResults({
      restaurants: term ? filteredRest : [],
      grocery: term ? filteredGrocery : [],
      pharmacy: term ? filteredPharmacy : [],
    });
  }, [query, filterVeg, filterTopRated, filterFreeDelivery]);

  const handleSuggestionClick = (search) => {
    setQuery(search);
  };

  const hasAnyResults = 
    results.restaurants.length > 0 || 
    results.grocery.length > 0 || 
    results.pharmacy.length > 0;

  return (
    <div className="screen-transition-container" style={searchContainer}>
      {/* Active Search Input */}
      <SearchBar 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search burgers, pizzas, milk, meds..."
        showFilter={false}
      />

      {/* Filter Chips Scrollbar */}
      <div style={filterScrollRow}>
        <Chips 
          label="Veg Only 🟢" 
          selected={filterVeg}
          onClick={() => setFilterVeg(!filterVeg)}
        />
        <Chips 
          label="Top Rated (4.8+★)" 
          selected={filterTopRated}
          onClick={() => setFilterTopRated(!filterTopRated)}
        />
        <Chips 
          label="Free Delivery 🛵" 
          selected={filterFreeDelivery}
          onClick={() => setFilterFreeDelivery(!filterFreeDelivery)}
        />
      </div>

      {/* Popular/Recent suggestions (visible when query is empty) */}
      {!query && (
        <div style={suggestionsSection}>
          <div style={sectionTitle}>Trending Searches</div>
          <div style={suggestionsGrid}>
            {recentSearches.map((search) => (
              <button 
                key={search} 
                onClick={() => handleSuggestionClick(search)}
                style={suggestionBtn}
                className="ripple"
              >
                🔍 {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {query && (
        <div style={resultsScrollArea}>
          {!hasAnyResults && (
            <div style={emptyState}>
              <span style={emptyStateIcon}>🍽️</span>
              <div style={emptyStateTitle}>No products found</div>
              <p style={emptyStateSub}>Try checking spelling or adjusting search filters.</p>
            </div>
          )}

          {/* Restaurant Results */}
          {results.restaurants.length > 0 && (
            <div>
              <div style={resultSectionHeader}>Restaurants</div>
              {results.restaurants.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  restaurant={rest}
                  onClick={() => push('StoreDetails', { restaurant: rest })}
                />
              ))}
            </div>
          )}

          {/* Grocery Results */}
          {results.grocery.length > 0 && (
            <div>
              <div style={resultSectionHeader}>InstaGrocery Shelf</div>
              <div style={productRowList}>
                {results.grocery.map((item) => (
                  <div key={item.id} style={resultProductCard}>
                    <div style={pCardImgBg}>{item.image}</div>
                    <div style={pCardInfo}>
                      <div style={pCardName}>{item.name}</div>
                      <div style={pCardSub}>{item.weight}</div>
                      <div style={pCardPriceBlock}>
                        <span style={pCardPrice}>${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => {
                            addToCart(item, 'grocery_store', 'Blink Grocery Store', [], 'grocery');
                            alert(`Added ${item.name} to cart!`);
                          }}
                          style={pAddBtn}
                          className="ripple"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pharmacy Results */}
          {results.pharmacy.length > 0 && (
            <div>
              <div style={resultSectionHeader}>Express Pharmacy Products</div>
              <div style={productRowList}>
                {results.pharmacy.map((item) => (
                  <div key={item.id} style={resultProductCard}>
                    <div style={pCardImgBg}>{item.image}</div>
                    <div style={pCardInfo}>
                      <div style={pCardName}>{item.name}</div>
                      <div style={pCardSub}>{item.size}</div>
                      <div style={pCardPriceBlock}>
                        <span style={pCardPrice}>${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => {
                            addToCart(item, 'pharmacy_store', 'Express Meds Pharmacy', [], 'pharmacy');
                            alert(`Added ${item.name} to cart!`);
                          }}
                          style={pAddBtn}
                          className="ripple"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const searchContainer = {
  backgroundColor: 'var(--md-sys-color-background)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const filterScrollRow = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  padding: '6px 16px 12px 16px',
  scrollbarWidth: 'none',
};

const suggestionsSection = {
  padding: '20px 16px',
};

const sectionTitle = {
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '12px',
};

const suggestionsGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const suggestionBtn = {
  border: '1px solid var(--md-sys-color-outline)',
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-on-background)',
  borderRadius: '100px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
};

const resultsScrollArea = {
  flex: 1,
  overflowY: 'auto',
  paddingBottom: '20px',
};

const resultSectionHeader = {
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  padding: '12px 16px 6px 16px',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  marginBottom: '12px',
};

const productRowList = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0 16px 16px 16px',
  gap: '12px',
};

const resultProductCard = {
  display: 'flex',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: '16px',
  border: '1px solid var(--md-sys-color-outline)',
  overflow: 'hidden',
  padding: '10px',
  gap: '12px',
};

const pCardImgBg = {
  width: '64px',
  height: '64px',
  borderRadius: '10px',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
};

const pCardInfo = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const pCardName = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '2px',
};

const pCardSub = {
  fontSize: '11px',
  color: 'var(--md-sys-color-on-surface-variant)',
  marginBottom: '6px',
};

const pCardPriceBlock = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const pCardPrice = {
  fontSize: '14px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
};

const pAddBtn = {
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-primary)',
  border: '1.5px solid var(--md-sys-color-primary)',
  borderRadius: '6px',
  fontWeight: '800',
  fontSize: '11px',
  padding: '2px 10px',
  cursor: 'pointer',
};

const emptyState = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 40px',
  textAlign: 'center',
};

const emptyStateIcon = {
  fontSize: '48px',
  marginBottom: '16px',
};

const emptyStateTitle = {
  fontSize: '16px',
  fontWeight: '800',
  color: 'var(--md-sys-color-on-background)',
  marginBottom: '4px',
};

const emptyStateSub = {
  fontSize: '12px',
  color: 'var(--md-sys-color-on-surface-variant)',
  lineHeight: '1.4',
};
