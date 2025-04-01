
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenSquare, Map, PlusCircle } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';

const MyBarCrawlsPage: React.FC = () => {
  const [createdBarCrawls, setCreatedBarCrawls] = useState<any[]>([]);
  const { toast } = useToast();

  // Simulate loading user's created bar crawls
  useEffect(() => {
    // Mock data - in a real app, this would come from your backend
    const mockBarCrawls = [
      {
        id: '1',
        name: 'Downtown Delights',
        image: 'https://placehold.co/600x300',
        establishments: sampleEstablishments.slice(0, 3),
        participants: 24,
        creator: true
      },
      {
        id: '2',
        name: 'Weekend Wanderers',
        image: 'https://placehold.co/600x300', 
        establishments: sampleEstablishments.slice(1, 4),
        participants: 12,
        creator: true
      }
    ];
    
    setCreatedBarCrawls(mockBarCrawls);
  }, []);

  const handleShareBarCrawl = (id: string) => {
    toast({
      title: 'Bar Crawl Shared',
      description: 'Your bar crawl has been shared with others!',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">My Bar Crawls</h1>
              <p className="text-material-on-surface-variant">
                Manage bar crawls you've created
              </p>
            </div>
            <Button asChild>
              <Link to="/create-bar-crawl">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Bar Crawl
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {createdBarCrawls.map((barCrawl) => (
            <Card key={barCrawl.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={barCrawl.image} 
                  alt={barCrawl.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-xl">{barCrawl.name}</h3>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{barCrawl.establishments.length} stops</span>
                    <span>{barCrawl.participants} participants</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/profile/bar-crawls/${barCrawl.id}`}>
                      <PenSquare className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/bar-crawl-details/${barCrawl.id}`}>
                      <Map className="h-4 w-4 mr-2" /> View Map
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed flex items-center justify-center min-h-[220px] cursor-pointer">
            <Link to="/create-bar-crawl" className="w-full h-full">
              <div className="text-center p-4 h-full flex flex-col items-center justify-center">
                <PlusCircle className="h-12 w-12 mx-auto mb-3 text-material-primary" />
                <p className="font-medium">Create New Bar Crawl</p>
                <p className="text-sm text-muted-foreground mt-1">Plan your next adventure</p>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MyBarCrawlsPage;
