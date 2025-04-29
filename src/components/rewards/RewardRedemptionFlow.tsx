
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Clock, GlassWater, Ticket, Coffee, Tag } from 'lucide-react';
import { useRewards } from '@/hooks/rewards/useRewards';
import { motion, AnimatePresence } from 'framer-motion';

export function RewardRedemptionFlow() {
  const { rewardProfile, redeemReward, isLoading } = useRewards();
  const { toast } = useToast();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const availableRewards = rewardProfile?.availableRewards || [];
  
  const categories = [
    { id: 'all', name: 'All Rewards', icon: <Gift className="h-4 w-4" /> },
    { id: 'drinks', name: 'Drinks', icon: <GlassWater className="h-4 w-4" /> },
    { id: 'events', name: 'Events', icon: <Ticket className="h-4 w-4" /> },
    { id: 'merchandise', name: 'Merchandise', icon: <Tag className="h-4 w-4" /> }
  ];

  const filteredRewards = activeCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === activeCategory);

  const handleRedeemClick = async (rewardId: string) => {
    setSelectedReward(rewardId);
    setIsRedeeming(true);
    
    try {
      await redeemReward(rewardId);
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Unable to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
      setSelectedReward(null);
    }
  };

  const hasEnoughPoints = (pointsRequired: number) => {
    return (rewardProfile?.points || 0) >= pointsRequired;
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary bg-primary/5 shadow-md overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Available Points</h3>
                <p className="text-sm text-muted-foreground">Redeem your points for rewards</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">
              {rewardProfile?.points || 0}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            {filteredRewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredRewards.map((reward) => {
                    const canRedeem = hasEnoughPoints(reward.points_required);
                    
                    return (
                      <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card 
                          key={reward.id} 
                          className={`overflow-hidden hover:shadow-md transition-shadow ${!canRedeem ? 'opacity-70' : ''} ${selectedReward === reward.id ? 'ring-2 ring-primary' : ''}`}
                        >
                          {reward.image_url && (
                            <div className="w-full h-32 bg-muted overflow-hidden">
                              <img 
                                src={reward.image_url} 
                                alt={reward.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{reward.name}</CardTitle>
                              <Badge 
                                variant={canRedeem ? "outline" : "secondary"}
                                className={`${canRedeem ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
                              >
                                {reward.points_required} pts
                              </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {reward.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardFooter className="flex justify-between items-center pt-0">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {reward.expires_in ? `Expires in ${reward.expires_in} days` : 'Never expires'}
                            </div>
                            
                            <Button 
                              size="sm"
                              disabled={!canRedeem || isRedeeming}
                              onClick={() => handleRedeemClick(reward.id)}
                              className="transition-all"
                            >
                              {isRedeeming && selectedReward === reward.id ? (
                                <>
                                  <span className="animate-spin mr-2">⏳</span>
                                  Redeeming...
                                </>
                              ) : (
                                'Redeem'
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="bg-muted/50 inline-flex rounded-full p-4 mb-4">
                  <Coffee className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rewards available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  There are no {category.id !== 'all' ? category.name.toLowerCase() : ''} rewards available at the moment. Check back soon!
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
