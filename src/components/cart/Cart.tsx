
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CartItem from './CartItem';
import { ShoppingCart, CreditCard } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalPrice, serviceFee, totalWithFees, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </div>
          <Badge variant="secondary">{items.length} item{items.length !== 1 ? 's' : ''}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem 
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity || 1}
              imageUrl={item.imageUrl}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service Fee:</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${totalWithFees.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={handleCheckout}
          className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  );
};

export default Cart;
