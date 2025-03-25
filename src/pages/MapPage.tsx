
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import MapView from '@/components/MapView';
import EstablishmentCard from '@/components/EstablishmentCard';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments } from '@/data/sampleData';

const MapPage = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast({
            title: "Location access denied",
            description: "Enable location services to find nearby establishments.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const handleMarkerClick = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId);
    
    // Scroll to the establishment card
    const element = document.getElementById(`establishment-${establishmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEstablishmentClick = (establishmentId: string) => {
    navigate(`/establishment/${establishmentId}`);
  };

  // Transform establishment data for the map
  const mapEstablishments = establishments.map(e => ({
    id: e.id,
    name: e.name,
    latitude: e.latitude,
    longitude: e.longitude,
    cocktailCount: e.cocktailCount,
  }));

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-4">
          <h1 className="text-2xl font-medium text-material-on-background">Nearby Map</h1>
          <p className="text-material-on-surface-variant">
            Find spirit-free cocktails around you
          </p>
        </div>

        <MapView 
          establishments={mapEstablishments}
          userLocation={userLocation}
          onMarkerClick={handleMarkerClick}
        />

        <div className="mt-6">
          <h2 className="text-lg font-medium text-material-on-surface mb-3">
            {userLocation ? 'Nearby Establishments' : 'All Establishments'}
          </h2>
          
          <div className="space-y-3">
            {establishments.map((establishment) => (
              <div 
                id={`establishment-${establishment.id}`}
                key={establishment.id}
                className={selectedEstablishment === establishment.id ? 'animate-pulse-subtle' : ''}
              >
                <EstablishmentCard
                  id={establishment.id}
                  name={establishment.name}
                  address={establishment.address}
                  distance={establishment.distance}
                  cocktailCount={establishment.cocktailCount}
                  image={establishment.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
