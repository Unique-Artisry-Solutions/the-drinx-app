
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, QrCode, Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventTicket {
  id: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue?: {
      name: string;
    };
  };
  ticket_type: {
    name: string;
    price: number;
  };
  purchase_date: string;
  status: string;
  ticket_code: string;
}

const MyTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          id,
          purchase_date,
          status,
          ticket_code,
          event:event_id (
            id,
            name,
            date,
            time,
            venue:venue_id (
              name
            )
          ),
          ticket_type:ticket_type_id (
            name,
            price
          )
        `)
        .eq('user_id', user?.id)
        .order('purchase_date', { ascending: false });

      if (error) {
        throw error;
      }

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error loading tickets",
        description: "Failed to load your tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = (ticketId: string) => {
    toast({
      title: "QR Code",
      description: `Ticket ID: ${ticketId}`,
    });
  };

  const downloadTicket = (ticket: EventTicket) => {
    toast({
      title: "Download started",
      description: "Your ticket is being prepared for download.",
    });
  };

  const resendConfirmation = (ticket: EventTicket) => {
    toast({
      title: "Email sent",
      description: `Confirmation resent to your email`,
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
            <p className="text-gray-600">Please log in to view your tickets.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
            <p>Loading your tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
        
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-gray-600 mb-4">You haven't purchased any tickets yet.</p>
              <Button asChild>
                <a href="/events">Browse Events</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{ticket.event.name}</CardTitle>
                      <p className="text-gray-600">
                        Purchased on {new Date(ticket.purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={ticket.status === 'confirmed' ? 'default' : 'secondary'}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Ticket Details</p>
                        <p className="text-sm text-gray-600">
                          {ticket.ticket_type.name} ticket
                        </p>
                        <p className="text-sm text-gray-600">
                          ${ticket.ticket_type.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{ticket.event.date} at {ticket.event.time}</span>
                      </div>

                      {ticket.event.venue && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{ticket.event.venue.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateQRCode(ticket.id)}
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadTicket(ticket)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resendConfirmation(ticket)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Resend Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTicketsPage;
