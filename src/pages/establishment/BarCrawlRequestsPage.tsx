
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, UserIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BarCrawlRequestsPage: React.FC = () => {
  const { toast } = useToast();

  // Sample data - in a real implementation, this would come from Supabase
  const barCrawlRequests = [
    {
      id: '1',
      name: 'Holiday Mocktail Crawl',
      organizer: 'Mike Wilson',
      participants: 15,
      date: '2023-12-15',
      time: '7:00 PM',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Weekend Wellness Tour',
      organizer: 'Ashley Bennett',
      participants: 12,
      date: '2023-12-20',
      time: '6:30 PM',
      status: 'pending'
    },
    {
      id: '3',
      name: 'New Year Spirits-Free Adventure',
      organizer: 'Jordan Taylor',
      participants: 20,
      date: '2023-12-31',
      time: '8:00 PM',
      status: 'pending'
    }
  ];

  const handleAcceptRequest = (id: string) => {
    toast({
      title: 'Request Accepted',
      description: 'You have successfully accepted this Swig Circuit request.'
    });
  };

  const handleDeclineRequest = (id: string) => {
    toast({
      title: 'Request Declined',
      description: 'You have declined this Swig Circuit request.'
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text mb-4">Swig Circuit Requests</h1>
        <p className="text-material-on-surface-variant mb-6">
          Review and manage requests to include your establishment in Swig Circuits
        </p>

        {barCrawlRequests.length === 0 ? (
          <Card className="vibrant-card">
            <CardContent className="p-6 text-center">
              <p className="text-material-on-surface-variant">
                No pending Swig Circuit requests at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {barCrawlRequests.map((request) => (
              <Card key={request.id} className="vibrant-card hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{request.name}</h3>
                      
                      <div className="flex items-center text-sm text-material-on-surface-variant">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>Organized by {request.organizer}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-material-on-surface-variant">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{request.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-material-on-surface-variant">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{request.time}</span>
                        </div>
                        
                        <div className="text-sm text-material-on-surface-variant">
                          <span>{request.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50" 
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        Decline
                      </Button>
                      <Button 
                        variant="gradient" 
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
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

export default BarCrawlRequestsPage;
