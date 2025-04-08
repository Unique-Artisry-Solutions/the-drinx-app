
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

      try {
        setIsLoading(true);
        setError(null);
        
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
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Home
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
