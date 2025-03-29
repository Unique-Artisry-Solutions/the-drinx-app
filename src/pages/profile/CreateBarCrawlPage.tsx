
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BackButton from '@/components/navigation/BackButton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, CalendarIcon, ExternalLink, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import PhotoUploadField from '@/components/PhotoUploadField';
import MapView from '@/components/map/MapView';
import { sampleEstablishments } from '@/data/sampleData';

// Define validation schema with profanity and special character checks
const barCrawlSchema = z.object({
  name: z.string()
    .min(3, { message: 'Bar crawl name must be at least 3 characters' })
    .max(50, { message: 'Bar crawl name must not exceed 50 characters' })
    .refine(val => !/[<>{}[\]\\\/]/.test(val), { 
      message: 'Name contains invalid special characters' 
    })
    .refine(val => !/(fuck|shit|ass|damn|cunt)/i.test(val), { 
      message: 'Name contains inappropriate language' 
    }),
  description: z.string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(500, { message: 'Description must not exceed 500 characters' })
    .refine(val => !/[<>{}[\]\\\/]/.test(val), { 
      message: 'Description contains invalid special characters' 
    })
    .refine(val => !/(fuck|shit|ass|damn|cunt)/i.test(val), { 
      message: 'Description contains inappropriate language' 
    }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  promoCode: z.string()
    .min(3, { message: 'Promo code must be at least 3 characters' })
    .max(20, { message: 'Promo code must not exceed 20 characters' })
    .refine(val => /^[A-Za-z0-9_-]+$/.test(val), { 
      message: 'Promo code can only contain letters, numbers, underscores, and hyphens' 
    }),
});

type BarCrawlFormValues = z.infer<typeof barCrawlSchema>;

const CreateBarCrawlPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [photo, setPhoto] = useState<File | null>(null);
  const [qrValue, setQrValue] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const [selectedEstablishments, setSelectedEstablishments] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form default values
  const defaultValues: Partial<BarCrawlFormValues> = {
    name: '',
    description: '',
    promoCode: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week later
  };

  // Initialize form with zod validation
  const form = useForm<BarCrawlFormValues>({
    resolver: zodResolver(barCrawlSchema),
    defaultValues,
  });

  // Watch form values to update QR code
  const watchName = form.watch('name');
  const watchPromoCode = form.watch('promoCode');
  
  useEffect(() => {
    if (watchName && watchPromoCode) {
      setQrValue(`https://spiritless.app/bar-crawl/${encodeURIComponent(watchName)}?promo=${encodeURIComponent(watchPromoCode)}`);
    }
  }, [watchName, watchPromoCode]);

  // Get user location for the map
  useEffect(() => {
    handleRefreshLocation();
  }, []);

  // Map related functions
  const handleRefreshLocation = () => {
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoadingLocation(false);
        toast({
          title: 'Location Error',
          description: 'Could not access your location. Please check your browser settings.',
          variant: 'destructive',
        });
      }
    );
  };

  // Handle establishment selection from map
  const handleEstablishmentSelect = (establishmentId: string) => {
    const establishment = sampleEstablishments.find(e => e.id === establishmentId);
    
    if (establishment) {
      // Check if already selected
      if (!selectedEstablishments.some(e => e.id === establishmentId)) {
        setSelectedEstablishments([...selectedEstablishments, establishment]);
        
        toast({
          title: 'Establishment Added',
          description: `${establishment.name} has been added to your bar crawl`,
        });
      } else {
        // Remove from selection if already selected
        setSelectedEstablishments(selectedEstablishments.filter(e => e.id !== establishmentId));
        
        toast({
          title: 'Establishment Removed',
          description: `${establishment.name} has been removed from your bar crawl`,
        });
      }
    }
  };

  // Form submission handler
  const onSubmit = (data: BarCrawlFormValues) => {
    // Ensure we have establishments and a photo
    if (selectedEstablishments.length === 0) {
      toast({
        title: 'Missing Establishments',
        description: 'Please select at least one establishment for your bar crawl',
        variant: 'destructive',
      });
      return;
    }
    
    if (!photo) {
      toast({
        title: 'Missing Photo',
        description: 'Please upload a photo for your bar crawl',
        variant: 'destructive',
      });
      return;
    }

    // Combine all data
    const barCrawlData = {
      ...data,
      establishments: selectedEstablishments,
      photo: photo,
      status: 'pending', // Needs admin approval
      created: new Date(),
    };

    console.log('Bar Crawl submission:', barCrawlData);
    
    // Show success toast and redirect
    toast({
      title: 'Bar Crawl Submitted',
      description: 'Your bar crawl has been submitted for approval',
    });

    // Navigate back to bar crawls page
    setTimeout(() => {
      navigate('/profile/bar-crawls');
    }, 1500);
  };

  // Share handlers
  const handleShare = (platform: string) => {
    const shareUrl = qrValue || 'https://spiritless.app/bar-crawl';
    const shareText = `Join my bar crawl: ${form.getValues('name')}`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll show a toast
        toast({
          title: 'Instagram Sharing',
          description: 'Copy the link and share it on Instagram manually',
        });
        navigator.clipboard.writeText(shareUrl);
        return;
      default:
        if (navigator.share) {
          navigator.share({
            title: shareText,
            text: shareText,
            url: shareUrl,
          }).catch(err => console.error('Error sharing:', err));
        } else {
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: 'Link Copied',
            description: 'Share link copied to clipboard',
          });
        }
        return;
    }
    
    window.open(shareLink, '_blank');
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <BackButton className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Create Bar Crawl</h1>
              <p className="text-material-on-surface-variant">
                Plan and share your own bar crawl experience
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Details Tab */}
              <TabsContent value="details">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bar Crawl Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Downtown Delights" {...field} />
                            </FormControl>
                            <FormDescription>
                              Create a memorable name for your bar crawl
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your bar crawl, locations, theme, etc." 
                                {...field} 
                                className="resize-none min-h-[120px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Tell others what makes your bar crawl special
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 grid-cols-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => 
                                      date < new Date() || 
                                      (form.getValues("startDate") && date < form.getValues("startDate"))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="promoCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promotional Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., SPIRITLESS20" {...field} />
                            </FormControl>
                            <FormDescription>
                              Add a promo code for special offers at establishments
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Bar Crawl Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PhotoUploadField 
                        onPhotoSelect={(file) => setPhoto(file)} 
                        className="mb-4"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload an image that represents your bar crawl. This will be displayed on your bar crawl page and promotional materials.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={() => setActiveTab('establishments')}>
                    Next: Select Establishments
                  </Button>
                </div>
              </TabsContent>

              {/* Establishments Tab */}
              <TabsContent value="establishments">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Select Establishments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Select establishments from the map below to include in your bar crawl. Click on a marker to add or remove an establishment.
                    </p>
                    
                    <div className="h-[400px] mb-6">
                      <MapView 
                        establishments={sampleEstablishments}
                        userLocation={userLocation}
                        onRefreshLocation={handleRefreshLocation}
                        isLoadingLocation={isLoadingLocation}
                        onMarkerClick={handleEstablishmentSelect}
                        mapboxToken={mapboxToken || undefined}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Selected Establishments ({selectedEstablishments.length})</h3>
                      {selectedEstablishments.length > 0 ? (
                        <div className="border rounded-md divide-y">
                          {selectedEstablishments.map((est, index) => (
                            <div key={est.id} className="p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{est.name}</p>
                                  <p className="text-sm text-muted-foreground">{est.address}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEstablishmentSelect(est.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border rounded-md bg-gray-50">
                          <p className="text-muted-foreground">
                            No establishments selected yet. Click on markers in the map to add them.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
                    Back to Details
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('share')}>
                    Next: Share Options
                  </Button>
                </div>
              </TabsContent>

              {/* Share Tab */}
              <TabsContent value="share">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>QR Code</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      {qrValue ? (
                        <div className="mb-4">
                          {/* Placeholder for QR code - in a real app use a QR code library */}
                          <div className="mx-auto w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                            <p className="text-sm text-muted-foreground p-4 text-center">
                              QR Code Preview <br />
                              (In a real app, a QR code would be generated here)
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Download QR Code
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Fill in the name and promo code to generate QR code
                          </p>
                        </div>
                      )}
                      
                      {qrValue && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Shareable Link:</p>
                          <div className="flex items-center">
                            <Input 
                              value={qrValue} 
                              readOnly 
                              className="text-xs"
                            />
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => {
                                navigator.clipboard.writeText(qrValue);
                                toast({
                                  title: 'Link Copied',
                                  description: 'Share link copied to clipboard',
                                });
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Sharing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share your bar crawl on social media to get more participants
                      </p>
                      
                      <div className="space-y-4">
                        <Button 
                          className="w-full bg-[#1877F2] hover:bg-[#166FE5]"
                          onClick={() => handleShare('facebook')}
                        >
                          <Facebook className="mr-2 h-4 w-4" />
                          Share on Facebook
                        </Button>
                        
                        <Button 
                          className="w-full bg-[#1DA1F2] hover:bg-[#1A94DA]"
                          onClick={() => handleShare('twitter')}
                        >
                          <Twitter className="mr-2 h-4 w-4" />
                          Share on Twitter
                        </Button>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90"
                          onClick={() => handleShare('instagram')}
                        >
                          <Instagram className="mr-2 h-4 w-4" />
                          Share on Instagram
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleShare('general')}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share via Other Apps
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('establishments')}>
                    Back to Establishments
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('preview')}>
                    Next: Preview & Submit
                  </Button>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Preview Bar Crawl</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                        {photo ? (
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt="Bar Crawl" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No image uploaded</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h2 className="text-2xl font-bold">
                            {form.getValues('name') || 'Your Bar Crawl Name'}
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                              {selectedEstablishments.length} Establishments
                            </Badge>
                            {form.getValues('startDate') && form.getValues('endDate') && (
                              <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                                {format(form.getValues('startDate'), 'MMM d')} - {format(form.getValues('endDate'), 'MMM d, yyyy')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Description</h3>
                          <p className="text-muted-foreground">
                            {form.getValues('description') || 'No description provided'}
                          </p>
                          
                          <h3 className="text-lg font-medium mt-6 mb-2">Promotional Details</h3>
                          <div className="flex items-center p-3 bg-material-primary/10 rounded-md">
                            <div className="bg-material-primary text-white p-2 rounded-md mr-3">
                              <CheckIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Promo Code</p>
                              <p className="text-lg font-bold tracking-wider">
                                {form.getValues('promoCode') || 'NONE'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Selected Establishments</h3>
                          {selectedEstablishments.length > 0 ? (
                            <div className="space-y-2">
                              {selectedEstablishments.map((est, index) => (
                                <div key={est.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                  <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{est.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No establishments selected</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Approval Process</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                          <p className="text-sm">
                            Your bar crawl will be submitted for approval. An admin will review your submission and either approve or reject it based on our community guidelines. You'll be notified once a decision has been made.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('share')}>
                    Back to Share Options
                  </Button>
                  <Button type="submit">
                    Submit Bar Crawl for Approval
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreateBarCrawlPage;
