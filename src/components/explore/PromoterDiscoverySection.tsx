
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Users, Calendar, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowButton from '@/components/common/FollowButton';
import type { Promoter } from '@/types/explore';

interface PromoterDiscoverySectionProps {
  promoters: Promoter[];
  isLoading?: boolean;
}

const PromoterDiscoverySection: React.FC<PromoterDiscoverySectionProps> = ({
  promoters,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Popular Promoters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Popular Promoters</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promoters.map(promoter => (
          <Card key={promoter.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={promoter.avatar_url} alt={promoter.name} />
                    <AvatarFallback>{promoter.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {promoter.is_verified && (
                    <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-blue-500 bg-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <Link 
                      to={`/promoter/${promoter.id}`}
                      className="font-semibold text-lg hover:text-primary transition-colors truncate"
                    >
                      {promoter.name}
                    </Link>
                    <FollowButton 
                      promoterId={promoter.id}
                      promoterName={promoter.name}
                      variant="compact"
                      size="sm"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {promoter.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {promoter.category}
                    </Badge>
                    {promoter.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {promoter.follower_count.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {promoter.event_count} events
                      </div>
                      {promoter.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {promoter.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    {promoter.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-20">{promoter.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromoterDiscoverySection;
