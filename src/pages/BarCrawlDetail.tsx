
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
import DetailPageMasthead from '@/components/shared/DetailPageMasthead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, Ticket, Users } from 'lucide-react';
import { useRoleSwitch } from '@/hooks/useRoleSwitch';
import { useCircuitPurchaseStatus } from '@/hooks/useCircuitPurchaseStatus';

const BarCrawlDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { currentRole } = useRoleSwitch();
  
  // Check if the user has admin/promoter privileges
  const isAdminOrPromoter = currentRole === 'promoter' || currentRole === 'establishment' || 
    localStorage.getItem('admin_authenticated') === 'true';
  
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Check if the user has purchased this circuit if they're logged in
  const { hasPurchased, isLoading: isPurchaseCheckLoading } = useCircuitPurchaseStatus(id || '');

  // Fetch swig circuit details with correct table relationships
  const { data: swigCircuit, isLoading, error } = useQuery({
    queryKey: ['swigCircuit', id],
    queryFn: async () => {
      try {
        console.log('Fetching swig circuit with ID:', id);
        
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('swig_circuits')
          .select(`
            *,
            swig_circuit_ticket_tiers (*),
            establishments:swig_circuit_venues (
              establishment:establishment_id (id, name, address, image_url)
            ),
            swig_circuit_drink_highlights (*)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error loading swig circuit from database:', error);
          throw error;
        }

        console.log('Swig circuit data loaded from database:', data);
        return data;
      } catch (error: any) {
        console.error('Error in swigCircuit query:', error);
        
        // Only show error toast once
        if (!window.swigCircuitErrorToastShown) {
          window.swigCircuitErrorToastShown = true;
          toast({
            title: 'Error loading data',
            description: 'There was an issue loading the circuit details',
            variant: 'destructive',
          });
          
          setTimeout(() => {
            window.swigCircuitErrorToastShown = false;
          }, 5000);
        }
        
        throw error;
      }
    },
    enabled: !!id,
    retry: 1, // Limit retries to prevent multiple error toasts
  });

  const handleAddToCart = () => {
    if (!selectedTicket || !swigCircuit) {
      toast({
        title: 'Please select a ticket',
        variant: 'destructive',
      });
      return;
    }

    // Safely access swig_circuit_ticket_tiers to avoid errors
    const ticketTypes = Array.isArray(swigCircuit.swig_circuit_ticket_tiers) 
      ? swigCircuit.swig_circuit_ticket_tiers 
      : [];
    
    const ticketType = ticketTypes.find(ticket => ticket.id === selectedTicket);
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
          <Skeleton className="h-64 w-full rounded-xl mb-8" /> {/* Masthead skeleton */}
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

  // Safely access swig_circuit_ticket_tiers to avoid errors
  const ticketTypes = Array.isArray(swigCircuit.swig_circuit_ticket_tiers) 
    ? swigCircuit.swig_circuit_ticket_tiers 
    : [];
  
  // Safely access establishments
  const establishments = Array.isArray(swigCircuit.establishments) 
    ? swigCircuit.establishments.map(e => e.establishment).filter(Boolean)
    : [];

  // Extract drink highlights if they exist
  const drinkHighlights = Array.isArray(swigCircuit.swig_circuit_drink_highlights) 
    ? swigCircuit.swig_circuit_drink_highlights 
    : [];
    
  // Determine if this is a paid circuit (has ticket types with prices)
  const isPaidCircuit = ticketTypes.some(ticket => ticket.price > 0);
  
  // Only show join button if it's a free circuit or the user has purchased it
  const showJoinButton = !isPaidCircuit || hasPurchased;
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* New Masthead */}
        <DetailPageMasthead 
          title={swigCircuit.name}
          subtitle={swigCircuit.description}
          imageUrl={swigCircuit.image_url}
        />
        
        <BarCrawlHeader 
          name={swigCircuit.name}
          organizer="Organizer" // This would need to be dynamically fetched
          date={new Date(swigCircuit.start_date).toLocaleDateString()}
          stops={establishments.length}
          description={swigCircuit.description}
          id={swigCircuit.id}
          showJoinButton={showJoinButton} // Only show join button if free or purchased
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <BarCrawlDetails 
              organizer="Organizer" // This would need to be dynamically fetched
              date={new Date(swigCircuit.start_date).toLocaleDateString()}
              stops={establishments.length}
            />
            
            {establishments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Participating Establishments</h2>
                <EstablishmentGrid establishments={establishments} />
              </div>
            )}
            
            {drinkHighlights.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Featured Drinks</h2>
                <DrinkHighlights drinkHighlights={drinkHighlights} />
              </div>
            )}
            
            <div className="mt-8">
              <InteractiveElements circuitId={swigCircuit.id} />
            </div>
            
            {/* Only show Feedback & Engagement section for admin/promoter users */}
            {isAdminOrPromoter && (
              <div className="mt-8">
                <FeedbackMechanism 
                  enabledOptions={[]}
                  onToggleOption={() => {}}
                />
              </div>
            )}
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
                {ticketTypes.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {ticketTypes.map((ticket) => {
                        // Calculate remaining tickets safely
                        const ticketLimit = ticket.ticket_limit || 0;
                        // Use 0 as default for sold tickets since the property doesn't exist
                        const soldTickets = 0; 
                        const remainingTickets = ticketLimit - soldTickets;
                        
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
                                {ticket.ticket_limit ? (
                                  <p className="text-xs text-muted-foreground">
                                    {remainingTickets} remaining
                                  </p>
                                ) : null}
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
                    
                    {/* Show join button for free circuits */}
                    {!isPaidCircuit && user && (
                      <div className="mt-4">
                        <JoinBarCrawlButton barCrawlId={swigCircuit.id} />
                      </div>
                    )}
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
                      {/* Use projected_attendance as a fallback for max_participants */}
                      {swigCircuit.projected_attendance && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Max {swigCircuit.projected_attendance} participants</span>
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

// Add TypeScript interface for the window object to support our debounce flag
declare global {
  interface Window {
    swigCircuitErrorToastShown?: boolean;
  }
}

export default BarCrawlDetail;
