
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, MapPin, GlassWater, Star, PenTool } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useAchievements } from '@/hooks/rewards/useAchievements';

interface BadgeCollectionProps {
  userStats: {
    swigCircuitsCompleted: number;
    establishmentsVisited: number;
    mocktailsTried: number;
    reviewsWritten: number;
    mocktailsCreated: number;
  };
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({ userStats }) => {
  const { achievements } = useAchievements();

  // Define badge categories
  const categories = [
    { id: 'all', name: 'All', icon: <Award className="h-4 w-4" /> },
    { id: 'visits', name: 'Visits', icon: <MapPin className="h-4 w-4" /> },
    { id: 'mocktails', name: 'Mocktails', icon: <GlassWater className="h-4 w-4" /> },
    { id: 'reviews', name: 'Reviews', icon: <Star className="h-4 w-4" /> },
    { id: 'creator', name: 'Creator', icon: <PenTool className="h-4 w-4" /> },
  ];

  // Filter achievements by category
  const getAchievementsByCategory = (categoryId: string) => {
    if (!achievements || achievements.length === 0) return [];
    if (categoryId === 'all') return achievements;
    return achievements.filter(achievement => achievement.category === categoryId);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  // If no achievements data is present, show placeholder badges based on user stats
  const getBadgesPlaceholder = () => {
    const badges = [];

    // Visit badges
    if (userStats.establishmentsVisited >= 1) {
      badges.push({ id: 'first-visit', name: 'First Visit', icon: <MapPin />, category: 'visits', earned: true });
    }
    if (userStats.establishmentsVisited >= 5) {
      badges.push({ id: 'regular', name: 'Regular Visitor', icon: <MapPin />, category: 'visits', earned: true });
    }
    if (userStats.establishmentsVisited >= 10) {
      badges.push({ id: 'explorer', name: 'Explorer', icon: <MapPin />, category: 'visits', earned: true });
    }
    
    // Mocktail badges
    if (userStats.mocktailsTried >= 1) {
      badges.push({ id: 'first-mocktail', name: 'First Sip', icon: <GlassWater />, category: 'mocktails', earned: true });
    }
    if (userStats.mocktailsTried >= 5) {
      badges.push({ id: 'taster', name: 'Taster', icon: <GlassWater />, category: 'mocktails', earned: true });
    }
    if (userStats.mocktailsTried >= 10) {
      badges.push({ id: 'connoisseur', name: 'Connoisseur', icon: <GlassWater />, category: 'mocktails', earned: true });
    }
    
    // Add placeholder locked badges
    badges.push(
      { id: 'master-explorer', name: 'Master Explorer', icon: <MapPin />, category: 'visits', earned: false },
      { id: 'mixologist', name: 'Mixologist', icon: <GlassWater />, category: 'mocktails', earned: false },
      { id: 'critic', name: 'Top Critic', icon: <Star />, category: 'reviews', earned: false },
      { id: 'recipe-creator', name: 'Recipe Creator', icon: <PenTool />, category: 'creator', earned: false }
    );
    
    return badges;
  };

  const placeholderBadges = getBadgesPlaceholder();

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="px-4 pb-4">
          <TabsList className="grid grid-cols-5 mb-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 text-xs">
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {achievements && achievements.length > 0 ? (
                  getAchievementsByCategory(category.id).map(achievement => (
                    <motion.div key={achievement.id} variants={item}>
                      <div 
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          achievement.isCompleted 
                            ? 'bg-amber-50 border-amber-200 shadow-sm' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        } aspect-square hover:scale-105 transition-transform`}
                      >
                        <div className={`p-3 rounded-full mb-3 ${
                          achievement.isCompleted ? 'bg-amber-100' : 'bg-gray-100'
                        }`}>
                          <Trophy className={`h-6 w-6 ${
                            achievement.isCompleted ? 'text-amber-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {achievement.isCompleted ? 'Earned' : 'Locked'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Use placeholder badges if no achievement data is available
                  placeholderBadges
                    .filter(badge => category.id === 'all' || badge.category === category.id)
                    .map(badge => (
                      <motion.div key={badge.id} variants={item}>
                        <div 
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                            badge.earned 
                              ? 'bg-amber-50 border-amber-200 shadow-sm' 
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          } aspect-square hover:scale-105 transition-transform`}
                        >
                          <div className={`p-3 rounded-full mb-3 ${
                            badge.earned ? 'bg-amber-100' : 'bg-gray-100'
                          }`}>
                            {React.cloneElement(badge.icon, { 
                              className: `h-6 w-6 ${badge.earned ? 'text-amber-500' : 'text-gray-400'}`
                            })}
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-sm">{badge.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {badge.earned ? 'Earned' : 'Locked'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </>
  );
};

export default BadgeCollection;
