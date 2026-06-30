import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * NavigationContext.jsx - Custom Stack Navigation Provider
 * 
 * Provides stack navigation routines reminiscent of React Navigation on Android.
 * This manages a history array, enabling push, pop, back hardware simulation,
 * and component route parameter transmission.
 */

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  // Stack begins with the Home screen
  const [history, setHistory] = useState([{ name: 'Home', params: {} }]);

  const currentScreen = history[history.length - 1];

  // Navigate forward - pushes a screen onto the stack
  const push = (screenName, params = {}) => {
    setHistory((prev) => [...prev, { name: screenName, params }]);
  };

  // Navigate backward - pops the top screen
  const pop = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  // Clear stack and set a new root screen
  const reset = (screenName, params = {}) => {
    setHistory([{ name: screenName, params }]);
  };

  // Listen for browser navigation / history key interactions if needed (simulation helper)
  const canGoBack = history.length > 1;

  return (
    <NavigationContext.Provider value={{ currentScreen, push, pop, reset, canGoBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
