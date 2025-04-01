
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenSquare, Map, PlusCircle } from 'lucide-react';

const MyCreationsPage: React.FC = () => {
  const [createdBarCrawls, setCreatedBarCrawls] = useState<any[]>([]);
  const { toast } = useToast();

  // Load user's created bar crawls from localStorage
  useEffect(() => {
    // Get bar crawls from localStorage where we save them when creating
    const storedBarCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    
    // Sort bar crawls by creation date (newest first)
    const sortedBarCrawls = storedBarCrawls.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    setCreatedBarCrawls(sortedBarCrawls);
  }, []);

  const handleShareBarCrawl = (id: string) => {
    // Copy a shareable link to clipboard
    const shareableLink = `${window.location.origin}/bar-crawl-details/${id}`;
    navigator.clipboard.writeText(shareableLink);
    
    toast({
      title: 'Bar Crawl Link Copied',
      description: 'Share link has been copied to clipboard!',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Created Bar Crawls</h1>
              <p className="text-material-on-surface-variant">
                Manage bar crawls you've created and organized
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
          {createdBarCrawls.length > 0 ? (
            <>
              {createdBarCrawls.map((barCrawl) => (
                <Card key={barCrawl.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={barCrawl.imageUrl || 'https://placehold.co/600x300'} 
                      alt={barCrawl.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-xl">{barCrawl.name}</h3>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{barCrawl.establishments?.length || 0} stops</span>
                        <span>{barCrawl.startDate ? new Date(barCrawl.startDate).toLocaleDateString() : 'No date'}</span>
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
                        <Link to={`/profile/my-creations/${barCrawl.id}`}>
                          <PenSquare className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleShareBarCrawl(barCrawl.id)}
                      >
                        <Map className="h-4 w-4 mr-2" /> Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : null}
          
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
        
        {createdBarCrawls.length === 0 && (
          <div className="text-center py-8 border rounded-md bg-gray-50 mt-6">
            <p className="text-muted-foreground mb-2">No bar crawls created yet</p>
            <p className="text-sm text-muted-foreground mb-4">Start planning your first bar crawl adventure!</p>
            <Button asChild>
              <Link to="/create-bar-crawl">Create Your First Bar Crawl</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCreationsPage;
