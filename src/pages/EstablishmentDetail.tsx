
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import EstablishmentInterior from '@/components/establishment/EstablishmentInterior';
import { useUserLocation } from '@/hooks/useUserLocation';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

const EstablishmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any>(null);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userLocation } = useUserLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstablishmentData = async () => {
      if (!id) {
        setError("No establishment ID provided");
        setIsLoading(false);
        return;
      }

      // Check if this is a special route or an invalid UUID format
      if (id === 'profile' || id === 'analytics' || id === 'bar-crawl-requests' || 
          id === 'reviews' || id === 'mocktail-suggestions' || 
          id === 'mocktail-menu' || id === 'promotions') {
        // These are valid routes within the establishment section, not actual IDs
        console.log("Received a special route, not an establishment ID:", id);
        setError("Invalid establishment ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // If the ID is numeric, try to find the establishment by its numeric ID in sample data
        if (/^\d+$/.test(id)) {
          console.log("Received numeric ID, looking for corresponding establishment in sample data");
          // For sample numeric IDs, map them to the sample data
          const sampleEstablishment = await findSampleEstablishmentByLegacyId(id);
          if (sampleEstablishment) {
            setEstablishment(sampleEstablishment);
            setCocktails(findSampleCocktailsForEstablishment(sampleEstablishment.id));
            setIsLoading(false);
            return;
          } else {
            throw new Error(`No establishment found with numeric ID: ${id}`);
          }
        }
        
        // Proceed with normal UUID lookup
        if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          throw new Error("Invalid establishment ID format");
        }

        // Fetch establishment
        const { data: estData, error: estError } = await supabase
          .from('establishments')
          .select('*')
          .eq('id', id)
          .single();

        if (estError) throw estError;
        if (!estData) throw new Error('Establishment not found');
        
        setEstablishment(estData);
        
        // Fetch cocktails for this establishment
        const { data: cocktailsData, error: cocktailsError } = await supabase
          .from('cocktails')
          .select('*')
          .eq('establishment_id', id);
          
        if (cocktailsError) throw cocktailsError;
        setCocktails(cocktailsData || []);
      } catch (err: any) {
        console.error('Error fetching establishment details:', err);
        setError(err.message || 'Failed to load establishment details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishmentData();
  }, [id]);

  // Helper function to find a sample establishment by legacy numeric ID
  const findSampleEstablishmentByLegacyId = async (numericId: string) => {
    // Import sample data dynamically to prevent circular dependencies
    const { sampleEstablishments, sampleCocktails } = await import('@/data/sampleData');
    
    return sampleEstablishments.find(est => est.id === numericId || est.id === `${numericId}`);
  };

  // Helper function to get sample cocktails for an establishment
  const findSampleCocktailsForEstablishment = (establishmentId: string) => {
    // We need to reimport here to ensure we're using the same data
    const { sampleCocktails } = require('@/data/sampleData');
    
    return sampleCocktails.filter(
      cocktail => cocktail.establishment && cocktail.establishment.id === establishmentId
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-8 px-4">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <div className="mt-8">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !establishment) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p className="text-red-500 mb-4">{error || 'Establishment not found'}</p>
          <button 
            onClick={() => navigate('/explore')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Explore
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pb-8">
        <EstablishmentInterior 
          establishment={establishment} 
          cocktails={cocktails}
          userLocation={userLocation}
        />
      </div>
    </Layout>
  );
};

export default EstablishmentDetail;
