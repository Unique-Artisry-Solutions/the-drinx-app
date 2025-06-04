
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Gift, Sparkles, Trophy, Star, Route, MapPin, GlassWater, Wine, ThumbsUp } from 'lucide-react';
import BackButton from '@/components/navigation/BackButton';
import { useTheme } from '@/contexts/ThemeContext';

const RewardsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-material-on-background">Bar Crawl Rewards</h1>
          <p className="text-material-on-surface-variant">
            Earn rewards as you explore and participate in bar crawls
          </p>
        </div>

        <div className="space-y-8">
          {/* Reward System Overview */}
          <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-spiritless-pink" />
                Rewards Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent className={`prose ${isDark ? "text-gray-300 max-w-none" : "max-w-none"}`}>
              <p>
                Our multi-tiered rewards program celebrates your spiritless journey through exclusive badges, 
                discounts, and VIP experiences—all designed to enhance your bar crawl adventures!
              </p>
              <p>
                Progress through the tiers by participating in bar crawls, visiting establishments, trying new mocktails,
                creating your own mocktail recipes, and having others try your creations.
                Your achievements are automatically tracked and rewards are unlocked as you reach new milestones.
              </p>
            </CardContent>
          </Card>

          {/* Basic Tier */}
          <Card>
            <CardHeader className={isDark 
              ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-t-lg" 
              : "bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg"}
            >
              <CardTitle className="flex items-center gap-2">
                <Badge className={`h-6 w-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                TIER 1: Badge Collector
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 pt-4 ${isDark ? "bg-gray-800" : ""}`}>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                Start your journey by earning beautiful badges that commemorate your bar crawl experiences.
                Each badge is a digital keepsake of your spiritless adventures.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className={`flex flex-col items-center p-3 rounded-lg text-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <Route className={`h-8 w-8 mb-2 ${isDark ? "text-purple-400" : "text-purple-500"}`} />
                  <h3 className="font-medium text-sm">First Crawl</h3>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Complete your first bar crawl</p>
                </div>
                <div className={`flex flex-col items-center p-3 rounded-lg text-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <MapPin className={`h-8 w-8 mb-2 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                  <h3 className="font-medium text-sm">Explorer</h3>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Visit 5 different establishments</p>
                </div>
                <div className={`flex flex-col items-center p-3 rounded-lg text-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <GlassWater className={`h-8 w-8 mb-2 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
                  <h3 className="font-medium text-sm">Mocktail Maven</h3>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Try 10 different mocktails</p>
                </div>
                <div className={`flex flex-col items-center p-3 rounded-lg text-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <Wine className={`h-8 w-8 mb-2 ${isDark ? "text-rose-400" : "text-rose-500"}`} />
                  <h3 className="font-medium text-sm">Mocktail Creator</h3>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Create your first mocktail</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mid Tier */}
          <Card>
            <CardHeader className={isDark 
              ? "bg-gradient-to-r from-blue-900/30 to-teal-900/30 rounded-t-lg" 
              : "bg-gradient-to-r from-blue-100 to-teal-100 rounded-t-lg"}
            >
              <CardTitle className="flex items-center gap-2">
                <Gift className={`h-6 w-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                TIER 2: Rewards Club
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 pt-4 ${isDark ? "bg-gray-800" : ""}`}>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                Take your experience to the next level! After completing 5 bar crawls or creating 3 mocktails,
                you'll unlock exclusive discounts and special offers at participating establishments.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-blue-900/50 p-2 rounded-full" : "bg-blue-100 p-2 rounded-full"}>
                    <Gift className={`h-6 w-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">10% Off Signature Mocktails</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Complete 5 bar crawls to unlock</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-teal-900/50 p-2 rounded-full" : "bg-teal-100 p-2 rounded-full"}>
                    <GlassWater className={`h-6 w-6 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Free Mocktail</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Every 3rd establishment visit</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-rose-900/50 p-2 rounded-full" : "bg-rose-100 p-2 rounded-full"}>
                    <Wine className={`h-6 w-6 ${isDark ? "text-rose-400" : "text-rose-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Featured Creator Badge</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Create 3 mocktail recipes to unlock</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Tier */}
          <Card>
            <CardHeader className={isDark 
              ? "bg-gradient-to-r from-amber-900/30 to-rose-900/30 rounded-t-lg" 
              : "bg-gradient-to-r from-amber-100 to-rose-100 rounded-t-lg"}
            >
              <CardTitle className="flex items-center gap-2">
                <Trophy className={`h-6 w-6 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
                TIER 3: VIP Experience
              </CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 pt-4 ${isDark ? "bg-gray-800" : ""}`}>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                The pinnacle of bar crawl rewards! Complete 15 bar crawls or have 10 users try your mocktail recipes
                to unlock VIP status, giving you access to exclusive events, tastings, and unique experiences.
              </p>
              
              <div className="space-y-3 mt-4">
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-amber-900/50 p-2 rounded-full" : "bg-amber-100 p-2 rounded-full"}>
                    <Sparkles className={`h-6 w-6 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Exclusive Tasting Events</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Private mocktail tasting sessions</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-rose-900/50 p-2 rounded-full" : "bg-rose-100 p-2 rounded-full"}>
                    <Award className={`h-6 w-6 ${isDark ? "text-rose-400" : "text-rose-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">VIP Bar Crawl Access</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Special crawls only for VIP members</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                  <div className={isDark ? "bg-purple-900/50 p-2 rounded-full" : "bg-purple-100 p-2 rounded-full"}>
                    <ThumbsUp className={`h-6 w-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Recipe Spotlight</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Have your mocktails featured on the homepage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Rewards Work */}
          <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-spiritless-pink" />
                How Rewards Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Progress Tracking</h3>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Your progress is automatically tracked as you participate in bar crawls,
                  visit establishments, create mocktails, and complete other qualifying activities.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Unlocking Rewards</h3>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Rewards are automatically unlocked as you reach each milestone.
                  Badges appear instantly in your profile, while discount codes and VIP
                  invitations will be sent to your registered email.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Redeeming Benefits</h3>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  To redeem your benefits at participating establishments, simply show your
                  profile page with your reward status. For digital rewards and special events,
                  you'll receive instructions via email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RewardsPage;
