
// Component layer types - UI-specific formats
export interface RewardTierProps {
  tier: {
    id: string;
    name: string;
    description?: string;
    pointsRequired: number;
    benefits: string[];
    color?: string;
    icon?: string;
    isActive: boolean;
  };
  currentPoints?: number;
  onSelect?: (tier: any) => void;
}

export interface RewardOfferingProps {
  offering: {
    id: string;
    name: string;
    description?: string;
    pointCost: number;
    availableQuantity?: number;
    imageUrl?: string;
    isActive: boolean;
  };
  userPoints?: number;
  onRedeem?: (offeringId: string) => void;
}

export interface RewardTransactionProps {
  transactions: Array<{
    id: string;
    type: 'earned' | 'redeemed';
    points: number;
    description: string;
    timestamp: string;
    source: string;
  }>;
  loading?: boolean;
}
