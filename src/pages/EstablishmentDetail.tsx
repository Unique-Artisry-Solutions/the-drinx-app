import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';
import { Star } from 'lucide-react';

const EstablishmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const foundEstablishment = sampleEstablishments.find(e => e.id === id);
    if (foundEstablishment) {
      setEstablishment(foundEstablishment);
    }
    setLoading(false);
  }, [id]);

  const handleContact = () => {
    // In a real app, this would open a contact form or modal
    toast({
      title: "Contact feature",
      description: "Contact functionality would be implemented here.",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Loading establishment details...</p>
        </div>
      </Layout>
    );
  }

  if (!establishment) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Establishment not found.</p>
          <Link to="/explore" className="text-material-primary hover:underline mt-4 inline-block">
            Explore other establishments
          </Link>
        </div>
      </Layout>
    );
  }

  const similarMocktails = sampleCocktails
    .filter(cocktail => cocktail.establishment === establishment.name)
    .slice(0, 3);

  return (
    <Layout>
      <div className="animate-fade-in pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{establishment.name}</CardTitle>
                <p className="text-muted-foreground">{establishment.type}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <img src={establishment.image} alt={establishment.name} className="rounded-md w-full h-auto" />
                <p>{establishment.description}</p>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{establishment.rating} ({establishment.reviewCount} reviews)</span>
                </div>
                <Button onClick={handleContact}>Contact Venue</Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{establishment.address}</p>
                <p>{establishment.city}, {establishment.state} {establishment.zip}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Mocktails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {similarMocktails.map(cocktail => (
                  <div key={cocktail.id} className="flex items-center gap-4">
                    <img src={cocktail.image} alt={cocktail.name} className="w-16 h-16 rounded-md" />
                    <div>
                      <p className="font-medium">{cocktail.name}</p>
                      <p className="text-sm text-muted-foreground">{cocktail.ingredients.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentDetail;
