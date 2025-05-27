
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReferralService } from '@/services/promotional';
import { ReferralRewardSystem } from '@/lib/rewards/referralRewards';
import { useAuth } from '@/contexts/auth';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  CheckCircle, 
  Clock,
  Star
} from 'lucide-react';

interface ReferralMetrics {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  currentTier: number;
  conversionRate: number;
}

export const ReferralTracker: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [user?.id]);

  const loadReferralData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Load referral metrics
      const metricsData = await ReferralRewardSystem.getReferralMetrics(user.id);
      const conversionRate = metricsData.totalReferrals > 0 
        ? (metricsData.successfulReferrals / metricsData.totalReferrals) * 100 
        : 0;

      setMetrics({
        ...metricsData,
        conversionRate
      });

      // Load recent referrals
      const referralData = await ReferralService.getUserReferrals(user.id);
      setReferrals(referralData);
      
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTierInfo = (tier: number) => {
    const tiers = [
      { name: 'Starter', color: 'bg-gray-500', min: 0 },
      { name: 'Bronze', color: 'bg-amber-600', min: 1 },
      { name: 'Silver', color: 'bg-gray-400', min: 5 },
      { name: 'Gold', color: 'bg-yellow-500', min: 10 },
      { name: 'Platinum', color: 'bg-purple-500', min: 25 },
      { name: 'Diamond', color: 'bg-blue-500', min: 50 }
    ];
    return tiers[tier] || tiers[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading referral tracking data...</div>;
  }

  const tierInfo = getTierInfo(metrics?.currentTier || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Referral Performance</h2>
        <Badge variant="outline" className={`${tierInfo.color} text-white`}>
          <Star className="h-3 w-3 mr-1" />
          {tierInfo.name} Tier
        </Badge>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{metrics?.totalReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold">{metrics?.successfulReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics?.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{metrics?.totalEarnings || 0} pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No referrals yet. Start sharing your referral code!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.slice(0, 10).map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(referral.status)}
                    <div>
                      <p className="font-medium">
                        Referral Code: {referral.referral_code}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {referral.status}
                    </Badge>
                    {referral.status === 'completed' && referral.completed_at && (
                      <span className="text-sm text-gray-500">
                        Converted {new Date(referral.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Tier: {tierInfo.name}</span>
              <span className="text-sm text-gray-500">
                {metrics?.successfulReferrals || 0} successful referrals
              </span>
            </div>
            
            {metrics?.currentTier < 5 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${tierInfo.color}`}
                    style={{ 
                      width: `${Math.min(100, ((metrics?.successfulReferrals || 0) / getTierInfo(metrics?.currentTier + 1).min) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {getTierInfo(metrics?.currentTier + 1).min - (metrics?.successfulReferrals || 0)} more referrals to reach {getTierInfo(metrics?.currentTier + 1).name}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
