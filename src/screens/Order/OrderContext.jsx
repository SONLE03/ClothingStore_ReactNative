import React, { createContext, useContext, useState } from 'react';

// Create a context
const OrderContext = createContext();

// Provide context
export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <OrderContext.Provider value={{ orderItems, setOrderItems, amount, setAmount, selectedAddress, setSelectedAddress }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = () => useContext(OrderContext);
