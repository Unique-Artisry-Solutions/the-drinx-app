
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CalendarPlus, MapPin, Ticket, ArrowRight } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';

interface LocationState {
  items: CartItem[];
  serviceFee: number;
  serviceFeePercentage: number;
  totalWithFees: number;
  contactInfo: {
    name: string;
    email: string;
  };
}

const PurchaseConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  // If no state (direct URL access), redirect to events
  if (!state || !state.items || state.items.length === 0) {
    // We'll do a gentle redirect after a delay
    React.useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/events');
      }, 5000);
      return () => clearTimeout(timer);
    }, [navigate]);

    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="mb-6 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Purchase Information Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find details about your purchase. You will be redirected to the events page shortly.
          </p>
          <Button onClick={() => navigate('/events')}>
            Go to Events
          </Button>
        </div>
      </Layout>
    );
  }

  const { items, serviceFee, serviceFeePercentage, totalWithFees, contactInfo } = state!;
  
  const eventTickets = items.filter(item => item.type === 'event_ticket');
  const swigCircuitTickets = items.filter(item => item.type === 'swig_circuit_ticket');
  const subscriptions = items.filter(item => item.type === 'user' || item.type === 'establishment');
  
  // Calculate subtotal from items
  const subtotal = items.reduce((total, item) => {
    if (item.quantity && item.quantity > 1) {
      return total + (item.price * item.quantity);
    }
    return total + item.price;
  }, 0);
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="mb-6 text-green-500">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. A confirmation has been sent to {contactInfo.email}.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {eventTickets.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <Ticket className="mr-2 h-5 w-5" />
                    Event Tickets
                  </h3>
                  <div className="space-y-4 pl-7">
                    {eventTickets.map((ticket) => (
                      <div key={ticket.id} className="border-b pb-4">
                        <h4 className="font-medium">{ticket.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{ticket.date} at {ticket.time}</p>
                          {ticket.venue && <p className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {ticket.venue}</p>}
                          <p className="font-semibold">Quantity: {ticket.quantity || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {swigCircuitTickets.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <CalendarPlus className="mr-2 h-5 w-5" />
                    Swig Circuit Tickets
                  </h3>
                  <div className="space-y-4 pl-7">
                    {swigCircuitTickets.map((ticket) => (
                      <div key={ticket.id} className="border-b pb-4">
                        <h4 className="font-medium">{ticket.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {ticket.date && <p>{ticket.date}</p>}
                          <p className="font-semibold">Quantity: {ticket.quantity || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {subscriptions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Subscriptions</h3>
                  <div className="space-y-4 pl-7">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="border-b pb-4">
                        <h4 className="font-medium">{sub.name}</h4>
                        <div className="text-sm text-gray-600">
                          <p>
                            ${sub.price.toFixed(2)}
                            {sub.interval !== 'one-time' && 
                              (sub.interval === 'monthly' ? '/month' : '/year')
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-700">Service Fee ({serviceFeePercentage}%):</span>
                  <span className="text-gray-900">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total Amount Paid:</span>
                  <span>${totalWithFees.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          {eventTickets.length > 0 && (
            <Link to="/events">
              <Button variant="outline" className="flex items-center">
                View All Events
              </Button>
            </Link>
          )}
          
          {swigCircuitTickets.length > 0 && (
            <Link to="/swig-circuits">
              <Button variant="outline" className="flex items-center">
                View Swig Circuits
              </Button>
            </Link>
          )}
          
          <Link to="/profile">
            <Button className="flex items-center">
              Go to Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseConfirmationPage;
