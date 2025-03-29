
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import EstablishmentInterior from '@/components/establishment/EstablishmentInterior';
import { useUserLocation } from '@/hooks/useUserLocation';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

const EstablishmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any>(null);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const { userLocation } = useUserLocation();

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const est = sampleEstablishments.find(e => e.id === id);
    setEstablishment(est);
    
    // Filter cocktails for this establishment
    const estCocktails = sampleCocktails.filter(c => {
      // Convert establishment object to string if needed
      const establishmentName = typeof c.establishment === 'object' 
        ? c.establishment.name 
        : c.establishment;
      
      return establishmentName === est?.name;
    });
    setCocktails(estCocktails);
  }, [id]);

  if (!establishment) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Loading establishment details...</p>
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
