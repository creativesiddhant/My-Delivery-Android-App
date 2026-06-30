import React from 'react';
import { useNavigation } from './context/NavigationContext';
import AndroidFrame from './components/AndroidFrame';
import BottomNavigation from './components/BottomNavigation';

// Screen imports
import HomeScreen from './screens/HomeScreen';
import StoreDetailsScreen from './screens/StoreDetailsScreen';
import SearchScreen from './screens/SearchScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';

/**
 * App.jsx - Main Application Shell
 * 
 * Acting as a senior product engineer, this component loads the custom stack navigation state
 * and renders the matching screen inside the simulated Android device viewport wrapper.
 * The bottom navigation bar is hidden on Store Details screens, aligning with Android guidelines.
 */
function App() {
  const { currentScreen } = useNavigation();

  const renderActiveScreen = () => {
    switch (currentScreen.name) {
      case 'StoreDetails':
        return <StoreDetailsScreen />;
      case 'Search':
        return <SearchScreen />;
      case 'Cart':
        return <CartScreen />;
      case 'Orders':
        return <OrdersScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Home':
      default:
        return <HomeScreen />;
    }
  };

  // Hide bottom navigation tab bar on detail screens to optimize vertical canvas space
  const showBottomBar = currentScreen.name !== 'StoreDetails';

  return (
    <AndroidFrame>
      <div style={appContainerStyle}>
        <div style={screenWrapperStyle}>
          {renderActiveScreen()}
        </div>
        {showBottomBar && <BottomNavigation />}
      </div>
    </AndroidFrame>
  );
}

const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  position: 'relative',
};

const screenWrapperStyle = {
  flex: 1,
  overflowY: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

export default App;
