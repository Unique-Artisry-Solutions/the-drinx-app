
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Star, Trophy, Gift, Zap, Users, TrendingUp, Crown } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface GamificationDashboardProps {
  promoterId: string;
  mode?: 'promoter' | 'follower';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: Record<string, any>;
  earned_count: number;
  total_followers: number;
}

interface LoyaltyTier {
  id: string;
  name: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
  icon: string;
  followerCount: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ 
  promoterId, 
  mode = 'promoter' 
}) => {
  const { followers } = useSubscriptions(promoterId);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const badges: Badge[] = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'First 100 followers',
      icon: '🐦',
      color: '#3B82F6',
      rarity: 'uncommon',
      requirements: { followers: 100 },
      earned_count: 23,
      total_followers: followers?.length || 0
    },
    {
      id: 'loyal-supporter',
      name: 'Loyal Supporter',
      description: 'Following for 6+ months',
      icon: '❤️',
      color: '#EF4444',
      rarity: 'rare',
      requirements: { months: 6 },
      earned_count: 12,
      total_followers: followers?.length || 0
    },
    {
      id: 'event-enthusiast',
      name: 'Event Enthusiast',
      description: 'Attended 5+ events',
      icon: '🎉',
      color: '#10B981',
      rarity: 'epic',
      requirements: { events: 5 },
      earned_count: 8,
      total_followers: followers?.length || 0
    },
    {
      id: 'vip-member',
      name: 'VIP Member',
      description: 'Premium tier for 1+ year',
      icon: '👑',
      color: '#F59E0B',
      rarity: 'legendary',
      requirements: { vip_months: 12 },
      earned_count: 3,
      total_followers: followers?.length || 0
    }
  ];

  const loyaltyTiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      pointsRequired: 0,
      benefits: ['Basic updates', 'Community access'],
      color: '#CD7F32',
      icon: '🥉',
      followerCount: Math.floor((followers?.length || 0) * 0.6)
    },
    {
      id: 'silver',
      name: 'Silver',
      pointsRequired: 500,
      benefits: ['Priority notifications', 'Early event access'],
      color: '#C0C0C0',
      icon: '🥈',
      followerCount: Math.floor((followers?.length || 0) * 0.25)
    },
    {
      id: 'gold',
      name: 'Gold',
      pointsRequired: 1500,
      benefits: ['Exclusive content', 'VIP events', 'Direct messaging'],
      color: '#FFD700',
      icon: '🥇',
      followerCount: Math.floor((followers?.length || 0) * 0.12)
    },
    {
      id: 'platinum',
      name: 'Platinum',
      pointsRequired: 3000,
      benefits: ['All benefits', 'Personal consultation', 'Beta features'],
      color: '#E5E4E2',
      icon: '💎',
      followerCount: Math.floor((followers?.length || 0) * 0.03)
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-follow',
      name: 'First Follow',
      description: 'Get your first follower',
      points: 50,
      category: 'growth',
      progress: 100,
      completed: true,
      completedAt: '2024-01-15'
    },
    {
      id: 'century-club',
      name: 'Century Club',
      description: 'Reach 100 followers',
      points: 500,
      category: 'growth',
      progress: (followers?.length || 0) >= 100 ? 100 : ((followers?.length || 0) / 100) * 100,
      completed: (followers?.length || 0) >= 100
    },
    {
      id: 'engagement-master',
      name: 'Engagement Master',
      description: 'Achieve 80% average engagement rate',
      points: 300,
      category: 'engagement',
      progress: 65,
      completed: false
    },
    {
      id: 'loyal-community',
      name: 'Loyal Community',
      description: 'Have 50+ followers with 6+ month tenure',
      points: 750,
      category: 'retention',
      progress: 40,
      completed: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': '#6B7280',
      'uncommon': '#10B981',
      'rare': '#3B82F6',
      'epic': '#8B5CF6',
      'legendary': '#F59E0B'
    };
    return colors[rarity as keyof typeof colors] || '#6B7280';
  };

  const totalPoints = achievements.reduce((sum, achievement) => 
    achievement.completed ? sum + achievement.points : sum, 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Gamification Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Total Points</span>
                  </div>
                  <div className="text-2xl font-bold">{totalPoints}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Badges Earned</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {badges.reduce((sum, badge) => sum + badge.earned_count, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Active Followers</span>
                  </div>
                  <div className="text-2xl font-bold">{followers?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Engagement Rate</span>
                  </div>
                  <div className="text-2xl font-bold">68%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Badge Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {badges.slice(0, 3).map(badge => (
                      <div key={badge.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </div>
                        <Badge 
                          style={{ backgroundColor: getRarityColor(badge.rarity), color: 'white' }}
                        >
                          {badge.earned_count} earned
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loyaltyTiers.map(tier => (
                      <div key={tier.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tier.icon}</span>
                          <span className="font-medium">{tier.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {tier.followerCount} followers
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                backgroundColor: tier.color,
                                width: `${(tier.followerCount / (followers?.length || 1)) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid gap-4">
              {badges.map(badge => (
                <Card key={badge.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{badge.name}</h4>
                          <Badge 
                            style={{ backgroundColor: getRarityColor(badge.rarity), color: 'white' }}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Earned by:</span>
                            <div className="font-medium">{badge.earned_count} followers</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completion rate:</span>
                            <div className="font-medium">
                              {((badge.earned_count / badge.total_followers) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Progress 
                            value={(badge.earned_count / badge.total_followers) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <div className="grid gap-4">
              {loyaltyTiers.map(tier => (
                <Card key={tier.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{tier.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-lg">{tier.name} Tier</h4>
                          <Badge variant="outline">
                            {tier.followerCount} followers
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Requires {tier.pointsRequired} points
                        </p>

                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Benefits:</h5>
                          <ul className="space-y-1">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1 h-1 bg-current rounded-full" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Distribution</span>
                            <span>{((tier.followerCount / (followers?.length || 1)) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(tier.followerCount / (followers?.length || 1)) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {achievements.map(achievement => (
                <Card key={achievement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{achievement.name}</h4>
                          {achievement.completed && (
                            <Badge className="bg-green-500 text-white">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Points:</span>
                            <span className="font-medium ml-1">{achievement.points}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium ml-1 capitalize">{achievement.category}</span>
                          </div>
                          {achievement.completedAt && (
                            <div>
                              <span className="text-muted-foreground">Completed:</span>
                              <span className="font-medium ml-1">
                                {new Date(achievement.completedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{achievement.progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GamificationDashboard;
