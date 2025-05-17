import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCode } from 'lucide-react';
import SwigCircuitTicketCard from './SwigCircuitTicketCard';
import { SwigCircuitTicket } from '@/types/SubscriptionTypes';

const TicketsTabContent: React.FC = () => {
  const [swigCircuitTickets, setSwigCircuitTickets] = useState<SwigCircuitTicket[]>([]);
  const [qrCodeContent, setQrCodeContent] = useState<string>('');
  const [qrCodeName, setQrCodeName] = useState<string>('');
  const [qrCodeDetails, setQrCodeDetails] = useState<string>('');
  const [open, setOpen] = useState(false);
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const handleShowQR = (code: string, name: string, details: string) => {
    setQrCodeContent(code);
    setQrCodeName(name);
    setQrCodeDetails(details);
    setOpen(true);
  };
  
  useEffect(() => {
    const fetchSwigCircuitTickets = async () => {
      setLoading(true);
      setError(null);
      
      if (!session) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabaseClient
          .from('swig_circuit_tickets')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (error) {
          throw error;
        }
        
        setSwigCircuitTickets(data || []);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching swig circuit tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSwigCircuitTickets();
  }, [session, supabaseClient]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Swig Circuit Tickets</CardTitle>
            <CardDescription>View and manage your purchased Swig Circuit tickets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-8">
              Loading tickets...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Swig Circuit Tickets</CardTitle>
            <CardDescription>View and manage your purchased Swig Circuit tickets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-8 text-red-500">
              Error loading tickets: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Swig Circuit Tickets</CardTitle>
          <CardDescription>View and manage your purchased Swig Circuit tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swigCircuitTickets.map(ticket => (
              <SwigCircuitTicketCard
                key={ticket.id}
                ticket={ticket}
                onShowQR={handleShowQR}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{qrCodeName}</DialogTitle>
            <DialogDescription>
              {qrCodeDetails}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeContent}`} 
              alt="QR Code" 
            />
          </div>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsTabContent;
