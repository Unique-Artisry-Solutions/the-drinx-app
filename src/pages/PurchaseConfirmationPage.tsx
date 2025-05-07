
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CalendarPlus, MapPin, Ticket, ArrowRight, Download, Printer, Mail } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { getReceipt } from '@/services/paymentService';
import { PaymentReceipt } from '@/types/PaymentTypes';

interface LocationState {
  items: CartItem[];
  serviceFee: number;
  serviceFeePercentage: number;
  totalWithFees: number;
  transactionId?: string;
  contactInfo: {
    name: string;
    email: string;
  };
}

const PurchaseConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

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

  const { items, serviceFee, serviceFeePercentage, totalWithFees, transactionId, contactInfo } = state!;
  
  // Fetch the receipt if we have a transaction ID
  useEffect(() => {
    async function fetchReceipt() {
      if (transactionId) {
        try {
          setIsLoadingReceipt(true);
          const receiptData = await getReceipt(transactionId);
          setReceipt(receiptData);
        } catch (error) {
          console.error('Error fetching receipt:', error);
        } finally {
          setIsLoadingReceipt(false);
        }
      }
    }
    
    fetchReceipt();
  }, [transactionId]);
  
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
  
  const handleDownloadReceipt = () => {
    if (!receipt) return;
    
    // Generate a simple HTML receipt
    const receiptHtml = `
      <html>
      <head>
        <title>Receipt #${receipt.receipt_number}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          h1 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .receipt-container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .receipt-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .receipt-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; text-align: right; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <div>
              <h1>Receipt</h1>
              <p>Receipt Number: ${receipt.receipt_number}</p>
              <p>Date: ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div class="receipt-details">
            <h2>Customer Information</h2>
            <p>Name: ${contactInfo.name}</p>
            <p>Email: ${contactInfo.email}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity || 1}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${((item.quantity || 1) * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Service Fee (${serviceFeePercentage}%): $${serviceFee.toFixed(2)}</p>
            <p class="total">Total: $${totalWithFees.toFixed(2)}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Transaction ID: ${transactionId}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create a blob from the HTML and download it
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.receipt_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleEmailReceipt = () => {
    // In a real application, this would call an API to send the receipt via email
    // For now, we'll just show a toast
    alert(`Receipt would be emailed to ${contactInfo.email}`);
  };
  
  const handlePrintReceipt = () => {
    window.print();
  };
  
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
        
        {receipt && (
          <Card className="mb-6 print:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Receipt #{receipt.receipt_number}</span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={handleDownloadReceipt}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePrintReceipt}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleEmailReceipt}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono">{transactionId}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Date</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Customer</p>
                  <p>{contactInfo.name}</p>
                  <p>{contactInfo.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-8 print:shadow-none">
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
