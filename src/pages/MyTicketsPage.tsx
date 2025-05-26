
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, QrCode, Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TicketPurchase {
  id: string;
  ticket_type: string;
  quantity: number;
  price_per_ticket: number;
  total_amount: number;
  payment_status: string;
  contact_name: string;
  contact_email: string;
  created_at: string;
  purchase_details: {
    item_name: string;
    date?: string;
    time?: string;
    venue?: string;
  };
}

const MyTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketPurchase[]>([]);
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
        .from('ticket_purchases')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

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
    // This would typically generate a QR code
    // For now, we'll just show the ticket ID
    toast({
      title: "QR Code",
      description: `Ticket ID: ${ticketId}`,
    });
  };

  const downloadTicket = (ticket: TicketPurchase) => {
    // This would generate and download a PDF ticket
    toast({
      title: "Download started",
      description: "Your ticket is being prepared for download.",
    });
  };

  const resendConfirmation = (ticket: TicketPurchase) => {
    // This would resend the confirmation email
    toast({
      title: "Email sent",
      description: `Confirmation resent to ${ticket.contact_email}`,
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
                      <CardTitle>{ticket.purchase_details.item_name}</CardTitle>
                      <p className="text-gray-600">
                        Purchased on {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={ticket.payment_status === 'completed' ? 'default' : 'secondary'}
                    >
                      {ticket.payment_status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Ticket Details</p>
                        <p className="text-sm text-gray-600">
                          {ticket.quantity} × {ticket.ticket_type} ticket{ticket.quantity > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${ticket.price_per_ticket} each (Total: ${ticket.total_amount})
                        </p>
                      </div>

                      {ticket.purchase_details.date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{ticket.purchase_details.date} at {ticket.purchase_details.time}</span>
                        </div>
                      )}

                      {ticket.purchase_details.venue && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{ticket.purchase_details.venue}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Contact Information</p>
                        <p className="text-sm text-gray-600">{ticket.contact_name}</p>
                        <p className="text-sm text-gray-600">{ticket.contact_email}</p>
                      </div>

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
