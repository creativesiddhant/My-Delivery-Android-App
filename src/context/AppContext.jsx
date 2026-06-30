import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAddresses } from '../data/mockData';

/**
 * AppContext.jsx - Global Application State
 * 
 * Acting as a senior mobile product engineer, we simulate critical production app logic:
 * 1. Shopping Cart (insert, delete, change quantity, calculate totals).
 * 2. Active Order Tracker (starts a real timer thread that advances order steps).
 * 3. User Addresses and Theme controls.
 */

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');
  const [selectedAddress, setSelectedAddress] = useState(userAddresses[0]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);

  // Live order progress simulation timer
  useEffect(() => {
    let interval;
    if (activeOrder && activeOrder.status !== 'delivered') {
      interval = setInterval(() => {
        setActiveOrder((currentOrder) => {
          if (!currentOrder) return null;
          
          let nextStatus;
          let nextProgress = currentOrder.progress;
          let statusMessage;

          switch (currentOrder.status) {
            case 'preparing':
              nextStatus = 'rider_picked_up';
              nextProgress = 50;
              statusMessage = 'Rider picked up your order and is heading your way!';
              break;
            case 'rider_picked_up':
              nextStatus = 'rider_nearby';
              nextProgress = 80;
              statusMessage = 'Rider is arriving at your gate! Please meet them.';
              break;
            case 'rider_nearby':
              nextStatus = 'delivered';
              nextProgress = 100;
              statusMessage = 'Delivered! Enjoy your meal/service.';
              break;
            default:
              nextStatus = 'delivered';
              nextProgress = 100;
              statusMessage = 'Delivered! Enjoy your meal/service.';
          }

          const updatedOrder = {
            ...currentOrder,
            status: nextStatus,
            progress: nextProgress,
            message: statusMessage,
          };

          // If delivered, move to past orders
          if (nextStatus === 'delivered') {
            setPastOrders((prev) => [updatedOrder, ...prev]);
            clearInterval(interval);
          }

          return updatedOrder;
        });
      }, 15000); // Progresses status every 15 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeOrder]);

  // Cart operations
  const addToCart = (item, storeId, storeName, customizations = [], type = 'food') => {
    setCart((prevCart) => {
      // Create a unique key based on item ID and selected customization option names
      const customKey = customizations.map(c => c.selectedOption.name).join('|');
      const cartItemId = `${item.id}-${customKey}`;

      const existingIndex = prevCart.findIndex((i) => i.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            item,
            quantity: 1,
            customizations,
            storeId,
            storeName,
            type, // 'food' | 'grocery' | 'pharmacy'
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place order simulator
  const placeOrder = (deliveryFee = 1.99) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((acc, curr) => {
      const customPrice = curr.customizations.reduce((sum, c) => sum + c.selectedOption.extraPrice, 0);
      return acc + (curr.item.price + customPrice) * curr.quantity;
    }, 0);

    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + taxes + deliveryFee;

    const newOrder = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      taxes,
      deliveryFee,
      total,
      status: 'preparing',
      progress: 20,
      message: 'Kitchen is preparing your order. Packaging details locked.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      address: selectedAddress,
    };

    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        theme,
        selectedAddress,
        setSelectedAddress,
        activeOrder,
        setActiveOrder,
        pastOrders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
