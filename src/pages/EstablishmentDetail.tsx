
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import EstablishmentInterior from '@/components/establishment/EstablishmentInterior';
import { useUserLocation } from '@/hooks/useUserLocation';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import ContactVenueButton from '@/components/promoter/communication/ContactVenueButton';

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
        console.error("No establishment ID provided");
        setError("No establishment ID provided");
        setIsLoading(false);
        return;
      }

      // Check if this is a special route or an invalid UUID format
      if (id === 'profile' || id === 'analytics' || id === 'swig-circuit-requests' || 
          id === 'reviews' || id === 'mocktail-suggestions' || 
          id === 'mocktail-menu' || id === 'promotions' || id === 'dashboard') {
        // These are valid routes within the establishment section, not actual IDs
        console.log("Received a special route, not an establishment ID:", id);
        setError("Invalid establishment ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching establishment with ID:", id);
        
        let establishmentData = null;
        let cocktailsData = [];

        // First try to find the establishment in Supabase
        if (isValidUUID(id) || /^\d+$/.test(id)) {
          // Check database for UUID or numeric ID
          const { data: estData, error: estError } = await supabase
            .from('establishments')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          
          if (estError) {
            console.error("Error fetching from Supabase:", estError);
          } else if (estData) {
            console.log("Found establishment in Supabase:", estData);
            establishmentData = estData;
            
            // Fetch cocktails from Supabase
            const { data: cocktailsResult, error: cocktailsError } = await supabase
              .from('cocktails')
              .select('*')
              .eq('establishment_id', id);
              
            if (!cocktailsError && cocktailsResult) {
              cocktailsData = cocktailsResult;
              console.log("Found cocktails in Supabase:", cocktailsData.length);
            }
          }
        }
        
        // If we couldn't find it in Supabase or we don't have an establishment yet
        if (!establishmentData) {
          console.log("Looking for establishment in sample data");
          if (/^\d+$/.test(id)) {
            // If numeric ID, check sample data with legacy ID mapping
            const sampleEstablishment = await findSampleEstablishmentByLegacyId(id);
            if (sampleEstablishment) {
              console.log("Found establishment in sample data by legacy ID:", sampleEstablishment);
              establishmentData = sampleEstablishment;
              cocktailsData = [];  // Don't use sample cocktails to ensure real data only
            }
          } else if (isValidUUID(id)) {
            // If UUID, check directly in sample data
            const { sampleEstablishments } = await import('@/data/sampleData');
            const foundEstablishment = sampleEstablishments.find(est => est.id === id);
            if (foundEstablishment) {
              console.log("Found establishment in sample data by UUID:", foundEstablishment);
              establishmentData = foundEstablishment;
              cocktailsData = [];  // Don't use sample cocktails to ensure real data only
            }
          }
        }

        // If we still don't have an establishment, it doesn't exist
        if (!establishmentData) {
          console.error("Establishment not found with ID:", id);
          throw new Error('Establishment not found');
        }
        
        // Calculate the actual cocktail count from the fetched data, not from sample data
        const actualCocktailCount = cocktailsData ? cocktailsData.length : 0;
        
        // Ensure the establishment has the expected format with correct cocktail count
        const formattedEstablishment = {
          ...establishmentData,
          // Set cocktail_count to the actual count from database
          cocktail_count: actualCocktailCount,
          // Ensure image field exists
          image: establishmentData.image_url || establishmentData.image || null
        };

        console.log("Setting establishment with correct cocktail count:", actualCocktailCount);
        setEstablishment(formattedEstablishment);
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

  // Helper function to validate UUID format
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Helper function to find a sample establishment by legacy numeric ID
  const findSampleEstablishmentByLegacyId = async (numericId: string) => {
    // Import sample data dynamically to prevent circular dependencies
    const { sampleEstablishments, legacyIdMap } = await import('@/data/sampleData');
    
    // First check if this ID maps to a UUID in our legacyIdMap
    const mappedId = legacyIdMap[numericId];
    if (mappedId) {
      return sampleEstablishments.find(est => est.id === mappedId);
    }
    
    // Fallback to direct numeric ID match
    return sampleEstablishments.find(est => est.id === numericId || est.id === `${numericId}`);
  };

  // This function is no longer used to avoid mixing real and sample data
  const findSampleCocktailsForEstablishment = (establishmentId: string) => {
    try {
      // We need to reimport here to ensure we're using the same data
      const { sampleCocktails } = require('@/data/sampleData');
      console.log(`Finding sample cocktails for establishment ${establishmentId}. Total sample cocktails: ${sampleCocktails.length}`);
      
      const matchedCocktails = sampleCocktails.filter(
        cocktail => cocktail.establishment && cocktail.establishment.id === establishmentId
      );
      console.log(`Found ${matchedCocktails.length} matching cocktails`);
      return matchedCocktails;
    } catch (err) {
      console.error('Error loading sample cocktails:', err);
      return [];
    }
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
        <div className="flex justify-end px-4 pt-4">
          <ContactVenueButton 
            establishmentId={id || ''} 
            establishmentName={establishment.name}
          />
        </div>
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
