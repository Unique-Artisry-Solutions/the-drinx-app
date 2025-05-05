
import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, clearCart, totalPrice, serviceFee, totalWithFees } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Group items by type for better organization
  const groupedItems = {
    subscriptions: items.filter(item => item.type === 'user' || item.type === 'establishment'),
    eventTickets: items.filter(item => item.type === 'event_ticket'),
    swigCircuitTickets: items.filter(item => item.type === 'swig_circuit_ticket')
  };

  const renderSection = (title: string, sectionItems: typeof items) => {
    if (sectionItems.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-4">{title}</h3>
        {sectionItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div>
              {renderSection('Subscriptions', groupedItems.subscriptions)}
              {renderSection('Event Tickets', groupedItems.eventTickets)}
              {renderSection('Swig Circuit Tickets', groupedItems.swigCircuitTickets)}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Fee:</span>
                <span className="font-medium">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${totalWithFees.toFixed(2)}</span>
              </div>
            </div>
            
            <DialogFooter className="flex sm:justify-between gap-2">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                Clear Cart
              </Button>
              <Button onClick={handleCheckout} className="flex-1">
                Checkout
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
