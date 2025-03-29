import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Camera, PlusCircle, Trash, Users, Calendar, BarChart, Map, X } from 'lucide-react';

const EstablishmentProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [promotions, setPromotions] = useState<{id: string; code: string; description: string}[]>([]);
  const [photos, setPhotos] = useState<{id: string; url: string; description: string}[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [visitorStats, setVisitorStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    returningVisitors: 0
  });
  
  const [barCrawls, setBarCrawls] = useState<{
    id: string;
    name: string;
    date: string;
    participants: number;
    organizer: string;
  }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setName("Your Establishment");
      setEmail(localStorage.getItem('user_email') || '');
      setDescription("We serve the best mocktails in town!");
      setAddress("123 Main St, Anytown USA");
      setPhone("555-123-4567");
      setWebsite("www.yourestablishment.com");
      
      setPromotions([
        {id: '1', code: 'WELCOME10', description: '10% off for first time visitors'},
        {id: '2', code: 'MOCKTAIL2023', description: 'Buy one get one free on signature mocktails'}
      ]);
      
      setPhotos([
        {id: '1', url: 'https://placehold.co/300x200', description: 'Our signature blue mocktail'},
        {id: '2', url: 'https://placehold.co/300x200', description: 'Tropical fruits mix'}
      ]);
      
      setVisitorStats({
        totalVisits: 278,
        uniqueVisitors: 153,
        returningVisitors: 62
      });
      
      setBarCrawls([
        {
          id: '1',
          name: 'Downtown Mocktail Tour',
          date: '2023-11-15',
          participants: 12,
          organizer: 'John Smith'
        },
        {
          id: '2',
          name: 'Weekend Spirits-Free Adventure',
          date: '2023-11-20',
          participants: 8,
          organizer: 'Sarah Johnson'
        }
      ]);
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your establishment profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleAddPromotion = () => {
    if (!newPromoCode || !newPromoDescription) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a code and description for your promotion',
        variant: 'destructive'
      });
      return;
    }
    
    const newPromo = {
      id: Date.now().toString(),
      code: newPromoCode,
      description: newPromoDescription
    };
    
    setPromotions([...promotions, newPromo]);
    setNewPromoCode('');
    setNewPromoDescription('');
    
    toast({
      title: 'Promotion added',
      description: `Your promotion "${newPromoCode}" has been added successfully`,
    });
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
    
    toast({
      title: 'Promotion removed',
      description: 'The promotion has been removed successfully',
    });
  };

  const handleUploadPhoto = () => {
    const mockPhoto = {
      id: Date.now().toString(),
      url: 'https://placehold.co/300x200',
      description: 'New mocktail photo'
    };
    
    setPhotos([...photos, mockPhoto]);
    
    toast({
      title: 'Photo uploaded',
      description: 'Your photo has been uploaded successfully',
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    
    toast({
      title: 'Photo removed',
      description: 'The photo has been removed successfully',
    });
  };

  const handleEndParticipation = (crawlId: string) => {
    setBarCrawls(barCrawls.filter(crawl => crawl.id !== crawlId));
    
    toast({
      title: 'Participation ended',
      description: 'You have successfully ended your participation in this bar crawl',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Establishment Profile</h1>
            <p className="text-material-on-surface-variant">
              Manage your establishment information and offerings
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="photos">Mocktail Photos</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Stats</TabsTrigger>
            <TabsTrigger value="barCrawls">Bar Crawl Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Establishment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
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

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Promotional Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promotion Code</label>
                    <Input 
                      value={newPromoCode} 
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="e.g., SUMMER2023" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      value={newPromoDescription} 
                      onChange={(e) => setNewPromoDescription(e.target.value)}
                      placeholder="Describe what this promotion offers" 
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddPromotion} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Promotion
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium mb-2">Your Promotions</h3>
                  {promotions.length > 0 ? (
                    promotions.map(promo => (
                      <div key={promo.id} className="border rounded-md p-3 flex justify-between items-start">
                        <div>
                          <div className="font-medium">{promo.code}</div>
                          <div className="text-sm text-muted-foreground">{promo.description}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeletePromotion(promo.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No promotions added yet. Create your first one!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Mocktail Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleUploadPhoto} className="w-full mb-6">
                  <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map(photo => (
                    <div key={photo.id} className="border rounded-md overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img 
                          src={photo.url} 
                          alt={photo.description} 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <p className="p-2 text-sm">{photo.description}</p>
                    </div>
                  ))}
                  
                  <div 
                    className="border border-dashed rounded-md flex items-center justify-center min-h-[150px] cursor-pointer"
                    onClick={handleUploadPhoto}
                  >
                    <div className="text-center p-4">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add more photos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">Total Visits</h3>
                    </div>
                    <p className="text-2xl font-bold">{visitorStats.totalVisits}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-medium">Unique Visitors</h3>
                    </div>
                    <p className="text-2xl font-bold">{visitorStats.uniqueVisitors}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium">Returning Visitors</h3>
                    </div>
                    <p className="text-2xl font-bold">{visitorStats.returningVisitors}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Visitor Trends</h3>
                  <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-gray-400 mr-2" />
                    <p className="text-material-on-surface-variant text-sm">
                      Visitor trend charts will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="barCrawls">
            <Card>
              <CardHeader>
                <CardTitle>Bar Crawl Participation</CardTitle>
              </CardHeader>
              <CardContent>
                {barCrawls.length > 0 ? (
                  <div className="space-y-4">
                    {barCrawls.map(crawl => (
                      <div key={crawl.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-material-primary mr-2" />
                            <h3 className="font-medium">{crawl.name}</h3>
                          </div>
                          <div className="bg-material-primary/10 px-3 py-1 rounded text-material-primary">
                            {new Date(crawl.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{crawl.participants} participants</span>
                          </div>
                          <div className="flex items-center">
                            <Map className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">Organizer: {crawl.organizer}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleEndParticipation(crawl.id)}
                          >
                            <X className="h-4 w-4 mr-1" /> End Participation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No bar crawl requests at this time.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentProfilePage;
