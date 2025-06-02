
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeatureGateProps {
  feature: string;
  requiredPlan?: string;
  children?: React.ReactNode;
  isLocked?: boolean;
  onUpgrade?: () => void;
  className?: string;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  requiredPlan = "Pro",
  children,
  isLocked = true,
  onUpgrade,
  className = ""
}) => {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      console.log(`Upgrade to ${requiredPlan} plan to access ${feature}`);
    }
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <CardTitle className="text-lg text-gray-700">
            {feature} Feature
          </CardTitle>
          <Badge variant="outline" className="mx-auto">
            Requires {requiredPlan}
          </Badge>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Upgrade your plan to unlock this feature and many more.
          </p>
          <Button onClick={handleUpgrade} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to {requiredPlan}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureGate;
