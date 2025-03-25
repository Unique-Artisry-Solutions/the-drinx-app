
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import MapView from '@/components/MapView';
import { Phone, Globe, MapPin, Clock, Share2 } from 'lucide-react';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

const EstablishmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any | null>(null);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    if (id) {
      // Find the establishment by ID
      const est = sampleEstablishments.find(e => e.id === id);
      if (est) {
        setEstablishment(est);
        
        // Find cocktails for this establishment
        const relatedCocktails = sampleCocktails.filter(
          c => c.establishment.id === id
        );
        setCocktails(relatedCocktails);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-pulse text-material-primary">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!establishment) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-medium text-material-on-background mb-2">Establishment Not Found</h2>
          <p className="text-material-on-surface-variant mb-6">
            We couldn't find the establishment you're looking for.
          </p>
          <Link 
            to="/" 
            className="bg-material-primary text-material-on-primary px-6 py-2 rounded-lg inline-block"
          >
            Return Home
          </Link>
        </div>
      </Layout>
    );
  }

  // Transform establishment for map
  const mapEstablishment = {
    id: establishment.id,
    name: establishment.name,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
    cocktailCount: establishment.cocktailCount,
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-4">
          <Link to="/map" className="text-material-primary text-sm mb-2 inline-block">
            &larr; Back to Map
          </Link>
          <h1 className="text-2xl font-medium text-material-on-background">{establishment.name}</h1>
          <p className="text-material-on-surface-variant">
            {establishment.cocktailCount} non-alcoholic cocktails available
          </p>
        </div>

        {establishment.image ? (
          <div className="h-48 w-full mb-6 rounded-xl overflow-hidden">
            <img 
              src={establishment.image} 
              alt={establishment.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        <div className="bg-white rounded-xl p-5 elevation-2 mb-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start">
              <MapPin className="text-material-primary mr-3 mt-1 flex-shrink-0" size={18} />
              <div>
                <p className="text-material-on-surface">{establishment.address}</p>
                {establishment.distance && (
                  <p className="text-sm text-material-on-surface-variant">
                    {establishment.distance} from your location
                  </p>
                )}
              </div>
            </div>

            {establishment.phone && (
              <div className="flex items-center">
                <Phone className="text-material-primary mr-3 flex-shrink-0" size={18} />
                <a href={`tel:${establishment.phone}`} className="text-material-on-surface">
                  {establishment.phone}
                </a>
              </div>
            )}

            {establishment.website && (
              <div className="flex items-center">
                <Globe className="text-material-primary mr-3 flex-shrink-0" size={18} />
                <a 
                  href={establishment.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-material-primary underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {establishment.hours && (
              <div className="flex items-start">
                <Clock className="text-material-primary mr-3 mt-1 flex-shrink-0" size={18} />
                <div>
                  {establishment.hours.map((hours: string, index: number) => (
                    <p key={index} className="text-material-on-surface">
                      {hours}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button className="flex items-center mt-3 text-material-primary font-medium">
              <Share2 className="mr-2" size={18} />
              Share this place
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-material-on-surface mb-3">
            Location
          </h2>
          <MapView 
            establishments={[mapEstablishment]}
            height="h-[200px]"
            interactive={false}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-material-on-surface mb-3">
            Available Cocktails
          </h2>
          
          {cocktails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cocktails.map((cocktail) => (
                <CocktailCard
                  key={cocktail.id}
                  id={cocktail.id}
                  name={cocktail.name}
                  price={cocktail.price}
                  description={cocktail.description}
                  ingredients={cocktail.ingredients}
                  image={cocktail.image}
                  establishment={cocktail.establishment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-material-surface-variant rounded-xl">
              <p className="text-material-on-surface-variant">
                No cocktails listed yet for this establishment.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentDetail;
