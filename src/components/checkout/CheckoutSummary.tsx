
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { CartItem } from '@/contexts/CartContext';

interface GroupedItems {
  subscriptions: CartItem[];
  eventTickets: CartItem[];
  swigCircuitTickets: CartItem[];
}

interface CheckoutSummaryProps {
  groupedItems: GroupedItems;
  totalPrice: number;
  serviceFee: number;
  serviceFeePercentage: number;
  totalWithFees: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  groupedItems,
  totalPrice,
  serviceFee,
  serviceFeePercentage,
  totalWithFees
}) => {
  const renderSection = (title: string, items: CartItem[]) => {
    if (items.length === 0) return null;
    
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">
          {title}
        </h4>
        <div className="divide-y">
          {items.map(item => (
            <div key={item.id} className="py-3">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">{item.name}</h5>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity || 1}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  {item.quantity && item.quantity > 1 && (
                    <p className="text-sm text-gray-500">
                      ${(item.price * item.quantity).toFixed(2)} total
                    </p>
                  )}
                </div>
              </div>
              {(item.type === 'event_ticket' && item.eventId) && (
                <div className="mt-2 text-right">
                  <Link 
                    to={`/event/${item.eventId}`} 
                    className="text-xs text-material-primary hover:underline"
                  >
                    View Event Details
                  </Link>
                </div>
              )}
              {(item.type === 'swig_circuit_ticket' && item.swigCircuitId) && (
                <div className="mt-2 text-right">
                  <Link 
                    to={`/swig-circuit/${item.swigCircuitId}`} 
                    className="text-xs text-material-primary hover:underline"
                  >
                    View Circuit Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderSection('Subscriptions', groupedItems.subscriptions)}
          {renderSection('Event Tickets', groupedItems.eventTickets)}
          {renderSection('Swig Circuit Tickets', groupedItems.swigCircuitTickets)}
          
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                Service Fee ({serviceFeePercentage}%):
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 inline-flex">
                        <HelpCircle size={14} className="text-gray-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This service fee helps support platform maintenance and payment processing.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 text-lg">
              <span>Total:</span>
              <span>${totalWithFees.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
