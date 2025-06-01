
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useFeatureTier } from '@/hooks/useFeatureTier';

interface FeatureGateProps {
  feature: string;
  requiredTier: 'free' | 'basic' | 'premium' | 'vip';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

const TIER_CONFIG = {
  free: { icon: Lock, color: 'bg-gray-100 text-gray-800', label: 'Free' },
  basic: { icon: Zap, color: 'bg-blue-100 text-blue-800', label: 'Basic' },
  premium: { icon: Crown, color: 'bg-purple-100 text-purple-800', label: 'Premium' },
  vip: { icon: Star, color: 'bg-amber-100 text-amber-800', label: 'VIP' }
};

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  requiredTier,
  children,
  fallback,
  showUpgradePrompt = true
}) => {
  const { user } = useAuth();
  const { hasFeatureAccess, userTier } = useFeatureTier();
  const { toast: _toast } = useToast();

  // Check if user has access to this feature
  const hasAccess = hasFeatureAccess(feature, requiredTier);
  
  if (hasAccess) {
    return <>{children}</>;
  }

  // If access is denied, show fallback or upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const tierConfig = TIER_CONFIG[requiredTier];
  const TierIcon = tierConfig.icon;

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <TierIcon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg">
          {tierConfig.label} Feature Required
        </CardTitle>
        <CardDescription>
          This feature requires a {tierConfig.label} subscription or higher.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge className={tierConfig.color}>
            {tierConfig.label} Required
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {user ? (
            <>
              Your current plan: <Badge variant="outline">{userTier}</Badge>
            </>
          ) : (
            "Sign in to access premium features"
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {!user && (
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          )}
          <Button size="sm">
            {user ? 'Upgrade Plan' : 'View Plans'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
