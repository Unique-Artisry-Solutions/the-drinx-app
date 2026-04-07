import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Users, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const EstablishmentSwigCircuitRequestsPage: React.FC = () => {
  // Sample data - in a real implementation, this would come from Supabase
  const requests = [
    {
      id: '1',
      crawlName: 'Downtown Nightlife Tour',
      promoterName: 'Party Promoters LLC',
      requestDate: '2023-11-29',
      crawlDate: '2023-12-15',
      expectedParticipants: 25,
      timeSlot: '7:00 PM - 9:00 PM',
      status: 'pending',
      description: 'High-energy group looking for mocktail specials and fun atmosphere. Part of a 4-venue tour.',
      proposedDeal: '20% discount on mocktails for group members'
    },
    {
      id: '2',
      crawlName: 'Holiday Mocktail Experience',
      promoterName: 'Festive Events Co.',
      requestDate: '2023-11-28', 
      crawlDate: '2023-12-20',
      expectedParticipants: 40,
      timeSlot: '6:30 PM - 8:30 PM',
      status: 'pending',
      description: 'Holiday-themed bar crawl focusing on festive mocktails and seasonal atmosphere.',
      proposedDeal: 'Special holiday mocktail menu at group rates'
    },
    {
      id: '3',
      crawlName: 'Corporate Team Building',
      promoterName: 'Business Events Inc.',
      requestDate: '2023-11-25',
      crawlDate: '2023-12-08',
      expectedParticipants: 15,
      timeSlot: '5:00 PM - 7:00 PM',
      status: 'approved',
      description: 'Professional team building event for local tech company.',
      proposedDeal: 'Corporate package with appetizers and mocktails'
    }
  ];

  const handleApprove = (requestId: string) => {
    console.log('Approving bar crawl request:', requestId);
    // Implementation would update Supabase
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting bar crawl request:', requestId);
    // Implementation would update Supabase
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Route className="text-spiritless-purple" />
            Swig Circuit Requests
          </h1>
          <p className="text-gray-600 mt-2">Review and manage bar crawl participation requests</p>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-orange-500" />
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-orange-400">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl">{request.crawlName}</h3>
                      <p className="text-sm text-gray-600 mt-1">by {request.promoterName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.crawlDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.expectedParticipants} participants</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Event Description:</h4>
                    <p className="text-gray-700 text-sm">{request.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Proposed Deal:</h4>
                    <p className="text-blue-700 text-sm font-medium">{request.proposedDeal}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleApprove(request.id)}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Request
                    </Button>
                    <Button 
                      onClick={() => handleReject(request.id)}
                      variant="outline"
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Approved Requests */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Approved Requests ({approvedRequests.length})
          </h2>
          <div className="grid gap-4">
            {approvedRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-green-400">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl">{request.crawlName}</h3>
                      <p className="text-sm text-gray-600 mt-1">by {request.promoterName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.crawlDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.expectedParticipants} participants</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 text-sm">{request.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-blue-700 text-sm font-medium">{request.proposedDeal}</p>
                  </div>
                  
                  <p className="text-sm text-green-600 font-medium">✓ Approved and scheduled</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentSwigCircuitRequestsPage;