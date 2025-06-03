
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Globe, Phone, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminEstablishmentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [establishment, setEstablishment] = useState<any>(null);

  useEffect(() => {
    fetchEstablishmentData();
  }, [id]);

  const fetchEstablishmentData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Fetch the establishment data
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get favorites count for this establishment
      const { count: favoritesCount, error: favoritesError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('establishment_id', id);
      
      if (favoritesError) throw favoritesError;
      
      // Get bar crawls that include this establishment
      const { data: barCrawlsData, error: barCrawlsError } = await supabase
        .from('bar_crawl_establishments')
        .select('bar_crawl_id')
        .eq('establishment_id', id);
      
      if (barCrawlsError) throw barCrawlsError;
      
      setEstablishment({
        ...data,
        favoritesCount: favoritesCount || 0,
        barCrawlsCount: barCrawlsData?.length || 0
      });
    } catch (error: any) {
      console.error('Error fetching establishment data:', error);
      toast({
        title: 'Failed to load establishment data',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-8 w-8 mb-2" />
          <p>Loading establishment data...</p>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Establishment Profile</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/establishments')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Establishments
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Establishment not found or has been deleted.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate('/admin/establishments')}>
                Return to Establishment List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Establishment Profile</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/establishments')}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Establishments
        </Button>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="h-48 bg-gray-200 relative">
          {establishment.image_url ? (
            <img 
              src={establishment.image_url} 
              alt={establishment.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{establishment.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <span>{establishment.address}</span>
          </div>
          
          {establishment.website && (
            <div className="flex items-start gap-2">
              <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
              <a 
                href={establishment.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {establishment.website}
              </a>
            </div>
          )}
          
          {establishment.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <span>{establishment.phone}</span>
            </div>
          )}
          
          {establishment.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Business Hours</h4>
                <div className="text-sm space-y-1">
                  {typeof establishment.hours === 'object' && Object.entries(establishment.hours).map(([day, hours]: [string, any]) => (
                    <div key={day}>
                      <span className="font-medium capitalize">{day}: </span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">ID</div>
              <div className="text-sm font-mono overflow-auto">{establishment.id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Coordinates</div>
              <div>{establishment.latitude}, {establishment.longitude}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Created</div>
              <div>{new Date(establishment.created_at).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Cocktail Count</div>
              <div className="text-lg font-semibold">{establishment.cocktail_count || 0}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Favorites</div>
              <div className="text-lg font-semibold">{establishment.favoritesCount}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Part of Bar Crawls</div>
              <div className="text-lg font-semibold">{establishment.barCrawlsCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button 
          onClick={() => window.open(`/establishment/${establishment.id}`, '_blank')}
          className="w-full max-w-xs"
        >
          View Public Profile
        </Button>
      </div>
    </div>
  );
};

export default AdminEstablishmentProfile;
