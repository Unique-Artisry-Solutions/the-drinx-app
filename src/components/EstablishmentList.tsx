import React from 'react';
import { useNavigate } from 'react-router-dom';
import EstablishmentCard from '@/components/EstablishmentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
interface Establishment {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  latitude: number;
  longitude: number;
}
interface EstablishmentListProps {
  establishments: Establishment[];
  selectedEstablishment: string | null;
  favoriteEstablishments: string[];
  onToggleFavorite: (establishmentId: string) => void;
  onEstablishmentClick: (establishmentId: string) => void;
  isLoading?: boolean;
}
const EstablishmentList: React.FC<EstablishmentListProps> = ({
  establishments,
  selectedEstablishment,
  favoriteEstablishments,
  onToggleFavorite,
  onEstablishmentClick,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const handleEstablishmentClick = (establishmentId: string) => {
    onEstablishmentClick(establishmentId);
    navigate(`/establishment/${establishmentId}`);
  };
  if (isLoading) {
    return <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="relative">
              <div className="flex rounded-xl overflow-hidden bg-white border border-gray-100">
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32" />
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>)}
        </div>
      </div>;
  }
  return <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-material-on-surface text-gray-300">
          {establishments.length > 0 ? 'Nearby Establishments' : 'All Establishments'}
        </h2>
        
        <Badge variant="outline">
          {establishments.length} {establishments.length === 1 ? 'Result' : 'Results'}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {establishments.map(establishment => <div id={`establishment-${establishment.id}`} key={establishment.id} className={`relative ${selectedEstablishment === establishment.id ? 'animate-pulse-subtle' : ''}`}>
            <EstablishmentCard id={establishment.id} name={establishment.name} address={establishment.address} distance={establishment.distance} cocktailCount={establishment.cocktailCount} image={establishment.image} onClick={() => handleEstablishmentClick(establishment.id)} />
            
            <Button variant="ghost" size="sm" className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white" onClick={e => {
          e.stopPropagation();
          onToggleFavorite(establishment.id);
        }}>
              <Heart size={16} className={favoriteEstablishments.includes(establishment.id) ? "fill-red-500 text-red-500" : ""} />
            </Button>
          </div>)}
        
        {establishments.length === 0 && <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-material-on-surface-variant">No establishments found matching your criteria.</p>
            <Button variant="link" onClick={() => window.location.reload()}>
              Reset filters
            </Button>
          </div>}
      </div>
    </div>;
};
export default EstablishmentList;