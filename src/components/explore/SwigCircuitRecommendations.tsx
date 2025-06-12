
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, Clock, Users, Star, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PersonalizedRecommendation } from '@/hooks/usePersonalizedRecommendations';

interface SwigCircuitRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  isLoading?: boolean;
}

const SwigCircuitRecommendations: React.FC<SwigCircuitRecommendationsProps> = ({
  recommendations,
  onSave,
  onShare,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Recommended Swig Circuits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const swigCircuits = recommendations.filter(rec => rec.type === 'swig-circuit');

  if (swigCircuits.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Route className="w-5 h-5 mr-2 text-spiritless-pink" />
          Recommended Swig Circuits
        </h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/swig-circuits">View All</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swigCircuits.map(circuit => (
          <Card key={circuit.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div 
              className="h-32 bg-gradient-to-r from-spiritless-pink to-spiritless-orange relative"
              style={{ 
                backgroundImage: `url(${circuit.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="outline" className="bg-white/90 text-gray-800">
                  {circuit.metadata?.stops} stops
                </Badge>
                {circuit.trending && (
                  <Badge className="bg-spiritless-pink text-white">
                    Trending
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSave(circuit.id)}
                  className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                >
                  {circuit.isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-white" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Link 
                  to={`/bar-crawl/${circuit.metadata?.circuit_id}`}
                  className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                >
                  {circuit.title}
                </Link>
                {circuit.rating && (
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{circuit.rating}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {circuit.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={getDifficultyColor(circuit.metadata?.difficulty || 'easy')}>
                  {circuit.metadata?.difficulty}
                </Badge>
                <Badge variant="secondary">
                  {circuit.metadata?.theme}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {circuit.metadata?.duration}
                  </div>
                  {circuit.distance && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {circuit.distance}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-spiritless-pink font-medium mb-3">
                {circuit.reason}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" asChild>
                  <Link to={`/bar-crawl/${circuit.metadata?.circuit_id}`}>
                    View Circuit
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onShare(circuit.id)}
                >
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SwigCircuitRecommendations;
