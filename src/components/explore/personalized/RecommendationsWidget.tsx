
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MapPin, Heart, Share2, Eye, TrendingUp, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event';
  rating?: number;
  distance?: string;
  imageUrl?: string;
  isTrending?: boolean;
  isNew?: boolean;
  priceRange?: string;
  tags?: string[];
}

export interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'The Mocktail Lounge',
    description: 'Trendy spot with creative non-alcoholic drinks and vibrant atmosphere',
    type: 'establishment',
    rating: 4.8,
    distance: '0.3 miles',
    isTrending: true,
    priceRange: '$$',
    tags: ['Trendy', 'Instagram-worthy', 'Live Music']
  },
  {
    id: '2',
    title: 'Virgin Mojito Supreme',
    description: 'Refreshing mint and lime combination with a twist of ginger',
    type: 'cocktail',
    rating: 4.6,
    isNew: true,
    tags: ['Refreshing', 'Minty', 'Popular']
  },
  {
    id: '3',
    title: 'Sober Social Hour',
    description: 'Weekly meetup for mocktail enthusiasts and mindful drinkers',
    type: 'event',
    distance: '1.2 miles',
    tags: ['Social', 'Weekly', 'Community']
  }
];

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ 
  recommendations = defaultRecommendations 
}) => {
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const visibleRecommendations = recommendations.filter(rec => !dismissedIds.has(rec.id));

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleSave = (id: string) => {
    setSavedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'establishment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cocktail': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary animate-bounce" />
            Recommended for You
            <Badge variant="secondary" className="ml-auto text-xs">
              {visibleRecommendations.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {visibleRecommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="group"
                >
                  <div className="relative p-4 rounded-xl border-2 border-gray-100 hover:border-primary/30 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer"
                       onClick={() => setSelectedRec(rec)}>
                    
                    {/* Dismiss button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(rec.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <div className="flex items-start gap-3">
                      {/* Placeholder image */}
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                        <div className="text-primary font-bold text-lg">
                          {rec.title.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sm truncate">{rec.title}</h4>
                          <Badge variant="outline" className={`text-xs ${getTypeColor(rec.type)}`}>
                            {rec.type}
                          </Badge>
                          {rec.isTrending && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              Trending
                            </Badge>
                          )}
                          {rec.isNew && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{rec.description}</p>
                        
                        {/* Tags */}
                        {rec.tags && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {rec.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {rec.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{rec.rating}</span>
                              </div>
                            )}
                            {rec.distance && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{rec.distance}</span>
                              </div>
                            )}
                            {rec.priceRange && (
                              <span className="text-muted-foreground">{rec.priceRange}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(rec.id);
                              }}
                            >
                              <Heart className={`h-3 w-3 ${savedIds.has(rec.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Share', rec.title);
                              }}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRec} onOpenChange={() => setSelectedRec(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedRec?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedRec?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRec?.tags && (
              <div className="flex flex-wrap gap-2">
                {selectedRec.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              {selectedRec?.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedRec.rating}</span>
                </div>
              )}
              {selectedRec?.distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedRec.distance}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedRec(null)}>
                Close
              </Button>
              <Button onClick={() => {
                console.log('View details', selectedRec?.title);
                setSelectedRec(null);
              }}>
                View Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
