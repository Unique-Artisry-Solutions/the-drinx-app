
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenSquare, Map, PlusCircle, Award } from 'lucide-react';
import { useRewardsSystem } from '@/hooks/useRewardsSystem';
import { Badge } from '@/components/ui/badge';

const MyCreationsPage: React.FC = () => {
  const [createdSwigCircuits, setCreatedSwigCircuits] = useState<any[]>([]);
  const { toast } = useToast();
  const { userStats, completeSwigCircuit } = useRewardsSystem();
  const userType = localStorage.getItem('user_type');
  const isPromoter = userType === 'promoter';

  // Load user's created bar crawls from localStorage
  useEffect(() => {
    // Get bar crawls from localStorage where we save them when creating
    const storedSwigCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    
    // Sort bar crawls by creation date (newest first)
    const sortedSwigCircuits = storedSwigCircuits.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    setCreatedSwigCircuits(sortedSwigCircuits);
  }, []);

  const handleShareSwigCircuit = (id: string) => {
    // Copy a shareable link to clipboard
    const shareableLink = `${window.location.origin}/swig-circuit-details/${id}`;
    navigator.clipboard.writeText(shareableLink);
    
    toast({
      title: 'Swig Circuit Link Copied',
      description: 'Share link has been copied to clipboard!',
    });
  };

  const handleCompleteSwigCircuit = (id: string) => {
    // Mark a bar crawl as completed and update rewards
    completeSwigCircuit();
    
    // Update the bar crawl status in localStorage
    const updatedSwigCircuits = createdSwigCircuits.map(crawl => {
      if (crawl.id === id) {
        return {
          ...crawl,
          status: 'completed',
          completed_at: new Date().toISOString()
        };
      }
      return crawl;
    });
    
    localStorage.setItem('user_bar_crawls', JSON.stringify(updatedSwigCircuits));
    setCreatedSwigCircuits(updatedSwigCircuits);
    
    toast({
      title: 'Swig Circuit Completed!',
      description: 'You\'ve earned progress toward your next reward tier!',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Created Swig Circuits</h1>
              <p className="text-material-on-surface-variant">
                {isPromoter 
                  ? "Manage Swig Circuits you've created and organized" 
                  : "View Swig Circuits you've participated in"}
              </p>
            </div>
            {isPromoter && (
              <Button asChild>
                <Link to="/create-swig-circuit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Swig Circuit
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {userStats.swigCircuitsCompleted >= 5 && (
          <div className="mb-6 p-4 border rounded-lg bg-blue-50 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 bg-blue-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Rewards Active!</h3>
                <p className="text-sm text-gray-600">
                  You've unlocked Tier {userStats.swigCircuitsCompleted >= 15 ? '3' : '2'} rewards for completing {userStats.swigCircuitsCompleted} Swig Circuits
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile/rewards">View Rewards</Link>
            </Button>
          </div>
        )}
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {createdSwigCircuits.length > 0 ? (
            <>
              {createdSwigCircuits.map((swigCircuit) => (
                <Card key={swigCircuit.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={swigCircuit.imageUrl || 'https://placehold.co/600x300'} 
                      alt={swigCircuit.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl">{swigCircuit.name}</h3>
                        {swigCircuit.status === 'completed' && (
                          <Badge className="bg-green-500">Completed</Badge>
                        )}
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{swigCircuit.establishments?.length || 0} stops</span>
                        <span>{swigCircuit.startDate ? new Date(swigCircuit.startDate).toLocaleDateString() : 'No date'}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      {isPromoter && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/profile/my-creations/${swigCircuit.id}`}>
                            <PenSquare className="h-4 w-4 mr-2" /> Edit
                          </Link>
                        </Button>
                      )}
                      <div className="space-x-2">
                        {swigCircuit.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCompleteSwigCircuit(swigCircuit.id)}
                          >
                            <Award className="h-4 w-4 mr-2" /> Complete
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleShareSwigCircuit(swigCircuit.id)}
                        >
                          <Map className="h-4 w-4 mr-2" /> Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : null}
          
          {isPromoter && (
            <Card className="border-dashed flex items-center justify-center min-h-[220px] cursor-pointer">
              <Link to="/create-swig-circuit" className="w-full h-full">
                <div className="text-center p-4 h-full flex flex-col items-center justify-center">
                  <PlusCircle className="h-12 w-12 mx-auto mb-3 text-material-primary" />
                  <p className="font-medium">Create New Swig Circuit</p>
                  <p className="text-sm text-muted-foreground mt-1">Plan your next adventure</p>
                </div>
              </Link>
            </Card>
          )}
        </div>
        
        {createdSwigCircuits.length === 0 && (
          <div className="text-center py-8 border rounded-md bg-gray-50 mt-6">
            <p className="text-muted-foreground mb-2">No Swig Circuits created yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              {isPromoter 
                ? "Start planning your first Swig Circuit adventure!" 
                : "You haven't participated in any Swig Circuits yet."}
            </p>
            {isPromoter && (
              <Button asChild>
                <Link to="/create-swig-circuit">Create Your First Swig Circuit</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCreationsPage;
