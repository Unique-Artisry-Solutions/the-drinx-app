
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import TicketQuantitySelector from './TicketQuantitySelector';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface TicketCardProps {
  ticket: {
    id: string;
    name: string;
    price: number;
    description?: string;
    available: number;
    maxPerOrder?: number;
    eventId?: string;
    eventName?: string;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
    benefits?: string[];
    isVip?: boolean;
  };
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (ticket.available < quantity) {
      toast({
        title: "Not enough tickets available",
        description: `Only ${ticket.available} tickets remaining.`,
        variant: "destructive"
      });
      return;
    }

    // Add each ticket individually to maintain cart structure
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${ticket.id}-${Date.now()}-${i}`,
        name: ticket.name,
        price: ticket.price,
        interval: 'one-time',
        type: 'event_ticket',
        eventId: ticket.eventId,
        ticketTypeId: ticket.id,
        ticketName: ticket.name,
        date: ticket.eventDate,
        time: ticket.eventTime,
        venue: ticket.venue,
        quantity: 1
      });
    }

    toast({
      title: "Added to cart",
      description: `${quantity} × ${ticket.name} ticket${quantity > 1 ? 's' : ''} added to cart.`,
    });

    // Reset quantity after adding
    setQuantity(1);
  };

  const isOutOfStock = ticket.available === 0;
  const maxQuantity = Math.min(ticket.available, ticket.maxPerOrder || 10);

  return (
    <Card className={`h-full ${ticket.isVip ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {ticket.name}
            {ticket.isVip && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                VIP
              </Badge>
            )}
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${ticket.price}</p>
            <p className="text-sm text-gray-500">per ticket</p>
          </div>
        </div>
        
        {ticket.description && (
          <p className="text-gray-600 text-sm">{ticket.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {ticket.eventName && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{ticket.eventDate} at {ticket.eventTime}</span>
            </div>
            {ticket.venue && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{ticket.venue}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-500" />
          <span className={`${ticket.available < 10 ? 'text-red-600' : 'text-gray-600'}`}>
            {isOutOfStock ? 'Sold Out' : `${ticket.available} remaining`}
          </span>
        </div>

        {ticket.benefits && ticket.benefits.length > 0 && (
          <div>
            <p className="font-medium text-sm mb-2">What's included:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {ticket.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
              {ticket.benefits.length > 3 && (
                <li className="text-xs text-gray-500">
                  +{ticket.benefits.length - 3} more benefits
                </li>
              )}
            </ul>
          </div>
        )}

        {!isOutOfStock && (
          <TicketQuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            maxQuantity={maxQuantity}
            price={ticket.price}
            disabled={isOutOfStock}
          />
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="lg"
        >
          {isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart - $${(ticket.price * quantity).toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
