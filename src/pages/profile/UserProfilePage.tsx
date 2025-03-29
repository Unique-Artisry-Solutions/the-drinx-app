
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, PenSquare, Trash, Upload, Map as MapIcon, Users } from 'lucide-react';
import MapView from '@/components/map/MapView';

const UserProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [barCrawls, setBarCrawls] = useState<any[]>([
    {
      id: '1',
      name: 'Downtown Delights',
      image: 'https://placehold.co/600x300',
      status: 'active',
      participants: 24,
      createdAt: '2023-06-15',
      establishments: [
        { id: '1', name: 'Mocktail Heaven', address: '123 Main St', accepted: true },
        { id: '2', name: 'Sober Bar', address: '456 Oak Ave', accepted: true },
        { id: '3', name: 'Tropical Vibes', address: '789 Palm Blvd', accepted: false }
      ]
    },
    {
      id: '2',
      name: 'Weekend Wanderers',
      image: 'https://placehold.co/600x300',
      status: 'active',
      participants: 12,
      createdAt: '2023-08-20',
      establishments: [
        { id: '4', name: 'Chill Zone', address: '321 Cool St', accepted: true },
        { id: '5', name: 'Zero Proof', address: '654 Pine Rd', accepted: true }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBarCrawl, setSelectedBarCrawl] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would fetch user data from an API
    setTimeout(() => {
      setName(localStorage.getItem('user_name') || 'User');
      setEmail(localStorage.getItem('user_email') || '');
      setUsername(localStorage.getItem('user_username') || '');
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_username', username);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleBarCrawlClick = (barCrawl: any) => {
    setSelectedBarCrawl(barCrawl);
  };

  const handleBackToList = () => {
    setSelectedBarCrawl(null);
  };

  const handleRemoveEstablishment = (establishmentId: string) => {
    if (!selectedBarCrawl) return;
    
    setSelectedBarCrawl({
      ...selectedBarCrawl,
      establishments: selectedBarCrawl.establishments.filter(
        (est: any) => est.id !== establishmentId
      )
    });
    
    toast({
      title: 'Establishment removed',
      description: 'The establishment has been removed from your bar crawl',
    });
  };

  const handleSaveBarCrawl = () => {
    if (!selectedBarCrawl) return;
    
    // Update the bar crawl in the list
    setBarCrawls(barCrawls.map(bc => 
      bc.id === selectedBarCrawl.id ? selectedBarCrawl : bc
    ));
    
    toast({
      title: 'Bar crawl updated',
      description: 'Your bar crawl has been updated successfully',
    });
    
    // Go back to the list
    setSelectedBarCrawl(null);
  };

  const renderBarCrawlDetail = () => {
    if (!selectedBarCrawl) return null;
    
    const mockEstablishmentsForMap = selectedBarCrawl.establishments.map((est: any, index: number) => ({
      id: est.id,
      name: est.name,
      latitude: 40.7128 + (index * 0.01),
      longitude: -74.006 - (index * 0.01),
      cocktailCount: 5
    }));
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToList}>
            ← Back to list
          </Button>
          <Button onClick={handleSaveBarCrawl}>Save Changes</Button>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bar Crawl Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                <img 
                  src={selectedBarCrawl.image} 
                  alt={selectedBarCrawl.name} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 rounded-md"
                >
                  <Upload className="h-4 w-4 mr-2" /> Change Image
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bar Crawl Name</label>
                <Input 
                  value={selectedBarCrawl.name} 
                  onChange={(e) => setSelectedBarCrawl({...selectedBarCrawl, name: e.target.value})}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" /> 
                  <span>{selectedBarCrawl.participants} participants</span>
                </div>
                <div>Created on {selectedBarCrawl.createdAt}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Establishments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedBarCrawl.establishments.map((est: any, index: number) => (
                  <div key={est.id} className="flex items-center border rounded-md p-3">
                    <div className="h-8 w-8 rounded-full bg-material-primary text-white flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{est.name}</h3>
                      <div className="flex items-center text-sm text-material-on-surface-variant">
                        <MapPin size={14} className="mr-1" />
                        {est.address}
                      </div>
                    </div>
                    <div className="flex">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveEstablishment(est.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Bar Crawl Map</CardTitle>
          </CardHeader>
          <CardContent>
            <MapView 
              establishments={mockEstablishmentsForMap}
              height="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBarCrawlList = () => {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {barCrawls.map(barCrawl => (
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
                  onClick={() => handleBarCrawlClick(barCrawl)}
                >
                  <PenSquare className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MapIcon className="h-4 w-4 mr-2" /> View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed flex items-center justify-center min-h-[220px] cursor-pointer">
          <div className="text-center p-4">
            <PlusCircle className="h-12 w-12 mx-auto mb-3 text-material-primary" />
            <p className="font-medium">Create New Bar Crawl</p>
            <p className="text-sm text-muted-foreground mt-1">Plan your next adventure</p>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">My Profile</h1>
            <p className="text-material-on-surface-variant">
              Manage your account and bar crawls
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="barCrawls">Bar Crawls</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="visited">Visited</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="barCrawls">
            {selectedBarCrawl ? renderBarCrawlDetail() : renderBarCrawlList()}
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorite Mocktails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  You haven't added any favorites yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visited">
            <Card>
              <CardHeader>
                <CardTitle>Places You've Visited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  No visited establishments yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
