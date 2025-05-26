
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Calendar, Download } from 'lucide-react';

const PurchaseSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchaseData = location.state;

  useEffect(() => {
    // If no purchase data, redirect to home
    if (!purchaseData) {
      navigate('/');
    }
  }, [purchaseData, navigate]);

  if (!purchaseData) {
    return null;
  }

  const { purchaseDetails, contactEmail } = purchaseData;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Purchase Successful!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your tickets have been confirmed.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Confirmation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmation sent to:</p>
                  <p className="font-medium">{contactEmail}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Purchase Date:</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>

                {purchaseDetails?.purchaseRecords && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Items Purchased:</p>
                    <div className="space-y-2">
                      {purchaseDetails.purchaseRecords.map((record: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{record.purchase_details?.item_name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {record.quantity} × ${record.price_per_ticket}
                          </p>
                          {record.purchase_details?.date && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {record.purchase_details.date} at {record.purchase_details.time}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-gray-600">
                      You'll receive a confirmation email with your tickets and QR codes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Save your tickets</p>
                    <p className="text-sm text-gray-600">
                      Download or save the QR codes to your phone for easy access at the event.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Add to calendar</p>
                    <p className="text-sm text-gray-600">
                      Don't forget to add the event dates to your calendar!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/my-tickets">View My Tickets</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseSuccessPage;
