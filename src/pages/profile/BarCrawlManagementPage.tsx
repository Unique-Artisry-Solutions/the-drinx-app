
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Share2, 
  ImagePlus,
  PlusCircle,
  X,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, parseISO, addDays } from 'date-fns';
import BackButton from '@/components/navigation/BackButton';
import { BarCrawl, Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';

const BarCrawlManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [barCrawl, setBarCrawl] = useState<BarCrawl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [availableEstablishments, setAvailableEstablishments] = useState<Establishment[]>([]);

  // Load the bar crawl data
  useEffect(() => {
    const loadBarCrawl = () => {
      try {
        const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
        const foundBarCrawl = barCrawls.find((bc: any) => bc.id === id);
        
        if (foundBarCrawl) {
          setBarCrawl(foundBarCrawl);
          setName(foundBarCrawl.name);
          setDescription(foundBarCrawl.description || '');
          setStartDate(foundBarCrawl.startDate);
          setEndDate(foundBarCrawl.endDate);
        }
        
        // Load sample establishments that are not already in the bar crawl
        const barCrawlEstIds = foundBarCrawl?.establishments?.map((est: Establishment) => est.id) || [];
        const availableEsts = sampleEstablishments.filter(est => !barCrawlEstIds.includes(est.id));
        setAvailableEstablishments(availableEsts);
      } catch (error) {
        console.error('Error loading bar crawl:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bar crawl data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBarCrawl();
  }, [id, toast]);

  const saveBarCrawlChanges = () => {
    if (!barCrawl) return;
    
    try {
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === id) {
          return {
            ...bc,
            name,
            description,
            startDate,
            endDate,
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
        name,
        description,
        startDate,
        endDate,
      });
      
      toast({
        title: 'Changes Saved',
        description: 'Your bar crawl has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving bar crawl changes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save bar crawl changes',
        variant: 'destructive',
      });
    }
  };

  const addEstablishment = (establishment: Establishment) => {
    if (!barCrawl) return;
    
    try {
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === id) {
          return {
            ...bc,
            establishments: [...bc.establishments, establishment]
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
        establishments: [...barCrawl.establishments, establishment]
      });
      
      // Remove from available establishments
      setAvailableEstablishments(availableEstablishments.filter(est => est.id !== establishment.id));
      
      toast({
        title: 'Establishment Added',
        description: `${establishment.name} has been added to your bar crawl.`,
      });
    } catch (error) {
      console.error('Error adding establishment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add establishment',
        variant: 'destructive',
      });
    }
  };

  const removeEstablishment = (establishmentId: string) => {
    if (!barCrawl) return;
    
    try {
      const establishmentToRemove = barCrawl.establishments.find(est => est.id === establishmentId);
      
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === id) {
          return {
            ...bc,
            establishments: bc.establishments.filter((est: any) => est.id !== establishmentId)
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
        establishments: barCrawl.establishments.filter(est => est.id !== establishmentId)
      });
      
      // Add back to available establishments if it exists
      if (establishmentToRemove) {
        setAvailableEstablishments([...availableEstablishments, establishmentToRemove]);
      }
      
      toast({
        title: 'Establishment Removed',
        description: 'The establishment has been removed from your bar crawl.',
      });
    } catch (error) {
      console.error('Error removing establishment:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove establishment',
        variant: 'destructive',
      });
    }
  };

  const inviteUser = () => {
    if (!inviteeEmail || !barCrawl) return;
    
    // In a real app, this would send an email invitation
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${inviteeEmail}`,
    });
    
    setInviteeEmail('');
    setShowInviteForm(false);
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/bar-crawl/${id}`;
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: 'Link Copied',
      description: 'Share link has been copied to clipboard',
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareLink = `${window.location.origin}/bar-crawl/${id}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Join my bar crawl: ${name}`)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll just copy the link
        navigator.clipboard.writeText(shareLink);
        toast({
          title: 'Link Copied',
          description: 'Share on Instagram by pasting this link in your post or bio',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-4 max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!barCrawl) {
    return (
      <Layout>
        <div className="py-4 max-w-5xl mx-auto">
          <BackButton fallbackPath="/profile/bar-crawls" />
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Bar Crawl Not Found</h1>
            <p className="text-gray-600 mb-6">The bar crawl you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/profile/bar-crawls">Go Back to Bar Crawls</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 max-w-5xl mx-auto">
        <BackButton fallbackPath="/profile/bar-crawls" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium">{barCrawl.name}</h1>
            <p className="text-material-on-surface-variant">
              Manage your bar crawl details and participants
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={copyShareLink}
          >
            <Share2 size={16} />
            Share
          </Button>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="invites">Invitations</TabsTrigger>
            <TabsTrigger value="sharing">Social Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Bar Crawl Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Bar Crawl Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input 
                            id="startDate" 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              // Update end date based on new start date
                              if (e.target.value) {
                                const start = new Date(e.target.value);
                                const end = addDays(start, 7);
                                setEndDate(format(end, 'yyyy-MM-dd'));
                              }
                            }} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input 
                            id="endDate" 
                            type="date" 
                            value={endDate}
                            readOnly
                            className="bg-gray-50"
                            title="End date is automatically set to 7 days after the start date"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum 7 days
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Bar Crawl Image</Label>
                      <div className="border rounded-md overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={barCrawl.imageUrl || 'https://placehold.co/600x300'} 
                            alt={barCrawl.name} 
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="absolute top-2 right-2 bg-white/80" 
                          >
                            <ImagePlus size={16} className="mr-2" />
                            Change
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Bar Crawl Stats</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-medium">{barCrawl.status.charAt(0).toUpperCase() + barCrawl.status.slice(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Establishments:</span>
                            <span className="font-medium">{barCrawl.establishments.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Organizer:</span>
                            <span className="font-medium">{barCrawl.organizer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span className="font-medium">{barCrawl.created_at ? format(new Date(barCrawl.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveBarCrawlChanges}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="establishments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Establishments</CardTitle>
                </CardHeader>
                <CardContent>
                  {barCrawl.establishments.length > 0 ? (
                    <div className="space-y-4">
                      {barCrawl.establishments.map((est, index) => (
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeEstablishment(est.id)}
                          >
                            <X size={16} className="text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No establishments added yet</p>
                      <p className="text-sm text-gray-400">
                        Add establishments from the list on the right
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Establishments</CardTitle>
                </CardHeader>
                <CardContent>
                  {availableEstablishments.length > 0 ? (
                    <div className="space-y-4">
                      {availableEstablishments.map((est) => (
                        <div key={est.id} className="flex items-center border rounded-md p-3">
                          <div className="flex-1">
                            <h3 className="font-medium">{est.name}</h3>
                            <div className="flex items-center text-sm text-material-on-surface-variant">
                              <MapPin size={14} className="mr-1" />
                              {est.address}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => addEstablishment(est)}
                          >
                            <PlusCircle size={16} className="text-green-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No more establishments available</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/map">
                        Find More on Map
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="invites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Invite Friends</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowInviteForm(!showInviteForm)}
                  >
                    <PlusCircle size={16} className="mr-2" />
                    New Invitation
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showInviteForm && (
                  <div className="mb-6 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-3">Send Invitation</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address"
                        value={inviteeEmail}
                        onChange={(e) => setInviteeEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={inviteUser}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">
                    No invitations sent yet
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Invite by Link</h3>
                    <div className="flex gap-2">
                      <Input
                        value={`${window.location.origin}/bar-crawl/${id}`}
                        readOnly
                        className="flex-1 bg-gray-50"
                      />
                      <Button variant="outline" onClick={copyShareLink}>
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sharing">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Share on Social Media</h3>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex-1 h-20 flex-col gap-2"
                        onClick={() => shareToSocialMedia('facebook')}
                      >
                        <Facebook size={24} className="text-blue-600" />
                        <span>Facebook</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex-1 h-20 flex-col gap-2"
                        onClick={() => shareToSocialMedia('twitter')}
                      >
                        <Twitter size={24} className="text-blue-400" />
                        <span>Twitter</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex-1 h-20 flex-col gap-2"
                        onClick={() => shareToSocialMedia('instagram')}
                      >
                        <Instagram size={24} className="text-pink-500" />
                        <span>Instagram</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Direct Link</h3>
                    <div className="flex gap-2">
                      <Input
                        value={`${window.location.origin}/bar-crawl/${id}`}
                        readOnly
                        className="flex-1 bg-gray-50"
                      />
                      <Button variant="outline" onClick={copyShareLink}>
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Preview</h3>
                    <div className="flex gap-4">
                      <div className="h-24 w-24 bg-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={barCrawl.imageUrl || 'https://placehold.co/600x300'} 
                          alt={barCrawl.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{barCrawl.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {format(new Date(barCrawl.startDate), 'MMM d')} - {format(new Date(barCrawl.endDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {barCrawl.establishments.length} establishments • Organized by {barCrawl.organizer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BarCrawlManagementPage;
