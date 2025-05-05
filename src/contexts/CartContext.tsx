import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly' | 'one-time';
  type: 'user' | 'establishment' | 'event_ticket' | 'swig_circuit_ticket';
  eventId?: string;
  swigCircuitId?: string;
  ticketTypeId?: string; 
  ticketName?: string;
  date?: string;
  time?: string;
  venue?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Calculate total price whenever items change
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    // Check if item with same ID already exists in cart
    const existingItem = items.find((i) => i.id === item.id);
    
    // If item exists, don't add it again
    if (existingItem) {
      toast({
        title: 'Item already in cart',
        description: `${item.name} is already in your cart.`,
      });
      return;
    }
    
    // If we add a new plan, remove any existing plan of the same type
    const newItems = items.filter((i) => i.type !== item.type);
    
    // Add the new item
    setItems([...newItems, item]);
    
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart.',
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
