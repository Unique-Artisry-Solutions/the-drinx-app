
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  Share2, 
  X, 
  TrendingUp, 
  DollarSign,
  Eye,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalizedRecommendations, PersonalizedRecommendation } from '@/hooks/usePersonalizedRecommendations';
import { NotificationService } from '@/services/NotificationService';

export interface RecommendationsWidgetProps {
  recommendations?: PersonalizedRecommendation[];
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ 
  recommendations: propRecommendations 
}) => {
  const { 
    recommendations, 
    isLoading, 
    activeCategory, 
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  } = usePersonalizedRecommendations();
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<PersonalizedRecommendation | null>(null);

  const displayRecommendations = propRecommendations || recommendations;

  const handleSave = async (rec: PersonalizedRecommendation) => {
    await saveRecommendation(rec.id);
    NotificationService.addNotification({
      title: rec.isSaved ? 'Removed from saved' : 'Saved!',
      message: `${rec.title} ${rec.isSaved ? 'removed from' : 'added to'} your saved items`,
      type: 'success'
    });
  };

  const handleDismiss = async (rec: PersonalizedRecommendation) => {
    await dismissRecommendation(rec.id);
    NotificationService.addNotification({
      title: 'Recommendation dismissed',
      message: 'We\'ll show you different suggestions',
      type: 'info'
    });
  };

  const handleShare = async (rec: PersonalizedRecommendation) => {
    await shareRecommendation(rec.id);
    NotificationService.addNotification({
      title: 'Shared successfully!',
      message: `${rec.title} has been shared`,
      type: 'success'
    });
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'open': return 'text-green-600';
      case 'closing-soon': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityText = (availability?: string) => {
    switch (availability) {
      case 'open': return 'Open now';
      case 'closing-soon': return 'Closing soon';
      case 'closed': return 'Closed';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="establishments">Places</TabsTrigger>
            <TabsTrigger value="cocktails">Drinks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            <AnimatePresence mode="wait">
              {displayRecommendations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recommendations in this category yet</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {displayRecommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Image */}
                            <div className="relative flex-shrink-0">
                              <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                                {rec.imageUrl && (
                                  <img 
                                    src={rec.imageUrl} 
                                    alt={rec.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                              </div>
                              {rec.trending && (
                                <Badge className="absolute -top-1 -right-1 text-xs bg-red-500">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-sm mb-1 truncate">{rec.title}</h3>
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {rec.description}
                                  </p>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSave(rec)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {rec.isSaved ? (
                                      <BookmarkCheck className="h-4 w-4 text-primary" />
                                    ) : (
                                      <Bookmark className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleShare(rec)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDismiss(rec)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                {rec.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{rec.rating}</span>
                                  </div>
                                )}
                                {rec.distance && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{rec.distance}</span>
                                  </div>
                                )}
                                {rec.price && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{rec.price}</span>
                                  </div>
                                )}
                                {rec.availability && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className={getAvailabilityColor(rec.availability)}>
                                      {getAvailabilityText(rec.availability)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Tags and reason */}
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {rec.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {rec.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{rec.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs text-primary"
                                      onClick={() => setSelectedRecommendation(rec)}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{rec.title}</DialogTitle>
                                      <DialogDescription>{rec.description}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      {rec.imageUrl && (
                                        <img 
                                          src={rec.imageUrl} 
                                          alt={rec.title}
                                          className="w-full h-48 object-cover rounded-lg"
                                        />
                                      )}
                                      <div>
                                        <h4 className="font-medium text-sm mb-2">Why we recommend this:</h4>
                                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {rec.tags.map((tag) => (
                                          <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>

                              {/* Reason */}
                              <p className="text-xs text-primary/70 mt-2 italic">
                                {rec.reason}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;
