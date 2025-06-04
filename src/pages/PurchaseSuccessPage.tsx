
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Ticket, Home } from 'lucide-react';

const PurchaseSuccessPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Purchase Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your tickets have been confirmed.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Ticket className="h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 text-left">
                <Calendar className="h-5 w-5 text-spiritless-pink mt-0.5" />
                <div>
                  <h4 className="font-medium">Check Your Email</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email with your ticket details and QR codes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 text-left">
                <Ticket className="h-5 w-5 text-spiritless-pink mt-0.5" />
                <div>
                  <h4 className="font-medium">Present Your Tickets</h4>
                  <p className="text-sm text-gray-600">
                    Show your QR codes at the event entrance for quick check-in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/explore">
                <Home className="h-4 w-4 mr-2" />
                Return to Explore
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/profile/tickets">
                View My Tickets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseSuccessPage;
