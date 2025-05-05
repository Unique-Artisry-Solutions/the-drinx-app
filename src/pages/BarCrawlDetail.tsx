
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/Layout';
import BarCrawlHeader from '@/components/barCrawl/BarCrawlHeader';
import BarCrawlDetails from '@/components/barCrawl/BarCrawlDetails';
import EstablishmentGrid from '@/components/barCrawl/EstablishmentGrid';
import DrinkHighlights from '@/components/barCrawl/DrinkHighlights';
import InteractiveElements from '@/components/barCrawl/InteractiveElements';
import FeedbackMechanism from '@/components/barCrawl/FeedbackMechanism';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, Ticket, Users } from 'lucide-react';

const BarCrawlDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch swig circuit details
  const { data: swigCircuit, isLoading } = useQuery({
    queryKey: ['swigCircuit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('swig_circuits')
        .select(`
          *,
          circuit_ticket_types (*),
          establishments:swig_circuit_establishments (
            establishment:establishment_id (id, name, address, image_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: 'Error loading swig circuit',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!selectedTicket || !swigCircuit) {
      toast({
        title: 'Please select a ticket',
        variant: 'destructive',
      });
      return;
    }

    const ticketType = swigCircuit.circuit_ticket_types.find(ticket => ticket.id === selectedTicket);
    if (!ticketType) return;

    addItem({
      id: `${swigCircuit.id}-${selectedTicket}-${Date.now()}`,
      name: `${swigCircuit.name} - ${ticketType.name}`,
      price: ticketType.price * quantity,
      interval: 'one-time',
      type: 'swig_circuit_ticket',
      swigCircuitId: swigCircuit.id,
      ticketTypeId: ticketType.id,
      ticketName: ticketType.name,
      date: swigCircuit.start_date,
      quantity: quantity
    });

    toast({
      title: 'Added to cart',
      description: `${quantity} ${ticketType.name} ticket${quantity > 1 ? 's' : ''} for ${swigCircuit.name} added to your cart.`,
    });

    // Navigate to checkout
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-64 w-full rounded-md mb-6" />
              <Skeleton className="h-8 w-1/3 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-md" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!swigCircuit) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Swig Circuit Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The Swig Circuit you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate('/swig-circuits')}>
            View All Swig Circuits
          </Button>
        </div>
      </Layout>
    );
  }

  const hasTickets = swigCircuit.circuit_ticket_types && swigCircuit.circuit_ticket_types.length > 0;
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <BarCrawlHeader barCrawl={swigCircuit} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <BarCrawlDetails barCrawl={swigCircuit} />
            
            {swigCircuit.establishments && swigCircuit.establishments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Participating Establishments</h2>
                <EstablishmentGrid establishments={swigCircuit.establishments.map(e => e.establishment)} />
              </div>
            )}
            
            {swigCircuit.featured_drinks && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Featured Drinks</h2>
                <DrinkHighlights drinks={swigCircuit.featured_drinks} />
              </div>
            )}
            
            <div className="mt-8">
              <InteractiveElements barCrawl={swigCircuit} />
            </div>
            
            <div className="mt-8">
              <FeedbackMechanism barCrawlId={id || ''} />
            </div>
          </div>
          
          {/* Ticket Selection Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Circuit Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasTickets ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {swigCircuit.circuit_ticket_types.map((ticket) => {
                        const ticketsSold = ticket.sold || 0;
                        const remainingTickets = ticket.quantity - ticketsSold;
                        
                        return (
                          <div 
                            key={ticket.id}
                            className={`p-4 border rounded-md cursor-pointer ${
                              selectedTicket === ticket.id ? 'border-purple-500 bg-purple-50' : ''
                            }`}
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{ticket.name}</h3>
                                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${ticket.price.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {remainingTickets} remaining
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} ticket{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={!selectedTicket}
                    >
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No tickets are currently available for this Swig Circuit.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back soon or contact the organizer for details.
                    </p>
                  </div>
                )}
                
                {swigCircuit.start_date && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Circuit Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {new Date(swigCircuit.start_date).toLocaleDateString()} 
                          {swigCircuit.end_date && ` - ${new Date(swigCircuit.end_date).toLocaleDateString()}`}
                        </span>
                      </div>
                      {swigCircuit.start_time && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{swigCircuit.start_time}</span>
                        </div>
                      )}
                      {swigCircuit.max_participants && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Max {swigCircuit.max_participants} participants</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarCrawlDetail;
