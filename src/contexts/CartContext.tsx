
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalPrice: number;
  serviceFee: number;
  serviceFeePercentage: number;
  totalWithFees: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [serviceFeePercentage, setServiceFeePercentage] = useState<number>(1.5);
  const { toast } = useToast();

  // Fetch service fee percentage from system settings when component mounts
  useEffect(() => {
    async function fetchServiceFeePercentage() {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'payment.service_fee_percentage')
          .single();
        
        if (error) {
          console.error('Error fetching service fee percentage:', error);
          return;
        }
        
        if (data) {
          setServiceFeePercentage(parseFloat(data.value as string));
        }
      } catch (error) {
        console.error('Failed to fetch service fee percentage', error);
      }
    }
    
    fetchServiceFeePercentage();
  }, []);

  // Calculate total price whenever items change
  const totalPrice = items.reduce((total, item) => {
    // If the item has a quantity, multiply the price by the quantity
    if (item.quantity && item.quantity > 1) {
      return total + (item.price * item.quantity);
    }
    return total + item.price;
  }, 0);

  // Calculate service fee based on total price and percentage
  const serviceFee = parseFloat((totalPrice * (serviceFeePercentage / 100)).toFixed(2));

  // Calculate total with fees
  const totalWithFees = totalPrice + serviceFee;

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
    
    // For subscription plans, remove any existing plan of the same type
    let newItems = items;
    if (item.type === 'user' || item.type === 'establishment') {
      newItems = items.filter((i) => i.type !== item.type);
    }
    
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

  const increaseQuantity = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    ));
  };

  const decreaseQuantity = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      increaseQuantity,
      decreaseQuantity,
      totalPrice, 
      serviceFee,
      serviceFeePercentage,
      totalWithFees
    }}>
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
