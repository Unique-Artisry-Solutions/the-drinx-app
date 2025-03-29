
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FloatingCartIndicator: React.FC = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
      <Button 
        onClick={() => navigate('/checkout')}
        className={cn(
          "flex items-center gap-3 shadow-bold-pink pointer-events-auto",
          "bg-red-500 hover:bg-red-600 text-white rounded-full py-4 px-6",
          "transform transition-all duration-300 hover:scale-105"
        )}
        size="lg"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
        <span className="bg-white text-red-500 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
          {items.length}
        </span>
      </Button>
    </div>
  );
};

export default FloatingCartIndicator;
